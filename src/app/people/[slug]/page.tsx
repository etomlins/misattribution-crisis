import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EntryList, SubmitCallout } from "@/components/entry-parts";
import { getPerson } from "@/lib/data";

// "1 quote credited to A.A. Milne that doesn’t hold up." / "5 quotes … that don’t hold up."
function summaryLine(n: number, name: string) {
  return n === 1
    ? `1 quote credited to ${name} that doesn’t hold up.`
    : `${n} quotes credited to ${name} that don’t hold up.`;
}

export async function generateMetadata({ params }: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPerson(slug);
  if (!result) return { title: "Not found" };
  const n = result.entries.length;
  return {
    title: `Misquoted: ${result.person.name}`,
    description: summaryLine(n, result.person.name),
  };
}

export default function PersonPage(props: PageProps<"/people/[slug]">) {
  return (
    <Suspense fallback={<div className="wrap page skeleton">Loading…</div>}>
      <PersonContent params={props.params} />
    </Suspense>
  );
}

async function PersonContent({ params }: { params: PageProps<"/people/[slug]">["params"] }) {
  const { slug } = await params;
  const result = await getPerson(slug);
  if (!result) notFound();
  const { person, entries } = result;

  return (
    <div className="wrap page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/people">Browse</Link>
        <span aria-hidden="true">›</span>
        <span>{person.name}</span>
      </nav>
      <header className="stack gap-8">
        <h1 className="title">{person.name}</h1>
        <p className="lede">
          {summaryLine(entries.length, person.name)}
        </p>
      </header>
      <EntryList entries={entries} />
      <SubmitCallout title={`Seen another misquoted ${person.name} line?`} />
    </div>
  );
}
