import Link from "next/link";
import type { EntrySummary, PersonRef } from "@/lib/data";
import { VERDICT_INFO, type Verdict } from "@/lib/verdicts";

export function VerdictBadge({ verdict, large = false }: { verdict: Verdict; large?: boolean }) {
  return <span className={large ? "badge badge-lg" : "badge"}>{VERDICT_INFO[verdict].label}</span>;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    date,
  );
}

export function joinNames(people: PersonRef[]) {
  const names = people.map((p) => p.name);
  if (names.length <= 2) return names.join(" and ");
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

/** Splits text on blank lines into paragraphs. */
export function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className={className}>
            {p}
          </p>
        ))}
    </>
  );
}

// A one-line summary under each quote in a list.
function creditLine(entry: EntrySummary) {
  const credited = joinNames(entry.credited);
  if (entry.verdict === "misattributed" && entry.actualAuthor) {
    return (
      <>
        Credited to <strong>{credited}</strong> · Actually <strong>{entry.actualAuthor}</strong>
        {entry.earliestKnown ? `, ${entry.earliestKnown}` : ""}
      </>
    );
  }
  if (entry.verdict === "paraphrased" && entry.originalText) {
    return (
      <>
        Credited to <strong>{credited}</strong> · The original: “{entry.originalText}”
      </>
    );
  }
  return (
    <>
      Credited to <strong>{credited}</strong>
    </>
  );
}

export function EntryList({ entries }: { entries: EntrySummary[] }) {
  return (
    <ul className="entry-list">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link href={`/q/${entry.slug}`} className="entry-row">
            <span className="entry-meta">
              <VerdictBadge verdict={entry.verdict} />
              <span className="small muted">Added {formatDate(entry.createdAt)}</span>
            </span>
            <span className="quote quote-md">“{entry.quote}”</span>
            <span className="entry-credit">{creditLine(entry)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SubmitCallout({ title = "Spotted a misquote?", text }: { title?: string; text?: string }) {
  return (
    <section className="callout" aria-labelledby="callout-title">
      <div>
        <h2 id="callout-title" className="heading">
          {title}
        </h2>
        <p className="muted">{text ?? "Send it in with your source. Every submission is reviewed before it’s published."}</p>
      </div>
      <Link href="/submit" className="btn">
        Submit a misquote
      </Link>
    </section>
  );
}
