import type { Metadata } from "next";
import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/server/auth";
import { mailConfigured } from "@/lib/server/mail";
import { STATUSES, list, type Status } from "@/lib/server/store";

// Blueprint review (server builds only): every system blueprint clients have submitted from /system-builder.
export const metadata: Metadata = { title: "Blueprint submissions", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ status?: string; error?: string }> };
const fmt = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function BlueprintsAdmin({ searchParams }: Props) {
  const { status, error } = await searchParams;
  if (!(await isAdmin())) return <Login error={error} />;

  const all = await list();
  const filter = STATUSES.includes(status as Status) ? (status as Status) : null;
  const rows = filter ? all.filter((s) => s.status === filter) : all.filter((s) => s.status !== "archived");
  const count = (st: Status) => all.filter((s) => s.status === st).length;

  return (
    <section className="adm" data-keep>
      <div className="adm-in">
        <header className="adm-head">
          <div><p className="eyebrow">Admin</p><h1 className="h-lg">Blueprint submissions</h1></div>
          <form method="post" action="/api/admin/login/"><input type="hidden" name="logout" value="1" /><button className="btn btn-ghost" type="submit">Sign out</button></form>
        </header>
        {!mailConfigured() && <p className="adm-warn">Email isn&apos;t set up on this server (SMTP_HOST is empty), so new submissions are saved here but not emailed.</p>}
        <nav className="adm-filters" aria-label="Filter by status">
          <Link href="/admin/blueprints/" className={!filter ? "is-on" : undefined}>Open <em>{all.length - count("archived")}</em></Link>
          {STATUSES.map((st) => <Link key={st} href={`/admin/blueprints/?status=${st}`} className={filter === st ? "is-on" : undefined}>{st[0].toUpperCase() + st.slice(1)} <em>{count(st)}</em></Link>)}
        </nav>
        {rows.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Received</th><th>Ref</th><th>Business</th><th>Contact</th><th>System</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((s) => { const b = s.blueprint.business, c = s.blueprint.contact; return (
                  <tr key={s.id}>
                    <td>{fmt(s.createdAt)}</td>
                    <td><Link href={`/admin/blueprints/${s.id}/`}><b>{s.ref}</b></Link></td>
                    <td><b>{b.name || "—"}</b><small>{[b.industry, b.size].filter(Boolean).join(" · ")}</small></td>
                    <td>{c.name}<small>{c.email || c.phone}</small></td>
                    <td>{s.blueprint.nodes.length} modules<small>{s.blueprint.flows.length} workflows</small></td>
                    <td><span className={`adm-st st-${s.status}`}>{s.status}</span></td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        ) : <p className="adm-empty">No {filter ?? "open"} submissions yet.</p>}
      </div>
    </section>
  );
}

function Login({ error }: { error?: string }) {
  return (
    <section className="adm" data-keep>
      <form className="adm-login" method="post" action="/api/admin/login/">
        <p className="eyebrow">Admin</p>
        <h1 className="h-lg">Blueprint submissions</h1>
        {!adminConfigured()
          ? <p className="adm-warn">Admin isn&apos;t set up on this server. Set ADMIN_PASSWORD and ADMIN_SECRET (32+ characters) and restart.</p>
          : <>
            <label><span>Password</span><input type="password" name="password" autoComplete="current-password" required autoFocus /></label>
            {error && <p className="adm-err">{error === "locked" ? "Too many attempts. Try again in 15 minutes." : "That password isn't right."}</p>}
            <button className="btn btn-primary" type="submit">Sign in</button>
          </>}
      </form>
    </section>
  );
}
