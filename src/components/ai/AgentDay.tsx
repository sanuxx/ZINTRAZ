"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Check, ClipboardList, Coffee, Handshake, Headphones, Home, Inbox, Laptop, Moon, Package, Phone, Pause, Play, Receipt, Truck, Users, Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * "Live example": one business day, rewound.
 *
 * A 24-hour dial is the whole idea. Drag the hour hand (or let it sweep on its own) and watch a day go by in two
 * lanes: what your team is doing, and what your agent is doing at the same moment. While the team sleeps, takes
 * calls or sits in a meeting, the agent quietly handles the work that would otherwise wait. Each moment the hand
 * passes is captioned, and the tally of what was handled — and the hours given back — builds as the day goes on.
 *
 * It sells impact, not a tool: no fake screens, just time. The hand is driven by one number (`hour`) that GSAP
 * tweens and the pointer sets; everything else is derived from it. Reduced motion: no autoplay sweep, but the dial
 * is still yours to turn.
 */
type Moment = { at: number; agent: string; detail: string; minutes: number; kind: "sales" | "support" | "ops" | "finance" };

// One day at an ordinary growing business. `minutes` is the staff time the action would otherwise have taken.
const MOMENTS: Moment[] = [
  { at: 0.7, agent: "Replies to a lead from another time zone", detail: "Answers their questions and books a demo for 10 AM.", minutes: 20, kind: "sales" },
  { at: 2.5, agent: "Restores a customer's account access", detail: "Verifies who they are and sends a secure reset link.", minutes: 15, kind: "support" },
  { at: 6.0, agent: "Prepares today's dispatch list", detail: "Checks stock and flags two orders that can't ship yet.", minutes: 40, kind: "ops" },
  { at: 7.5, agent: "Sends the morning cash summary", detail: "Yesterday's payments, today's bills and one overdue account.", minutes: 30, kind: "finance" },
  { at: 10.3, agent: "Drafts a proposal after a sales call", detail: "Pulls pricing and terms, then waits for your approval to send.", minutes: 45, kind: "sales" },
  { at: 13.2, agent: "Resolves a delivery query", detail: "Finds the shipment, shares tracking and updates the ticket.", minutes: 20, kind: "support" },
  { at: 15.6, agent: "Chases three unpaid invoices", detail: "Polite reminders with payment links, logged against each account.", minutes: 30, kind: "finance" },
  { at: 19.4, agent: "Follows up on an open quote", detail: "A timely nudge to the client; their reply lands in the CRM.", minutes: 15, kind: "sales" },
  { at: 22.6, agent: "Closes the day", detail: "Updates the reports, reconciles orders and lines up tomorrow's priorities.", minutes: 45, kind: "ops" },
];
const KIND_LABEL: Record<Moment["kind"], string> = { sales: "Sales", support: "Support", ops: "Operations", finance: "Finance" };

/** What the team is doing at a given hour of the day. */
function teamAt(h: number) {
  if (h < 6.5 || h >= 23) return { state: "Asleep", detail: "Nobody is working." };
  if (h < 9) return { state: "On the way in", detail: "Commuting, coffee, catching up." };
  if (h < 12) return { state: "Calls & meetings", detail: "Clients, colleagues, the inbox waits." };
  if (h < 13) return { state: "Lunch break", detail: "Away from their desks." };
  if (h < 17.5) return { state: "Heads down", detail: "Deep work on what matters most." };
  if (h < 19) return { state: "Wrapping up", detail: "Last emails, then home." };
  return { state: "Off for the evening", detail: "Time with family." };
}

// The team: four people, and what each is doing in each part of the day.
type Phase = "asleep" | "commute" | "meetings" | "lunch" | "focus" | "wrap" | "home";
const phaseAt = (h: number): Phase =>
  h < 6.5 || h >= 23 ? "asleep" : h < 9 ? "commute" : h < 12 ? "meetings" : h < 13 ? "lunch" : h < 17.5 ? "focus" : h < 19 ? "wrap" : "home";
const TEAM: { role: string; does: Record<Phase, LucideIcon> }[] = [
  { role: "Founder", does: { asleep: Moon, commute: Coffee, meetings: Users, lunch: Coffee, focus: Users, wrap: Laptop, home: Home } },
  { role: "Sales", does: { asleep: Moon, commute: Coffee, meetings: Phone, lunch: Coffee, focus: Phone, wrap: Laptop, home: Home } },
  { role: "Accounts", does: { asleep: Moon, commute: Coffee, meetings: Laptop, lunch: Coffee, focus: Laptop, wrap: Laptop, home: Home } },
  { role: "Operations", does: { asleep: Moon, commute: Coffee, meetings: ClipboardList, lunch: Coffee, focus: Truck, wrap: Laptop, home: Home } },
];
// The agents, one per kind of work; each runs the same three-beat process when it acts.
const AGENTS: { kind: Moment["kind"]; icon: LucideIcon }[] = [
  { kind: "sales", icon: Handshake },
  { kind: "support", icon: Headphones },
  { kind: "ops", icon: Package },
  { kind: "finance", icon: Receipt },
];
const PROCESS: { label: string; icon: LucideIcon }[] = [
  { label: "Receives", icon: Inbox },
  { label: "Acts", icon: Zap },
  { label: "Done", icon: Check },
];

const fmt = (h: number) => {
  const t = ((h % 24) + 24) % 24;
  const hh = Math.floor(t), mm = Math.floor((t - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};
const R = 168; // dial radius in SVG units (viewBox 400x400, centre 200,200)
const angleOf = (h: number) => (h / 24) * Math.PI * 2 - Math.PI / 2; // midnight at the top
// Rounded to 2 decimals: the server and the browser can differ in the last digit of a cosine, which React reports
// as a hydration mismatch on every SVG coordinate.
const round = (v: number) => Math.round(v * 100) / 100;
const pointAt = (h: number, r = R) => ({ x: round(200 + Math.cos(angleOf(h)) * r), y: round(200 + Math.sin(angleOf(h)) * r) });
/** SVG arc path along the rim between two hours. */
function arc(from: number, to: number, r = R) {
  const a = pointAt(from, r), b = pointAt(to, r);
  const large = (to - from) % 24 > 12 ? 1 : 0;
  return `M${a.x.toFixed(2)} ${a.y.toFixed(2)} A${r} ${r} 0 ${large} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

export default function AgentDay() {
  const root = useRef<HTMLElement>(null);
  const dial = useRef<SVGSVGElement>(null);
  const clock = useRef({ hour: 0 });
  const sweep = useRef<gsap.core.Tween | null>(null);
  const [hour, setHour] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dragging, setDragging] = useState(false);

  const passed = MOMENTS.filter((m) => m.at <= hour);
  const current = passed[passed.length - 1];
  const fresh = current && hour - current.at < 1.6; // the hand has only just passed it
  const minutes = passed.reduce((s, m) => s + m.minutes, 0);
  const outOfHours = passed.filter((m) => m.at < 9 || m.at >= 17).length;
  const team = teamAt(hour);
  const hand = pointAt(hour, R - 26);
  const tip = pointAt(hour, R);

  // One tween drives the autoplay sweep; the hand follows the number it animates.
  const play = useCallback((from?: number) => {
    sweep.current?.kill();
    const c = clock.current;
    if (from !== undefined) c.hour = from;
    if (c.hour >= 23.98) c.hour = 0;
    setPlaying(true);
    sweep.current = gsap.to(c, {
      hour: 24, duration: (24 - c.hour) * 1.25, ease: "none",
      onUpdate: () => setHour(c.hour),
      onComplete: () => { setPlaying(false); c.hour = 23.99; setHour(23.99); },
    });
  }, []);
  const pause = useCallback(() => { sweep.current?.kill(); sweep.current = null; setPlaying(false); }, []);

  // Start the day the first time the section is properly on screen; stop it when it leaves.
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("rm");
    let started = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        if (still) { clock.current.hour = 13.5; setHour(13.5); } else play(0);
      } else if (!e.isIntersecting) sweep.current?.pause();
      else if (e.isIntersecting) sweep.current?.resume();
    }, { threshold: 0.35 });
    io.observe(root.current!);
    return () => { io.disconnect(); sweep.current?.kill(); };
  }, [play]);

  // Turning the dial by hand.
  const setFromPointer = (e: React.PointerEvent) => {
    const svg = dial.current!;
    const r = svg.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
    let a = Math.atan2(y, x) + Math.PI / 2;
    if (a < 0) a += Math.PI * 2;
    let h = (a / (Math.PI * 2)) * 24;
    // Don't let a drag past midnight wrap the whole day around; pin to the end you came from.
    const prev = clock.current.hour;
    if (prev > 20 && h < 4) h = 23.99;
    else if (prev < 4 && h > 20) h = 0;
    clock.current.hour = h;
    setHour(h);
  };
  const onDown = (e: React.PointerEvent) => {
    pause();
    setDragging(true);
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    setFromPointer(e);
  };
  const onMove = (e: React.PointerEvent) => { if (dragging) setFromPointer(e); };
  const onUp = () => setDragging(false);
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 1 : 0.25;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { pause(); const h = Math.min(23.99, clock.current.hour + step); clock.current.hour = h; setHour(h); e.preventDefault(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { pause(); const h = Math.max(0, clock.current.hour - step); clock.current.hour = h; setHour(h); e.preventDefault(); }
    if (e.key === " ") { e.preventDefault(); if (playing) pause(); else play(); }
  };
  // Picking a moment glides the hand there (the way it would have moved), rather than jumping.
  const jumpTo = (at: number) => {
    pause();
    const c = clock.current;
    sweep.current = gsap.to(c, { hour: at + 0.02, duration: 0.9, ease: "power3.inOut", onUpdate: () => setHour(c.hour) });
  };

  const hours = Math.floor(minutes / 60), mins = minutes % 60;

  return (
    <section ref={root} className="ad" id="demo">
      <div className="ad-glow" aria-hidden="true" />
      <div className="container">
        <div className="ad-head">
          <p className="ad-eyebrow">Live example</p>
          <h2 className="h-xl">One day. <span className="grad-text">Two shifts running at once.</span></h2>
          <p className="ad-lede">
            Turn the dial through a day at a growing business. Your team does what only people can do. The agent does
            everything that would otherwise wait — including while everyone is asleep.
          </p>
        </div>

        <div className="ad-grid">
          {/* The dial */}
          <div className="ad-dial-wrap">
            <div className="ad-dial-box">
            <svg
              ref={dial}
              viewBox="0 0 400 400"
              className={`ad-dial${dragging ? " is-drag" : ""}`}
              role="slider"
              tabIndex={0}
              aria-label="Time of day"
              aria-valuemin={0}
              aria-valuemax={24}
              aria-valuenow={Math.round(hour * 4) / 4}
              aria-valuetext={`${fmt(hour)}. ${current ? current.agent : "Nothing yet"}`}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onKeyDown={onKey}
            >
              <defs>
                <linearGradient id="ad-sweep" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#5b8cff" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              {/* Night: the hours nobody is working. */}
              <path d={arc(23, 24, R + 18)} className="ad-night" />
              <path d={arc(0, 6.5, R + 18)} className="ad-night" />
              <circle cx="200" cy="200" r={R} className="ad-rim" />
              {/* The day so far. */}
              {hour > 0.01 && <path d={arc(0, Math.min(hour, 23.99))} className="ad-progress" />}
              {Array.from({ length: 96 }, (_, i) => {
                const h = i / 4, major = i % 4 === 0;
                const a = pointAt(h, R - (major ? 12 : 7)), b = pointAt(h, R - 2);
                return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={`ad-tick${major ? " major" : ""}${h <= hour ? " past" : ""}`} />;
              })}
              {[0, 6, 12, 18].map((h) => {
                const p = pointAt(h, R - 30);
                return <text key={h} x={p.x} y={p.y} className="ad-hour">{String(h).padStart(2, "0")}</text>;
              })}
              {/* Each moment the agent acted. */}
              {MOMENTS.map((m) => {
                const p = pointAt(m.at, R + 18);
                const on = m.at <= hour;
                return (
                  <g key={m.at} className={`ad-mark k-${m.kind}${on ? " on" : ""}${current === m && fresh ? " now" : ""}`} onPointerDown={(e) => { e.stopPropagation(); jumpTo(m.at); }}>
                    <circle cx={p.x} cy={p.y} r="12" className="ad-mark-halo" />
                    <circle cx={p.x} cy={p.y} r="4.5" className="ad-mark-dot" />
                  </g>
                );
              })}
              {/* The hand. */}
              <line x1="200" y1="200" x2={hand.x} y2={hand.y} className="ad-hand" />
              <circle cx={tip.x} cy={tip.y} r="9" className="ad-knob" />
              <circle cx="200" cy="200" r="4" className="ad-pin" />
            </svg>
            <div className="ad-face" aria-hidden="true">
              <b>{fmt(hour)}</b>
              <span>{hour < 6.5 || hour >= 22 ? "Night" : hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening"}</span>
            </div>
            </div>
            <div className="ad-controls">
              <button type="button" className="ad-play" onClick={() => (playing ? pause() : play())} aria-label={playing ? "Pause the day" : "Play the day"}>
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <span>{dragging ? "Turning the day" : playing ? "The day is playing — drag the hand to take over" : "Drag the hand through the day"}</span>
            </div>
          </div>

          {/* The two shifts and the tally */}
          <div className="ad-story">
            {/* Your team: four people, each showing what they are doing right now. */}
            <div className={`ad-crew is-${phaseAt(hour)}`}>
              <p className="ad-lane-label">Your team <em>{team.state}</em></p>
              <div className="ad-people">
                {TEAM.map(({ role, does }) => {
                  const Icon = does[phaseAt(hour)];
                  return (
                    <div key={role} className="ad-person">
                      <span className="ad-avatar"><Icon size={20} /></span>
                      <small>{role}</small>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Your agents: the one at work lights up and runs its process. */}
            <div className="ad-crew is-agents">
              <p className="ad-lane-label">Your agents <em>{current && fresh ? `${KIND_LABEL[current.kind]} · ${fmt(current.at)}` : "Standing by"}</em></p>
              <div className="ad-agents">
                {AGENTS.map(({ kind, icon: Icon }) => {
                  const live = !!current && fresh && current.kind === kind;
                  const p = live ? Math.min(1, (hour - current!.at) / 0.9) : -1;
                  return (
                    <div key={kind} className={`ad-agent k-${kind}${live ? " is-live" : ""}`}>
                      <span className="ad-orb"><Icon size={20} /></span>
                      <small>{KIND_LABEL[kind]}</small>
                      <span className="ad-proc" aria-hidden="true">
                        {PROCESS.map(({ label, icon: P }, k) => (
                          <i key={label} className={p >= k / 2.2 ? "on" : undefined} title={label}><P size={11} /></i>
                        ))}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="ad-caption" key={current?.at ?? "none"}>{current ? current.agent : "Turn the dial to start the day."}</p>
            </div>

            <div className="ad-tally" aria-live="polite">
              <div><b>{passed.length}</b><span>tasks handled by the agent</span></div>
              <div><b>{hours ? `${hours}h ${String(mins).padStart(2, "0")}m` : `${mins}m`}</b><span>of staff time given back</span></div>
              <div><b>{outOfHours}</b><span>done outside working hours</span></div>
            </div>

            <p className="ad-note">An illustrative day. Every action follows rules you set, and anything high-stakes waits for a person.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
