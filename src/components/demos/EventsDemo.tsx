"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DemoShell, Empty, Meter, Tag, money, useLog } from "@/components/demos/DemoKit";

/**
 * ZynEvents, three connected systems: a floor planner (guest count seats itself across the hall's
 * tables for the chosen layout; click a table to reserve it as VIP), packages & quoting priced from the
 * same guest count, and a run-of-show schedule that flags overlapping items for the same team.
 */
const LAYOUTS = {
  Banquet: { tables: 14, seats: 10, note: "Round tables of 10" },
  Cocktail: { tables: 16, seats: 12, note: "High tables, standing" },
  Theatre: { tables: 12, seats: 16, note: "Rows facing the stage" },
} as const;
type Layout = keyof typeof LAYOUTS;
const PACKAGES = [
  { id: "Silver", pp: 4500, inc: ["Buffet dinner", "Welcome drink", "Standard décor"] },
  { id: "Gold", pp: 6500, inc: ["Buffet + live stations", "2-hour bar", "Floral centrepieces", "Basic AV"] },
  { id: "Platinum", pp: 9000, inc: ["Plated 5-course", "Open bar", "Premium décor", "Full AV & lighting", "Event host"] },
];
const ADDONS = [
  { id: "dj", name: "DJ & sound", price: 45000 },
  { id: "photo", name: "Photography", price: 60000 },
  { id: "led", name: "LED wall", price: 80000 },
  { id: "kids", name: "Kids' corner", price: 25000 },
];
const TEAMS = ["Kitchen", "AV", "Front of house"] as const;
type Item = { id: number; start: number; mins: number; title: string; team: (typeof TEAMS)[number] };
const TABS = [
  { id: "floor", label: "Floor plan", hint: "Seat your guests" },
  { id: "quote", label: "Packages & quote", hint: "Price the event" },
  { id: "run", label: "Run of show", hint: "Schedule the night" },
];
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export default function EventsDemo({ accent }: { accent: string }) {
  const [tab, setTab] = useState("floor");
  const { log, push } = useLog(11 * 60 + 40);
  const [guests, setGuests] = useState(96);
  const [layout, setLayout] = useState<Layout>("Banquet");
  const [vip, setVip] = useState<number[]>([0]);
  const [pkg, setPkg] = useState("Gold");
  const [addons, setAddons] = useState<string[]>(["photo"]);
  const [items, setItems] = useState<Item[]>([
    { id: 1, start: 18 * 60 + 30, mins: 30, title: "Guest arrival & welcome drinks", team: "Front of house" },
    { id: 2, start: 19 * 60, mins: 20, title: "Speeches", team: "AV" },
    { id: 3, start: 19 * 60 + 15, mins: 60, title: "Dinner service", team: "Kitchen" },
    { id: 4, start: 20 * 60 + 30, mins: 90, title: "Dancing", team: "AV" },
  ]);
  const [draft, setDraft] = useState({ title: "Cake cutting", start: 20 * 60 + 15, mins: 20, team: "AV" as Item["team"] });

  const L = LAYOUTS[layout];
  const capacity = L.tables * L.seats;
  // Seat guests table by table; VIP tables fill first.
  const order = [...vip, ...Array.from({ length: L.tables }, (_, i) => i).filter((i) => !vip.includes(i))];
  const seated: number[] = Array(L.tables).fill(0);
  let left = guests;
  order.forEach((i) => { const n = Math.min(L.seats, left); seated[i] = n; left -= n; });
  const used = seated.filter((n) => n > 0).length;

  const P = PACKAGES.find((p) => p.id === pkg)!;
  const food = P.pp * guests;
  const extras = ADDONS.filter((a) => addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const svc = (food + extras) * 0.1;
  const total = food + extras + svc;

  const sorted = [...items].sort((a, b) => a.start - b.start);
  const clash = (it: Item) => items.find((o) => o.id !== it.id && o.team === it.team && it.start < o.start + o.mins && o.start < it.start + it.mins);

  return (
    <DemoShell title="ZynEvents · Grand Ballroom" accent={accent} tabs={TABS} tab={tab} setTab={setTab} log={log}>
      {tab === "floor" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>Grand Ballroom</b><small>{L.note}</small></div>
            <div className={`dm-hall l-${layout.toLowerCase()}`}>
              <span className="dm-stage">Stage</span>
              {seated.map((n, i) => (
                <button key={i} type="button" className={`dm-tbl${vip.includes(i) ? " vip" : ""}${n === 0 ? " empty" : ""}`} style={{ ["--f" as string]: n / L.seats }}
                  onClick={() => { setVip((v) => (v.includes(i) ? v.filter((x) => x !== i) : [...v, i])); push(`Table ${i + 1} ${vip.includes(i) ? "released" : "reserved for VIP guests"}`); }}
                  aria-label={`Table ${i + 1}: ${n} of ${L.seats} seats`}>
                  <b>{i + 1}</b><small>{n}/{L.seats}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Setup</b></div>
            <div className="dm-chips">{(Object.keys(LAYOUTS) as Layout[]).map((k) => <button key={k} type="button" className={k === layout ? "is-on" : undefined} onClick={() => { setLayout(k); setVip([]); push(`Layout switched to ${k}`); }}>{k}</button>)}</div>
            <label className="dm-field"><span>Guests · {guests}</span><input type="range" className="dm-range" min={20} max={220} step={2} value={guests} onChange={(e) => setGuests(+e.target.value)} /></label>
            <div className="dm-kpis">
              <div><small>Tables used</small><b>{used}/{L.tables}</b></div>
              <div><small>Capacity</small><b>{capacity}</b></div>
              <div><small>Free seats</small><b>{Math.max(0, capacity - guests)}</b></div>
            </div>
            <Meter value={(guests / capacity) * 100} tone={guests > capacity ? "bad" : guests > capacity * 0.9 ? "warn" : "ok"} />
            {guests > capacity
              ? <p className="dm-note bad">{guests - capacity} guests over capacity. Try a different layout or the terrace.</p>
              : <p className="dm-note">Click a table to reserve it for VIPs; they are seated first.</p>}
          </div>
        </div>
      )}

      {tab === "quote" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>Package</b><small>{guests} guests (from floor plan)</small></div>
            <div className="dm-grid-3">
              {PACKAGES.map((p) => (
                <button key={p.id} type="button" className={`dm-tile${p.id === pkg ? " is-on" : ""}`} onClick={() => setPkg(p.id)}>
                  <b>{p.id}</b><span>LKR {money(p.pp)} pp</span>
                  <ul>{p.inc.map((x) => <li key={x}>{x}</li>)}</ul>
                </button>
              ))}
            </div>
            <div className="dm-field"><span>Add-ons</span>
              {ADDONS.map((a) => (
                <label key={a.id} className="dm-check"><input type="checkbox" checked={addons.includes(a.id)} onChange={(e) => setAddons((s) => (e.target.checked ? [...s, a.id] : s.filter((x) => x !== a.id)))} /> {a.name} <small>LKR {money(a.price)}</small></label>
              ))}
            </div>
          </div>
          <div className="dm-panel dm-paper">
            <div className="dm-h"><b>Quotation</b><Tag tone="acc">{pkg}</Tag></div>
            <div className="dm-row"><span>{pkg} package · {guests} × {money(P.pp)}</span><span>{money(food)}</span></div>
            {ADDONS.filter((a) => addons.includes(a.id)).map((a) => <div key={a.id} className="dm-row"><span>{a.name}</span><span>{money(a.price)}</span></div>)}
            <div className="dm-total"><span>Service 10%</span><span>{money(svc)}</span></div>
            <div className="dm-total big"><span>Total</span><b>LKR {money(total)}</b></div>
            <div className="dm-total"><span>Per guest</span><span>LKR {money(total / guests)}</span></div>
            <div className="dm-total"><span>Deposit to confirm (30%)</span><span>LKR {money(total * 0.3)}</span></div>
            <button type="button" className="dm-btn wide" onClick={() => push(`Quote sent · ${pkg} for ${guests} guests · LKR ${money(total)} · deposit link included`)}>Send quote to client</button>
          </div>
        </div>
      )}

      {tab === "run" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>Run of show · Saturday</b>{items.some((i) => clash(i)) ? <Tag tone="bad">Conflicts</Tag> : <Tag tone="ok">No conflicts</Tag>}</div>
            {sorted.length ? sorted.map((it) => {
              const c = clash(it);
              return (
                <div key={it.id} className={`dm-slot${c ? " clash" : ""}`}>
                  <span className="dm-mono">{hhmm(it.start)}–{hhmm(it.start + it.mins)}</span>
                  <span><b>{it.title}</b><small>{it.team}{c ? ` · overlaps “${c.title}”` : ""}</small></span>
                  <button type="button" className="dm-x" aria-label={`Remove ${it.title}`} onClick={() => { setItems((s) => s.filter((x) => x.id !== it.id)); push(`Removed “${it.title}” from the run of show`); }}><X size={14} /></button>
                </div>
              );
            }) : <Empty>Nothing scheduled.</Empty>}
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Add an item</b></div>
            <label className="dm-field"><span>Title</span><input className="dm-input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
            <label className="dm-field"><span>Starts · {hhmm(draft.start)}</span><input type="range" className="dm-range" min={17 * 60} max={23 * 60} step={15} value={draft.start} onChange={(e) => setDraft({ ...draft, start: +e.target.value })} /></label>
            <label className="dm-field"><span>Duration · {draft.mins} min</span><input type="range" className="dm-range" min={10} max={120} step={5} value={draft.mins} onChange={(e) => setDraft({ ...draft, mins: +e.target.value })} /></label>
            <div className="dm-field"><span>Team</span><div className="dm-chips">{TEAMS.map((t) => <button key={t} type="button" className={t === draft.team ? "is-on" : undefined} onClick={() => setDraft({ ...draft, team: t })}>{t}</button>)}</div></div>
            <button type="button" className="dm-btn wide" disabled={!draft.title.trim()} onClick={() => {
              const id = Math.max(0, ...items.map((i) => i.id)) + 1;
              setItems((s) => [...s, { ...draft, id, title: draft.title.trim() }]);
              push(`Scheduled “${draft.title.trim()}” at ${hhmm(draft.start)} for ${draft.team}`);
            }}>Add to schedule</button>
          </div>
        </div>
      )}
    </DemoShell>
  );
}
