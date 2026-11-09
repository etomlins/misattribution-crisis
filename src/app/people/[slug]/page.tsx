import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EntryList, SubmitCallout } from "@/components/entry-parts";
import { getPerson } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPerson(slug);
  if (!result) return { title: "Not found" };
  const n = result.entries.length;
  return {
    title: `Misquoted: ${result.person.name}`,
    description: `${n} ${n === 1 ? "quote" : "quotes"} credited to ${result.person.name} that don’t hold up.`,
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
          {entries.length} {entries.length === 1 ? "quote" : "quotes"} credited to {person.name} that don’t hold up.
        </p>
      </header>
      <EntryList entries={entries} />
      <SubmitCallout title={`Seen another misquoted ${person.name} line?`} />
    </div>
  );
}
