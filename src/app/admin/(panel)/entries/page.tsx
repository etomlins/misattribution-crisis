import Link from "next/link";
import { formatDate, VerdictBadge } from "@/components/entry-parts";
import { listAllEntries } from "@/lib/admin-data";

export const metadata = { title: "Entries" };

export default async function AdminEntriesPage(props: PageProps<"/admin/entries">) {
  const sp = await props.searchParams;
  const status = sp.status === "draft" || sp.status === "published" ? sp.status : null;
  const q = typeof sp.q === "string" ? sp.q : "";
  const entries = await listAllEntries({ status, q });

  const tab = (value: "draft" | "published" | null, label: string) => {
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    if (q) params.set("q", q);
    const qs = params.toString();
    return (
      <Link href={qs ? `/admin/entries?${qs}` : "/admin/entries"} className="pill" aria-current={status === value ? "true" : undefined}>
        {label}
      </Link>
    );
  };

  return (
    <>
      <header className="stack gap-12">
        <h1 className="title">Entries</h1>
        <div className="filter-row">
          {tab(null, "All")}
          {tab("draft", "Drafts")}
          {tab("published", "Published")}
          <span style={{ flex: 1 }} />
          <form action="/admin/entries" role="search" className="search-bar" style={{ flex: "1 1 280px" }}>
            {status ? <input type="hidden" name="status" value={status} /> : null}
            <label htmlFor="admin-q" className="visually-hidden">
              Search entries
            </label>
            <input id="admin-q" name="q" type="search" defaultValue={q} placeholder="Search quotes or names…" />
            <button type="submit" className="btn-quiet">
              Search
            </button>
          </form>
        </div>
      </header>

      <p className="small muted">{entries.length} shown</p>

      <ul className="entry-list">
        {entries.map((e) => (
          <li key={e.id}>
            <Link href={`/admin/entries/${e.id}`} className="entry-row" style={{ padding: "18px 0" }}>
              <span className="entry-meta">
                <span className={e.status === "draft" ? "badge badge-draft" : "badge"}>{e.status === "draft" ? "Draft" : "Live"}</span>
                <VerdictBadge verdict={e.verdict} />
                <span className="small muted">Updated {formatDate(e.updatedAt)}</span>
              </span>
              <span className="quote quote-sm">“{e.quote}”</span>
              <span className="entry-credit">{e.credited ?? "No one credited yet"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
