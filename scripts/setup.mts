// Creates the tables (if missing) and loads the starter entries (if the
// database has none yet). Safe to run more than once: it never deletes data.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";
import { seedEntries } from "../db/seed-data.ts";
import { slugify } from "../src/lib/slug.ts";

export async function setupDatabase(databaseUrl: string) {
  const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(databaseUrl);
  const sql = postgres(databaseUrl, {
    prepare: false,
    fetch_types: false,
    max: 1,
    ssl: isLocal ? false : "require",
    onnotice: () => {},
  });

  try {
    const [{ exists }] = await sql`select to_regclass('public.entries') is not null as exists`;
    if (exists) {
      console.log("Tables already exist, skipping schema.");
    } else {
      const schema = readFileSync(join(process.cwd(), "db", "schema.sql"), "utf8");
      await sql.unsafe(schema);
      console.log("Created tables.");
    }

    const [{ count }] = await sql`select count(*)::int as count from entries`;
    if (count > 0) {
      console.log(`Database already has ${count} entries, skipping seed data.`);
      return;
    }

    await sql.begin(async (tx) => {
      const personIds = new Map<string, number>();
      const usedSlugs = new Set<string>();
      const start = Date.parse("2026-11-06T15:00:00Z");

      for (const [i, e] of seedEntries.entries()) {
        let slug = slugify(e.quote);
        for (let n = 2; usedSlugs.has(slug); n++) slug = `${slugify(e.quote)}-${n}`;
        usedSlugs.add(slug);

        // Later entries in the log get later timestamps, so "latest" matches the log order.
        const createdAt = new Date(start + i * 60_000);

        const [{ id: entryId }] = await tx`
          insert into entries ${tx({
            slug,
            quote: e.quote,
            verdict: e.verdict,
            status: e.status,
            actual_author: e.actualAuthor ?? null,
            earliest_known: e.earliestKnown ?? null,
            first_attributed: e.firstAttributed ?? null,
            original_text: e.originalText ?? null,
            original_citation: e.originalCitation ?? null,
            findings: e.findings ?? "",
            created_at: createdAt,
            updated_at: createdAt,
          })}
          returning id`;

        for (const [position, name] of e.credited.entries()) {
          let personId = personIds.get(name);
          if (!personId) {
            const [row] = await tx`
              insert into people ${tx({ name, slug: slugify(name) })}
              on conflict (name) do update set name = excluded.name
              returning id`;
            personId = Number(row.id);
            personIds.set(name, personId);
          }
          await tx`insert into attributions ${tx({ entry_id: entryId, person_id: personId, position })}`;
        }

        for (const [position, s] of (e.sources ?? []).entries()) {
          await tx`insert into sources ${tx({ entry_id: entryId, kind: s.kind, label: s.label, url: s.url ?? null, position })}`;
        }
      }
    });

    const published = seedEntries.filter((e) => e.status === "published").length;
    console.log(`Loaded ${seedEntries.length} entries (${published} published, ${seedEntries.length - published} drafts).`);
  } finally {
    await sql.end();
  }
}

// Run directly: `npm run db:setup`
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Add it to .env.local (see README).");
    process.exit(1);
  }
  setupDatabase(url).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
