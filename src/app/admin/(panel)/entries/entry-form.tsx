"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { EntryInput } from "@/lib/admin-data";
import { VERDICT_INFO, VERDICTS } from "@/lib/verdicts";
import { saveEntryAction, type EntryFormState } from "../../actions";

const BLANK_SOURCES = 2;

export function EntryForm({ initial, fromSubmission }: { initial: EntryInput; fromSubmission?: number }) {
  const [state, action, pending] = useActionState<EntryFormState, FormData>(saveEntryAction, {});
  const values = state.values ?? initial;
  const errors = state.fieldErrors ?? {};
  const [extraRows, setExtraRows] = useState(0);
  const rows = [
    ...values.sources,
    ...Array.from({ length: BLANK_SOURCES + extraRows }, () => ({ kind: "evidence" as const, label: "", url: "" })),
  ];
  const invalid = (name: keyof NonNullable<EntryFormState["fieldErrors"]>) =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};
  const errorText = (name: keyof NonNullable<EntryFormState["fieldErrors"]>) =>
    errors[name] ? (
      <span id={`${name}-error`} className="error-text">
        {errors[name]}
      </span>
    ) : null;

  return (
    <form action={action} className="stack gap-24" noValidate>
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
      {fromSubmission ? <input type="hidden" name="fromSubmission" value={fromSubmission} /> : null}
      <input type="hidden" name="sourceCount" value={rows.length} />

      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="field-row">
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={values.status}>
            <option value="draft">Draft (hidden)</option>
            <option value="published">Published (on the site)</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="verdict">Verdict</label>
          <select id="verdict" name="verdict" defaultValue={values.verdict} {...invalid("verdict")}>
            {VERDICTS.map((v) => (
              <option key={v} value={v}>
                {VERDICT_INFO[v].label}
              </option>
            ))}
          </select>
          {errorText("verdict")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="quote">The quote, as it circulates</label>
        <textarea id="quote" name="quote" rows={3} className="serif" defaultValue={values.quote} {...invalid("quote")} />
        {errorText("quote")}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="credited">
            Credited to <span className="hint">(one per line)</span>
          </label>
          <textarea id="credited" name="credited" rows={3} defaultValue={values.credited.join("\n")} {...invalid("credited")} />
          {errorText("credited")}
        </div>
        <div className="field">
          <label htmlFor="actualAuthor">
            Actually said by <span className="hint">(if known)</span>
          </label>
          <input id="actualAuthor" name="actualAuthor" type="text" defaultValue={values.actualAuthor} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="earliestKnown">
            Earliest known <span className="hint">(e.g. 1894)</span>
          </label>
          <input id="earliestKnown" name="earliestKnown" type="text" defaultValue={values.earliestKnown} />
        </div>
        <div className="field">
          <label htmlFor="firstAttributed">
            First tied to the famous name <span className="hint">(e.g. 1907)</span>
          </label>
          <input id="firstAttributed" name="firstAttributed" type="text" defaultValue={values.firstAttributed} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="findings">
          Findings <span className="hint">(leave a blank line between paragraphs)</span>
        </label>
        <textarea id="findings" name="findings" rows={8} defaultValue={values.findings} />
      </div>

      <div className="field">
        <label htmlFor="originalText">
          The original wording <span className="hint">(optional, keep it short)</span>
        </label>
        <textarea id="originalText" name="originalText" rows={2} className="serif" defaultValue={values.originalText} />
      </div>
      <div className="field">
        <label htmlFor="originalCitation">
          Where the original comes from <span className="hint">(optional)</span>
        </label>
        <input id="originalCitation" name="originalCitation" type="text" defaultValue={values.originalCitation} />
      </div>

      <fieldset className="stack gap-12" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="label" style={{ marginBottom: 8 }}>
          Sources
        </legend>
        <p className="small muted" style={{ marginTop: -4 }}>
          Evidence backs up your finding. “Spreading” is a place repeating the misquote. Clear a row to remove it.
        </p>
        {rows.map((s, i) => (
          <div key={`${i}-${s.label}`} className="source-row">
            <label className="visually-hidden" htmlFor={`sourceKind${i}`}>
              Source {i + 1} type
            </label>
            <select id={`sourceKind${i}`} name={`sourceKind${i}`} defaultValue={s.kind}>
              <option value="evidence">Evidence</option>
              <option value="spreading">Spreading</option>
            </select>
            <label className="visually-hidden" htmlFor={`sourceLabel${i}`}>
              Source {i + 1} name
            </label>
            <input id={`sourceLabel${i}`} name={`sourceLabel${i}`} type="text" placeholder="Name, e.g. Quote Investigator" defaultValue={s.label} />
            <label className="visually-hidden" htmlFor={`sourceUrl${i}`}>
              Source {i + 1} link
            </label>
            <input id={`sourceUrl${i}`} name={`sourceUrl${i}`} type="url" placeholder="https://" defaultValue={s.url} />
          </div>
        ))}
        <button type="button" className="btn-quiet" style={{ alignSelf: "flex-start" }} onClick={() => setExtraRows((n) => n + 2)}>
          Add more rows
        </button>
      </fieldset>

      <div className="field-row">
        <div className="field">
          <label htmlFor="submittedBy">
            Submitted by <span className="hint">(credit shown on the entry)</span>
          </label>
          <input id="submittedBy" name="submittedBy" type="text" defaultValue={values.submittedBy} />
        </div>
        <div className="field">
          <label htmlFor="slug">
            Web address <span className="hint">(/q/…, made from the quote if blank)</span>
          </label>
          <input id="slug" name="slug" type="text" defaultValue={values.slug} />
        </div>
      </div>

      <div className="admin-actions">
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "Saving…" : fromSubmission ? "Save entry and approve submission" : "Save"}
        </button>
        {values.id && values.status === "published" && values.slug ? (
          <Link href={`/q/${values.slug}`} className="btn-quiet" target="_blank">
            View on site
          </Link>
        ) : null}
      </div>
    </form>
  );
}
