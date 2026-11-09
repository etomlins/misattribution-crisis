import type { Metadata } from "next";
import Link from "next/link";
import { VERDICT_INFO, VERDICTS } from "@/lib/verdicts";

export const metadata: Metadata = {
  title: "How I verify",
  description: "What each verdict means and what counts as evidence.",
};

// DRAFT COPY: rewrite in your own words.
export default function HowIVerifyPage() {
  return (
    <div className="narrow page">
      <header className="stack gap-12">
        <h1 className="title">How I verify</h1>
        <p className="lede">
          Every entry starts with a quote someone attached to a famous name. I go looking for where it first appeared,
          and the verdict reflects how far the trail goes.
        </p>
      </header>

      <section className="stack gap-12" aria-labelledby="verdicts">
        <h2 id="verdicts" className="heading">
          The verdicts
        </h2>
        <dl className="verdict-list">
          {VERDICTS.map((v) => (
            <div key={v}>
              <dt>
                <span className="badge">{VERDICT_INFO[v].label}</span>
              </dt>
              <dd>{VERDICT_INFO[v].meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="stack gap-12" aria-labelledby="evidence">
        <h2 id="evidence" className="heading">
          What counts as evidence
        </h2>
        <p className="body">
          Primary sources come first: the original book, letter, speech or archive. After that, reputable reference
          works and careful researchers like Quote Investigator. Quote aggregators like Goodreads are never evidence;
          they’re usually where the misquote is spreading.
        </p>
      </section>

      <section className="stack gap-12" aria-labelledby="no-record">
        <h2 id="no-record" className="heading">
          “No record found” isn’t proof
        </h2>
        <p className="body">
          Not finding a quote in someone’s work makes it Unverified, not Misattributed. Misattributed means I can
          point to who said it first. Absence of evidence is worth logging, but it’s a weaker claim, and the verdict
          says so.
        </p>
      </section>

      <section className="stack gap-12" aria-labelledby="corrections">
        <h2 id="corrections" className="heading">
          Corrections
        </h2>
        <p className="body">
          Think I got one wrong? <Link href="/submit">Send a correction</Link> with your source. Entries show the date
          they were last updated.
        </p>
      </section>
    </div>
  );
}
