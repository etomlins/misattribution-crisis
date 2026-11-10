import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CopyLinkButton } from "@/components/copy-link-button";
import { formatDate, joinNames, Paragraphs, VerdictBadge } from "@/components/entry-parts";
import { getEntry, getRelatedEntries, type EntrySummary } from "@/lib/data";
import { VERDICT_INFO } from "@/lib/verdicts";

export async function generateMetadata({ params }: PageProps<"/q/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry(slug);
  if (!entry) return { title: "Not found" };

  const verdict = VERDICT_INFO[entry.verdict].label;
  const credited = joinNames(entry.credited);
  const description =
    entry.verdict === "misattributed" && entry.actualAuthor
      ? `${verdict}. Credited to ${credited}, actually ${entry.actualAuthor}.`
      : `${verdict}. Credited to ${credited}.`;
  const title = `“${entry.quote.length > 70 ? `${entry.quote.slice(0, 67)}…` : entry.quote}”`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default function EntryPage(props: PageProps<"/q/[slug]">) {
  return (
    <Suspense fallback={<div className="narrow page skeleton">Loading…</div>}>
      <EntryContent params={props.params} />
    </Suspense>
  );
}

async function EntryContent({ params }: { params: PageProps<"/q/[slug]">["params"] }) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  if (!entry) notFound();

  const firstPerson = entry.credited[0];
  const evidence = entry.sources.filter((s) => s.kind === "evidence");
  const spreading = entry.sources.filter((s) => s.kind === "spreading");
  const showUpdated = entry.updatedAt.getTime() - entry.createdAt.getTime() > 60_000;

  const facts = [
    { label: "Credited to", value: joinNames(entry.credited) },
    { label: "Actually said by", value: entry.actualAuthor ?? "Unknown" },
    entry.earliestKnown ? { label: "Earliest known", value: entry.earliestKnown } : null,
    entry.firstAttributed && firstPerson
      ? { label: `First tied to ${firstPerson.name.split(" ").at(-1)}`, value: entry.firstAttributed }
      : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <article className="narrow page">
      {firstPerson ? (
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/people">Browse</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/people/${firstPerson.slug}`}>{firstPerson.name}</Link>
        </nav>
      ) : null}

      <header className="stack gap-20">
        <div className="entry-meta">
          <VerdictBadge verdict={entry.verdict} large />
          <span className="small muted">
            Added {formatDate(entry.createdAt)}
            {showUpdated ? ` · Updated ${formatDate(entry.updatedAt)}` : ""}
          </span>
        </div>
        <h1 className="quote quote-xl" style={{ fontWeight: 400 }}>
          “{entry.quote}”
        </h1>
        <p className="muted" style={{ fontSize: 17 }}>
          As commonly credited to {joinNames(entry.credited)}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <CopyLinkButton />
          <Link href={`/submit?correction=${encodeURIComponent(entry.slug)}`} className="btn-quiet">
            Suggest a correction
          </Link>
        </div>
      </header>

      <dl className="facts">
        {facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      {entry.findings.trim() ? (
        <section className="stack gap-12" aria-labelledby="findings">
          <h2 id="findings" className="heading">
            Findings
          </h2>
          <Paragraphs text={entry.findings} className="body" />
          {entry.submittedBy ? <p className="small muted">Submitted by {entry.submittedBy}.</p> : null}
        </section>
      ) : null}

      {entry.originalText || entry.originalCitation ? (
        <section className="stack gap-12" aria-labelledby="original">
          <h2 id="original" className="heading">
            The original
          </h2>
          <blockquote className="original">
            {entry.originalText ? <p>“{entry.originalText}”</p> : null}
            {entry.originalCitation ? <footer>{entry.originalCitation}</footer> : null}
          </blockquote>
        </section>
      ) : null}

      {evidence.length > 0 || spreading.length > 0 ? (
        <div className="source-cols">
          {evidence.length > 0 ? (
            <section aria-labelledby="evidence">
              <h2 id="evidence" className="label">
                Evidence
              </h2>
              <SourceList sources={evidence} />
            </section>
          ) : null}
          {spreading.length > 0 ? (
            <section aria-labelledby="spreading">
              <h2 id="spreading" className="label">
                Spreading the misquote
              </h2>
              <SourceList sources={spreading} />
            </section>
          ) : null}
        </div>
      ) : null}

      <Suspense fallback={null}>
        <Related entry={entry} />
      </Suspense>
    </article>
  );
}

function SourceList({ sources }: { sources: { label: string; url: string | null }[] }) {
  return (
    <ul>
      {sources.map((s, i) => (
        <li key={i}>
          {s.url ? (
            <a href={s.url} rel="noopener noreferrer nofollow" target="_blank">
              {s.label}
            </a>
          ) : (
            s.label
          )}
        </li>
      ))}
    </ul>
  );
}

async function Related({ entry }: { entry: EntrySummary }) {
  const related = await getRelatedEntries(entry);
  if (related.length === 0) return null;
  const name = entry.credited[0]?.name;
  return (
    <section className="related rule-top stack" aria-labelledby="related">
      <h2 id="related" className="label" style={{ marginBottom: 8 }}>
        {entry.credited.length === 1 && name ? `More misquoted ${name}` : "Related misquotes"}
      </h2>
      {related.map((r) => (
        <Link key={r.id} href={`/q/${r.slug}`}>
          <span className="quote quote-sm">“{r.quote}”</span>
        </Link>
      ))}
    </section>
  );
}
