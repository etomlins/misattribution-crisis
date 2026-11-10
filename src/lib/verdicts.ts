export const VERDICTS = ["misattributed", "paraphrased", "unverified", "accurate"] as const;
export type Verdict = (typeof VERDICTS)[number];

export const VERDICT_INFO: Record<Verdict, { label: string; meaning: string }> = {
  misattributed: { label: "Misattributed", meaning: "Someone else said it first, and we know who." },
  paraphrased: { label: "Paraphrased", meaning: "A reworded version of something they really said." },
  unverified: { label: "Unverified", meaning: "No record in their work, and the true origin is unknown." },
  accurate: { label: "Accurate", meaning: "Checked against a primary source. They really said it." },
};

export function parseVerdict(value: unknown): Verdict | null {
  return typeof value === "string" && (VERDICTS as readonly string[]).includes(value) ? (value as Verdict) : null;
}
