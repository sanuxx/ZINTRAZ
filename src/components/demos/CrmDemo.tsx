"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { DemoShell, Empty, Meter, Tag, money, useLog } from "@/components/demos/DemoKit";

/**
 * ZynCRM, three connected systems: a drag-and-drop pipeline whose stage moves trigger follow-up
 * automation; predictive lead scoring from engagement signals (the score shows on the pipeline card);
 * and a quote generator that prices a deal and moves the lead to Proposal.
 */
const STAGES = ["New", "Contacted", "Proposal", "Won"] as const;
type Stage = (typeof STAGES)[number];
type Signals = { opened: boolean; pricing: boolean; demo: boolean; size: "Small" | "Mid" | "Large"; idle: number };
type Lead = { id: number; name: string; company: string; value: number; stage: Stage; s: Signals };
const AUTOMATION: Record<Stage, string> = {
  New: "added to the nurture sequence",
  Contacted: "follow-up email scheduled in 2 days",
  Proposal: "quote reminder set for 3 days",
  Won: "onboarding tasks created for the delivery team",
};
const CATALOG = [
  { id: "lic", name: "ZynRest licence (per month)", price: 15000 },
  { id: "setup", name: "Setup & data migration", price: 50000 },
  { id: "train", name: "Staff training (per day)", price: 20000 },
  { id: "kds", name: "Kitchen display screen", price: 35000 },
];
const TABS = [
  { id: "pipe", label: "Pipeline", hint: "Drag deals through stages" },
  { id: "score", label: "Lead scoring", hint: "Predict who will buy" },
  { id: "quote", label: "Quote generator", hint: "Price and send" },
];

function score(s: Signals) {
  const parts: [string, number][] = [
    ["Opened recent emails", s.opened ? 18 : 0],
    ["Visited the pricing page", s.pricing ? 24 : 0],
    ["Booked a demo", s.demo ? 30 : 0],
    [`${s.size} company`, s.size === "Large" ? 16 : s.size === "Mid" ? 10 : 4],
    [`${s.idle} days since last contact`, -Math.round(s.idle * 1.2)],
  ];
  const total = Math.max(0, Math.min(100, 12 + parts.reduce((a, [, v]) => a + v, 0)));
  return { total, parts, band: total >= 70 ? "Hot" : total >= 45 ? "Warm" : "Cold" } as const;
}

export default function CrmDemo({ accent }: { accent: string }) {
  const [tab, setTab] = useState("pipe");
  const { log, push } = useLog(10 * 60 + 14);
  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, name: "Dilani Perera", company: "Spice Route Cafés", value: 420000, stage: "New", s: { opened: true, pricing: true, demo: false, size: "Mid", idle: 2 } },
    { id: 2, name: "Omar Haleem", company: "Harbour Grill", value: 180000, stage: "New", s: { opened: false, pricing: false, demo: false, size: "Small", idle: 12 } },
    { id: 3, name: "Sarah Lim", company: "Blue Lotus Hotels", value: 960000, stage: "Contacted", s: { opened: true, pricing: true, demo: true, size: "Large", idle: 1 } },
    { id: 4, name: "Kasun Silva", company: "Kandy Bakes", value: 240000, stage: "Proposal", s: { opened: true, pricing: false, demo: true, size: "Small", idle: 5 } },
    { id: 5, name: "Priya Nair", company: "Coastline Resorts", value: 1250000, stage: "Won", s: { opened: true, pricing: true, demo: true, size: "Large", idle: 0 } },
  ]);
  const [drag, setDrag] = useState<number | null>(null);
  const [focus, setFocus] = useState(1);
  const [newName, setNewName] = useState("");
  const [lines, setLines] = useState<Record<string, number>>({ lic: 12, setup: 1, train: 2 });
  const [disc, setDisc] = useState(5);
  const [quoteNo, setQuoteNo] = useState(31);
  const [sent, setSent] = useState<string | null>(null);

  const move = (id: number, to: Stage) => {
    const l = leads.find((x) => x.id === id);
    if (!l || l.stage === to) return;
    setLeads((ls) => ls.map((x) => (x.id === id ? { ...x, stage: to } : x)));
    push(`${l.company} → ${to} · ${AUTOMATION[to]}`);
  };
  const addLead = () => {
    const name = newName.trim();
    if (!name) return;
    const id = Math.max(...leads.map((l) => l.id)) + 1;
    setLeads((ls) => [...ls, { id, name, company: `${name.split(" ")[0]}'s Kitchen`, value: 300000, stage: "New", s: { opened: false, pricing: false, demo: false, size: "Small", idle: 0 } }]);
    push(`New lead captured from web form · ${name} · ${AUTOMATION.New}`);
    setNewName("");
  };
  const lead = leads.find((l) => l.id === focus) ?? leads[0];
  const sc = score(lead.s);
  const setSig = (p: Partial<Signals>) => setLeads((ls) => ls.map((x) => (x.id === lead.id ? { ...x, s: { ...x.s, ...p } } : x)));

  const sub = CATALOG.reduce((s, c) => s + c.price * (lines[c.id] ?? 0), 0);
  const discount = (sub * disc) / 100;
  const vat = (sub - discount) * 0.18;
  const generate = () => {
    const no = `Q-2026-${String(quoteNo).padStart(3, "0")}`;
    setQuoteNo((n) => n + 1);
    setSent(no);
    setLeads((ls) => ls.map((x) => (x.id === lead.id ? { ...x, value: Math.round(sub - discount), stage: x.stage === "Won" ? "Won" : "Proposal" } : x)));
    push(`${no} sent to ${lead.name} · LKR ${money(sub - discount + vat)} · ${lead.company} → Proposal`);
  };

  const LeadPicker = (
    <div className="dm-chips">
      {leads.map((l) => <button key={l.id} type="button" className={l.id === lead.id ? "is-on" : undefined} onClick={() => { setFocus(l.id); setSent(null); }}>{l.company}</button>)}
    </div>
  );

  return (
    <DemoShell title="ZynCRM · Sales" accent={accent} tabs={TABS} tab={tab} setTab={setTab} log={log}>
      {tab === "pipe" && (
        <>
          <div className="dm-cols four">
            {STAGES.map((st, si) => {
              const list = leads.filter((l) => l.stage === st);
              return (
                <div key={st} className={`dm-col${drag !== null ? " is-drop" : ""}`} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag !== null) move(drag, st); setDrag(null); }}>
                  <div className="dm-h"><b>{st}</b><small>LKR {money(list.reduce((s, l) => s + l.value, 0) / 1000)}k</small></div>
                  {list.map((l) => {
                    const s = score(l.s);
                    return (
                      <div key={l.id} className="dm-card dm-deal" draggable onDragStart={() => setDrag(l.id)} onDragEnd={() => setDrag(null)}>
                        <div className="dm-row"><b>{l.company}</b><Tag tone={s.band === "Hot" ? "ok" : s.band === "Warm" ? "warn" : undefined}>{s.total}</Tag></div>
                        <div className="dm-li">{l.name} · LKR {money(l.value)}</div>
                        <div className="dm-move">
                          <button type="button" aria-label="Move back" disabled={si === 0} onClick={() => move(l.id, STAGES[si - 1])}><ChevronLeft size={14} /></button>
                          <button type="button" aria-label="Move forward" disabled={si === STAGES.length - 1} onClick={() => move(l.id, STAGES[si + 1])}><ChevronRight size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                  {!list.length && <Empty>Drop a deal here</Empty>}
                </div>
              );
            })}
          </div>
          <div className="dm-inline">
            <input className="dm-input" value={newName} placeholder="Capture a lead: contact name" onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLead()} />
            <button type="button" className="dm-btn" disabled={!newName.trim()} onClick={addLead}>Add lead</button>
          </div>
        </>
      )}

      {tab === "score" && (
        <>
          {LeadPicker}
          <div className="dm-split">
            <div className="dm-panel">
              <div className="dm-h"><b>Engagement signals</b><small>{lead.name}</small></div>
              <label className="dm-check"><input type="checkbox" checked={lead.s.opened} onChange={(e) => setSig({ opened: e.target.checked })} /> Opened the last 3 emails</label>
              <label className="dm-check"><input type="checkbox" checked={lead.s.pricing} onChange={(e) => setSig({ pricing: e.target.checked })} /> Visited the pricing page</label>
              <label className="dm-check"><input type="checkbox" checked={lead.s.demo} onChange={(e) => setSig({ demo: e.target.checked })} /> Booked a demo</label>
              <div className="dm-field"><span>Company size</span>
                <div className="dm-chips">{(["Small", "Mid", "Large"] as const).map((z) => <button key={z} type="button" className={lead.s.size === z ? "is-on" : undefined} onClick={() => setSig({ size: z })}>{z}</button>)}</div>
              </div>
              <label className="dm-field"><span>Days since last contact · {lead.s.idle}</span><input type="range" className="dm-range" min={0} max={30} value={lead.s.idle} onChange={(e) => setSig({ idle: +e.target.value })} /></label>
            </div>
            <div className="dm-panel">
              <div className="dm-h"><b>Predicted score</b><Tag tone={sc.band === "Hot" ? "ok" : sc.band === "Warm" ? "warn" : "bad"}>{sc.band}</Tag></div>
              <div className="dm-score"><b>{sc.total}</b><span>/ 100</span></div>
              <Meter value={sc.total} tone={sc.band === "Hot" ? "ok" : sc.band === "Warm" ? "warn" : "bad"} />
              <p className="dm-note">Why this score</p>
              {sc.parts.map(([k, v]) => <div key={k} className="dm-row"><span>{k}</span><b className={v < 0 ? "neg" : v > 0 ? "pos" : undefined}>{v > 0 ? "+" : ""}{v}</b></div>)}
              <p className="dm-note">{sc.band === "Hot" ? "Call today: high intent and recent activity." : sc.band === "Warm" ? "Send a case study and propose a demo." : "Keep in the nurture sequence."}</p>
            </div>
          </div>
        </>
      )}

      {tab === "quote" && (
        <>
          {LeadPicker}
          <div className="dm-split">
            <div className="dm-panel">
              <div className="dm-h"><b>Line items</b><small>{lead.company}</small></div>
              {CATALOG.map((c) => (
                <div key={c.id} className="dm-row">
                  <span>{c.name}<br /><small>LKR {money(c.price)}</small></span>
                  <span className="dm-step">
                    <button type="button" aria-label="Less" onClick={() => setLines((l) => ({ ...l, [c.id]: Math.max(0, (l[c.id] ?? 0) - 1) }))}><Minus size={12} /></button>
                    <b>{lines[c.id] ?? 0}</b>
                    <button type="button" aria-label="More" onClick={() => setLines((l) => ({ ...l, [c.id]: (l[c.id] ?? 0) + 1 }))}><Plus size={12} /></button>
                  </span>
                </div>
              ))}
              <label className="dm-field"><span>Discount · {disc}%</span><input type="range" className="dm-range" min={0} max={20} value={disc} onChange={(e) => setDisc(+e.target.value)} /></label>
            </div>
            <div className="dm-panel dm-paper">
              <div className="dm-h"><b>{sent ?? "Draft quote"}</b>{sent ? <Tag tone="ok">Sent</Tag> : <Tag>Draft</Tag>}</div>
              <div className="dm-li">To {lead.name}, {lead.company}</div>
              {CATALOG.filter((c) => (lines[c.id] ?? 0) > 0).map((c) => <div key={c.id} className="dm-row"><span>{lines[c.id]} × {c.name}</span><span>{money(c.price * lines[c.id])}</span></div>)}
              {sub === 0 && <Empty>Add a line item.</Empty>}
              <div className="dm-total"><span>Subtotal</span><span>{money(sub)}</span></div>
              <div className="dm-total"><span>Discount {disc}%</span><span>−{money(discount)}</span></div>
              <div className="dm-total"><span>VAT 18%</span><span>{money(vat)}</span></div>
              <div className="dm-total big"><span>Total</span><b>LKR {money(sub - discount + vat)}</b></div>
              <button type="button" className="dm-btn wide" disabled={sub === 0} onClick={generate}>Generate & send quote</button>
            </div>
          </div>
        </>
      )}
    </DemoShell>
  );
}
