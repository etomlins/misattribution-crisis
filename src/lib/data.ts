import "server-only";
import { connection } from "next/server";
import { getSql } from "./db";
import type { Verdict } from "./verdicts";

// Every read here waits for a real request (connection()), so anything you
// change in Supabase shows up on the next page load. No rebuild needed.

export type PersonRef = { name: string; slug: string };

export type EntrySummary = {
  id: number;
  slug: string;
  quote: string;
  verdict: Verdict;
  actualAuthor: string | null;
  earliestKnown: string | null;
  firstAttributed: string | null;
  originalText: string | null;
  originalCitation: string | null;
  findings: string;
  submittedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  credited: PersonRef[];
};

export type Source = { kind: "evidence" | "spreading"; label: string; url: string | null };
export type Entry = EntrySummary & { sources: Source[] };

export type PersonWithCount = PersonRef & { count: number; sampleQuote: string; lastUpdated: Date };

function entryColumns() {
  const sql = getSql();
  return sql`
    e.id::int as id,
    e.slug,
    e.quote,
    e.verdict::text as verdict,
    e.actual_author as "actualAuthor",
    e.earliest_known as "earliestKnown",
    e.first_attributed as "firstAttributed",
    e.original_text as "originalText",
    e.original_citation as "originalCitation",
    e.findings,
    e.submitted_by as "submittedBy",
    e.created_at as "createdAt",
    e.updated_at as "updatedAt",
    coalesce((
      select json_agg(json_build_object('name', p.name, 'slug', p.slug) order by a.position)
      from attributions a join people p on p.id = a.person_id
      where a.entry_id = e.id
    ), '[]'::json) as credited
  `;
}

export async function getLatestEntries(limit = 5): Promise<EntrySummary[]> {
  await connection();
  const sql = getSql();
  return sql<EntrySummary[]>`
    select ${entryColumns()} from entries e
    where e.status = 'published'
    order by e.created_at desc
    limit ${limit}
  `;
}

export async function getEntry(slug: string): Promise<Entry | null> {
  await connection();
  const sql = getSql();
  const [entry] = await sql<EntrySummary[]>`
    select ${entryColumns()} from entries e
    where e.status = 'published' and e.slug = ${slug}
  `;
  if (!entry) return null;
  const sources = await sql<Source[]>`
    select kind::text as kind, label, url from sources
    where entry_id = ${entry.id}
    order by kind, position, id
  `;
  return { ...entry, sources: [...sources] };
}

// Other published entries credited to any of the same people.
export async function getRelatedEntries(entry: EntrySummary, limit = 4): Promise<EntrySummary[]> {
  await connection();
  if (entry.credited.length === 0) return [];
  const sql = getSql();
  const slugs = entry.credited.map((p) => p.slug);
  return sql<EntrySummary[]>`
    select ${entryColumns()} from entries e
    where e.status = 'published' and e.id <> ${entry.id}
      and exists (
        select 1 from attributions a join people p on p.id = a.person_id
        where a.entry_id = e.id and p.slug in ${sql(slugs)}
      )
    order by e.created_at desc
    limit ${limit}
  `;
}

export type PeopleSort = "most" | "az" | "recent";

export async function getPeople(opts: { verdict?: Verdict | null; sort?: PeopleSort; limit?: number } = {}) {
  await connection();
  const sql = getSql();
  const order =
    opts.sort === "az"
      ? sql`p.name asc`
      : opts.sort === "recent"
        ? sql`max(e.updated_at) desc, p.name asc`
        : sql`count(*) desc, p.name asc`;
  return sql<PersonWithCount[]>`
    select p.name, p.slug, count(*)::int as count,
      (array_agg(e.quote order by e.created_at desc))[1] as "sampleQuote",
      max(e.updated_at) as "lastUpdated"
    from people p
    join attributions a on a.person_id = p.id
    join entries e on e.id = a.entry_id
    where e.status = 'published'
      ${opts.verdict ? sql`and e.verdict = ${opts.verdict}` : sql``}
    group by p.id
    order by ${order}
    ${opts.limit ? sql`limit ${opts.limit}` : sql``}
  `;
}

export async function getPerson(slug: string): Promise<{ person: PersonRef; entries: EntrySummary[] } | null> {
  await connection();
  const sql = getSql();
  const [person] = await sql<PersonRef[]>`select name, slug from people where slug = ${slug}`;
  if (!person) return null;
  const entries = await sql<EntrySummary[]>`
    select ${entryColumns()} from entries e
    where e.status = 'published'
      and exists (
        select 1 from attributions a join people p on p.id = a.person_id
        where a.entry_id = e.id and p.slug = ${slug}
      )
    order by e.created_at desc
  `;
  if (entries.length === 0) return null;
  return { person, entries: [...entries] };
}

export async function searchEntries(opts: {
  q: string;
  verdict?: Verdict | null;
  person?: string | null;
}): Promise<EntrySummary[]> {
  await connection();
  const sql = getSql();
  const q = opts.q.trim().slice(0, 200);
  const like = `%${q.replace(/[\\%_]/g, "\\$&")}%`;

  const textMatch = q
    ? sql`and (
        e.search @@ websearch_to_tsquery('english', ${q})
        or e.quote ilike ${like}
        or e.actual_author ilike ${like}
        or exists (
          select 1 from attributions a join people p on p.id = a.person_id
          where a.entry_id = e.id and p.name ilike ${like}
        )
      )`
    : sql``;

  const order = q
    ? sql`ts_rank(e.search, websearch_to_tsquery('english', ${q})) desc, e.created_at desc`
    : sql`e.created_at desc`;

  return sql<EntrySummary[]>`
    select ${entryColumns()} from entries e
    where e.status = 'published'
      ${textMatch}
      ${opts.verdict ? sql`and e.verdict = ${opts.verdict}` : sql``}
      ${
        opts.person
          ? sql`and exists (
              select 1 from attributions a join people p on p.id = a.person_id
              where a.entry_id = e.id and p.slug = ${opts.person}
            )`
          : sql``
      }
    order by ${order}
    limit 50
  `;
}
