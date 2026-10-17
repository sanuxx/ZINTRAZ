"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { DemoShell, Empty, Meter, Tag, money, useLog } from "@/components/demos/DemoKit";

/**
 * ZynStay, three connected systems: the front desk room board (check in / check out, live occupancy
 * and RevPAR), bookings (quote and confirm a stay, then check the arrival into a free room), and
 * housekeeping (rooms vacated at check-out queue for cleaning, get assigned and come back vacant).
 */
type Status = "vacant" | "occupied" | "dirty" | "cleaning";
type Room = { no: number; type: "Standard" | "Deluxe"; status: Status; guest?: string; nights?: number; attendant?: string };
type Booking = { id: string; guest: string; type: Room["type"]; nights: number; guests: number; total: number };
const RATE = { Standard: 18500, Deluxe: 26000 } as const;
const BREAKFAST = 2500;
const ATTENDANTS = ["Nimal", "Kumari", "Ruwan"];
const WALKINS = ["A. Perera", "J. Smith", "M. Fernando", "K. Tanaka", "S. Silva", "L. Müller"];
const TABS = [
  { id: "desk", label: "Front desk", hint: "Rooms, check-in/out" },
  { id: "book", label: "Bookings", hint: "Quote & confirm" },
  { id: "hk", label: "Housekeeping", hint: "Clean & release" },
];
const STATUS_LABEL: Record<Status, string> = { vacant: "Vacant", occupied: "Occupied", dirty: "Needs cleaning", cleaning: "Being cleaned" };

const seed = (): Room[] => [101, 102, 103, 104, 105, 106, 201, 202, 203, 204, 205, 206].map((no, i) => {
  const type = no > 200 ? "Deluxe" : "Standard";
  const s: Status[] = ["occupied", "vacant", "dirty", "occupied", "vacant", "occupied", "occupied", "vacant", "occupied", "dirty", "vacant", "occupied"];
  const status = s[i];
  return { no, type, status, ...(status === "occupied" ? { guest: ["R. Jayasuriya", "E. Clarke", "P. Wickrama", "D. Kim", "N. Rao", "T. Dias", "F. Ahmed"][i % 7], nights: (i % 3) + 1 } : {}) };
});

export default function StayDemo({ accent }: { accent: string }) {
  const [tab, setTab] = useState("desk");
  const { log, push } = useLog(14 * 60);
  const [rooms, setRooms] = useState<Room[]>(seed);
  const [sel, setSel] = useState(102);
  const [walkin, setWalkin] = useState(0);
  const [seq, setSeq] = useState(2208);
  const [arrivals, setArrivals] = useState<Booking[]>([{ id: "BK-2207", guest: "C. Gunawardena", type: "Deluxe", nights: 2, guests: 2, total: 2 * RATE.Deluxe }]);
  const [form, setForm] = useState({ guest: "", type: "Deluxe" as Room["type"], nights: 2, guests: 2, breakfast: true });

  const occ = rooms.filter((r) => r.status === "occupied");
  const revenue = occ.reduce((s, r) => s + RATE[r.type], 0);
  const room = rooms.find((r) => r.no === sel)!;
  const patch = (no: number, p: Partial<Room>) => setRooms((rs) => rs.map((r) => (r.no === no ? { ...r, ...p } : r)));

  const checkIn = (r: Room, guest: string, nights: number) => {
    patch(r.no, { status: "occupied", guest, nights });
    push(`${guest} checked in to ${r.no} (${r.type}) · ${nights} night${nights > 1 ? "s" : ""}`);
  };
  const checkOut = (r: Room) => {
    patch(r.no, { status: "dirty", guest: undefined, nights: undefined });
    push(`${r.guest} checked out of ${r.no} · folio LKR ${money(RATE[r.type] * (r.nights ?? 1))} settled · sent to housekeeping`);
  };

  const quote = form.nights * (RATE[form.type] + (form.breakfast ? BREAKFAST * form.guests : 0));
  const tax = quote * 0.1;
  const free = (t: Room["type"]) => rooms.filter((r) => r.type === t && r.status === "vacant");
  const confirm = () => {
    const guest = form.guest.trim() || "Walk-in guest";
    const id = `BK-${seq}`;
    setSeq((n) => n + 1);
    setArrivals((a) => [...a, { id, guest, type: form.type, nights: form.nights, guests: form.guests, total: quote + tax }]);
    push(`Booking ${id} confirmed · ${guest} · ${form.type} × ${form.nights} nights · LKR ${money(quote + tax)}`);
    setForm((f) => ({ ...f, guest: "" }));
  };
  const arrive = (b: Booking) => {
    const r = free(b.type)[0];
    if (!r) return;
    checkIn(r, b.guest, b.nights);
    setArrivals((a) => a.filter((x) => x.id !== b.id));
  };

  const dirty = rooms.filter((r) => r.status === "dirty" || r.status === "cleaning");

  return (
    <DemoShell title="ZynStay · Hill Crest Hotel" accent={accent} tabs={TABS} tab={tab} setTab={setTab} log={log}>
      {tab === "desk" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-kpis">
              <div><small>Occupancy</small><b>{Math.round((occ.length / rooms.length) * 100)}%</b></div>
              <div><small>Tonight&apos;s revenue</small><b>{money(revenue / 1000)}k</b></div>
              <div><small>RevPAR</small><b>{money(revenue / rooms.length)}</b></div>
            </div>
            <div className="dm-rooms">
              {rooms.map((r) => (
                <button key={r.no} type="button" className={`dm-room s-${r.status}${r.no === sel ? " is-sel" : ""}`} onClick={() => setSel(r.no)}>
                  <b>{r.no}</b><span>{r.type}</span>
                </button>
              ))}
            </div>
            <div className="dm-legend">{(Object.keys(STATUS_LABEL) as Status[]).map((s) => <span key={s} className={`s-${s}`}><i />{STATUS_LABEL[s]}</span>)}</div>
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Room {room.no}</b><Tag tone={room.status === "vacant" ? "ok" : room.status === "occupied" ? "acc" : "warn"}>{STATUS_LABEL[room.status]}</Tag></div>
            <div className="dm-row"><span>Type</span><span>{room.type}</span></div>
            <div className="dm-row"><span>Rate / night</span><span>LKR {money(RATE[room.type])}</span></div>
            {room.status === "occupied" && <>
              <div className="dm-row"><span>Guest</span><b>{room.guest}</b></div>
              <div className="dm-row"><span>Folio</span><span>LKR {money(RATE[room.type] * (room.nights ?? 1))}</span></div>
              <button type="button" className="dm-btn wide" onClick={() => checkOut(room)}>Check out & settle folio</button>
            </>}
            {room.status === "vacant" && <>
              <div className="dm-row"><span>Walk-in guest</span><b>{WALKINS[walkin % WALKINS.length]}</b></div>
              <button type="button" className="dm-btn wide" onClick={() => { checkIn(room, WALKINS[walkin % WALKINS.length], 1); setWalkin((w) => w + 1); }}>Check in walk-in</button>
            </>}
            {(room.status === "dirty" || room.status === "cleaning") && <>
              <Empty>This room can&apos;t be sold until housekeeping releases it.</Empty>
              <button type="button" className="dm-btn ghost wide" onClick={() => setTab("hk")}>Open housekeeping</button>
            </>}
          </div>
        </div>
      )}

      {tab === "book" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>New reservation</b><small>Direct booking</small></div>
            <label className="dm-field"><span>Guest name</span><input className="dm-input" value={form.guest} placeholder="e.g. Amaya Perera" onChange={(e) => setForm({ ...form, guest: e.target.value })} /></label>
            <div className="dm-field"><span>Room type</span>
              <div className="dm-chips">
                {(["Standard", "Deluxe"] as const).map((t) => (
                  <button key={t} type="button" className={form.type === t ? "is-on" : undefined} onClick={() => setForm({ ...form, type: t })}>{t} · {free(t).length} free</button>
                ))}
              </div>
            </div>
            <div className="dm-field-row">
              <div className="dm-field"><span>Nights</span><span className="dm-step"><button type="button" aria-label="Fewer nights" onClick={() => setForm({ ...form, nights: Math.max(1, form.nights - 1) })}><Minus size={12} /></button><b>{form.nights}</b><button type="button" aria-label="More nights" onClick={() => setForm({ ...form, nights: Math.min(14, form.nights + 1) })}><Plus size={12} /></button></span></div>
              <div className="dm-field"><span>Guests</span><span className="dm-step"><button type="button" aria-label="Fewer guests" onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })}><Minus size={12} /></button><b>{form.guests}</b><button type="button" aria-label="More guests" onClick={() => setForm({ ...form, guests: Math.min(3, form.guests + 1) })}><Plus size={12} /></button></span></div>
              <label className="dm-check"><input type="checkbox" checked={form.breakfast} onChange={(e) => setForm({ ...form, breakfast: e.target.checked })} /> Breakfast</label>
            </div>
            <div className="dm-total"><span>Room {form.nights} × {money(RATE[form.type])}</span><span>{money(form.nights * RATE[form.type])}</span></div>
            {form.breakfast && <div className="dm-total"><span>Breakfast {form.guests} × {form.nights}</span><span>{money(BREAKFAST * form.guests * form.nights)}</span></div>}
            <div className="dm-total"><span>Taxes 10%</span><span>{money(tax)}</span></div>
            <div className="dm-total big"><span>Total</span><b>LKR {money(quote + tax)}</b></div>
            <button type="button" className="dm-btn wide" onClick={confirm}>Confirm booking</button>
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Today&apos;s arrivals</b><Tag tone="acc">{arrivals.length}</Tag></div>
            {arrivals.length ? arrivals.map((b) => {
              const has = free(b.type).length > 0;
              return (
                <div key={b.id} className="dm-card">
                  <div className="dm-row"><b>{b.guest}</b><span className="dm-mono">{b.id}</span></div>
                  <div className="dm-li">{b.type} · {b.nights} night{b.nights > 1 ? "s" : ""} · {b.guests} guest{b.guests > 1 ? "s" : ""} · LKR {money(b.total)}</div>
                  <button type="button" className="dm-btn" disabled={!has} onClick={() => arrive(b)}>{has ? `Check in → room ${free(b.type)[0].no}` : `No ${b.type} room ready`}</button>
                </div>
              );
            }) : <Empty>Confirm a booking to see it here.</Empty>}
          </div>
        </div>
      )}

      {tab === "hk" && (
        <div className="dm-panel">
          <div className="dm-h"><b>Housekeeping board</b><Tag tone={dirty.length ? "warn" : "ok"}>{dirty.length ? `${dirty.length} to clean` : "All rooms ready"}</Tag></div>
          {dirty.length ? dirty.map((r) => (
            <div key={r.no} className="dm-row dm-hk">
              <b>Room {r.no}</b>
              <span>{r.type}</span>
              {r.status === "dirty" ? (
                <span className="dm-chips">
                  {ATTENDANTS.map((a) => <button key={a} type="button" onClick={() => { patch(r.no, { status: "cleaning", attendant: a }); push(`Room ${r.no} assigned to ${a}`); }}>{a}</button>)}
                </span>
              ) : (
                <span className="dm-hk-on"><Meter value={60} /> {r.attendant} cleaning</span>
              )}
              <button type="button" className="dm-btn" disabled={r.status !== "cleaning"} onClick={() => { patch(r.no, { status: "vacant", attendant: undefined }); push(`Room ${r.no} inspected & released · back on sale`); }}>Mark clean</button>
            </div>
          )) : <Empty>Check a guest out at the front desk and the room lands here.</Empty>}
        </div>
      )}
    </DemoShell>
  );
}
