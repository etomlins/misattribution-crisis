import "server-only";

// Emails you when someone submits a misquote, through Resend (resend.com).
// Off unless RESEND_API_KEY and NOTIFY_EMAIL are set. A failed email never
// affects the submission itself; it's already saved by the time this runs.

export type SubmissionAlert = {
  id: number;
  quote: string;
  creditedTo: string;
  actualAuthor: string;
  evidence: string;
  seenAt: string;
  notes: string;
  email: string;
  creditName: string;
};

export async function notifyNewSubmission(s: SubmissionAlert): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const from = process.env.NOTIFY_FROM || "The Misattribution Crisis <onboarding@resend.dev>";
  const oneLine = (text: string, max: number) => {
    const flat = text.replace(/\s+/g, " ").trim();
    return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
  };

  // null lines (empty optional fields) are dropped; "" lines are deliberate blank lines.
  const lines = [
    `New submission #${s.id}`,
    "",
    `Quote: “${s.quote}”`,
    `Credited to: ${s.creditedTo}`,
    s.actualAuthor ? `Actually said by: ${s.actualAuthor}` : null,
    "",
    "Evidence:",
    s.evidence,
    s.seenAt ? `\nSeen at: ${s.seenAt}` : null,
    s.notes ? `\nNotes:\n${s.notes}` : null,
    "",
    `From: ${s.creditName || "anonymous"}${s.email ? ` <${s.email}>` : ""}`,
    "",
    "Review it in Supabase: Table Editor → submissions, filtered to status = pending.",
  ].filter((line): line is string => line !== null);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New misquote: ${oneLine(s.creditedTo, 40)}, “${oneLine(s.quote, 60)}”`,
        text: lines.join("\n"),
        // Hitting Reply goes to the submitter, if they left an email.
        ...(s.email ? { reply_to: s.email } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error("Submission email failed", res.status, await res.text());
  } catch (err) {
    console.error("Submission email failed", err);
  }
}
