import Link from "next/link";
import { formatDate } from "@/components/entry-parts";
import { countSubmissions, listSubmissions, SUBMISSION_STATUSES, type SubmissionStatus } from "@/lib/admin-data";
import { updateSubmissionStatus } from "../actions";

export const metadata = { title: "Inbox" };

const LABELS: Record<SubmissionStatus, string> = { pending: "Pending", approved: "Approved", rejected: "Rejected" };

export default async function InboxPage(props: PageProps<"/admin">) {
  const sp = await props.searchParams;
  const status: SubmissionStatus = SUBMISSION_STATUSES.includes(sp.status as SubmissionStatus)
    ? (sp.status as SubmissionStatus)
    : "pending";
  const [submissions, counts] = await Promise.all([listSubmissions(status), countSubmissions()]);

  return (
    <>
      <header className="stack gap-12">
        <h1 className="title">Submissions</h1>
        <div className="filter-row">
          {SUBMISSION_STATUSES.map((s) => (
            <Link
              key={s}
              href={s === "pending" ? "/admin" : `/admin?status=${s}`}
              className="pill"
              aria-current={s === status ? "true" : undefined}
            >
              {LABELS[s]} · {counts[s]}
            </Link>
          ))}
        </div>
      </header>

      {submissions.length === 0 ? (
        <p className="muted">{status === "pending" ? "Nothing waiting. Inbox zero." : `No ${status} submissions.`}</p>
      ) : (
        <ul className="entry-list">
          {submissions.map((s) => (
            <li key={s.id} className="admin-row">
              <Link href={`/admin/submissions/${s.id}`} className="entry-row" style={{ flex: "1 1 420px" }}>
                <span className="small muted">
                  #{s.id} · {formatDate(s.createdAt)} · {s.creditName || "anonymous"}
                </span>
                <span className="quote quote-sm">“{s.quote}”</span>
                <span className="entry-credit">
                  Credited to <strong>{s.creditedTo}</strong>
                  {s.actualAuthor ? (
                    <>
                      {" "}
                      · Says actually <strong>{s.actualAuthor}</strong>
                    </>
                  ) : null}
                </span>
              </Link>
              {status === "pending" ? (
                <div className="admin-actions">
                  <Link href={`/admin/entries/new?from=${s.id}`} className="btn" style={{ fontSize: 14, minHeight: 40, padding: "8px 14px" }}>
                    Write up as entry
                  </Link>
                  <form action={updateSubmissionStatus}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button type="submit" className="btn-quiet">
                      Reject
                    </button>
                  </form>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
