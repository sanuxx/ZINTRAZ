// Email for blueprint submissions, over SMTP (any provider: Google Workspace, Zoho, SES, Mailgun…).
// Configured by SMTP_HOST / SMTP_PORT / SMTP_SECURE / SMTP_USER / SMTP_PASS, MAIL_FROM and MAIL_TO.
// Without SMTP_HOST, nothing is sent and submissions are only saved (the admin page still lists them).
import nodemailer from "nodemailer";
import { EMAIL } from "@/lib/contact";
import { CATEGORIES, MOD, brief, encode, stepText, triggerText } from "@/lib/builder";
import { SITE } from "@/lib/site";
import type { Submission } from "./store";

export const mailConfigured = () => !!process.env.SMTP_HOST;

function transport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export const builderLink = (s: Submission) => `${SITE}/system-builder/#bp=${encode(s.blueprint)}`;
export const adminLink = (s: Submission) => `${SITE}/admin/blueprints/${s.id}/`;

function html(s: Submission) {
  const bp = s.blueprint, b = bp.business, c = bp.contact;
  const row = (k: string, v: string) => (v ? `<tr><td style="padding:4px 12px 4px 0;color:#6b7280">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>` : "");
  const mods = CATEGORIES.map((cat) => {
    const ns = bp.nodes.filter((n) => MOD[n.mod]?.cat === cat.id);
    return ns.length ? `<p style="margin:8px 0 0"><b style="color:${cat.hue}">${esc(cat.name)}:</b> ${ns.map((n) => esc(n.label || MOD[n.mod].name) + (n.prio === "nice" ? " <i style='color:#9ca3af'>(nice to have)</i>" : "")).join(", ")}</p>` : "";
  }).join("");
  const flows = bp.flows.map((f) => `<p style="margin:10px 0 0"><b>${esc(f.name)}</b> <span style="color:#6b7280">— when ${esc(triggerText(f).toLowerCase())}</span><br>${f.steps.map((st, i) => `${i + 1}. ${esc(stepText(st))}`).join("<br>")}</p>`).join("");
  return `<div style="font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#111827;max-width:640px">
<h2 style="margin:0 0 4px">New system blueprint · ${esc(s.ref)}</h2>
<p style="margin:0 0 16px;color:#6b7280">${esc(b.name || "Untitled business")} — ${bp.nodes.length} modules, ${bp.links.length} connections, ${bp.flows.length} workflows</p>
<p><a href="${adminLink(s)}" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0b5cff;color:#fff;text-decoration:none;font-weight:600">Review it</a>
&nbsp; <a href="${builderLink(s)}" style="color:#0b5cff">Open in the builder</a></p>
<table style="border-collapse:collapse;margin:12px 0">${row("Name", c.name)}${row("Company", c.company)}${row("Email", c.email)}${row("Phone", c.phone)}${row("Industry", b.industry)}${row("Team size", b.size)}${row("Branches", b.branches)}${row("Users", b.users)}${row("Timeline", b.timeline)}${row("Budget", b.budget)}</table>
${b.notes ? `<p style="padding:10px 14px;border-radius:10px;background:#f3f4f6">${esc(b.notes)}</p>` : ""}
<h3 style="margin:20px 0 0">Modules</h3>${mods}
${flows ? `<h3 style="margin:20px 0 0">Workflows</h3>${flows}` : ""}
<p style="margin-top:24px;color:#9ca3af;font-size:12px">The full blueprint is attached as JSON.</p></div>`;
}

/** Tells the team about a new submission. Throws if SMTP is configured but sending fails. */
export async function notifyTeam(s: Submission) {
  if (!mailConfigured()) return false;
  const bp = s.blueprint, c = bp.contact;
  await transport().sendMail({
    from: process.env.MAIL_FROM || `ZINTRAZ website <${EMAIL}>`,
    to: process.env.MAIL_TO || EMAIL,
    replyTo: c.email || undefined,
    subject: `New system blueprint ${s.ref} — ${bp.business.name || c.company || c.name}`,
    text: `${brief(bp, builderLink(s))}\n\nReview: ${adminLink(s)}`,
    html: html(s),
    attachments: [{ filename: `${s.ref}.json`, content: JSON.stringify(bp, null, 2), contentType: "application/json" }],
  });
  return true;
}

/** Confirms receipt to the client, if they gave an email address. */
export async function confirmToClient(s: Submission) {
  const to = s.blueprint.contact.email;
  if (!mailConfigured() || !to) return false;
  const name = s.blueprint.contact.name.split(" ")[0] || "there";
  await transport().sendMail({
    from: process.env.MAIL_FROM || `ZINTRAZ <${EMAIL}>`,
    to,
    replyTo: process.env.MAIL_TO || EMAIL,
    subject: `We've received your system blueprint (${s.ref})`,
    text: `Hi ${name},\n\nThanks for sending us your system blueprint for ${s.blueprint.business.name || "your business"}. Your reference is ${s.ref}.\n\nOur team will review it and reply within 24 hours with questions and a plan: what to build first, a timeline and an estimate.\n\nYou can reopen your blueprint any time: ${builderLink(s)}\n\n— The ZINTRAZ team\n${EMAIL}`,
  });
  return true;
}
