"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, Copy, LayoutGrid, Maximize2, Minus, Plus, Redo2, Search, Trash2, Undo2, X,
} from "lucide-react";
import { CATEGORIES, MOD, MODULES, catOf, layout, uid, type Blueprint, type CatId, type Node } from "@/lib/builder";

/**
 * The blueprint canvas. Modules come from the palette (drag them on, or tap "+"), sit on a large grid that
 * scrolls and zooms, move by dragging, and connect by dragging from a module's right-hand port onto another
 * module. Selecting a module opens the inspector (rename, priority, notes, duplicate, delete); selecting a
 * connection lets it be removed. `readOnly` turns it into the live system map used in the preview.
 */
export const NW = 196, NH = 66;
const WORLD_W = 2600, WORLD_H = 1700;

type Upd = (fn: (bp: Blueprint) => Blueprint, commit?: boolean) => void;
type Props = {
  bp: Blueprint; update?: Upd; sel?: string | null; setSel?: (id: string | null) => void;
  undo?: () => void; redo?: () => void; canUndo?: boolean; canRedo?: boolean; readOnly?: boolean; flowingDefault?: boolean;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = Math.max(60, Math.abs(x2 - x1) / 2);
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
};

export default function Canvas({ bp, update, sel = null, setSel, undo, redo, canUndo, canRedo, readOnly, flowingDefault }: Props) {
  const view = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(readOnly ? 0.8 : 0.9);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [wire, setWire] = useState<{ from: string; x: number; y: number } | null>(null);
  const [selLink, setSelLink] = useState<string | null>(null);
  const [flowing, setFlowing] = useState(!!flowingDefault);
  const grab = useRef<{ id: string; dx: number; dy: number; moved: boolean } | null>(null);

  const pos = (n: Node) => (drag?.id === n.id ? { x: drag.x, y: drag.y } : { x: n.x, y: n.y });
  const nodeById = useMemo(() => Object.fromEntries(bp.nodes.map((n) => [n.id, n])), [bp.nodes]);

  const toWorld = (cx: number, cy: number) => {
    const v = view.current!, r = v.getBoundingClientRect();
    return { x: (cx - r.left + v.scrollLeft) / zoom, y: (cy - r.top + v.scrollTop) / zoom };
  };

  // Where a new module lands: the middle of what is on screen, nudged so it doesn't sit on another one.
  const freeSpot = () => {
    const v = view.current;
    let x = 80, y = 80;
    if (v) { x = (v.scrollLeft + v.clientWidth / 2) / zoom - NW / 2; y = (v.scrollTop + v.clientHeight / 2) / zoom - NH / 2; }
    for (let k = 0; k < 40 && bp.nodes.some((n) => Math.abs(n.x - x) < NW - 20 && Math.abs(n.y - y) < NH + 10); k++) { x += 24; y += 30; }
    return { x: clamp(x, 0, WORLD_W - NW), y: clamp(y, 0, WORLD_H - NH) };
  };

  const add = (mod: string, at?: { x: number; y: number }) => {
    if (!update) return;
    const p = at ?? freeSpot();
    const node: Node = { id: uid(), mod, x: clamp(p.x, 0, WORLD_W - NW), y: clamp(p.y, 0, WORLD_H - NH), prio: "must" };
    update((b) => ({ ...b, nodes: [...b.nodes, node] }));
    setSel?.(node.id);
  };
  const remove = (id: string) => {
    update?.((b) => ({ ...b, nodes: b.nodes.filter((n) => n.id !== id), links: b.links.filter((l) => l.from !== id && l.to !== id) }));
    setSel?.(null);
  };
  const removeLink = (id: string) => { update?.((b) => ({ ...b, links: b.links.filter((l) => l.id !== id) })); setSelLink(null); };

  // Keyboard: delete the selection, undo / redo.
  useEffect(() => {
    if (readOnly) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      if ((e.key === "Delete" || e.key === "Backspace") && (sel || selLink)) { e.preventDefault(); if (selLink) removeLink(selLink); else if (sel) remove(sel); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); if (e.shiftKey) redo?.(); else undo?.(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") { e.preventDefault(); redo?.(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Moving a module.
  const onNodeDown = (e: React.PointerEvent, n: Node) => {
    if (readOnly || (e.target as Element).closest(".bc-port, button")) return;
    e.stopPropagation();
    const w = toWorld(e.clientX, e.clientY);
    grab.current = { id: n.id, dx: w.x - n.x, dy: w.y - n.y, moved: false };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    setSel?.(n.id); setSelLink(null);
  };
  const onNodeMove = (e: React.PointerEvent) => {
    const g = grab.current;
    if (!g) return;
    const w = toWorld(e.clientX, e.clientY);
    g.moved = true;
    setDrag({ id: g.id, x: clamp(Math.round(w.x - g.dx), 0, WORLD_W - NW), y: clamp(Math.round(w.y - g.dy), 0, WORLD_H - NH) });
  };
  const onNodeUp = () => {
    const g = grab.current;
    grab.current = null;
    if (g?.moved && drag) { const d = drag; update?.((b) => ({ ...b, nodes: b.nodes.map((n) => (n.id === d.id ? { ...n, x: d.x, y: d.y } : n)) })); }
    setDrag(null);
  };

  // Wiring two modules.
  const onPortDown = (e: React.PointerEvent, n: Node) => {
    if (readOnly) return;
    e.stopPropagation(); e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const w = toWorld(e.clientX, e.clientY);
    setWire({ from: n.id, x: w.x, y: w.y });
  };
  const onPortMove = (e: React.PointerEvent) => { if (wire) { const w = toWorld(e.clientX, e.clientY); setWire({ ...wire, x: w.x, y: w.y }); } };
  const onPortUp = (e: React.PointerEvent) => {
    if (!wire) return;
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-node]");
    const to = el?.getAttribute("data-node");
    const from = wire.from;
    setWire(null);
    if (!to || to === from) return;
    update?.((b) => (b.links.some((l) => (l.from === from && l.to === to) || (l.from === to && l.to === from)) ? b : { ...b, links: [...b.links, { id: uid(), from, to }] }));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const mod = e.dataTransfer.getData("text/zyn-mod");
    if (!mod || !MOD[mod]) return;
    const w = toWorld(e.clientX, e.clientY);
    add(mod, { x: w.x - NW / 2, y: w.y - NH / 2 });
  };

  const fit = () => {
    const v = view.current;
    if (!v || !bp.nodes.length) return;
    const maxX = Math.max(...bp.nodes.map((n) => n.x + NW)) + 60, maxY = Math.max(...bp.nodes.map((n) => n.y + NH)) + 60;
    const z = clamp(Math.min(v.clientWidth / maxX, v.clientHeight / maxY), 0.4, 1);
    setZoom(Number(z.toFixed(2)));
    v.scrollTo({ left: 0, top: 0 });
  };
  const arrange = () => {
    const placed = layout(bp.nodes.map((n) => n.mod));
    update?.((b) => ({ ...b, nodes: b.nodes.map((n, i) => ({ ...n, x: placed[i].x, y: placed[i].y })) }));
  };
  // Fit the map to its frame the first time it shows a blueprint.
  const fitted = useRef(false);
  useEffect(() => { if (!fitted.current && bp.nodes.length && view.current) { fitted.current = true; fit(); } });

  const node = sel ? nodeById[sel] : null;

  return (
    <div className={`bc${readOnly ? " is-ro" : ""}`}>
      {!readOnly && <Palette bp={bp} onAdd={(m) => add(m)} />}

      <div className="bc-main">
        <div className="bc-tools" role="toolbar" aria-label="Canvas tools">
          {!readOnly && <>
            <button type="button" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)"><Undo2 size={15} /></button>
            <button type="button" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)"><Redo2 size={15} /></button>
            <span className="bc-sep" />
          </>}
          <button type="button" onClick={() => setZoom((z) => clamp(+(z - 0.1).toFixed(2), 0.4, 1.4))} title="Zoom out"><Minus size={15} /></button>
          <span className="bc-zoom">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => setZoom((z) => clamp(+(z + 0.1).toFixed(2), 0.4, 1.4))} title="Zoom in"><Plus size={15} /></button>
          <button type="button" onClick={fit} title="Fit to screen"><Maximize2 size={15} /></button>
          {!readOnly && <button type="button" onClick={arrange} title="Auto-arrange by category" disabled={!bp.nodes.length}><LayoutGrid size={15} /><span>Arrange</span></button>}
          <button type="button" className={flowing ? "is-on" : undefined} aria-pressed={flowing} onClick={() => setFlowing((f) => !f)} title="Show data flowing between modules"><Activity size={15} /><span>Data flow</span></button>
          <span className="bc-count">{bp.nodes.length} modules · {bp.links.length} connections</span>
        </div>

        <div ref={view} className="bc-view" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
          onPointerDown={(e) => { if (e.target === e.currentTarget || (e.target as Element).closest(".bc-world") === e.target) { setSel?.(null); setSelLink(null); } }}>
          <div className="bc-sizer" style={{ width: WORLD_W * zoom, height: WORLD_H * zoom }}>
            <div className="bc-world" style={{ width: WORLD_W, height: WORLD_H, transform: `scale(${zoom})` }}
              onPointerDown={(e) => { if (e.target === e.currentTarget) { setSel?.(null); setSelLink(null); } }}>
              <svg className="bc-links" width={WORLD_W} height={WORLD_H}>
                {bp.links.map((l, i) => {
                  const a = nodeById[l.from], b = nodeById[l.to];
                  if (!a || !b) return null;
                  const pa = pos(a), pb = pos(b);
                  const leftToRight = pa.x <= pb.x;
                  const d = leftToRight ? curve(pa.x + NW, pa.y + NH / 2, pb.x, pb.y + NH / 2) : curve(pb.x + NW, pb.y + NH / 2, pa.x, pa.y + NH / 2);
                  const hue = catOf(MOD[a.mod].cat).hue;
                  return (
                    <g key={l.id} className={`bc-link${selLink === l.id ? " is-sel" : ""}`} style={{ ["--c" as string]: hue }}
                      onPointerDown={(e) => { if (readOnly) return; e.stopPropagation(); setSelLink(l.id); setSel?.(null); }}>
                      <path className="bc-hit" d={d} />
                      <path className="bc-line" d={d} />
                      {flowing && <path className={`bc-pulse${leftToRight ? "" : " rev"}`} d={d} style={{ animationDelay: `${(i % 5) * 0.35}s` }} />}
                    </g>
                  );
                })}
                {wire && nodeById[wire.from] && (() => { const a = pos(nodeById[wire.from]); return <path className="bc-wire" d={curve(a.x + NW, a.y + NH / 2, wire.x, wire.y)} />; })()}
              </svg>

              {bp.nodes.map((n) => {
                const m = MOD[n.mod], c = catOf(m.cat), p = pos(n);
                return (
                  <div key={n.id} data-node={n.id} className={`bc-node${sel === n.id ? " is-sel" : ""}${n.prio === "nice" ? " is-nice" : ""}${drag?.id === n.id ? " is-drag" : ""}`}
                    style={{ left: p.x, top: p.y, width: NW, height: NH, ["--c" as string]: c.hue }}
                    onPointerDown={(e) => onNodeDown(e, n)} onPointerMove={onNodeMove} onPointerUp={onNodeUp} onPointerCancel={onNodeUp}
                    tabIndex={readOnly ? -1 : 0} role={readOnly ? undefined : "button"} aria-label={`${n.label || m.name}, ${c.name}`}
                    onKeyDown={(e) => { if (e.key === "Enter") setSel?.(n.id); }}>
                    <span className="bc-ico"><m.Icon size={17} /></span>
                    <span className="bc-txt"><b>{n.label || m.name}</b><small>{c.name}{n.prio === "nice" ? " · nice to have" : ""}</small></span>
                    {!readOnly && <span className="bc-port" title="Drag to connect" onPointerDown={(e) => onPortDown(e, n)} onPointerMove={onPortMove} onPointerUp={onPortUp} />}
                    {flowing && <i className="bc-live" aria-hidden="true" />}
                  </div>
                );
              })}

              {!bp.nodes.length && !readOnly && (
                <div className="bc-empty">
                  <b>Your canvas is empty</b>
                  <span>Drag modules here from the left, or tap + on any module. Then drag from the dot on a module&apos;s right edge to connect it to another.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {selLink && !readOnly && (
          <div className="bc-linkbar">
            <span>Connection: <b>{(() => { const l = bp.links.find((x) => x.id === selLink); return l ? `${nodeById[l.from]?.label || MOD[nodeById[l.from]?.mod]?.name} → ${nodeById[l.to]?.label || MOD[nodeById[l.to]?.mod]?.name}` : ""; })()}</b></span>
            <button type="button" onClick={() => removeLink(selLink)}><Trash2 size={14} />Remove connection</button>
            <button type="button" className="ghost" onClick={() => setSelLink(null)} aria-label="Close"><X size={14} /></button>
          </div>
        )}
      </div>

      {!readOnly && (
        <aside className="bc-inspect" aria-label="Inspector">
          {node ? <Inspector key={node.id} node={node} bp={bp} update={update!} onRemove={() => remove(node.id)} onDuplicate={() => add(node.mod, { x: node.x + 30, y: node.y + 90 })} onClose={() => setSel?.(null)} /> : <Overview bp={bp} />}
        </aside>
      )}
    </div>
  );
}

function Palette({ bp, onAdd }: { bp: Blueprint; onAdd: (mod: string) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CatId | "all">("all");
  const used = useMemo(() => new Set(bp.nodes.map((n) => n.mod)), [bp.nodes]);
  const list = MODULES.filter((m) => (cat === "all" || m.cat === cat) && (!q || `${m.name} ${m.desc}`.toLowerCase().includes(q.toLowerCase())));
  const groups = CATEGORIES.map((c) => ({ c, mods: list.filter((m) => m.cat === c.id) })).filter((g) => g.mods.length);
  return (
    <aside className="bc-pal" aria-label="Modules">
      <div className="bc-pal-head">
        <b>Modules <em>{MODULES.length}</em></b>
        <label className="bc-search"><Search size={14} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search modules…" aria-label="Search modules" /></label>
        <div className="bc-cats">
          <button type="button" className={cat === "all" ? "is-on" : undefined} onClick={() => setCat("all")}>All</button>
          {CATEGORIES.map((c) => <button key={c.id} type="button" className={cat === c.id ? "is-on" : undefined} style={{ ["--c" as string]: c.hue }} onClick={() => setCat(c.id)}>{c.name}</button>)}
        </div>
      </div>
      <div className="bc-pal-list">
        {groups.map(({ c, mods }) => (
          <section key={c.id}>
            <h4 style={{ ["--c" as string]: c.hue }}>{c.name}</h4>
            {mods.map((m) => (
              <div key={m.id} className={`bc-mod${used.has(m.id) ? " is-used" : ""}`} draggable style={{ ["--c" as string]: c.hue }}
                onDragStart={(e) => { e.dataTransfer.setData("text/zyn-mod", m.id); e.dataTransfer.effectAllowed = "copy"; }}>
                <span className="bc-ico"><m.Icon size={15} /></span>
                <span className="bc-txt"><b>{m.name}</b><small>{m.desc}</small></span>
                <button type="button" onClick={() => onAdd(m.id)} aria-label={`Add ${m.name}`} title="Add to canvas"><Plus size={15} /></button>
              </div>
            ))}
          </section>
        ))}
        {!groups.length && <p className="bc-none">No module matches “{q}”. Describe it in your notes and we&apos;ll build it.</p>}
      </div>
    </aside>
  );
}

function Inspector({ node, bp, update, onRemove, onDuplicate, onClose }: { node: Node; bp: Blueprint; update: Upd; onRemove: () => void; onDuplicate: () => void; onClose: () => void }) {
  const m = MOD[node.mod], c = catOf(m.cat);
  const set = (patch: Partial<Node>, commit = true) => update((b) => ({ ...b, nodes: b.nodes.map((n) => (n.id === node.id ? { ...n, ...patch } : n)) }), commit);
  const links = bp.links.filter((l) => l.from === node.id || l.to === node.id).map((l) => bp.nodes.find((n) => n.id === (l.from === node.id ? l.to : l.from))).filter(Boolean) as Node[];
  return (
    <div className="ins" style={{ ["--c" as string]: c.hue }}>
      <div className="ins-head">
        <span className="bc-ico"><m.Icon size={18} /></span>
        <div><small>{c.name}</small><b>{m.name}</b></div>
        <button type="button" className="ins-x" onClick={onClose} aria-label="Close"><X size={15} /></button>
      </div>
      <p className="ins-desc">{m.desc}</p>
      <label className="ins-field"><span>Name on your system</span>
        <input value={node.label ?? ""} placeholder={m.name} onChange={(e) => set({ label: e.target.value }, false)} onBlur={(e) => set({ label: e.target.value })} />
      </label>
      <div className="ins-field"><span>Priority</span>
        <div className="ins-seg">
          <button type="button" aria-pressed={node.prio === "must"} onClick={() => set({ prio: "must" })}>Must have</button>
          <button type="button" aria-pressed={node.prio === "nice"} onClick={() => set({ prio: "nice" })}>Nice to have</button>
        </div>
      </div>
      <label className="ins-field"><span>Notes for our team</span>
        <textarea rows={3} value={node.note ?? ""} placeholder="How you use it today, special rules, numbers…" onChange={(e) => set({ note: e.target.value }, false)} onBlur={(e) => set({ note: e.target.value })} />
      </label>
      {m.t.length > 0 && <div className="ins-list"><span>Can start workflows when</span><ul>{m.t.map((t) => <li key={t}>{t}</li>)}</ul></div>}
      {m.a.length > 0 && <div className="ins-list"><span>Can do</span><ul>{m.a.map((a) => <li key={a}>{a}</li>)}</ul></div>}
      <div className="ins-list"><span>Connected to</span>
        {links.length ? <ul>{links.map((n) => <li key={n.id}>{n.label || MOD[n.mod].name}</li>)}</ul> : <p className="ins-hint">Drag from the dot on its right edge onto another module.</p>}
      </div>
      <div className="ins-actions">
        <button type="button" onClick={onDuplicate}><Copy size={14} />Duplicate</button>
        <button type="button" className="danger" onClick={onRemove}><Trash2 size={14} />Remove</button>
      </div>
    </div>
  );
}

function Overview({ bp }: { bp: Blueprint }) {
  const counts = CATEGORIES.map((c) => ({ c, n: bp.nodes.filter((x) => MOD[x.mod]?.cat === c.id).length })).filter((x) => x.n);
  return (
    <div className="ins">
      <div className="ins-head"><div><small>Your blueprint</small><b>{bp.business.name || "Untitled system"}</b></div></div>
      <div className="ins-stats">
        <div><b>{bp.nodes.length}</b><small>modules</small></div>
        <div><b>{bp.links.length}</b><small>connections</small></div>
        <div><b>{bp.flows.length}</b><small>workflows</small></div>
      </div>
      {counts.length > 0 && <ul className="ins-cats">{counts.map(({ c, n }) => <li key={c.id} style={{ ["--c" as string]: c.hue }}><i />{c.name}<em>{n}</em></li>)}</ul>}
      <div className="ins-tips">
        <span>How it works</span>
        <ol>
          <li>Drag modules from the left onto the canvas, or tap <b>+</b>.</li>
          <li>Drag from the dot on a module&apos;s right edge onto another to connect them.</li>
          <li>Click a module to rename it, mark it nice-to-have, or add notes.</li>
          <li>Click a connection to remove it. <b>Delete</b> removes the selection.</li>
        </ol>
      </div>
    </div>
  );
}
