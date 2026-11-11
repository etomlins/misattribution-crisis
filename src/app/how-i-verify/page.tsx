import { VerdictBadge } from "@/components/entry-parts";
import type { Metadata } from "next";
import { VERDICT_INFO, VERDICTS } from "@/lib/verdicts";

export const metadata: Metadata = {
  title: "How I verify",
  description: "What each verdict means and what counts as evidence.",
};

export default function HowIVerifyPage() {
  return (
    <div className="narrow page">
      <header className="stack gap-12">
        <h1 className="title">How I verify</h1>
      </header>

      <section className="stack gap-12" aria-labelledby="verdicts">
        <h2 id="verdicts" className="heading">
          The verdicts
        </h2>
        <dl className="verdict-list">
          {VERDICTS.map((v) => (
            <div key={v}>
              <dt>
                <VerdictBadge verdict={v} />
              </dt>
              <dd>{VERDICT_INFO[v].meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="muted">
        The rest of this page is under construction.
      </p>
    </div>
  );
}
