import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { joinNames } from "@/components/entry-parts";
import { getEntry } from "@/lib/data";
import { SubmitForm } from "./submit-form";

export const metadata: Metadata = {
  title: "Submit a misquote",
  description:
    "Found a quote credited to the wrong person? Send it in with your source.",
};

// The Turnstile site key is public by design (it's in the page's HTML), but it's read on the server
// so it can be stored as an ordinary private variable in Vercel. The old NEXT_PUBLIC_ name still works.
function turnstileSiteKey() {
  return (
    (
      process.env.TURNSTILE_SITE_KEY ||
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    )?.trim() || undefined
  );
}

export default function SubmitPage(props: PageProps<"/submit">) {
  return (
    <div className="wrap page">
      <div className="form-layout">
        <div
          className="stack gap-24"
          style={{ flex: "999 1 520px", minWidth: 0 }}
        >
          <header className="stack gap-8">
            <h1 className="title">Submit a misquote</h1>
            <p className="lede">
              Found a quote credited to the wrong person? Send it in. I review
              every submission before anything is published.
            </p>
          </header>
          <Suspense fallback={<SubmitForm placeholder />}>
            <FormWithPrefill searchParams={props.searchParams} />
          </Suspense>
        </div>

        <aside className="panel" aria-labelledby="tips">
          <h2 id="tips" className="heading" style={{ fontSize: 22 }}>
            What makes a good submission
          </h2>
          <ul
            className="stack gap-8"
            style={{ margin: 0, paddingLeft: 18, fontSize: 15 }}
          >
            <li>The quote exactly as it circulates</li>
            <li>A source for the real origin, not just “I couldn’t find it”</li>
            <li>Where you saw it misattributed</li>
          </ul>
          <p>
            <Link href="/how-i-verify">How I verify →</Link>
          </p>
          <hr
            style={{
              border: 0,
              borderTop: "1px solid var(--rule)",
              margin: 0,
              width: "100%",
            }}
          />
          <h2 className="label">After you submit</h2>
          <p style={{ fontSize: 15 }}>
            You’ll see a thank-you note. If it checks out, it’s published as a
            new entry or added to an existing one.
          </p>
        </aside>
      </div>
    </div>
  );
}

// "Suggest a correction" links here with ?correction=<entry slug>.
async function FormWithPrefill({
  searchParams,
}: {
  searchParams: PageProps<"/submit">["searchParams"];
}) {
  const sp = await searchParams;
  const slug = typeof sp.correction === "string" ? sp.correction : null;
  const entry = slug ? await getEntry(slug) : null;
  if (!entry) return <SubmitForm siteKey={turnstileSiteKey()} />;
  return (
    <SubmitForm
      siteKey={turnstileSiteKey()}
      prefill={{
        quote: entry.quote,
        creditedTo: joinNames(entry.credited),
        correction: entry.slug,
      }}
    />
  );
}
