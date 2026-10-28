"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Check, LayoutDashboard, Map as MapIcon, Monitor, MoreHorizontal, Pause, Play, Search, Smartphone, Tablet, Zap } from "lucide-react";
import { ACCENTS, CATEGORIES, MOD, stepText, triggerText, type Blueprint, type Widget } from "@/lib/builder";
import Canvas from "./Canvas";

/**
 * The virtual system: the blueprint rendered as the app it would become, in the client's name and colour,
 * on desktop, tablet or phone. Every module is a menu item, a live dashboard widget and a screen of its own
 * whose actions respond. While "Live" is on, the workflows run on their own and stream into the activity feed
 * and notifications. "System map" shows the blueprint itself with data flowing along the connections.
 */
type Upd = (fn: (bp: Blueprint) => Blueprint, commit?: boolean) => void;
type Feed = { id: number; text: string; sub: string; kind: "trigger" | "step" | "action" };

function WidgetView({ w, tick }: { w: Widget; tick: number }) {
  switch (w.k) {
    case "stat": return <><b className="app-v">{w.v}</b><span className="app-s">{w.s}</span></>;
    case "list": return <ul className="app-list">{w.rows.map(([a, b]) => <li key={a}><span>{a}</span><em>{b}</em></li>)}</ul>;
    case "meter": return <ul className="app-meter">{w.rows.map(([a, n], i) => { const v = Math.max(4, Math.min(100, n + ((tick + i) % 3) - 1)); return <li key={a}><span>{a}<em>{v}%</em></span><i><b style={{ width: `${Math.min(v, 100)}%` }} className={v < 30 ? "is-low" : undefined} /></i></li>; })}</ul>;
    case "spark": {
      const p = [...w.pts.slice(tick % 3), ...w.pts.slice(0, tick % 3)];
      const max = Math.max(...p), pts = p.map((v, i) => `${(i / (p.length - 1)) * 100},${30 - (v / max) * 26}`).join(" ");
      return <><b className="app-v">{w.v}</b><svg className="app-spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true"><polyline points={pts} /></svg></>;
    }
    case "bars": {
      const max = Math.max(...w.pts);
      return <><b className="app-v">{w.v}</b><div className="app-bars" aria-hidden="true">{w.pts.map((v, i) => <i key={i} style={{ height: `${(v / max) * 100}%` }} />)}</div></>;
    }
    case "chat": return <div className="app-chat"><span>{w.q}</span><span className="is-me">{w.a}</span></div>;
  }
}

export default function Experience({ bp, update }: { bp: Blueprint; update: Upd }) {
  const [view, setView] = useState<"app" | "map">("app");
  const [device, setDevice] = useState<"desktop" | "tablet" | "phone">("desktop");
  const [page, setPage] = useState<string>("overview");
  const [live, setLive] = useState(true);
  const [tick, setTick] = useState(0);
  const [feed, setFeed] = useState<Feed[]>([]);
  const [bell, setBell] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const seq = useRef(0);
  const name = bp.business.name || "Your business";
  const host = `${(bp.business.name || "yourbusiness").toLowerCase().replace(/[^a-z0-9]+/g, "")}.zintraz.app`;

  // One entry per module (duplicates collapse), in category order.
  const mods = useMemo(() => {
    const seen = new Set<string>();
    return CATEGORIES.flatMap((c) => bp.nodes.filter((n) => MOD[n.mod].cat === c.id && !seen.has(n.mod) && seen.add(n.mod)));
  }, [bp.nodes]);
  const current = mods.find((n) => n.id === page);

  const push = (items: Omit<Feed, "id">[]) => setFeed((f) => [...items.map((x) => ({ ...x, id: ++seq.current })).reverse(), ...f].slice(0, 30));

  // Live simulation: numbers drift, and every few seconds a workflow (or a module event) plays out step by step.
  useEffect(() => {
    if (!live) return;
    const t1 = window.setInterval(() => setTick((t) => t + 1), 2200);
    const timers: number[] = [];
    const run = () => {
      if (bp.flows.length) {
        const f = bp.flows[Math.floor(Math.random() * bp.flows.length)];
        push([{ text: f.name, sub: `Started · ${triggerText(f)}`, kind: "trigger" }]);
        setBell((b) => b + 1);
        f.steps.forEach((s, i) => timers.push(window.setTimeout(() => push([{ text: stepText(s), sub: f.name, kind: "step" }]), 700 * (i + 1))));
      } else if (mods.length) {
        const n = mods[Math.floor(Math.random() * mods.length)], m = MOD[n.mod];
        if (m.t.length) push([{ text: m.t[Math.floor(Math.random() * m.t.length)], sub: n.label || m.name, kind: "trigger" }]);
      }
    };
    run();
    const t2 = window.setInterval(run, 5200);
    return () => { window.clearInterval(t1); window.clearInterval(t2); timers.forEach(clearTimeout); };
  }, [live, bp.flows, mods]);

  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(null), 2200); return () => window.clearTimeout(t); }, [toast]);
  const act = (a: string, mod: string) => { setToast(`${a} — done`); push([{ text: a, sub: mod, kind: "action" }]); };

  const navGroups = CATEGORIES.map((c) => ({ c, items: mods.filter((n) => MOD[n.mod].cat === c.id) })).filter((g) => g.items.length);
  const greet = ["Good morning", "Good afternoon", "Good evening"][Math.min(2, Math.floor(new Date().getHours() / 8) % 3)];

  return (
    <div className="xp" style={{ ["--brand" as string]: bp.accent }}>
      <div className="xp-bar">
        <div className="xp-seg" role="group" aria-label="View">
          <button type="button" aria-pressed={view === "app"} onClick={() => setView("app")}><LayoutDashboard size={14} />Your app</button>
          <button type="button" aria-pressed={view === "map"} onClick={() => setView("map")}><MapIcon size={14} />System map</button>
        </div>
        {view === "app" && <>
          <div className="xp-seg" role="group" aria-label="Device">
            <button type="button" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")} title="Desktop"><Monitor size={14} /></button>
            <button type="button" aria-pressed={device === "tablet"} onClick={() => setDevice("tablet")} title="Tablet"><Tablet size={14} /></button>
            <button type="button" aria-pressed={device === "phone"} onClick={() => setDevice("phone")} title="Phone"><Smartphone size={14} /></button>
          </div>
          <label className="xp-name"><span>Name</span><input value={bp.business.name} placeholder="Your business" onChange={(e) => update((b) => ({ ...b, business: { ...b.business, name: e.target.value } }), false)} onBlur={() => update((b) => b)} /></label>
          <div className="xp-colors" role="group" aria-label="Brand colour">
            {ACCENTS.map((c) => <button key={c} type="button" aria-pressed={bp.accent === c} style={{ background: c }} onClick={() => update((b) => ({ ...b, accent: c }))} aria-label={`Colour ${c}`} />)}
            <label className="xp-pick" title="Pick any colour"><input type="color" value={bp.accent} onChange={(e) => update((b) => ({ ...b, accent: e.target.value }), false)} /></label>
          </div>
          <button type="button" className={`xp-live${live ? " is-on" : ""}`} onClick={() => setLive((l) => !l)}>{live ? <Pause size={14} /> : <Play size={14} />}{live ? "Live" : "Paused"}</button>
        </>}
      </div>

      {view === "map" ? (
        <div className="xp-map"><Canvas bp={bp} readOnly flowingDefault /></div>
      ) : !mods.length ? (
        <div className="xp-empty"><b>Nothing to show yet</b><span>Add modules in the Blueprint step and your system appears here.</span></div>
      ) : (
        <div className={`xp-stage is-${device}`}>
          <div className="xp-device">
            <div className="app xp-app" data-keep>
              <div className="app-bar"><i /><i /><i /><span>{host}</span></div>
              <div className="app-body">
                <aside className="app-side">
                  <b className="app-logo"><span>{name[0]?.toUpperCase()}</span>{name}</b>
                  <ul>
                    <li className={`app-nav${page === "overview" ? " is-focus" : ""}`} onClick={() => setPage("overview")}><LayoutDashboard size={14} />Overview</li>
                    {navGroups.map(({ c, items }) => (
                      <li key={c.id} className="xp-navgroup">
                        <span className="app-sep">{c.name}</span>
                        <ul>{items.map((n) => { const m = MOD[n.mod]; return <li key={n.id} className={`app-nav${page === n.id ? " is-focus" : ""}`} onClick={() => setPage(n.id)}><m.Icon size={14} />{n.label || m.name}</li>; })}</ul>
                      </li>
                    ))}
                  </ul>
                </aside>
                <div className="app-main">
                  <div className="app-head">
                    <div><small>{current ? CATEGORIES.find((c) => c.id === MOD[current.mod].cat)?.name : "Overview"}</small><b>{current ? current.label || MOD[current.mod].name : greet}</b></div>
                    <div className="xp-head-tools">
                      <span className="xp-search"><Search size={13} />Search</span>
                      <span className="xp-bell"><Bell size={15} />{bell > 0 && <em>{Math.min(bell, 99)}</em>}</span>
                      <span className="app-live"><i />{live ? "Live" : "Paused"}</span>
                    </div>
                  </div>

                  {!current ? (
                    <div className="xp-over">
                      <div className="app-grid">
                        {mods.map((n) => { const m = MOD[n.mod]; return (
                          <button key={n.id} type="button" className="app-card xp-card" onClick={() => setPage(n.id)}>
                            <small><m.Icon size={12} />{m.w.t}</small>
                            <WidgetView w={m.w} tick={tick} />
                          </button>
                        ); })}
                      </div>
                      <aside className="xp-feed" aria-label="Live activity">
                        <b><Zap size={13} />Live activity</b>
                        <ul>
                          {feed.map((f) => <li key={f.id} className={`k-${f.kind}`}><span>{f.text}</span><small>{f.sub}</small></li>)}
                          {!feed.length && <li className="k-none"><span>Waiting for activity…</span><small>{bp.flows.length ? "Your workflows will run here" : "Add workflows to see them run"}</small></li>}
                        </ul>
                      </aside>
                    </div>
                  ) : (() => {
                    const m = MOD[current.mod];
                    const partners = bp.links.filter((l) => l.from === current.id || l.to === current.id).map((l) => bp.nodes.find((n) => n.id === (l.from === current.id ? l.to : l.from))).filter(Boolean);
                    const flows = bp.flows.filter((f) => f.trigger.mod === current.mod || f.steps.some((s) => s.mod === current.mod));
                    return (
                      <div className="xp-screen">
                        <p className="xp-desc">{m.desc}{current.note ? ` — ${current.note}` : ""}</p>
                        <div className="xp-cols">
                          <div className="app-card xp-big"><small><m.Icon size={12} />{m.w.t}</small><WidgetView w={m.w} tick={tick} /></div>
                          <div className="xp-side">
                            {m.a.length > 0 && <div className="xp-box"><span>Actions</span><div className="xp-acts">{m.a.map((a) => <button key={a} type="button" onClick={() => act(a, current.label || m.name)}>{a}</button>)}</div></div>}
                            {partners.length > 0 && <div className="xp-box"><span>Shares data with</span><div className="xp-chips">{partners.map((p) => <button key={p!.id} type="button" onClick={() => setPage(p!.id)}>{p!.label || MOD[p!.mod].name}</button>)}</div></div>}
                            {flows.length > 0 && <div className="xp-box"><span>Automations</span><ul>{flows.map((f) => <li key={f.id}><Zap size={12} />{f.name}</li>)}</ul></div>}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              {device === "phone" && (
                <nav className="xp-tabs" aria-label="App tabs">
                  <button type="button" className={page === "overview" ? "is-on" : undefined} onClick={() => setPage("overview")}><LayoutDashboard size={16} />Home</button>
                  {mods.slice(0, 3).map((n) => { const m = MOD[n.mod]; return <button key={n.id} type="button" className={page === n.id ? "is-on" : undefined} onClick={() => setPage(n.id)}><m.Icon size={16} />{(n.label || m.name).split(" ")[0]}</button>; })}
                  <button type="button" onClick={() => setPage(mods[(mods.findIndex((n) => n.id === page) + 1) % mods.length].id)}><MoreHorizontal size={16} />More</button>
                </nav>
              )}
              {toast && <div className="xp-toast" role="status"><Check size={14} />{toast}</div>}
            </div>
          </div>
        </div>
      )}
      <p className="xp-note">This is a preview made from your blueprint, with sample data. The real system is engineered around your actual processes.</p>
    </div>
  );
}
