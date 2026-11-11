import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { EntryList, SubmitCallout } from "@/components/entry-parts";
import { getLatestEntries, getPeople } from "@/lib/data";
import twain from "../../public/mark-twain.png";

export default function HomePage() {
  return (
    <div className="wrap page" style={{ gap: 56 }}>
      <section className="hero">
        <div className="stack gap-20 hero-text">
          <h1 className="title title-lg">Did they really say that?</h1>
          <p className="lede">
            In the information age, truth should be easier to access than ever.
            However, humanity’s most beloved quotables are being misattributed
            daily. If we are not scrupulous about the trivialities of history,
            we cannot possibly derive generalizations about continuity and
            change over time.
          </p>
          <p className="lede">
            Please help confront the misattribution crisis by submitting
            misquotes <Link href="/submit">here</Link>.
          </p>
          <form
            action="/search"
            role="search"
            className="search-bar"
            style={{ maxWidth: 720 }}
          >
            <label htmlFor="home-q" className="visually-hidden">
              Search quotes
            </label>
            <input
              id="home-q"
              name="q"
              type="search"
              placeholder="Search a quote or a name…"
            />
            <button type="submit" className="btn">
              Search
            </button>
          </form>
        </div>
        {/* Mark Twain, the most misquoted man on the site, keeping an eye on things. */}
        <Image
          src={twain}
          alt="Mark Twain"
          className="hero-overseer"
          priority
        />
      </section>

      <section className="stack gap-16" aria-labelledby="most-misquoted">
        <h2 id="most-misquoted" className="label">
          Most misquoted
        </h2>
        <Suspense fallback={<p className="skeleton">Loading…</p>}>
          <MostMisquoted />
        </Suspense>
      </section>

      <section className="stack gap-8" aria-labelledby="latest">
        <h2 id="latest" className="label">
          Latest investigations
        </h2>
        <Suspense fallback={<p className="skeleton">Loading…</p>}>
          <Latest />
        </Suspense>
        <p style={{ paddingTop: 12 }}>
          <Link href="/search">See all entries →</Link>
        </p>
      </section>

      <SubmitCallout />
    </div>
  );
}

async function MostMisquoted() {
  const people = await getPeople({ sort: "most", limit: 6 });
  if (people.length === 0) return <p className="muted">Nothing here yet.</p>;
  return (
    <ul className="chips">
      {people.map((p) => (
        <li key={p.slug}>
          <Link href={`/people/${p.slug}`} className="chip">
            {p.name} · {p.count}
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function Latest() {
  const entries = await getLatestEntries(5);
  if (entries.length === 0)
    return <p className="muted">No entries published yet.</p>;
  return <EntryList entries={entries} />;
}
