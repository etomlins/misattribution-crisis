"use server";

import { redirect } from "next/navigation";
import {
  endSession,
  isAdminConfigured,
  passwordMatches,
  requireAdmin,
  startSession,
} from "@/lib/admin-auth";
import { saveEntry, setSubmissionStatus, SUBMISSION_STATUSES, type EntryInput, type SubmissionStatus } from "@/lib/admin-data";
import { parseVerdict } from "@/lib/verdicts";

const text = (formData: FormData, name: string) => {
  const v = formData.get(name);
  return typeof v === "string" ? v.trim() : "";
};

// ---------- login ----------

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) return { error: "Admin is switched off. Set ADMIN_PASSWORD first (see README)." };
  if (!passwordMatches(text(formData, "password"))) {
    await new Promise((r) => setTimeout(r, 1000)); // slow down guessing
    return { error: "That password isn’t right." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ---------- submissions ----------

export async function updateSubmissionStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(text(formData, "id"));
  const status = text(formData, "status") as SubmissionStatus;
  if (!Number.isInteger(id) || !SUBMISSION_STATUSES.includes(status)) return;
  await setSubmissionStatus(id, status);
  redirect(text(formData, "next") === "detail" ? `/admin/submissions/${id}` : "/admin");
}

// ---------- entries ----------

export type EntryFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"quote" | "credited" | "verdict", string>>;
  values?: EntryInput;
};

export async function saveEntryAction(_prev: EntryFormState, formData: FormData): Promise<EntryFormState> {
  await requireAdmin();

  const id = Number(text(formData, "id")) || null;
  const fromSubmission = Number(text(formData, "fromSubmission")) || null;
  const verdict = parseVerdict(text(formData, "verdict"));

  const sourceCount = Math.min(Number(text(formData, "sourceCount")) || 0, 50);
  const sources: EntryInput["sources"] = [];
  for (let i = 0; i < sourceCount; i++) {
    const label = text(formData, `sourceLabel${i}`);
    const url = text(formData, `sourceUrl${i}`);
    if (!label && !url) continue; // blank row
    sources.push({
      kind: text(formData, `sourceKind${i}`) === "spreading" ? "spreading" : "evidence",
      label: label || url,
      url,
    });
  }

  const values: EntryInput = {
    id,
    slug: text(formData, "slug"),
    quote: text(formData, "quote"),
    credited: text(formData, "credited")
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean),
    verdict: verdict ?? "unverified",
    status: text(formData, "status") === "published" ? "published" : "draft",
    actualAuthor: text(formData, "actualAuthor"),
    earliestKnown: text(formData, "earliestKnown"),
    firstAttributed: text(formData, "firstAttributed"),
    originalText: text(formData, "originalText"),
    originalCitation: text(formData, "originalCitation"),
    findings: text(formData, "findings"),
    submittedBy: text(formData, "submittedBy"),
    sources,
  };

  const fieldErrors: EntryFormState["fieldErrors"] = {};
  if (!values.quote) fieldErrors.quote = "The quote is required.";
  if (values.credited.length === 0) fieldErrors.credited = "Add at least one person it’s credited to.";
  if (!verdict) fieldErrors.verdict = "Pick a verdict.";
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors, values };
  }

  let savedId: number;
  try {
    savedId = await saveEntry(values, fromSubmission);
  } catch (err) {
    console.error("Saving entry failed", err);
    return { error: "Couldn’t save. Nothing was changed. Try again, or check the server log.", values };
  }
  redirect(`/admin/entries/${savedId}?saved=1`);
}
