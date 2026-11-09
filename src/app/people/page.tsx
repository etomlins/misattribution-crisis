import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPeople, type PeopleSort } from "@/lib/data";
import { parseVerdict, VERDICT_INFO, VERDICTS, type Verdict } from "@/lib/verdicts";

export const metadata: Metadata = {
  title: "Browse by person",
  description: "Everyone who’s been credited with something they didn’t say.",
};

const SORTS: { value: PeopleSort; label: string }[] = [
  { value: "most", label: "Most entries" },
  { value: "az", label: "A–Z" },
  { value: "recent", label: "Recently updated" },
];

export default function PeoplePage(props: PageProps<"/people">) {
  return (
    <div className="wrap page" style={{ gap: 32 }}>
      <header className="stack gap-8">
        <h1 className="title">Browse by person</h1>
        <p className="lede">Everyone who’s been credited with something they didn’t say.</p>
      </header>
      <Suspense fallback={<p className="skeleton">Loading…</p>}>
        <PeopleContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

function hrefFor(verdict: Verdict | null, sort: PeopleSort) {
  const params = new URLSearchParams();
  if (verdict) params.set("verdict", verdict);
  if (sort !== "most") params.set("sort", sort);
  const qs = params.toString();
  return qs ? `/people?${qs}` : "/people";
}

async function PeopleContent({ searchParams }: { searchParams: PageProps<"/people">["searchParams"] }) {
  const sp = await searchParams;
  const verdict = parseVerdict(sp.verdict);
  const sort: PeopleSort = SORTS.some((s) => s.value === sp.sort) ? (sp.sort as PeopleSort) : "most";
  const people = await getPeople({ verdict, sort });

  return (
    <>
      <section className="filters" aria-label="Filters">
        <div className="filter-row">
          <span className="label" id="verdict-label">
            Verdict
          </span>
          <Link href={hrefFor(null, sort)} className="pill" aria-current={verdict === null ? "true" : undefined}>
            All
          </Link>
          {VERDICTS.map((v) => (
            <Link key={v} href={hrefFor(v, sort)} className="pill" aria-current={verdict === v ? "true" : undefined}>
              {VERDICT_INFO[v].label}
            </Link>
          ))}
        </div>
        <form className="filter-row" action="/people">
          {verdict ? <input type="hidden" name="verdict" value={verdict} /> : null}
          <label htmlFor="sort" className="label">
            Sort
          </label>
          <select id="sort" name="sort" defaultValue={sort}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-quiet">
            Apply
          </button>
        </form>
      </section>

      {people.length === 0 ? (
        <p className="muted">No one matches that filter yet.</p>
      ) : (
        <ul className="card-grid">
          {people.map((p) => (
            <li key={p.slug}>
              <Link href={`/people/${p.slug}`} className="person-card">
                <span className="person-card-head">
                  <span className="person-name">{p.name}</span>
                  <span className="small muted">
                    {p.count} {p.count === 1 ? "entry" : "entries"}
                  </span>
                </span>
                <span className="quote" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.45 }}>
                  “{p.sampleQuote}”
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
