import type { Metadata } from "next";
import { Suspense } from "react";
import { EntryList, SubmitCallout } from "@/components/entry-parts";
import { getPeople, searchEntries } from "@/lib/data";
import { parseVerdict, VERDICT_INFO, VERDICTS } from "@/lib/verdicts";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage(props: PageProps<"/search">) {
  return (
    <div className="narrow page" style={{ gap: 28 }}>
      <h1 className="title">Search</h1>
      <Suspense fallback={<p className="skeleton">Loading…</p>}>
        <SearchContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function SearchContent({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const sp = await searchParams;
  const q = (first(sp.q) ?? "").trim();
  const verdict = parseVerdict(first(sp.verdict));
  const person = first(sp.person) || null;

  const [results, people] = await Promise.all([
    searchEntries({ q, verdict, person }),
    getPeople({ sort: "az" }),
  ]);
  const filtered = Boolean(q || verdict || person);

  return (
    <>
      <form action="/search" role="search" className="stack gap-16">
        <div className="search-bar">
          <label htmlFor="q" className="visually-hidden">
            Search quotes
          </label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Search a quote or a name…" />
          <button type="submit" className="btn">
            Search
          </button>
        </div>
        <div className="filter-row">
          <label htmlFor="verdict" className="small muted">
            Verdict
          </label>
          <select id="verdict" name="verdict" defaultValue={verdict ?? ""}>
            <option value="">Any</option>
            {VERDICTS.map((v) => (
              <option key={v} value={v}>
                {VERDICT_INFO[v].label}
              </option>
            ))}
          </select>
          <label htmlFor="person" className="small muted" style={{ marginLeft: 8 }}>
            Credited to
          </label>
          <select id="person" name="person" defaultValue={person ?? ""}>
            <option value="">Anyone</option>
            {people.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </form>

      <p className="muted" aria-live="polite" style={{ fontSize: 15 }}>
        {filtered
          ? `${results.length} ${results.length === 1 ? "result" : "results"}${q ? ` for “${q}”` : ""}`
          : `All ${results.length} entries, newest first`}
      </p>

      {results.length > 0 ? <EntryList entries={results} /> : null}

      <SubmitCallout
        title="Not finding the quote you’re looking for?"
        text="If you think it’s misattributed, send it in with whatever source you have."
      />
    </>
  );
}
