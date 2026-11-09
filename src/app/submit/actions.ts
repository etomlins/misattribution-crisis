"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getSql } from "@/lib/db";

export type SubmitValues = {
  quote: string;
  creditedTo: string;
  actualAuthor: string;
  evidence: string;
  seenAt: string;
  notes: string;
  email: string;
  creditName: string;
};

export type SubmitState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors: Partial<Record<keyof SubmitValues | "consent", string>>; values: SubmitValues };

const LIMITS: Record<keyof SubmitValues, number> = {
  quote: 1000,
  creditedTo: 200,
  actualAuthor: 200,
  evidence: 2000,
  seenAt: 500,
  notes: 2000,
  email: 254,
  creditName: 100,
};

const MAX_PER_HOUR = 5;

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitMisquote(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  // 1. Honeypot. People never see this field; bots fill it in. Pretend it worked.
  if (text(formData, "website")) return { status: "success" };

  const values: SubmitValues = {
    quote: text(formData, "quote"),
    creditedTo: text(formData, "creditedTo"),
    actualAuthor: text(formData, "actualAuthor"),
    evidence: text(formData, "evidence"),
    seenAt: text(formData, "seenAt"),
    notes: text(formData, "notes"),
    email: text(formData, "email"),
    creditName: text(formData, "creditName"),
  };
  const correction = text(formData, "correction").slice(0, 200);

  // 2. Validate.
  const fieldErrors: Extract<SubmitState, { status: "error" }>["fieldErrors"] = {};
  if (!values.quote) fieldErrors.quote = "Add the quote as you’ve seen it.";
  if (!values.creditedTo) fieldErrors.creditedTo = "Who is it usually credited to?";
  if (!values.evidence) fieldErrors.evidence = "Add a link or citation. Submissions without a source can’t be checked.";
  if (values.seenAt && !/^https?:\/\/\S+$/i.test(values.seenAt)) fieldErrors.seenAt = "This should be a web address starting with http.";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) fieldErrors.email = "That email doesn’t look right.";
  if (formData.get("consent") !== "yes") fieldErrors.consent = "Please confirm you’re OK with your submission being published.";
  for (const [key, max] of Object.entries(LIMITS) as [keyof SubmitValues, number][]) {
    if (values[key].length > max) fieldErrors[key] = `Please keep this under ${max} characters.`;
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  // 3. CAPTCHA, checked on the server.
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";

  const captchaOk = await verifyTurnstile(text(formData, "cf-turnstile-response"), ip);
  if (!captchaOk) {
    return {
      status: "error",
      message: "We couldn’t confirm you’re not a bot. Please complete the check and try again.",
      fieldErrors: {},
      values,
    };
  }

  // 4. Rate limit by (hashed) IP address.
  const sql = getSql();
  const ipHash = createHash("sha256")
    .update(`${process.env.IP_HASH_SALT ?? "misattribution-crisis"}:${ip}`)
    .digest("hex");
  const [{ recent }] = await sql<{ recent: number }[]>`
    select count(*)::int as recent from submissions
    where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'
  `;
  if (recent >= MAX_PER_HOUR) {
    return {
      status: "error",
      message: "You’ve sent a lot of submissions in the last hour. Please try again later.",
      fieldErrors: {},
      values,
    };
  }

  // 5. Save as pending. Nothing is published until it's reviewed.
  const notes = correction ? `Correction for /q/${correction}\n\n${values.notes}`.trim() : values.notes;
  await sql`
    insert into submissions ${sql({
      quote: values.quote,
      credited_to: values.creditedTo,
      actual_author: values.actualAuthor || null,
      evidence: values.evidence,
      seen_at: values.seenAt || null,
      notes: notes || null,
      email: values.email || null,
      credit_name: values.creditName || null,
      ip_hash: ipHash,
    })}
  `;

  return { status: "success" };
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      // Fail closed: never accept unchecked submissions on the live site.
      console.error("TURNSTILE_SECRET_KEY is not set; rejecting submission.");
      return false;
    }
    return true; // Local development without CAPTCHA keys.
  }
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, ...(ip !== "unknown" ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification failed", err);
    return false;
  }
}
