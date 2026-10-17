// POST /api/blueprints — a client submits the blueprint they built in /system-builder.
// Saved first (so nothing is lost if email fails), then emailed to the team and confirmed to the client.
// Server builds only (see next.config.ts); the GitHub Pages preview falls back to email / WhatsApp links.
import { validate, type Blueprint } from "@/lib/builder";
import { create } from "@/lib/server/store";
import { confirmToClient, notifyTeam } from "@/lib/server/mail";
import { allow, clientIp } from "@/lib/server/limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 300_000;
const cut = (s: unknown, n: number) => (typeof s === "string" ? s.slice(0, n) : "");

/** Caps sizes and string lengths so one request can't store or email something enormous. */
function sanitize(bp: Blueprint): Blueprint {
  const nodes = bp.nodes.slice(0, 300).map((n) => ({ id: cut(n.id, 32), mod: cut(n.mod, 40), x: Number(n.x) || 0, y: Number(n.y) || 0, prio: n.prio === "nice" ? "nice" as const : "must" as const, label: cut(n.label, 80) || undefined, note: cut(n.note, 1000) || undefined }));
  const ids = new Set(nodes.map((n) => n.id));
  return {
    ...bp,
    template: cut(bp.template, 40),
    accent: /^#[0-9a-f]{6}$/i.test(bp.accent) ? bp.accent : "#0b5cff",
    business: Object.fromEntries(Object.entries(bp.business).map(([k, v]) => [k, cut(v, k === "notes" ? 4000 : 160)])) as Blueprint["business"],
    contact: Object.fromEntries(Object.entries(bp.contact).map(([k, v]) => [k, cut(v, 160)])) as Blueprint["contact"],
    nodes,
    links: bp.links.slice(0, 600).filter((l) => ids.has(l.from) && ids.has(l.to)).map((l) => ({ id: cut(l.id, 32), from: l.from, to: l.to })),
    flows: bp.flows.slice(0, 60).map((f) => ({
      id: cut(f.id, 32), name: cut(f.name, 120), trigger: { mod: cut(f.trigger?.mod, 40), event: cut(f.trigger?.event, 120) },
      steps: (Array.isArray(f.steps) ? f.steps : []).slice(0, 40).map((s) => ({ id: cut(s.id, 32), kind: s.kind, mod: cut(s.mod, 40) || undefined, text: cut(s.text, 300) })),
    })),
  };
}

const json = (body: unknown, status = 200) => Response.json(body, { status });

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!allow(`bp:${ip}`, 5, 10 * 60_000)) return json({ error: "Too many submissions from this address. Please try again in a few minutes, or email us." }, 429);
  const raw = await req.text();
  if (raw.length > MAX_BYTES) return json({ error: "This blueprint is too large to send. Please email it to us instead." }, 413);

  let body: { blueprint?: unknown; website?: string };
  try { body = JSON.parse(raw); } catch { return json({ error: "Invalid request." }, 400); }
  // Honeypot: a field people never see. Bots fill it; pretend all is well and keep nothing.
  if (body.website) return json({ ok: true, ref: "BP-RECEIVED" });

  const parsed = validate(body.blueprint);
  if (!parsed) return json({ error: "That doesn't look like a system blueprint." }, 400);
  const bp = sanitize(parsed);
  const c = bp.contact;
  if (!bp.nodes.length) return json({ error: "Add at least one module before sending." }, 400);
  if (!c.name.trim()) return json({ error: "Please add your name." }, 400);
  if (!/^\S+@\S+\.\S+$/.test(c.email) && !c.phone.trim()) return json({ error: "Please add an email address or phone number." }, 400);

  const sub = await create(bp, ip);
  let emailed = false;
  try { emailed = await notifyTeam(sub); } catch (e) { console.error(`[blueprints] team email failed for ${sub.ref}:`, e); }
  try { await confirmToClient(sub); } catch (e) { console.error(`[blueprints] confirmation email failed for ${sub.ref}:`, e); }
  return json({ ok: true, ref: sub.ref, emailed });
}
