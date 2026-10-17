"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, Play, Plus, Sparkles, Trash2, Zap } from "lucide-react";
import {
  APPROVERS, CHANNELS, CONDITIONS, MOD, NOTIFY, STEP_KINDS, SYSTEM_TRIGGERS, TEMPLATES, WAITS, fromTemplate, stepText, triggerText, uid,
  type Blueprint, type Flow, type Step, type StepKind,
} from "@/lib/builder";

/**
 * Workflow designer: "when this happens, do these steps". Triggers come from the events of the modules on the
 * canvas (or a schedule), and steps from their actions, plus notify / condition / approval / wait / AI steps.
 * Steps reorder and delete; "Test run" walks through the flow step by step. Suggestions are the template
 * workflows whose modules are all on the canvas.
 */
type Upd = (fn: (bp: Blueprint) => Blueprint, commit?: boolean) => void;

export default function Flows({ bp, update }: { bp: Blueprint; update: Upd }) {
  const [openId, setOpenId] = useState<string | null>(bp.flows[0]?.id ?? null);
  const open = bp.flows.find((f) => f.id === openId) ?? null;
  const onCanvas = useMemo(() => [...new Set(bp.nodes.map((n) => n.mod))], [bp.nodes]);

  const suggestions = useMemo(() => {
    const have = new Set(onCanvas), names = new Set(bp.flows.map((f) => f.name));
    return TEMPLATES.flatMap((t) => fromTemplate(t).flows)
      .filter((f) => !names.has(f.name) && (f.trigger.mod === "system" || have.has(f.trigger.mod)) && f.steps.every((s) => !s.mod || have.has(s.mod)))
      .filter((f, i, a) => a.findIndex((x) => x.name === f.name) === i).slice(0, 4);
  }, [onCanvas, bp.flows]);

  const setFlow = (id: string, fn: (f: Flow) => Flow, commit = true) => update((b) => ({ ...b, flows: b.flows.map((f) => (f.id === id ? fn(f) : f)) }), commit);
  const addFlow = (f?: Flow) => {
    const trig = onCanvas.find((m) => MOD[m].t.length);
    const flow: Flow = f ? { ...f, id: uid() } : { id: uid(), name: `Workflow ${bp.flows.length + 1}`, trigger: trig ? { mod: trig, event: MOD[trig].t[0] } : { mod: "system", event: SYSTEM_TRIGGERS[0] }, steps: [] };
    update((b) => ({ ...b, flows: [...b.flows, flow] }));
    setOpenId(flow.id);
  };
  const removeFlow = (id: string) => { update((b) => ({ ...b, flows: b.flows.filter((f) => f.id !== id) })); setOpenId(bp.flows.find((f) => f.id !== id)?.id ?? null); };

  return (
    <div className="bwf">
      <aside className="bwf-list" aria-label="Your workflows">
        <div className="bwf-list-head"><b>Workflows <em>{bp.flows.length}</em></b><button type="button" className="btn btn-primary" onClick={() => addFlow()}><Plus size={15} />New</button></div>
        <ul>
          {bp.flows.map((f) => (
            <li key={f.id}>
              <button type="button" className={f.id === openId ? "is-on" : undefined} onClick={() => setOpenId(f.id)}>
                <Zap size={14} /><span><b>{f.name}</b><small>{triggerText(f)} · {f.steps.length} steps</small></span>
              </button>
            </li>
          ))}
        </ul>
        {!bp.flows.length && <p className="bwf-none">No workflows yet. Start one, or pick a suggestion below.</p>}
        {suggestions.length > 0 && (
          <div className="bwf-sugg">
            <span><Sparkles size={13} />Suggested for your modules</span>
            {suggestions.map((s) => (
              <button key={s.name} type="button" onClick={() => addFlow(s)}><b>{s.name}</b><small>When {triggerText(s).toLowerCase()}</small><Plus size={14} /></button>
            ))}
          </div>
        )}
      </aside>

      <section className="bwf-edit">
        {open ? <Editor key={open.id} flow={open} bp={bp} onCanvas={onCanvas} set={(fn, c) => setFlow(open.id, fn, c)} onRemove={() => removeFlow(open.id)} />
          : <div className="bwf-blank"><Zap size={28} /><b>Automate the work between your modules</b><span>A workflow starts when something happens — an order, a low stock level, a booking — and runs the steps you choose.</span><button type="button" className="btn btn-primary" onClick={() => addFlow()}><Plus size={15} />Create a workflow</button></div>}
      </section>
    </div>
  );
}

function Editor({ flow, bp, onCanvas, set, onRemove }: { flow: Flow; bp: Blueprint; onCanvas: string[]; set: (fn: (f: Flow) => Flow, commit?: boolean) => void; onRemove: () => void }) {
  const [run, setRun] = useState(-1);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const trigMods = onCanvas.filter((m) => MOD[m].t.length);
  const actMods = onCanvas.filter((m) => MOD[m].a.length);
  const aiMods = onCanvas.filter((m) => MOD[m].cat === "ai" && MOD[m].a.length);

  const setStep = (id: string, patch: Partial<Step>) => set((f) => ({ ...f, steps: f.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  const move = (i: number, d: number) => set((f) => { const s = [...f.steps]; const j = i + d; if (j < 0 || j >= s.length) return f; [s[i], s[j]] = [s[j], s[i]]; return { ...f, steps: s }; });
  const addStep = (kind: StepKind) => {
    const first = kind === "action" ? actMods[0] : kind === "ai" ? aiMods[0] : undefined;
    const text = kind === "action" ? (first ? MOD[first].a[0] : "") : kind === "notify" ? `${NOTIFY[0]}|${CHANNELS[0]}` : kind === "condition" ? CONDITIONS[0] : kind === "approval" ? APPROVERS[0] : kind === "wait" ? WAITS[2] : first ? MOD[first].a[0] : "Let the AI agent reply";
    set((f) => ({ ...f, steps: [...f.steps, { id: uid(), kind, mod: first, text }] }));
  };
  const test = () => {
    window.clearTimeout(timer.current);
    let i = 0; setRun(0);
    const tick = () => { i++; setRun(i); if (i <= flow.steps.length) timer.current = window.setTimeout(tick, 750); };
    timer.current = window.setTimeout(tick, 750);
  };

  const trigVal = flow.trigger.mod === "system" ? `system::${flow.trigger.event}` : `${flow.trigger.mod}::${flow.trigger.event}`;
  return (
    <div className="wfe">
      <div className="wfe-head">
        <input className="wfe-name" value={flow.name} onChange={(e) => set((f) => ({ ...f, name: e.target.value }), false)} onBlur={(e) => set((f) => ({ ...f, name: e.target.value }))} aria-label="Workflow name" />
        <button type="button" className="btn btn-ghost" onClick={test} disabled={!flow.steps.length}><Play size={14} />Test run</button>
        <button type="button" className="wfe-del" onClick={onRemove} aria-label="Delete workflow" title="Delete workflow"><Trash2 size={15} /></button>
      </div>

      <ol className="wfe-flow">
        <li className={`wfe-node is-trigger${run >= 0 ? " is-done" : ""}`}>
          <span className="wfe-kind"><Zap size={15} />When</span>
          <select value={trigVal} onChange={(e) => { const [mod, event] = e.target.value.split("::"); set((f) => ({ ...f, trigger: { mod, event } })); }} aria-label="Trigger">
            {trigMods.map((m) => <optgroup key={m} label={MOD[m].name}>{MOD[m].t.map((t) => <option key={t} value={`${m}::${t}`}>{t}</option>)}</optgroup>)}
            <optgroup label="Schedule & other">{SYSTEM_TRIGGERS.map((t) => <option key={t} value={`system::${t}`}>{t}</option>)}</optgroup>
            {flow.trigger.mod !== "system" && !trigMods.includes(flow.trigger.mod) && <option value={trigVal}>{triggerText(flow)} — module not on canvas</option>}
          </select>
        </li>
        {flow.steps.map((s, i) => {
          const k = STEP_KINDS.find((x) => x.kind === s.kind)!;
          const [who, via] = (s.text || "|").split("|");
          return (
            <li key={s.id} className={`wfe-node k-${s.kind}${run > i ? " is-done" : ""}${run === i + 1 ? " is-now" : ""}`}>
              <span className="wfe-kind"><k.Icon size={15} />{k.name}</span>
              <div className="wfe-fields">
                {s.kind === "action" && <>
                  <select value={s.mod ?? ""} onChange={(e) => setStep(s.id, { mod: e.target.value, text: MOD[e.target.value]?.a[0] ?? "" })} aria-label="Module">
                    {!actMods.length && <option value="">Add modules to the canvas first</option>}
                    {actMods.map((m) => <option key={m} value={m}>{MOD[m].name}</option>)}
                  </select>
                  <select value={s.text} onChange={(e) => setStep(s.id, { text: e.target.value })} aria-label="Action">
                    {(s.mod ? MOD[s.mod]?.a ?? [] : []).map((a) => <option key={a} value={a}>{a}</option>)}
                    {s.mod && !MOD[s.mod]?.a.includes(s.text) && <option value={s.text}>{s.text}</option>}
                  </select>
                </>}
                {s.kind === "notify" && <>
                  <select value={who} onChange={(e) => setStep(s.id, { text: `${e.target.value}|${via}` })} aria-label="Who">{NOTIFY.map((x) => <option key={x}>{x}</option>)}</select>
                  <select value={via} onChange={(e) => setStep(s.id, { text: `${who}|${e.target.value}` })} aria-label="How">{CHANNELS.map((x) => <option key={x}>{x}</option>)}</select>
                </>}
                {s.kind === "condition" && (
                  <input list="bwf-conditions" value={s.text} onChange={(e) => setStep(s.id, { text: e.target.value })} aria-label="Condition" placeholder="e.g. the amount is over LKR 100,000" />
                )}
                {s.kind === "approval" && <select value={s.text} onChange={(e) => setStep(s.id, { text: e.target.value })} aria-label="Approver">{APPROVERS.map((x) => <option key={x}>{x}</option>)}</select>}
                {s.kind === "wait" && <select value={s.text} onChange={(e) => setStep(s.id, { text: e.target.value })} aria-label="Wait">{WAITS.map((x) => <option key={x}>{x}</option>)}</select>}
                {s.kind === "ai" && <>
                  <select value={s.mod ?? ""} onChange={(e) => setStep(s.id, { mod: e.target.value || undefined, text: MOD[e.target.value]?.a[0] ?? "Let the AI agent reply" })} aria-label="AI module">
                    <option value="">Any AI agent</option>
                    {aiMods.map((m) => <option key={m} value={m}>{MOD[m].name}</option>)}
                  </select>
                  <input value={s.text} onChange={(e) => setStep(s.id, { text: e.target.value })} aria-label="What the AI should do" />
                </>}
              </div>
              <span className="wfe-read">{stepText(s)}</span>
              <div className="wfe-tools">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === flow.steps.length - 1} aria-label="Move down"><ArrowDown size={14} /></button>
                <button type="button" onClick={() => set((f) => ({ ...f, steps: f.steps.filter((x) => x.id !== s.id) }))} aria-label="Remove step"><Trash2 size={14} /></button>
              </div>
              {run > i && <Check className="wfe-ok" size={16} />}
            </li>
          );
        })}
        <li className="wfe-add">
          <span>Add a step</span>
          <div>{STEP_KINDS.map((k) => <button key={k.kind} type="button" onClick={() => addStep(k.kind)} title={k.hint}><k.Icon size={14} />{k.name}</button>)}</div>
        </li>
      </ol>
      {run > flow.steps.length && <p className="wfe-result"><Check size={15} />Test run complete — {flow.steps.length} steps ran in order.</p>}
      <datalist id="bwf-conditions">{CONDITIONS.map((c) => <option key={c} value={c} />)}</datalist>
      {!bp.nodes.length && <p className="wfe-warn">Your canvas has no modules yet, so only schedule triggers are available. Add modules in the Blueprint step.</p>}
    </div>
  );
}
