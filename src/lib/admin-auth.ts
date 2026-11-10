import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";

// One admin (Ellen), one password: the ADMIN_PASSWORD environment variable.
// Logging in sets a signed cookie. The signing key is derived from the
// password, so changing the password logs out every existing session.

const COOKIE = "mc_admin";
const SESSION_DAYS = 30;
export const MIN_PASSWORD_LENGTH = 12;

function password() {
  const pw = process.env.ADMIN_PASSWORD ?? "";
  return pw.length >= MIN_PASSWORD_LENGTH ? pw : null;
}

/** Admin stays switched off until a long enough ADMIN_PASSWORD is set. */
export function isAdminConfigured() {
  return password() !== null;
}

function signingKey(pw: string) {
  return createHash("sha256").update(`misattribution-admin-session:${pw}`).digest();
}

function sign(payload: string, pw: string) {
  return createHmac("sha256", signingKey(pw)).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  // Hash both sides so lengths always match before comparing in constant time.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function passwordMatches(attempt: string) {
  const pw = password();
  return pw !== null && safeEqual(attempt, pw);
}

export async function startSession() {
  const pw = password();
  if (!pw) throw new Error("ADMIN_PASSWORD is not set");
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `admin:${expires}`;
  (await cookies()).set(COOKIE, `${expires}.${sign(payload, pw)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(expires),
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  await connection(); // always check at request time, never at build time
  const pw = password();
  if (!pw) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(`admin:${expires}`, pw));
}

/** Call at the top of every admin page and admin action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
