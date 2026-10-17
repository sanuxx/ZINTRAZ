"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { DemoShell, Empty, Meter, Tag, money, useLog } from "@/components/demos/DemoKit";

/**
 * ZynRest, three connected systems: the POS builds a ticket and sends it to the kitchen; the kitchen
 * display picks it up and bumps it through cooking to ready (live timers); every sent dish deducts its
 * recipe from stock, which the inventory view shows with low-stock flags, reorders and recipe costing.
 */
type Ing = "chicken" | "roti" | "veg" | "prawns" | "chilli" | "rice" | "flour" | "egg" | "lime" | "jaggery";
const ING: Record<Ing, { name: string; unit: string; cost: number; par: number }> = {
  chicken: { name: "Chicken", unit: "g", cost: 2.2, par: 4000 },
  roti: { name: "Godamba roti", unit: "pcs", cost: 35, par: 40 },
  veg: { name: "Vegetables", unit: "g", cost: 0.6, par: 3000 },
  prawns: { name: "Prawns", unit: "g", cost: 6.5, par: 1500 },
  chilli: { name: "Chilli paste", unit: "g", cost: 1.2, par: 500 },
  rice: { name: "Rice", unit: "g", cost: 0.4, par: 5000 },
  flour: { name: "Rice flour", unit: "g", cost: 0.3, par: 3000 },
  egg: { name: "Eggs", unit: "pcs", cost: 45, par: 60 },
  lime: { name: "Limes", unit: "pcs", cost: 25, par: 30 },
  jaggery: { name: "Jaggery", unit: "g", cost: 1.1, par: 1000 },
};
const MENU = [
  { id: "kottu", name: "Chicken kottu", price: 1200, recipe: { chicken: 120, roti: 2, veg: 80 } },
  { id: "prawns", name: "Devilled prawns", price: 2850, recipe: { prawns: 200, chilli: 20, veg: 60 } },
  { id: "lamprais", name: "Lamprais", price: 1650, recipe: { rice: 150, chicken: 100, egg: 1 } },
  { id: "hoppers", name: "Egg hoppers (3)", price: 750, recipe: { flour: 120, egg: 3 } },
  { id: "soda", name: "Fresh lime soda", price: 450, recipe: { lime: 1 } },
  { id: "watalappan", name: "Watalappan", price: 750, recipe: { egg: 2, jaggery: 60 } },
] as const;
type Dish = (typeof MENU)[number];
const dish = (id: string) => MENU.find((m) => m.id === id)!;
const costOf = (d: Dish) => Object.entries(d.recipe).reduce((s, [k, q]) => s + ING[k as Ing].cost * q, 0);

type Order = { id: number; table: number; items: [string, number][]; status: "new" | "cooking" | "ready"; secs: number };
const TABS = [
  { id: "pos", label: "POS", hint: "Take an order" },
  { id: "kds", label: "Kitchen display", hint: "Cook & bump tickets" },
  { id: "inv", label: "Inventory & cost", hint: "Stock and margins" },
];

export default function RestDemo({ accent }: { accent: string }) {
  const [tab, setTab] = useState("pos");
  const { log, push } = useLog(19 * 60 + 2);
  const [table, setTable] = useState(4);
  const [ticket, setTicket] = useState<Record<string, number>>({ kottu: 2, soda: 2 });
  const [orders, setOrders] = useState<Order[]>([{ id: 1041, table: 7, items: [["prawns", 1], ["hoppers", 2]], status: "cooking", secs: 312 }]);
  const [stock, setStock] = useState<Record<Ing, number>>(() => {
    const s = {} as Record<Ing, number>;
    (Object.keys(ING) as Ing[]).forEach((k) => (s[k] = Math.round(ING[k].par * (k === "prawns" ? 0.34 : k === "lime" ? 0.3 : 0.8))));
    return s;
  });
  const [costDish, setCostDish] = useState<string>("kottu");

  // Kitchen timers tick for every ticket not yet ready.
  useEffect(() => {
    const t = setInterval(() => setOrders((os) => os.map((o) => (o.status === "ready" ? o : { ...o, secs: o.secs + 1 }))), 1000);
    return () => clearInterval(t);
  }, []);

  const lines = Object.entries(ticket).filter(([, q]) => q > 0);
  const subtotal = lines.reduce((s, [id, q]) => s + dish(id).price * q, 0);
  const service = subtotal * 0.1;
  const canMake = (id: string, extra = 1) => Object.entries(dish(id).recipe).every(([k, q]) => stock[k as Ing] >= q * ((ticket[id] ?? 0) + extra));

  const add = (id: string, d: number) => setTicket((t) => ({ ...t, [id]: Math.max(0, (t[id] ?? 0) + d) }));
  const send = () => {
    if (!lines.length) return;
    const id = 1042 + orders.length;
    setOrders((os) => [...os, { id, table, items: lines as [string, number][], status: "new", secs: 0 }]);
    setStock((s) => {
      const n = { ...s };
      lines.forEach(([dId, q]) => Object.entries(dish(dId).recipe).forEach(([k, amt]) => (n[k as Ing] = Math.max(0, n[k as Ing] - amt * q))));
      return n;
    });
    push(`Table ${table} → kitchen · ticket #${id} · ${lines.reduce((s, [, q]) => s + q, 0)} items · stock deducted`);
    setTicket({});
  };
  const bump = (o: Order) => {
    if (o.status === "ready") {
      setOrders((os) => os.filter((x) => x.id !== o.id));
      push(`Ticket #${o.id} served to table ${o.table}`);
      return;
    }
    const next = o.status === "new" ? "cooking" : "ready";
    setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, status: next } : x)));
    push(`Ticket #${o.id} ${next === "cooking" ? "started" : `ready in ${Math.floor(o.secs / 60)}m ${o.secs % 60}s`}`);
  };
  const reorder = (k: Ing) => {
    setStock((s) => ({ ...s, [k]: ING[k].par }));
    push(`Purchase order raised · ${ING[k].name} restocked to ${money(ING[k].par)}${ING[k].unit}`);
  };

  const cd = dish(costDish);
  const cdCost = costOf(cd);
  const mm = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const lowCount = (Object.keys(ING) as Ing[]).filter((k) => stock[k] / ING[k].par < 0.35).length;

  return (
    <DemoShell title="ZynRest · Lotus Kitchen" accent={accent} tabs={TABS} tab={tab} setTab={setTab} log={log}>
      {tab === "pos" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>Menu</b><small>Tap to add · margin shown</small></div>
            <div className="dm-grid-3">
              {MENU.map((m) => {
                const ok = canMake(m.id);
                const margin = Math.round((1 - costOf(m) / m.price) * 100);
                return (
                  <button key={m.id} type="button" className="dm-tile" disabled={!ok} onClick={() => add(m.id, 1)}>
                    <b>{m.name}</b>
                    <span>LKR {money(m.price)}</span>
                    {ok ? <Tag tone={margin > 60 ? "ok" : "warn"}>{margin}% margin</Tag> : <Tag tone="bad">Out of stock</Tag>}
                    {(ticket[m.id] ?? 0) > 0 && <em className="dm-badge">{ticket[m.id]}</em>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Ticket</b><small>Table</small></div>
            <div className="dm-chips">
              {[1, 2, 3, 4, 5, 6, 8].map((n) => <button key={n} type="button" className={n === table ? "is-on" : undefined} onClick={() => setTable(n)}>T{n}</button>)}
            </div>
            {lines.length ? lines.map(([id, q]) => (
              <div key={id} className="dm-row">
                <span>{dish(id).name}</span>
                <span className="dm-step">
                  <button type="button" aria-label="Remove one" onClick={() => add(id, -1)}><Minus size={12} /></button>
                  <b>{q}</b>
                  <button type="button" aria-label="Add one" disabled={!canMake(id)} onClick={() => add(id, 1)}><Plus size={12} /></button>
                </span>
                <span>{money(dish(id).price * q)}</span>
              </div>
            )) : <Empty>Tap dishes on the menu to start a ticket.</Empty>}
            <div className="dm-total"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="dm-total"><span>Service 10%</span><span>{money(service)}</span></div>
            <div className="dm-total big"><span>Total</span><b>LKR {money(subtotal + service)}</b></div>
            <button type="button" className="dm-btn wide" disabled={!lines.length} onClick={send}>Send to kitchen</button>
          </div>
        </div>
      )}

      {tab === "kds" && (
        <div className="dm-cols">
          {(["new", "cooking", "ready"] as const).map((st) => {
            const list = orders.filter((o) => o.status === st);
            return (
              <div key={st} className="dm-col">
                <div className="dm-h"><b>{st === "new" ? "New" : st === "cooking" ? "Cooking" : "Ready to serve"}</b><Tag tone={st === "ready" ? "ok" : st === "new" ? "acc" : undefined}>{list.length}</Tag></div>
                {list.length ? list.map((o) => (
                  <div key={o.id} className={`dm-ticket${o.secs > 600 && st !== "ready" ? " late" : ""}`}>
                    <div className="dm-row"><b>T{o.table} · #{o.id}</b><span className="dm-mono">{mm(o.secs)}</span></div>
                    {o.items.map(([id, q]) => <div key={id} className="dm-li"><b>{q}×</b> {dish(id).name}</div>)}
                    <button type="button" className={`dm-btn${st === "ready" ? " ghost" : ""}`} onClick={() => bump(o)}>
                      {st === "new" ? "Start cooking" : st === "cooking" ? "Mark ready" : "Served"}
                    </button>
                  </div>
                )) : <Empty>{st === "new" ? "Send an order from the POS." : "Nothing here."}</Empty>}
              </div>
            );
          })}
        </div>
      )}

      {tab === "inv" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>Stock on hand</b>{lowCount ? <Tag tone="warn">{lowCount} low</Tag> : <Tag tone="ok">All good</Tag>}</div>
            {(Object.keys(ING) as Ing[]).map((k) => {
              const r = stock[k] / ING[k].par;
              return (
                <div key={k} className="dm-row dm-stock">
                  <span>{ING[k].name}</span>
                  <Meter value={r * 100} tone={r < 0.2 ? "bad" : r < 0.35 ? "warn" : "ok"} />
                  <span className="dm-mono">{money(stock[k])}{ING[k].unit}</span>
                  {r < 0.35 ? <button type="button" className="dm-link" onClick={() => reorder(k)}>Reorder</button> : <span />}
                </div>
              );
            })}
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Recipe cost engine</b></div>
            <div className="dm-chips">
              {MENU.map((m) => <button key={m.id} type="button" className={m.id === costDish ? "is-on" : undefined} onClick={() => setCostDish(m.id)}>{m.name}</button>)}
            </div>
            {Object.entries(cd.recipe).map(([k, q]) => (
              <div key={k} className="dm-row"><span>{ING[k as Ing].name} · {q}{ING[k as Ing].unit}</span><span>{money(ING[k as Ing].cost * q)}</span></div>
            ))}
            <div className="dm-total"><span>Plate cost</span><span>LKR {money(cdCost)}</span></div>
            <div className="dm-total"><span>Menu price</span><span>LKR {money(cd.price)}</span></div>
            <div className="dm-total big"><span>Gross margin</span><b>{Math.round((1 - cdCost / cd.price) * 100)}%</b></div>
            <Meter value={(1 - cdCost / cd.price) * 100} tone={1 - cdCost / cd.price > 0.6 ? "ok" : "warn"} />
          </div>
        </div>
      )}
    </DemoShell>
  );
}
