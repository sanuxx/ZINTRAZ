"use client";

import { useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { DemoShell, Empty, Tag, money, useLog } from "@/components/demos/DemoKit";

/**
 * ZynAgent, three connected systems: a customer conversation where the agent reasons, calls tools in
 * your systems and replies (refunds above the auto-approve limit go to a person); the approvals queue
 * with that limit as a policy slider; and the audit log of every action, filterable by channel.
 */
type Channel = "Web" | "WhatsApp" | "Email";
type Msg = { from: "customer" | "agent"; text: string; tools?: string[] };
type Approval = { id: string; customer: string; amount: number; reason: string; channel: Channel };
type Audit = { t: string; channel: Channel; action: string; by: "Agent" | "Manager"; outcome: "Done" | "Pending" | "Approved" | "Declined" | "Escalated" };
const PRESETS = [
  "Can I book a table for 4 tomorrow at 8pm?",
  "Where is my order #4821?",
  "My meal arrived cold. I'd like a refund.",
  "Do you have vegan options?",
];
const TABS = [
  { id: "chat", label: "Conversation", hint: "Talk to the agent" },
  { id: "appr", label: "Approvals", hint: "Human in the loop" },
  { id: "audit", label: "Audit log", hint: "Every action, recorded" },
];

export default function AgentDemo({ accent }: { accent: string }) {
  const [tab, setTab] = useState("chat");
  const { log, push, now } = useLog(21 * 60 + 12);
  const [channel, setChannel] = useState<Channel>("WhatsApp");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "agent", text: "Hi, I'm the Lotus Kitchen assistant. I can book tables, track orders and sort out problems. How can I help?" }]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [limit, setLimit] = useState(2000);
  const [queue, setQueue] = useState<Approval[]>([{ id: "AP-118", customer: "Ruwan D.", amount: 6400, reason: "Wrong order delivered, full refund requested", channel: "Email" }]);
  const [audit, setAudit] = useState<Audit[]>([{ t: "21:04", channel: "Web", action: "Answered opening hours question", by: "Agent", outcome: "Done" }]);
  const [filter, setFilter] = useState<"All" | Channel>("All");
  const [seq, setSeq] = useState(119);

  const record = (a: Omit<Audit, "t">) => setAudit((s) => [{ ...a, t: now }, ...s]);

  const reply = (q: string): { text: string; tools: string[]; audit: Omit<Audit, "t" | "channel">; approval?: number } => {
    const s = q.toLowerCase();
    if (/(book|table|reserv)/.test(s)) return { text: "Done. You're booked for 4 tomorrow at 20:00, table 12 by the window. I've sent a confirmation, and you can reply here to change it.", tools: ["reservations.search(4 guests, tomorrow 20:00) → 3 free", "reservations.create → R-1182", `${channel.toLowerCase()}.send(confirmation)`], audit: { action: "Created booking R-1182 (4 guests, 20:00)", by: "Agent", outcome: "Done" } };
    if (/(where|order|track|#)/.test(s)) return { text: "Order #4821 left the kitchen 6 minutes ago with Kasun on a bike. Estimated arrival is 12 minutes. I'll message you when it's at your door.", tools: ["orders.get(#4821) → dispatched 21:06", "delivery.eta → 12 min", "notify.subscribe(#4821)"], audit: { action: "Looked up order #4821 and subscribed customer to updates", by: "Agent", outcome: "Done" } };
    if (/(refund|cold|wrong|complain)/.test(s)) {
      const amount = 3250;
      if (amount <= limit) return { text: `I'm sorry about that. I've refunded LKR ${money(amount)} to your card; it'll show in 3–5 days. I've also flagged it to the kitchen.`, tools: ["orders.get(latest) → LKR 3,250", `policy.check(refund ≤ ${money(limit)}) → auto-approve`, "payments.refund(3,250)", "kitchen.flag(temperature)"], audit: { action: `Refunded LKR ${money(amount)} (within auto-approve limit)`, by: "Agent", outcome: "Done" } };
      return { text: `I'm sorry about that. A refund of LKR ${money(amount)} needs a manager's approval, so I've sent it to them now. You'll hear back within the hour.`, tools: ["orders.get(latest) → LKR 3,250", `policy.check(refund ≤ ${money(limit)}) → needs approval`, "approvals.create"], audit: { action: `Requested approval for LKR ${money(amount)} refund`, by: "Agent", outcome: "Pending" }, approval: amount };
    }
    if (/(vegan|vegetarian|menu|allerg)/.test(s)) return { text: "Yes: the jackfruit curry, vegetable kottu (ask for no egg) and the coconut sambol hoppers are all vegan. Want me to add any to an order?", tools: ["menu.search(diet: vegan) → 3 dishes"], audit: { action: "Answered dietary question from the menu", by: "Agent", outcome: "Done" } };
    return { text: "I'm not certain I can help with that, so I've passed it to the team with our conversation attached. Someone will reply here shortly.", tools: ["confidence.check → low", "handoff.create(team: front of house)"], audit: { action: "Escalated an unrecognised request to the team", by: "Agent", outcome: "Escalated" } };
  };

  const send = (q: string) => {
    if (!q.trim() || typing) return;
    setMsgs((m) => [...m, { from: "customer", text: q }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      const r = reply(q);
      setMsgs((m) => [...m, { from: "agent", text: r.text, tools: r.tools }]);
      setTyping(false);
      record({ ...r.audit, channel });
      push(`${channel}: ${r.audit.action}`);
      if (r.approval) {
        setQueue((qq) => [...qq, { id: `AP-${seq}`, customer: "You (demo)", amount: r.approval!, reason: "Meal arrived cold", channel }]);
        setSeq((n) => n + 1);
      }
    }, 900);
  };

  const decide = (a: Approval, ok: boolean) => {
    setQueue((q) => q.filter((x) => x.id !== a.id));
    record({ channel: a.channel, action: `${ok ? "Approved" : "Declined"} ${a.id}: LKR ${money(a.amount)} refund`, by: "Manager", outcome: ok ? "Approved" : "Declined" });
    push(`Manager ${ok ? "approved" : "declined"} ${a.id} · agent notified ${a.customer} on ${a.channel}`);
  };

  const shown = audit.filter((a) => filter === "All" || a.channel === filter);

  return (
    <DemoShell title="ZynAgent · Customer agent" accent={accent} tabs={TABS} tab={tab} setTab={setTab} log={log}>
      {tab === "chat" && (
        <div className="dm-split">
          <div className="dm-panel dm-chat">
            <div className="dm-h"><b>Customer · {channel}</b><div className="dm-chips">{(["Web", "WhatsApp", "Email"] as Channel[]).map((c) => <button key={c} type="button" className={c === channel ? "is-on" : undefined} onClick={() => setChannel(c)}>{c}</button>)}</div></div>
            <div className="dm-thread">
              {msgs.map((m, i) => (
                <div key={i} className={`dm-msg ${m.from}`}>
                  <span className="dm-ava">{m.from === "agent" ? <Bot size={14} /> : <User size={14} />}</span>
                  <div>
                    <p>{m.text}</p>
                    {m.tools && <div className="dm-tools">{m.tools.map((t) => <code key={t}>{t}</code>)}</div>}
                  </div>
                </div>
              ))}
              {typing && <div className="dm-msg agent"><span className="dm-ava"><Bot size={14} /></span><div className="dm-think"><i /><i /><i /> Checking your systems…</div></div>}
            </div>
            <form className="dm-inline" onSubmit={(e) => { e.preventDefault(); send(text); }}>
              <input className="dm-input" value={text} placeholder="Type as the customer…" onChange={(e) => setText(e.target.value)} />
              <button type="submit" className="dm-btn" disabled={!text.trim() || typing}><Send size={14} /></button>
            </form>
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Try a request</b></div>
            {PRESETS.map((p) => <button key={p} type="button" className="dm-tile row" disabled={typing} onClick={() => send(p)}>{p}</button>)}
            <p className="dm-note">Refunds up to LKR {money(limit)} are handled automatically; above that, a manager approves. Change the limit under Approvals.</p>
          </div>
        </div>
      )}

      {tab === "appr" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>Waiting for a person</b><Tag tone={queue.length ? "warn" : "ok"}>{queue.length}</Tag></div>
            {queue.length ? queue.map((a) => (
              <div key={a.id} className="dm-card">
                <div className="dm-row"><b>{a.id} · LKR {money(a.amount)}</b><Tag>{a.channel}</Tag></div>
                <div className="dm-li">{a.customer}: {a.reason}</div>
                <div className="dm-li"><b>Agent recommends:</b> approve, first complaint on this account.</div>
                <div className="dm-inline">
                  <button type="button" className="dm-btn" onClick={() => decide(a, true)}>Approve</button>
                  <button type="button" className="dm-btn ghost" onClick={() => decide(a, false)}>Decline</button>
                </div>
              </div>
            )) : <Empty>Queue clear. Ask for a refund in the conversation with a low limit to see one arrive.</Empty>}
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Policy</b></div>
            <label className="dm-field"><span>Auto-approve refunds up to · LKR {money(limit)}</span><input type="range" className="dm-range" min={0} max={10000} step={250} value={limit} onChange={(e) => setLimit(+e.target.value)} /></label>
            <div className="dm-row"><span>Refunds above the limit</span><b>Manager approves</b></div>
            <div className="dm-row"><span>Low-confidence answers</span><b>Escalate to team</b></div>
            <div className="dm-row"><span>Booking changes</span><b>Agent acts</b></div>
            <button type="button" className="dm-btn ghost wide" onClick={() => push(`Policy saved · auto-approve limit LKR ${money(limit)}`)}>Save policy</button>
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="dm-panel">
          <div className="dm-h"><b>Audit log</b><div className="dm-chips">{(["All", "Web", "WhatsApp", "Email"] as const).map((c) => <button key={c} type="button" className={c === filter ? "is-on" : undefined} onClick={() => setFilter(c)}>{c}</button>)}</div></div>
          <div className="dm-table">
            <div className="dm-tr head"><span>Time</span><span>Channel</span><span>Action</span><span>By</span><span>Outcome</span></div>
            {shown.map((a, i) => (
              <div key={i} className="dm-tr"><span className="dm-mono">{a.t}</span><span>{a.channel}</span><span>{a.action}</span><span>{a.by}</span><span><Tag tone={a.outcome === "Done" || a.outcome === "Approved" ? "ok" : a.outcome === "Declined" ? "bad" : "warn"}>{a.outcome}</Tag></span></div>
            ))}
            {!shown.length && <Empty>No actions on this channel yet.</Empty>}
          </div>
        </div>
      )}
    </DemoShell>
  );
}
