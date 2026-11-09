"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState, useEffect, useRef } from "react";
import { submitMisquote, type SubmitState, type SubmitValues } from "./actions";

declare global {
  interface Window {
    turnstile?: { reset: (el?: string | HTMLElement) => void };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Prefill = { quote?: string; creditedTo?: string; correction?: string };

export function SubmitForm({ prefill = {} }: { prefill?: Prefill }) {
  const [state, formAction, pending] = useActionState<SubmitState, FormData>(submitMisquote, { status: "idle" });
  const captchaRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // A CAPTCHA token works once; after a failed attempt, get a fresh one.
  useEffect(() => {
    if (state.status === "error") {
      if (captchaRef.current) window.turnstile?.reset(captchaRef.current);
      errorRef.current?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="form-done stack gap-16" role="status">
        <h2 className="heading">Thank you.</h2>
        <p className="body">
          Your submission is in the queue. If it checks out, it’ll be published as a new entry or added to an existing
          one.
        </p>
        <p>
          <Link href="/">Back to the home page</Link>
        </p>
      </div>
    );
  }

  const values: Partial<SubmitValues> = state.status === "error" ? state.values : prefill;
  const errors = state.status === "error" ? state.fieldErrors : {};
  const fieldProps = (name: keyof SubmitValues | "consent") =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};
  const errorText = (name: keyof SubmitValues | "consent") =>
    errors[name] ? (
      <span id={`${name}-error`} className="error-text">
        {errors[name]}
      </span>
    ) : null;

  return (
    <form action={formAction} className="stack gap-24" noValidate>
      {SITE_KEY ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /> : null}

      {state.status === "error" ? (
        <p className="form-error" role="alert" tabIndex={-1} ref={errorRef}>
          {state.message}
        </p>
      ) : null}

      {prefill.correction ? (
        <>
          <input type="hidden" name="correction" value={prefill.correction} />
          <p className="panel small">
            You’re suggesting a correction to an existing entry. Tell me what’s wrong and what your source says.
          </p>
        </>
      ) : null}

      <div className="field">
        <label htmlFor="quote">
          The quote, as you’ve seen it <span className="hint">(required)</span>
        </label>
        <textarea id="quote" name="quote" rows={3} className="serif" required defaultValue={values.quote} {...fieldProps("quote")} />
        {errorText("quote")}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="creditedTo">
            Who it’s credited to <span className="hint">(required)</span>
          </label>
          <input
            id="creditedTo"
            name="creditedTo"
            type="text"
            required
            placeholder="e.g. Mark Twain"
            defaultValue={values.creditedTo}
            {...fieldProps("creditedTo")}
          />
          {errorText("creditedTo")}
        </div>
        <div className="field">
          <label htmlFor="actualAuthor">
            Who actually said it <span className="hint">(if known)</span>
          </label>
          <input id="actualAuthor" name="actualAuthor" type="text" defaultValue={values.actualAuthor} {...fieldProps("actualAuthor")} />
          {errorText("actualAuthor")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="evidence">
          Your evidence <span className="hint">(required)</span>
        </label>
        <textarea
          id="evidence"
          name="evidence"
          rows={3}
          required
          defaultValue={values.evidence}
          aria-describedby={errors.evidence ? "evidence-error evidence-help" : "evidence-help"}
          aria-invalid={errors.evidence ? true : undefined}
        />
        <span id="evidence-help" className="help">
          A link or a citation: book, page, date, archive. Primary sources are best.
        </span>
        {errorText("evidence")}
      </div>

      <div className="field">
        <label htmlFor="seenAt">
          Where you saw the misquote <span className="hint">(optional)</span>
        </label>
        <input id="seenAt" name="seenAt" type="url" placeholder="https://" defaultValue={values.seenAt} {...fieldProps("seenAt")} />
        {errorText("seenAt")}
      </div>

      <div className="field">
        <label htmlFor="notes">
          Anything else <span className="hint">(optional)</span>
        </label>
        <textarea id="notes" name="notes" rows={3} defaultValue={values.notes} {...fieldProps("notes")} />
        {errorText("notes")}
      </div>

      <div className="field">
        <label htmlFor="email">
          Your email <span className="hint">(optional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={values.email}
          aria-describedby={errors.email ? "email-error email-help" : "email-help"}
          aria-invalid={errors.email ? true : undefined}
        />
        <span id="email-help" className="help">
          Only used to follow up or credit you. Never shared or shown.
        </span>
        {errorText("email")}
      </div>

      <div className="field">
        <label htmlFor="creditName">
          Name to credit <span className="hint">(optional)</span>
        </label>
        <input
          id="creditName"
          name="creditName"
          type="text"
          autoComplete="name"
          placeholder="Leave blank to stay anonymous"
          defaultValue={values.creditName}
          {...fieldProps("creditName")}
        />
        {errorText("creditName")}
      </div>

      {/* Honeypot: hidden from people and screen readers. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {SITE_KEY ? (
        <div ref={captchaRef} className="cf-turnstile" data-sitekey={SITE_KEY} data-theme="light" />
      ) : process.env.NODE_ENV !== "production" ? (
        <p className="small muted">CAPTCHA is off: no Turnstile site key is set (fine for local development).</p>
      ) : null}

      <div className="field">
        <label className="check" style={{ fontWeight: 400 }}>
          <input type="checkbox" name="consent" value="yes" {...fieldProps("consent")} />
          <span>I agree my submission may be edited and published on this site.</span>
        </label>
        {errorText("consent")}
      </div>

      <button type="submit" className="btn" disabled={pending} style={{ alignSelf: "flex-start" }}>
        {pending ? "Sending…" : "Send for review"}
      </button>
    </form>
  );
}
