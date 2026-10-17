// POST /api/admin/login (form) — signs in to the blueprint review pages. POST with no password signs out.
import { NextResponse } from "next/server";
import { COOKIE, checkPassword, sessionOptions, sessionValue } from "@/lib/server/auth";
import { allow, clientIp } from "@/lib/server/limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const form = await req.formData();
  const to = (path: string) => NextResponse.redirect(new URL(path, req.url), 303);
  if (form.get("logout")) { const res = to("/admin/blueprints/"); res.cookies.delete(COOKIE); return res; }
  if (!allow(`login:${clientIp(req)}`, 8, 15 * 60_000)) return to("/admin/blueprints/?error=locked");
  if (!checkPassword(String(form.get("password") ?? ""))) return to("/admin/blueprints/?error=1");
  const res = to("/admin/blueprints/");
  res.cookies.set(COOKIE, sessionValue(), sessionOptions);
  return res;
}
