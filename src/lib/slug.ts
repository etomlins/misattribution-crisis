// Turns "I have never let my schooling…" into "i-have-never-let-my-schooling".
export function slugify(text: string, maxWords = 8): string {
  const words = text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxWords);
  return words.join("-") || "untitled";
}
