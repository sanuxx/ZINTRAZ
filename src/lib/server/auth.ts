// Admin sign-in for the blueprint review pages: one shared password (ADMIN_PASSWORD) and an HMAC-signed,
// httpOnly session cookie (signed with ADMIN_SECRET). Without both env vars set, admin is locked shut.
import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE = "zyn_admin";
const DAY = 24 * 60 * 60;
const TTL = 7 * DAY;

const secret = () => process.env.ADMIN_SECRET || "";
export const adminConfigured = () => !!process.env.ADMIN_PASSWORD && secret().length >= 32;

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");
const same = (a: string, b: string) => {
  const x = createHash("sha256").update(a).digest(), y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
};

export function checkPassword(pw: string) {
  return adminConfigured() && same(pw, process.env.ADMIN_PASSWORD!);
}

export function sessionValue() {
  const exp = String(Math.floor(Date.now() / 1000) + TTL);
  return `${exp}.${sign(exp)}`;
}
export const sessionOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: TTL };

export function validSession(value: string | undefined) {
  if (!value || !adminConfigured()) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !same(sig, sign(exp))) return false;
  return Number(exp) > Date.now() / 1000;
}

export async function isAdmin() {
  return validSession((await cookies()).get(COOKIE)?.value);
}
