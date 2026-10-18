"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Caveat } from "next/font/google";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Eye, FileText, Hand, Loader2, Plus, RotateCcw, Sparkles, Wand2, Wrench, X } from "lucide-react";
import AgentScreen from "@/components/aipage/AgentScreen";
import { businesses, customTask, type AnyTask, type StepItem, type Task } from "@/components/aipage/delegateTasks";

/**
 * "Delegate your to-do list" on /ai. The visitor picks their kind of business and gets its week of
 * sticky-note busywork, plus a blank note to write their own. Dragging a note onto the AI team (or
 * tapping it) flies it into the core and spawns an agent; agents run in parallel, and clicking one
 * opens its screen to watch the actual work appear (AgentScreen). Some agents hit a problem and recover,
 * one per business stops for the visitor's approval, and human-only tasks are handed back with a
 * briefing. Freed hours drain out of the week bar into the counter. Entirely scripted, no model.
 */
const hand = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-hand", display: "swap" });

type Phase = "todo" | "flying" | "working" | "waiting" | "done" | "returned";
const WEEK = 40;
const TILT = [-2.5, 1.8, -1.2, 2.4, -2, 1.2, -1.6, 2.2, -0.8];
const MAX_OWN = 3;
const dur = (t: AnyTask) => 3600 + t.hours * 1200;
const hrs = (h: number) => `${Math.round(h * 10) / 10}h`;
const stepText = (s: StepItem) => (typeof s === "string" ? s : s.text);
const stepTone = (s: StepItem) => (typeof s === "string" ? undefined : s.tone);
const stepAt = (t: Task, k: number) => Math.min(t.steps.length - 1, Math.floor(k * t.steps.length));

function useTween(target: number) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const a = from.current;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 800);
      const val = a + (target - a) * (1 - Math.pow(1 - k, 3));
      from.current = val;
      setV(val);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

export default function DelegateBoard() {
  const [bizId, setBizId] = useState<string | null>(null);
  const [own, setOwn] = useState<AnyTask[]>([]);
  const [state, setState] = useState<Record<string, Phase>>({});
  const [elapsed, setElapsed] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [watch, setWatch] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [draftHours, setDraftHours] = useState(2);
  const [over, setOver] = useState(false);
  const [gulp, setGulp] = useState(0);
  const notes = useRef<Record<string, HTMLButtonElement | null>>({});
  const zone = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ id: string; x: number; y: number; dx: number; dy: number; moved: boolean } | null>(null);
  const timers = useRef<number[]>([]);
  const live = useRef<{ tasks: AnyTask[]; state: Record<string, Phase>; answers: Record<string, boolean> }>({ tasks: [], state: {}, answers: {} });

  const biz = businesses.find((b) => b.id === bizId);
  const tasks: AnyTask[] = biz ? [...biz.tasks, ...own] : [];

  // "working" turns into "waiting" or "done" from the clock, so pauses and finishes need no scheduling.
  const phase = (t: AnyTask): Phase => {
    const s = state[t.id] ?? "todo";
    if (s !== "working" || t.human) return s;
    const e = elapsed[t.id] ?? 0;
    const d = dur(t);
    if (e >= d) return "done";
    if (t.approval && answers[t.id] === undefined && e >= t.approval.at * d - 1) return "waiting";
    return "working";
  };
  const progress = (t: AnyTask) => Math.min(1, (elapsed[t.id] ?? 0) / dur(t));
  const result = (t: Task) => (t.approval ? (answers[t.id] ? t.approval.yes : t.approval.no) : t.result);

  const delegable = tasks.filter((t): t is Task => !t.human);
  const busywork = delegable.reduce((h, t) => h + t.hours, 0);
  const freed = delegable.reduce((h, t) => (phase(t) === "done" ? h + t.hours : h), 0);
  const shown = useTween(freed);
  const running = delegable.some((t) => phase(t) === "working");
  const working = delegable.filter((t) => phase(t) === "working" || phase(t) === "waiting");
  const waiting = delegable.filter((t) => phase(t) === "waiting").length;
  const allDone = busywork > 0 && freed === busywork;

  useEffect(() => {
    live.current = { tasks, state, answers };
  });

  // Advance every running agent; an agent with an unanswered approval stops at its approval point.
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const iv = window.setInterval(() => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      const { tasks, state, answers } = live.current;
      setElapsed((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const t of tasks) {
          if (t.human || state[t.id] !== "working") continue;
          const d = dur(t);
          const cap = t.approval && answers[t.id] === undefined ? t.approval.at * d : d;
          const cur = prev[t.id] ?? 0;
          if (cur < cap) {
            next[t.id] = Math.min(cap, cur + dt);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 100);
    return () => window.clearInterval(iv);
  }, [running]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  useEffect(() => {
    if (!watch) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWatch(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [watch]);

  const hit = (x: number, y: number) => {
    const r = zone.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const send = (t: AnyTask, offset = { dx: 0, dy: 0 }) => {
    if ((live.current.state[t.id] ?? "todo") !== "todo") return;
    live.current.state = { ...live.current.state, [t.id]: "flying" };
    setState((s) => ({ ...s, [t.id]: "flying" }));

    const land = () => {
      setGulp((g) => g + 1);
      setOrder((o) => [t.id, ...o]);
      setState((s) => ({ ...s, [t.id]: t.human ? "returned" : "working" }));
    };

    const el = notes.current[t.id];
    const c = core.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("rm");
    if (!el || !c || still) return land();

    const a = el.getBoundingClientRect();
    const b = c.getBoundingClientRect();
    const tx = offset.dx + b.left + b.width / 2 - (a.left + a.width / 2);
    const ty = offset.dy + b.top + b.height / 2 - (a.top + a.height / 2);
    const i = tasks.findIndex((x) => x.id === t.id);
    const tilt = `rotate(${TILT[i % TILT.length]}deg)`;
    const from = `translate(${offset.dx}px, ${offset.dy}px) ${tilt}`;
    el.style.transform = "";

    if (t.human) {
      // Halfway in, the core refuses it and the note springs back to the board.
      el.animate(
        [{ transform: from }, { transform: `translate(${tx * 0.6}px, ${ty * 0.6}px) scale(.55) rotate(-10deg)`, offset: 0.42 }, { transform: tilt }],
        { duration: 1150, easing: "cubic-bezier(.5,0,.25,1)" },
      );
      timers.current.push(window.setTimeout(land, 480));
      return;
    }
    // The note unmounts when it lands (its key changes), so the forwards fill never has to be undone.
    el.animate(
      [{ transform: from, opacity: 1 }, { transform: `translate(${tx}px, ${ty}px) scale(.1) rotate(24deg)`, opacity: 0.15 }],
      { duration: 720, easing: "cubic-bezier(.55,0,.35,1)", fill: "forwards" },
    ).onfinish = land;
  };

  const sendAll = () => {
    delegable.filter((t) => (state[t.id] ?? "todo") === "todo").forEach((t, i) => {
      timers.current.push(window.setTimeout(() => send(t), i * 260));
    });
  };

  const answer = (id: string, yes: boolean) => setAnswers((a) => ({ ...a, [id]: yes }));

  const reset = (keepBiz = true) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    live.current = { tasks: [], state: {}, answers: {} };
    setState({});
    setElapsed({});
    setAnswers({});
    setOrder([]);
    setWatch(null);
    if (!keepBiz) {
      setOwn([]);
      setBizId(null);
    }
  };

  const addOwn = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setOwn((o) => [...o, customTask(draft, draftHours)]);
    setDraft("");
  };

  if (!biz)
    return (
      <div className={`ail-dl-wrap ${hand.variable}`} data-ail="rise">
        <div className="ail-dl-pick">
          <p className="ail-dl-pick-q">First, what kind of business do you run?</p>
          <div className="ail-dl-pick-grid">
            {businesses.map(({ id, label, name, Icon }) => (
              <button key={id} type="button" onClick={() => setBizId(id)}>
                <span className="ail-ico"><Icon size={20} /></span>
                <b>{label}</b>
                <small>like {name}</small>
                <ArrowRight className="go" size={16} />
              </button>
            ))}
          </div>
          <p className="ail-dl-pick-note">We&apos;ll fill your week with the busywork that kind of business really has. You can add your own tasks too.</p>
        </div>
      </div>
    );

  const human = tasks.filter((t) => t.human).reduce((h, t) => h + t.hours, 0);
  const real = Math.max(6, WEEK - busywork - human);
  const left = delegable.some((t) => (state[t.id] ?? "todo") === "todo");
  const wt = delegable.find((t) => t.id === watch);

  return (
    <div className={`ail-dl-wrap ${hand.variable}`} data-ail="rise">
      <div className="ail-dl">
        <div className="ail-dl-week">
          <div className="ail-dl-week-top">
            <b>Your week at {biz.name}</b>
            <span>Busywork left: <strong>{hrs(busywork - shown)}</strong> of {WEEK}h</span>
          </div>
          <div className="ail-dl-bar" aria-hidden="true">
            {tasks.map((t) => {
              const p = phase(t);
              return (
                <span key={t.id} className={`c-${t.color} ${t.human ? "human" : p === "done" ? "free" : p === "working" || p === "waiting" ? "busy" : ""}`} style={{ flexGrow: t.hours }}>
                  <em>{p === "done" ? "free" : t.text}</em>
                </span>
              );
            })}
            <span className="real" style={{ flexGrow: real }}><em>Your real work</em></span>
          </div>
        </div>

        <div className="ail-dl-board">
          <div className="ail-dl-head">
            <p><b>To do this week</b> · drag a note onto your AI team, or tap it</p>
            <div>
              {left && <button type="button" className="ail-dl-chip" onClick={sendAll}><Wand2 size={14} />Delegate everything</button>}
              {order.length > 0 && <button type="button" className="ail-dl-chip ghost" onClick={() => reset()}><RotateCcw size={14} />Start over</button>}
              <button type="button" className="ail-dl-chip ghost" onClick={() => reset(false)}><ArrowLeft size={14} />Change business</button>
            </div>
          </div>
          <ul className="ail-dl-notes">
            {tasks.map((t, i) => {
              const p = phase(t);
              const style = { ["--r" as string]: `${TILT[i % TILT.length]}deg` };
              if (!t.human && p !== "todo" && p !== "flying")
                return (
                  <li key={`${t.id}-gone`} className="ail-dl-ghost" style={style}>
                    {p === "done" ? <Check size={16} /> : <Loader2 size={16} className="spin" />}
                    <span>{p === "done" ? "Done by" : "With"} {t.agent}</span>
                  </li>
                );
              return (
                <li key={`${t.id}-note`} style={style} className={t.id.startsWith("own-") ? "is-new" : undefined}>
                  <button
                    type="button"
                    ref={(el) => { notes.current[t.id] = el; }}
                    className={`ail-dl-note c-${t.color}${p === "returned" ? " is-back" : ""}`}
                    disabled={p !== "todo"}
                    aria-label={p === "returned" ? `${t.text}: handed back to you` : `Delegate: ${t.text}`}
                    onClick={(e) => { if (e.detail === 0) send(t); }}
                    onPointerDown={(e) => {
                      if (p !== "todo" || e.button !== 0) return;
                      e.currentTarget.setPointerCapture(e.pointerId);
                      drag.current = { id: t.id, x: e.clientX, y: e.clientY, dx: 0, dy: 0, moved: false };
                    }}
                    onPointerMove={(e) => {
                      const d = drag.current;
                      if (!d || d.id !== t.id) return;
                      d.dx = e.clientX - d.x;
                      d.dy = e.clientY - d.y;
                      if (!d.moved && Math.hypot(d.dx, d.dy) > 6) {
                        d.moved = true;
                        e.currentTarget.classList.add("is-drag");
                      }
                      if (!d.moved) return;
                      e.currentTarget.style.transform = `translate(${d.dx}px, ${d.dy}px) rotate(-4deg) scale(1.08)`;
                      setOver(hit(e.clientX, e.clientY));
                    }}
                    onPointerUp={(e) => {
                      const d = drag.current;
                      drag.current = null;
                      if (!d) return;
                      e.currentTarget.classList.remove("is-drag");
                      setOver(false);
                      if (!d.moved || hit(e.clientX, e.clientY)) return send(t, d.moved ? { dx: d.dx, dy: d.dy } : undefined);
                      e.currentTarget.style.transform = "";
                    }}
                    onPointerCancel={(e) => {
                      drag.current = null;
                      e.currentTarget.classList.remove("is-drag");
                      e.currentTarget.style.transform = "";
                      setOver(false);
                    }}
                  >
                    {t.id.startsWith("own-") && <span className="ail-dl-yours">Yours</span>}
                    <span className="ail-dl-text">{t.text}</span>
                    <span className="ail-dl-hours">{t.hours}h</span>
                    {p === "returned" && <span className="ail-dl-badge"><FileText size={12} />Briefing ready</span>}
                  </button>
                </li>
              );
            })}
            {own.length < MAX_OWN && (
              <li style={{ ["--r" as string]: "1.4deg" }}>
                <form className="ail-dl-own" onSubmit={addOwn}>
                  <label className="ail-dl-own-l" htmlFor="ail-dl-own">Add your own task</label>
                  <textarea
                    id="ail-dl-own"
                    value={draft}
                    maxLength={60}
                    rows={2}
                    placeholder="e.g. chase supplier quotes"
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) addOwn(e); }}
                  />
                  <div className="ail-dl-own-foot">
                    <div role="group" aria-label="Hours a week">
                      {[1, 2, 4].map((h) => (
                        <button key={h} type="button" aria-pressed={draftHours === h} onClick={() => setDraftHours(h)}>{h}h</button>
                      ))}
                    </div>
                    <button type="submit" className="add" disabled={!draft.trim()} aria-label="Add task"><Plus size={16} /></button>
                  </div>
                </form>
              </li>
            )}
          </ul>
        </div>

        <div ref={zone} className={`ail-dl-team${over ? " is-over" : ""}${allDone ? " is-done" : ""}`}>
          <div className="ail-dl-team-top">
            <b>Your AI team</b>
            <span className={waiting ? "warn" : undefined}>
              {waiting ? `${waiting} need${waiting > 1 ? "" : "s"} your approval` : working.length ? `${working.length} agent${working.length > 1 ? "s" : ""} working` : allDone ? "All done" : "Ready"}
            </span>
          </div>

          <div className="ail-dl-stage">
            <div className="ail-dl-corewrap" aria-hidden="true">
              <div ref={core} key={gulp} className={`ail-dl-core${gulp ? " gulp" : ""}`}>
                <i className="ring" /><i className="ring two" />
                <Sparkles size={26} />
              </div>
              {/* One satellite per working agent. */}
              <div className="ail-dl-orbit">
                {working.map((t, i) => <i key={t.id} style={{ ["--d" as string]: `${-i * 0.7}s`, ["--o" as string]: `${70 + (i % 3) * 8}px` }} />)}
              </div>
            </div>
            <div className="ail-dl-count" aria-live="polite">
              <strong>{hrs(shown)}</strong>
              <span>given back to you this week</span>
            </div>
          </div>

          <p className="ail-dl-hint">{over ? "Let go to delegate" : allDone ? "" : order.length ? "Tap an agent to watch it work" : "Drop a task here"}</p>

          {allDone && (
            <div className="ail-dl-final">
              <b>{hrs(busywork)} back. Every week.</b>
              <p>Time to grow {biz.name}, not just run it.</p>
              <Link href="/contact" className="ail-btn light">Build your AI team <ArrowRight size={15} /></Link>
            </div>
          )}

          <ul className="ail-dl-lanes">
            {order.map((id, li) => {
              const t = tasks.find((x) => x.id === id);
              if (!t) return null;
              if (t.human)
                return (
                  <li key={id} className="ail-dl-lane back">
                    <div className="ail-dl-lane-main">
                      <span className="ail-dl-lane-ico"><Hand size={14} /></span>
                      <div><b>Handed back to you</b><p>{t.handback}</p></div>
                    </div>
                  </li>
                );
              const p = phase(t);
              const k = progress(t);
              const s = t.steps[stepAt(t, k)];
              const tone = p === "working" ? stepTone(s) : undefined;
              return (
                <li key={id} className={`ail-dl-lane c-${t.color} ${p}`}>
                  <button type="button" className="ail-dl-lane-main" onClick={() => setWatch(id)} aria-label={`Watch ${t.agent} work on: ${t.text}`}>
                    <span className="ail-dl-lane-ico">{p === "done" ? <Check size={14} /> : p === "waiting" ? <Hand size={14} /> : tone === "warn" ? <AlertTriangle size={14} /> : <Sparkles size={14} />}</span>
                    <div>
                      <b>{t.agent}<small className={li === order.length - 1 && p !== "done" ? "pulse" : undefined}><Eye size={12} />Watch</small></b>
                      <p className={tone}>
                        {p === "done" ? result(t) : p === "waiting" ? "Waiting for your approval" : <>{stepText(s)}<span className="ail-dl-dots" /></>}
                      </p>
                      <span className="ail-dl-prog"><i style={{ transform: `scaleX(${k})` }} /></span>
                    </div>
                  </button>
                  {p === "waiting" && t.approval && (
                    <div className="ail-dl-approve">
                      <b>{t.approval.ask}</b>
                      <small>{t.approval.detail}</small>
                      <div>
                        <button type="button" className="yes" onClick={() => answer(id, true)}><Check size={14} />Approve</button>
                        <button type="button" className="no" onClick={() => answer(id, false)}>Not now</button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {wt && (() => {
        const p = phase(wt);
        const k = progress(wt);
        const cur = p === "done" ? wt.steps.length : stepAt(wt, k);
        return (
          <div className="ail-dl-modal" role="dialog" aria-modal="true" aria-label={`${wt.agent} at work`} onClick={(e) => { if (e.target === e.currentTarget) setWatch(null); }}>
            <div className="ail-dl-win">
              <header>
                <span className={`ail-dl-lane-ico c-${wt.color}`}>{p === "done" ? <Check size={15} /> : <Sparkles size={15} />}</span>
                <div><b>{wt.agent}</b><small>{wt.text}</small></div>
                <span className={`ail-dl-pill ${p}`}>{p === "done" ? "Done" : p === "waiting" ? "Needs you" : "Working"}</span>
                <button ref={closeBtn} type="button" className="ail-dl-x" onClick={() => setWatch(null)} aria-label="Close"><X size={18} /></button>
              </header>
              <div className="ail-dl-win-body">
                <div className="ail-dl-steps">
                  <p className="ail-dl-steps-h">What it&apos;s doing</p>
                  <ol>
                    {wt.steps.map((s, i) => {
                      const tone = stepTone(s);
                      const state = i < cur ? "done" : i === cur && p === "working" ? "now" : "";
                      return (
                        <li key={i} className={`${state} ${tone ?? ""}`}>
                          <span>{tone === "warn" && i <= cur ? <AlertTriangle size={13} /> : tone === "fix" && i <= cur ? <Wrench size={13} /> : i < cur ? <Check size={13} /> : state === "now" ? <Loader2 size={13} className="spin" /> : <i />}</span>
                          {stepText(s)}
                        </li>
                      );
                    })}
                  </ol>
                  {wt.approval && (p === "waiting" || wt.id in answers) && (
                    <div className="ail-dl-approve">
                      <b>{wt.approval.ask}</b>
                      <small>{wt.approval.detail}</small>
                      {wt.id in answers ? (
                        <p className={answers[wt.id] ? "yes" : "no"}>{answers[wt.id] ? <><Check size={14} />Approved by you</> : <><X size={14} />Not now: nothing was spent</>}</p>
                      ) : (
                        <div>
                          <button type="button" className="yes" onClick={() => answer(wt.id, true)}><Check size={14} />Approve</button>
                          <button type="button" className="no" onClick={() => answer(wt.id, false)}>Not now</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <AgentScreen out={wt.out} k={k} done={p === "done"} />
              </div>
              <footer>
                <span className="ail-dl-prog"><i className={`c-${wt.color}`} style={{ transform: `scaleX(${k})` }} /></span>
                <p>{p === "done" ? <><Check size={14} />{result(wt)}</> : p === "waiting" ? "Paused until you decide" : `Working · ${Math.round(k * 100)}%`}</p>
              </footer>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
