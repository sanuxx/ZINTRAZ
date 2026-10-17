import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CATEGORIES, MOD, stepText, triggerText } from "@/lib/builder";
import { isAdmin } from "@/lib/server/auth";
import { builderLink } from "@/lib/server/mail";
import { STATUSES, get } from "@/lib/server/store";

// One submitted blueprint: who sent it, what they designed, and the team's status and notes.
export const metadata: Metadata = { title: "Blueprint", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function BlueprintDetail({ params, searchParams }: Props) {
  if (!(await isAdmin())) redirect("/admin/blueprints/");
  const { id } = await params;
  const { saved } = await searchParams;
  const s = await get(id);
  if (!s) notFound();
  const bp = s.blueprint, b = bp.business, c = bp.contact;
  const name = (nid: string) => { const n = bp.nodes.find((x) => x.id === nid); return n ? n.label || MOD[n.mod]?.name : "?"; };
  const wa = c.phone.replace(/[^\d]/g, "");

  return (
    <section className="adm" data-keep>
      <div className="adm-in">
        <Link href="/admin/blueprints/" className="adm-back">← All submissions</Link>
        <header className="adm-head">
          <div><p className="eyebrow">{s.ref} · {new Date(s.createdAt).toLocaleString("en-GB")}</p><h1 className="h-lg">{b.name || "Untitled business"}</h1>
            <p className="adm-sub">{[b.industry, b.size, b.branches && `${b.branches} branch(es)`, b.users && `${b.users} users`].filter(Boolean).join(" · ")}</p></div>
          <div className="adm-actions">
            <a className="btn btn-primary" href={builderLink(s)} target="_blank" rel="noopener noreferrer">Open in the builder</a>
            <a className="btn btn-ghost" href={`/api/admin/blueprints/${s.id}/`}>Download JSON</a>
          </div>
        </header>

        <div className="adm-grid">
          <div className="adm-card">
            <h2>Contact</h2>
            <dl>
              <dt>Name</dt><dd>{c.name}</dd>
              {c.company && <><dt>Company</dt><dd>{c.company}</dd></>}
              {c.email && <><dt>Email</dt><dd><a href={`mailto:${c.email}?subject=${encodeURIComponent(`Your system blueprint (${s.ref})`)}`}>{c.email}</a></dd></>}
              {c.phone && <><dt>Phone</dt><dd><a href={`tel:${c.phone}`}>{c.phone}</a>{wa && <> · <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></>}</dd></>}
              <dt>Timeline</dt><dd>{b.timeline || "—"}</dd>
              <dt>Budget</dt><dd>{b.budget || "—"}</dd>
            </dl>
            {b.notes && <p className="adm-notes">{b.notes}</p>}
          </div>

          <form className="adm-card" method="post" action={`/api/admin/blueprints/${s.id}/`}>
            <h2>Review</h2>
            <label><span>Status</span><select name="status" defaultValue={s.status}>{STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}</select></label>
            <label><span>Internal note</span><textarea name="note" rows={5} defaultValue={s.note} placeholder="Call notes, estimate, next step…" /></label>
            <button className="btn btn-primary" type="submit">Save</button>
            {saved && <p className="adm-ok">Saved.</p>}
          </form>
        </div>

        <div className="adm-card">
          <h2>Modules <em>{bp.nodes.length}</em></h2>
          {CATEGORIES.map((cat) => { const ns = bp.nodes.filter((n) => MOD[n.mod]?.cat === cat.id); return ns.length ? (
            <div key={cat.id} className="adm-mods" style={{ ["--c" as string]: cat.hue }}>
              <span>{cat.name}</span>
              <ul>{ns.map((n) => <li key={n.id} className={n.prio === "nice" ? "is-nice" : undefined}><b>{n.label || MOD[n.mod].name}</b>{n.label && <small>{MOD[n.mod].name}</small>}{n.prio === "nice" && <small>nice to have</small>}{n.note && <q>{n.note}</q>}</li>)}</ul>
            </div>
          ) : null; })}
        </div>

        <div className="adm-grid">
          <div className="adm-card">
            <h2>Connections <em>{bp.links.length}</em></h2>
            {bp.links.length ? <ul className="adm-list">{bp.links.map((l) => <li key={l.id}>{name(l.from)} → {name(l.to)}</li>)}</ul> : <p className="adm-sub">None.</p>}
          </div>
          <div className="adm-card">
            <h2>Workflows <em>{bp.flows.length}</em></h2>
            {bp.flows.length ? bp.flows.map((f) => (
              <div key={f.id} className="adm-flow"><b>{f.name}</b><small>When {triggerText(f).toLowerCase()}</small><ol>{f.steps.map((st) => <li key={st.id}>{stepText(st)}</li>)}</ol></div>
            )) : <p className="adm-sub">None.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
