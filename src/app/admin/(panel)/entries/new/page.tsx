import Link from "next/link";
import { findSimilarEntries, getSubmission, type EntryInput } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";
import { EntryForm } from "../entry-form";

export const metadata = { title: "New entry" };

const isUrl = (s: string | null | undefined): s is string => !!s && /^https?:\/\/\S+$/i.test(s);

export default async function NewEntryPage(props: PageProps<"/admin/entries/new">) {
  await requireAdmin();
  const sp = await props.searchParams;
  const fromId = Number(sp.from);
  const submission = Number.isInteger(fromId) && fromId > 0 ? await getSubmission(fromId) : null;
  const similar = submission ? await findSimilarEntries(submission.quote) : [];

  const initial: EntryInput = {
    id: null,
    slug: "",
    quote: submission?.quote ?? "",
    // "Mark Twain, Ben Franklin" or "Twain and Franklin" become one name per line.
    credited: submission ? submission.creditedTo.split(/\s*(?:,|\band\b|&)\s*/).filter(Boolean) : [],
    verdict: "unverified",
    status: "draft",
    actualAuthor: submission?.actualAuthor ?? "",
    earliestKnown: "",
    firstAttributed: "",
    originalText: "",
    originalCitation: "",
    findings: "",
    submittedBy: submission?.creditName ?? "",
    sources: [
      ...(isUrl(submission?.evidence) ? [{ kind: "evidence" as const, label: "Submitted source", url: submission.evidence }] : []),
      ...(isUrl(submission?.seenAt) ? [{ kind: "spreading" as const, label: "Where it was seen", url: submission.seenAt }] : []),
    ],
  };

  return (
    <div className="form-layout">
      <div className="stack gap-24" style={{ flex: "999 1 520px", minWidth: 0 }}>
        <h1 className="title">New entry</h1>
        <EntryForm initial={initial} fromSubmission={submission?.id} />
      </div>
      {submission ? (
        <aside className="panel" aria-labelledby="sub-title">
          <h2 id="sub-title" className="label">
            From submission #{submission.id}
          </h2>
          <p className="small">
            <strong>Their evidence:</strong>
          </p>
          <p className="small" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
            {submission.evidence}
          </p>
          {submission.notes ? (
            <>
              <p className="small">
                <strong>Notes:</strong>
              </p>
              <p className="small" style={{ whiteSpace: "pre-wrap" }}>
                {submission.notes}
              </p>
            </>
          ) : null}
          {similar.length > 0 ? (
            <div className="stack gap-8" style={{ borderTop: "1px solid var(--rule)", paddingTop: 14 }}>
              <p className="small">
                <strong>Might already be in the log:</strong>
              </p>
              {similar.map((e) => (
                <Link key={e.id} href={`/admin/entries/${e.id}`} className="small">
                  “{e.quote}” {e.credited ? `(${e.credited})` : ""}
                  {e.status === "draft" ? " · draft" : ""}
                </Link>
              ))}
              <p className="small muted">
                If it’s the same quote, add their sources to that entry instead, then mark the submission approved.
              </p>
            </div>
          ) : null}
          <p className="small muted">Saving this entry marks the submission approved.</p>
          <Link href={`/admin/submissions/${submission.id}`} className="small">
            View the full submission
          </Link>
        </aside>
      ) : null}
    </div>
  );
}
