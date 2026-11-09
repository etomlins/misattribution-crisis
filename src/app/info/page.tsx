import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_URL, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Info",
  description: "About the project, submissions, privacy and contact.",
};

export default function InfoPage() {
  return (
    <div className="narrow page">
      <h1 className="title">Info</h1>

      <section className="stack gap-12" aria-labelledby="about">
        <h2 id="about" className="label">
          About this project
        </h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.5 }}>
          The age of information has brought with it a crisis of quote misattributions. Our great thinkers are being
          remembered for their eloquent lines that, in reality, never crossed their minds.
        </p>
        <p style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.5 }}>
          We are losing grasp of history; the more research I conduct, the more I find that our belief structures are
          built on cornerstones of sand. Stay sharp. Good luck and Godspeed.
        </p>
        <p className="muted">
          This site started as a running log on my blog, <a href={BLOG_URL}>the life and times of ellen</a>.
        </p>
      </section>

      <section className="stack gap-12 rule-top" aria-labelledby="who">
        <h2 id="who" className="label">
          Who runs it
        </h2>
        {/* TODO: a few lines about you */}
        <p>Ellen Tomlins.</p>
      </section>

      <section className="stack gap-12 rule-top" aria-labelledby="submissions">
        <h2 id="submissions" className="label">
          Submissions
        </h2>
        <p>
          Anyone can <Link href="/submit">submit a misquote</Link>. Every submission is reviewed before it appears, and
          may be edited for length and clarity. If you leave a name, you’ll be credited on the entry.
        </p>
        <p>
          For what counts as evidence and what each verdict means, see <Link href="/how-i-verify">How I verify</Link>.
        </p>
      </section>

      <section className="stack gap-12 rule-top" aria-labelledby="privacy">
        <h2 id="privacy" className="label">
          Privacy
        </h2>
        <p>
          Email addresses are optional and only used to follow up on a submission. They are never shown on the site or
          shared. To limit spam, the site keeps a scrambled (hashed) form of the submitter’s IP address, which can’t be
          turned back into the address. The site uses no tracking or ad cookies.
        </p>
      </section>

      <section className="stack gap-12 rule-top" aria-labelledby="quoting">
        <h2 id="quoting" className="label">
          Quoting and sources
        </h2>
        <p>
          Entries quote only short passages and link to the original source wherever possible. If you hold the rights
          to something quoted here and want it changed or removed, get in touch.
        </p>
      </section>

      <section className="stack gap-12 rule-top" aria-labelledby="contact">
        <h2 id="contact" className="label">
          Contact
        </h2>
        <p>
          For corrections, takedown requests or anything else:{" "}
          {CONTACT_EMAIL ? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> : <span>[contact email]</span>}
        </p>
      </section>
    </div>
  );
}
