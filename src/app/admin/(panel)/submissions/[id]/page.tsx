import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/entry-parts";
import { getSubmission } from "@/lib/admin-data";
import { updateSubmissionStatus } from "../../../actions";

export const metadata = { title: "Submission" };

export default async function SubmissionPage(props: PageProps<"/admin/submissions/[id]">) {
  const { id } = await props.params;
  const submission = Number.isInteger(Number(id)) ? await getSubmission(Number(id)) : null;
  if (!submission) notFound();
  const s = submission;

  const rows: [string, React.ReactNode][] = [
    ["Credited to", s.creditedTo],
    ["Actually said by", s.actualAuthor],
    ["Evidence", <Linkify key="e" text={s.evidence} />],
    ["Seen at", s.seenAt ? <Linkify key="s" text={s.seenAt} /> : null],
    ["Notes", s.notes],
    ["Credit as", s.creditName],
    ["Email", s.email ? <a key="m" href={`mailto:${s.email}`}>{s.email}</a> : null],
  ];

  const statusButton = (status: "approved" | "rejected" | "pending", label: string) => (
    <form action={updateSubmissionStatus}>
      <input type="hidden" name="id" value={s.id} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="next" value="detail" />
      <button type="submit" className="btn-quiet">
        {label}
      </button>
    </form>
  );

  return (
    <article className="stack gap-24" style={{ maxWidth: 760 }}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/admin">Inbox</Link>
        <span aria-hidden="true">›</span>
        <span>#{s.id}</span>
      </nav>

      <header className="stack gap-12">
        <span className="small muted">
          Submitted {formatDate(s.createdAt)} · <span className="badge">{s.status}</span>
        </span>
        <h1 className="quote quote-xl" style={{ fontWeight: 400 }}>
          “{s.quote}”
        </h1>
      </header>

      <dl className="verdict-list">
        {rows
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd style={{ whiteSpace: "pre-wrap" }}>{v}</dd>
            </div>
          ))}
      </dl>

      <div className="admin-actions">
        <Link href={`/admin/entries/new?from=${s.id}`} className="btn">
          Write up as entry
        </Link>
        {s.status !== "approved" ? statusButton("approved", "Mark approved") : null}
        {s.status !== "rejected" ? statusButton("rejected", "Reject") : null}
        {s.status !== "pending" ? statusButton("pending", "Move back to pending") : null}
      </div>
      <p className="small muted">
        “Write up as entry” opens the entry form filled in from this submission. Saving it marks the submission approved.
        “Mark approved” is for submissions you’ve added to an existing entry by hand.
      </p>
    </article>
  );
}

/** Shows text with any web addresses turned into links. */
function Linkify({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer nofollow">
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}
