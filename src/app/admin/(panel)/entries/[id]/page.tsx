import { notFound } from "next/navigation";
import { getEntryForEdit } from "@/lib/admin-data";
import { EntryForm } from "../entry-form";

export const metadata = { title: "Edit entry" };

export default async function EditEntryPage(props: PageProps<"/admin/entries/[id]">) {
  const [{ id }, sp] = await Promise.all([props.params, props.searchParams]);
  const entry = Number.isInteger(Number(id)) ? await getEntryForEdit(Number(id)) : null;
  if (!entry) notFound();

  return (
    <div className="stack gap-24" style={{ maxWidth: 820 }}>
      <h1 className="title">Edit entry</h1>
      {sp.saved ? (
        <p className="panel small" role="status">
          Saved.{" "}
          {entry.status === "published" ? "It’s live on the site." : "It’s a draft, so it isn’t on the site yet."}
        </p>
      ) : null}
      {/* key: start the form fresh after each save */}
      <EntryForm key={`${entry.id}-${String(sp.saved ?? "")}-${entry.slug}`} initial={entry} />
    </div>
  );
}
