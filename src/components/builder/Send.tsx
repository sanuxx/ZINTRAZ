"use client";

import { useRef, useState } from "react";
import { Check, Copy, Download, FileUp, Link2, Mail, MessageCircle, Printer, Send as SendIcon, Zap } from "lucide-react";
import { EMAIL } from "@/lib/contact";
import { BUDGETS, CATEGORIES, MOD, SIZES, TIMELINES, brief, catOf, encode, stepText, triggerText, validate, type Blueprint } from "@/lib/builder";
import { BASE_PATH, SERVER_FEATURES } from "@/lib/site";

/**
 * Last step: the business and contact details, a summary of everything designed, and the ways to send it.
 * On the production server, "Submit to ZYNTRAZ" posts the blueprint to /api/blueprints (saved, emailed to the
 * team, confirmed to the client). In the static GitHub Pages preview there is no server, so email and
 * WhatsApp open with the brief filled in and a share link that reopens this exact blueprint for our review.
 * Either way, the blueprint can be downloaded (and imported again), copied as a link, or printed as a PDF.
 */
type Upd = (fn: (bp: Blueprint) => Blueprint, commit?: boolean) => void;
const WA_NUMBER = "94777437250";
const INDUSTRIES = ["Hospitality", "Healthcare", "Education", "Retail & E-Commerce", "Corporate & Professional Services", "Logistics", "Manufacturing", "Real estate", "Other"];

export function shareLink(bp: Blueprint) {
  return `${window.location.origin}${window.location.pathname}#bp=${encode(bp)}`;
}

export default function Send({ bp, update, onImport }: { bp: Blueprint; update: Upd; onImport: (bp: Blueprint) => void }) {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const honey = useRef<HTMLInputElement>(null);
  const b = bp.business, c = bp.contact;
  const setB = (k: keyof Blueprint["business"], v: string, commit = false) => update((x) => ({ ...x, business: { ...x.business, [k]: v } }), commit);
  const setC = (k: keyof Blueprint["contact"], v: string) => update((x) => ({ ...x, contact: { ...x.contact, [k]: v } }), false);

  const missing = [!bp.nodes.length && "at least one module", !c.name.trim() && "your name", !/^\S+@\S+\.\S+$/.test(c.email) && !c.phone.trim() && "an email or phone number"].filter(Boolean) as string[];
  const ready = !missing.length;

  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true); setErr(null);
    try {
      const res = await fetch(`${BASE_PATH}/api/blueprints/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ blueprint: bp, website: honey.current?.value ?? "" }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setRef(data.ref); setSent(true);
    } catch (e) {
      setErr(`${e instanceof Error ? e.message : "Something went wrong."} You can also email or WhatsApp it to us below.`);
    } finally { setBusy(false); }
  };
  const email = () => {
    if (!ready) return;
    const link = shareLink(bp);
    let body = brief(bp, link);
    // Some mail apps cut very long links; the link always carries the full blueprint, so trim the text first.
    if (body.length > 6000) body = `${brief({ ...bp, links: [], flows: [] }, link)}\n\n(Connections and workflows are in the blueprint link.)`;
    const subject = `System blueprint — ${b.name || c.company || c.name}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const whatsapp = () => {
    if (!ready) return;
    const text = `Hi ZYNTRAZ, I built a system blueprint for ${b.name || "my business"}: ${bp.nodes.length} modules, ${bp.links.length} connections, ${bp.flows.length} workflows. — ${c.name}\n\nOpen it here: ${shareLink(bp)}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setSent(true);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(shareLink(bp)); setCopied(true); window.setTimeout(() => setCopied(false), 2000); }
    catch { setErr("Couldn't copy automatically — select the address bar after opening the link instead."); }
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(bp, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(b.name || "system").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const importFile = async (f: File) => {
    try {
      const parsed = validate(JSON.parse(await f.text()));
      if (!parsed) throw new Error();
      onImport(parsed); setErr(null);
    } catch { setErr("That file isn't a ZYNTRAZ blueprint."); }
  };

  const groups = CATEGORIES.map((cat) => ({ cat, nodes: bp.nodes.filter((n) => MOD[n.mod]?.cat === cat.id) })).filter((g) => g.nodes.length);

  return (
    <div className="snd">
      <form className="snd-form" onSubmit={(e) => { e.preventDefault(); if (SERVER_FEATURES) submit(); else email(); }}>
        {/* Honeypot for bots: hidden from people and screen readers. */}
        <input ref={honey} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="snd-hp" />
        <fieldset>
          <legend>Your business</legend>
          <div className="snd-row">
            <label><span>Business name</span><input value={b.name} onChange={(e) => setB("name", e.target.value)} onBlur={() => update((x) => x)} placeholder="e.g. Lotus Kitchen" /></label>
            <label><span>Industry</span><select value={b.industry} onChange={(e) => setB("industry", e.target.value, true)}><option value="">Select…</option>{INDUSTRIES.map((x) => <option key={x}>{x}</option>)}{b.industry && !INDUSTRIES.includes(b.industry) && <option>{b.industry}</option>}</select></label>
          </div>
          <div className="snd-row three">
            <label><span>Team size</span><select value={b.size} onChange={(e) => setB("size", e.target.value, true)}><option value="">Select…</option>{SIZES.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label><span>Branches</span><input type="number" min={1} value={b.branches} onChange={(e) => setB("branches", e.target.value)} /></label>
            <label><span>People using it</span><input type="number" min={1} value={b.users} onChange={(e) => setB("users", e.target.value)} placeholder="e.g. 25" /></label>
          </div>
          <div className="snd-row">
            <label><span>Timeline</span><select value={b.timeline} onChange={(e) => setB("timeline", e.target.value, true)}><option value="">Select…</option>{TIMELINES.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label><span>Budget</span><select value={b.budget} onChange={(e) => setB("budget", e.target.value, true)}><option value="">Select…</option>{BUDGETS.map((x) => <option key={x}>{x}</option>)}</select></label>
          </div>
          <label><span>Anything else we should know?</span><textarea rows={3} value={b.notes} onChange={(e) => setB("notes", e.target.value)} onBlur={() => update((x) => x)} placeholder="Tools you use today, what hurts most, must-have deadlines…" /></label>
        </fieldset>
        <fieldset>
          <legend>How we reach you</legend>
          <div className="snd-row">
            <label><span>Your name *</span><input value={c.name} onChange={(e) => setC("name", e.target.value)} autoComplete="name" /></label>
            <label><span>Company</span><input value={c.company} onChange={(e) => setC("company", e.target.value)} autoComplete="organization" /></label>
          </div>
          <div className="snd-row">
            <label><span>Email</span><input type="email" value={c.email} onChange={(e) => setC("email", e.target.value)} autoComplete="email" placeholder="you@company.com" /></label>
            <label><span>Phone / WhatsApp</span><input type="tel" value={c.phone} onChange={(e) => setC("phone", e.target.value)} autoComplete="tel" placeholder="+94 …" /></label>
          </div>
        </fieldset>

        <div className="snd-send">
          {!ready && <p className="snd-missing">To send, add {missing.join(", ")}.</p>}
          {ref ? (
            <div className="snd-next" role="status">
              <b><Check size={16} />Blueprint received · {ref}</b>
              <span>Thank you. Our team will review it and reply within 24 hours with questions and a plan: what to build first, a timeline and an estimate.{c.email ? ` A confirmation is on its way to ${c.email}.` : ""}</span>
            </div>
          ) : (
            <div className="snd-btns">
              {SERVER_FEATURES
                ? <button type="submit" className="btn btn-primary btn-lg" disabled={!ready || busy}><SendIcon size={16} />{busy ? "Sending…" : "Submit to ZYNTRAZ"}</button>
                : <button type="submit" className="btn btn-primary btn-lg" disabled={!ready}><Mail size={16} />Email it to ZYNTRAZ</button>}
              {SERVER_FEATURES && <button type="button" className="btn btn-ghost" disabled={!ready} onClick={email}><Mail size={16} />Email instead</button>}
              <button type="button" className="btn btn-wa" disabled={!ready} onClick={whatsapp}><MessageCircle size={16} />Send on WhatsApp</button>
            </div>
          )}
          <div className="snd-more">
            <button type="button" onClick={copy}>{copied ? <Check size={14} /> : <Link2 size={14} />}{copied ? "Link copied" : "Copy share link"}</button>
            <button type="button" onClick={download}><Download size={14} />Download blueprint</button>
            <button type="button" onClick={() => window.print()}><Printer size={14} />Print / save PDF</button>
            <button type="button" onClick={() => file.current?.click()}><FileUp size={14} />Import a blueprint</button>
            <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = ""; }} />
          </div>
          {err && <p className="snd-err">{err}</p>}
          <p className="snd-note">{SERVER_FEATURES
            ? "Submitting sends your blueprint and contact details straight to our team. The share link holds your whole blueprint, so you can reopen it any time."
            : "Nothing is sent until you choose email or WhatsApp. The share link holds your whole blueprint, so our team opens exactly what you built."}</p>
          {sent && !ref && (
            <div className="snd-next" role="status">
              <b><Check size={16} />Ready on your side</b>
              <span>Once your email or WhatsApp message is sent, we review your blueprint and reply within 24 hours with questions and a plan: what to build first, timeline and estimate.</span>
            </div>
          )}
        </div>
      </form>

      <aside className="snd-sum sb-print" aria-label="Blueprint summary">
        <div className="snd-sum-head">
          <small>System blueprint</small>
          <b>{b.name || "Untitled system"}</b>
          <span>{[b.industry, b.size, b.branches && `${b.branches} branch${b.branches === "1" ? "" : "es"}`].filter(Boolean).join(" · ") || "Add your business details"}</span>
        </div>
        <div className="ins-stats">
          <div><b>{bp.nodes.length}</b><small>modules</small></div>
          <div><b>{bp.links.length}</b><small>connections</small></div>
          <div><b>{bp.flows.length}</b><small>workflows</small></div>
        </div>
        {groups.map(({ cat, nodes }) => (
          <div key={cat.id} className="snd-grp" style={{ ["--c" as string]: catOf(cat.id).hue }}>
            <span>{cat.name}</span>
            <ul>{nodes.map((n) => { const m = MOD[n.mod]; return <li key={n.id} className={n.prio === "nice" ? "is-nice" : undefined}><m.Icon size={13} />{n.label || m.name}{n.prio === "nice" && <em>nice to have</em>}</li>; })}</ul>
          </div>
        ))}
        {bp.flows.length > 0 && (
          <div className="snd-flows">
            <span>Workflows</span>
            {bp.flows.map((f) => (
              <div key={f.id}><b><Zap size={12} />{f.name}</b><small>When {triggerText(f).toLowerCase()}</small><ol>{f.steps.map((s) => <li key={s.id}>{stepText(s)}</li>)}</ol></div>
            ))}
          </div>
        )}
        {!bp.nodes.length && <p className="snd-empty">Your blueprint is empty. Add modules in the Blueprint step.</p>}
        <button type="button" className="snd-copytext" onClick={async () => { try { await navigator.clipboard.writeText(brief(bp, shareLink(bp))); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ } }}><Copy size={13} />Copy as text</button>
      </aside>
    </div>
  );
}
