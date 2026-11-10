import "server-only";
import { connection } from "next/server";
import { requireAdmin } from "./admin-auth";
import { getSql } from "./db";
import { slugify } from "./slug";
import type { Verdict } from "./verdicts";

// Everything here checks the admin session first, so nothing can be read or
// changed without being logged in, whichever page or action calls it.

export type SubmissionStatus = "pending" | "approved" | "rejected";
export const SUBMISSION_STATUSES: SubmissionStatus[] = ["pending", "approved", "rejected"];

export type Submission = {
  id: number;
  quote: string;
  creditedTo: string;
  actualAuthor: string | null;
  evidence: string;
  seenAt: string | null;
  notes: string | null;
  email: string | null;
  creditName: string | null;
  status: SubmissionStatus;
  createdAt: Date;
};

const submissionColumns = () => getSql()`
  id::int as id, quote, credited_to as "creditedTo", actual_author as "actualAuthor",
  evidence, seen_at as "seenAt", notes, email, credit_name as "creditName",
  status::text as status, created_at as "createdAt"
`;

export async function listSubmissions(status: SubmissionStatus): Promise<Submission[]> {
  await requireAdmin();
  await connection();
  const sql = getSql();
  return sql<Submission[]>`
    select ${submissionColumns()} from submissions
    where status = ${status}
    order by created_at ${status === "pending" ? sql`asc` : sql`desc`}
    limit 200
  `;
}

export async function countSubmissions(): Promise<Record<SubmissionStatus, number>> {
  await requireAdmin();
  await connection();
  const rows = await getSql()<{ status: SubmissionStatus; n: number }[]>`
    select status::text as status, count(*)::int as n from submissions group by status
  `;
  const counts = { pending: 0, approved: 0, rejected: 0 };
  for (const r of rows) counts[r.status] = r.n;
  return counts;
}

export async function getSubmission(id: number): Promise<Submission | null> {
  await requireAdmin();
  await connection();
  const [row] = await getSql()<Submission[]>`select ${submissionColumns()} from submissions where id = ${id}`;
  return row ?? null;
}

export async function setSubmissionStatus(id: number, status: SubmissionStatus) {
  await requireAdmin();
  await getSql()`update submissions set status = ${status} where id = ${id}`;
}

export type AdminEntryRow = {
  id: number;
  slug: string;
  quote: string;
  verdict: Verdict;
  status: "draft" | "published";
  credited: string | null;
  updatedAt: Date;
};

export async function listAllEntries(opts: { status?: "draft" | "published" | null; q?: string }) {
  await requireAdmin();
  await connection();
  const sql = getSql();
  const q = (opts.q ?? "").trim();
  const like = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
  return sql<AdminEntryRow[]>`
    select e.id::int as id, e.slug, e.quote, e.verdict::text as verdict, e.status::text as status,
      e.updated_at as "updatedAt",
      (select string_agg(p.name, ', ' order by a.position)
         from attributions a join people p on p.id = a.person_id where a.entry_id = e.id) as credited
    from entries e
    where true
      ${opts.status ? sql`and e.status = ${opts.status}` : sql``}
      ${
        q
          ? sql`and (e.quote ilike ${like} or exists (
              select 1 from attributions a join people p on p.id = a.person_id
              where a.entry_id = e.id and p.name ilike ${like}))`
          : sql``
      }
    order by e.updated_at desc
    limit 500
  `;
}

/** Entries whose quote shares the most words with `quote`, to catch duplicates before writing a new one. */
export async function findSimilarEntries(quote: string) {
  await requireAdmin();
  await connection();
  const sql = getSql();
  return sql<{ id: number; quote: string; status: string; credited: string | null }[]>`
    with q as (
      select to_tsquery('english', replace(plainto_tsquery('english', ${quote})::text, ' & ', ' | ')) as query
    ), ranked as (
      select e.id, e.quote, e.status, ts_rank(setweight(to_tsvector('english', e.quote), 'A'), q.query) as rank
      from entries e, q
      where to_tsvector('english', e.quote) @@ q.query
    )
    select r.id::int as id, r.quote, r.status::text as status,
      (select string_agg(p.name, ', ' order by a.position)
         from attributions a join people p on p.id = a.person_id where a.entry_id = r.id) as credited
    from ranked r
    where r.rank > 0.2
    order by r.rank desc
    limit 3
  `;
}

export type EntrySourceInput = { kind: "evidence" | "spreading"; label: string; url: string };

export type EntryInput = {
  id: number | null;
  slug: string;
  quote: string;
  credited: string[];
  verdict: Verdict;
  status: "draft" | "published";
  actualAuthor: string;
  earliestKnown: string;
  firstAttributed: string;
  originalText: string;
  originalCitation: string;
  findings: string;
  submittedBy: string;
  sources: EntrySourceInput[];
};

export async function getEntryForEdit(id: number): Promise<EntryInput | null> {
  await requireAdmin();
  await connection();
  const sql = getSql();
  const [e] = await sql<
    (Omit<EntryInput, "credited" | "sources"> & { credited: string[] | null })[]
  >`
    select e.id::int as id, e.slug, e.quote, e.verdict::text as verdict, e.status::text as status,
      coalesce(e.actual_author, '') as "actualAuthor",
      coalesce(e.earliest_known, '') as "earliestKnown",
      coalesce(e.first_attributed, '') as "firstAttributed",
      coalesce(e.original_text, '') as "originalText",
      coalesce(e.original_citation, '') as "originalCitation",
      e.findings, coalesce(e.submitted_by, '') as "submittedBy",
      (select array_agg(p.name order by a.position)
         from attributions a join people p on p.id = a.person_id where a.entry_id = e.id) as credited
    from entries e where e.id = ${id}
  `;
  if (!e) return null;
  const sources = await sql<EntrySourceInput[]>`
    select kind::text as kind, label, coalesce(url, '') as url
    from sources where entry_id = ${id} order by kind, position, id
  `;
  return { ...e, credited: e.credited ?? [], sources: [...sources] };
}

/** Creates or updates an entry, its credits and sources, all-or-nothing. Returns its id. */
export async function saveEntry(input: EntryInput, fromSubmissionId: number | null): Promise<number> {
  await requireAdmin();
  const sql = getSql();

  return sql.begin(async (tx) => {
    // A unique web address: the one given, or one made from the quote.
    const base = slugify(input.slug || input.quote);
    let slug = base;
    for (let n = 2; ; n++) {
      const [taken] = await tx`
        select 1 from entries where slug = ${slug} ${input.id ? tx`and id <> ${input.id}` : tx``}`;
      if (!taken) break;
      slug = `${base}-${n}`;
    }

    const fields = {
      slug,
      quote: input.quote,
      verdict: input.verdict,
      status: input.status,
      actual_author: input.actualAuthor || null,
      earliest_known: input.earliestKnown || null,
      first_attributed: input.firstAttributed || null,
      original_text: input.originalText || null,
      original_citation: input.originalCitation || null,
      findings: input.findings,
      submitted_by: input.submittedBy || null,
    };

    let entryId: number;
    if (input.id) {
      const [row] = await tx`
        update entries set ${tx(fields)} where id = ${input.id} returning id::int as id`;
      if (!row) throw new Error("That entry no longer exists.");
      entryId = row.id;
    } else {
      const [row] = await tx`insert into entries ${tx(fields)} returning id::int as id`;
      entryId = row.id;
    }

    // Credits: find or create each person, keeping the order given.
    await tx`delete from attributions where entry_id = ${entryId}`;
    for (const [position, name] of input.credited.entries()) {
      let [person] = await tx<{ id: number }[]>`select id::int as id from people where name = ${name}`;
      if (!person) {
        const personBase = slugify(name);
        let personSlug = personBase;
        for (let n = 2; ; n++) {
          const [taken] = await tx`select 1 from people where slug = ${personSlug}`;
          if (!taken) break;
          personSlug = `${personBase}-${n}`;
        }
        [person] = await tx<{ id: number }[]>`
          insert into people ${tx({ name, slug: personSlug })} returning id::int as id`;
      }
      await tx`insert into attributions ${tx({ entry_id: entryId, person_id: person.id, position })}`;
    }

    await tx`delete from sources where entry_id = ${entryId}`;
    for (const [position, s] of input.sources.entries()) {
      await tx`insert into sources ${tx({ entry_id: entryId, kind: s.kind, label: s.label, url: s.url || null, position })}`;
    }

    if (fromSubmissionId) {
      await tx`update submissions set status = 'approved' where id = ${fromSubmissionId}`;
    }

    return entryId;
  });
}
