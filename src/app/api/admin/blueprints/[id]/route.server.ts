// /api/admin/blueprints/[id] — GET downloads the blueprint JSON; POST (form) updates status and the
// internal note. Admin session required for both.
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/auth";
import { STATUSES, get, update, type Status } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const sub = await get((await params).id);
  if (!sub) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(sub.blueprint, null, 2), {
    headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="${sub.ref}.json"` },
  });
}

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!(await isAdmin())) return NextResponse.redirect(new URL("/admin/blueprints/", req.url), 303);
  const form = await req.formData();
  const status = String(form.get("status") ?? "");
  const note = form.get("note");
  await update(id, {
    ...(STATUSES.includes(status as Status) ? { status: status as Status } : {}),
    ...(typeof note === "string" ? { note: note.slice(0, 5000) } : {}),
  });
  return NextResponse.redirect(new URL(`/admin/blueprints/${id}/?saved=1`, req.url), 303);
}
