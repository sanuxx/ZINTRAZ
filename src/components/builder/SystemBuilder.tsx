"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Boxes, Eye, History, LayoutTemplate, Send as SendIcon, Workflow } from "lucide-react";
import { TEMPLATES, blankBlueprint, decode, fromTemplate, validate, type Blueprint } from "@/lib/builder";
import Canvas from "./Canvas";
import Flows from "./Flows";
import Experience from "./Experience";
import Send from "./Send";

/**
 * The system builder: Start (template) → Blueprint (modules on a canvas, connected) → Workflows → Experience
 * (the virtual system) → Send. One blueprint object holds everything; edits go through `update`, which keeps
 * an undo history (typing is grouped into one step) and autosaves to this browser. A share link (#bp=…)
 * opens that exact blueprint — that is how a client's design reaches our team for review.
 */
const STEPS = [
  { name: "Start", Icon: LayoutTemplate },
  { name: "Blueprint", Icon: Boxes },
  { name: "Workflows", Icon: Workflow },
  { name: "Experience it", Icon: Eye },
  { name: "Send to us", Icon: SendIcon },
];
const KEY = "zintraz-system-blueprint";

export default function SystemBuilder() {
  const [bp, setBp] = useState<Blueprint>(blankBlueprint);
  const [past, setPast] = useState<Blueprint[]>([]);
  const [future, setFuture] = useState<Blueprint[]>([]);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const [saved, setSaved] = useState<Blueprint | null>(null);
  const [shared, setShared] = useState(false);
  const [ready, setReady] = useState(false);
  const base = useRef<Blueprint | null>(null); // the state before a run of uncommitted edits (typing)
  const top = useRef<HTMLDivElement>(null);

  // `cur` mirrors the latest blueprint so updates stay pure (no history writes inside a state updater).
  // Every change goes through `put`, which keeps it in step.
  const cur = useRef(bp);
  const put = useCallback((b: Blueprint) => { cur.current = b; setBp(b); }, []);
  const update = useCallback((fn: (b: Blueprint) => Blueprint, commit = true) => {
    const prev = cur.current, next = fn(prev);
    put(next);
    if (!commit) { if (!base.current) base.current = prev; return; }
    const before = base.current ?? prev;
    base.current = null;
    if (before !== next) { setPast((p) => [...p.slice(-59), before]); setFuture([]); }
  }, [put]);
  const undo = () => { if (!past.length) return; const prev = past[past.length - 1]; setPast((p) => p.slice(0, -1)); setFuture((f) => [cur.current, ...f]); base.current = null; put(prev); setSel(null); };
  const redo = () => { if (!future.length) return; const nxt = future[0]; setFuture((f) => f.slice(1)); setPast((p) => [...p, cur.current]); base.current = null; put(nxt); setSel(null); };
  const load = (b: Blueprint) => { setPast((p) => [...p, cur.current]); setFuture([]); put(b); setSel(null); };

  // Open a shared blueprint (#bp=…), else offer to resume the one saved in this browser. Deferred a tick,
  // like the other hash readers on the site, so the first render matches the server's.
  useEffect(() => {
    queueMicrotask(() => {
      const m = window.location.hash.match(/#bp=([\w-]+)/);
      const fromLink = m ? decode(m[1]) : null;
      if (fromLink) {
        put(fromLink); setShared(true); setStep(1);
        history.replaceState(null, "", window.location.pathname + window.location.search);
      } else {
        try { const s = window.localStorage.getItem(KEY); const v = s ? validate(JSON.parse(s)) : null; if (v && v.nodes.length) setSaved(v); } catch { /* storage unavailable */ }
      }
      setReady(true);
    });
  }, [put]);
  useEffect(() => {
    if (!ready || (!bp.nodes.length && !bp.flows.length)) return;
    const t = window.setTimeout(() => { try { window.localStorage.setItem(KEY, JSON.stringify(bp)); } catch { /* storage unavailable */ } }, 400);
    return () => window.clearTimeout(t);
  }, [bp, ready]);

  const go = (i: number) => { setStep(i); top.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const pick = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id)!;
    if (bp.nodes.length && !window.confirm("Replace your current blueprint with this template? You can undo this.")) return;
    load(fromTemplate(t)); go(1);
  };

  return (
    <div className="sb" ref={top}>
      <nav className="sb-steps" aria-label="Builder steps">
        {STEPS.map((s, i) => (
          <button key={s.name} type="button" className={`${i === step ? "is-on" : ""}${i < step ? " is-done" : ""}`} aria-current={i === step ? "step" : undefined} onClick={() => go(i)}>
            <em>{i + 1}</em><s.Icon size={15} /><span>{s.name}</span>
            {i === 1 && bp.nodes.length > 0 && <small>{bp.nodes.length}</small>}
            {i === 2 && bp.flows.length > 0 && <small>{bp.flows.length}</small>}
          </button>
        ))}
      </nav>

      {shared && (
        <div className="sb-banner"><b>You&apos;re viewing a shared blueprint.</b><span>Any changes you make stay in this browser.</span><button type="button" onClick={() => setShared(false)}>OK</button></div>
      )}

      <div className="sb-body">
        {step === 0 && (
          <div className="sb-start">
            <div className="sb-start-head">
              <h2 className="h-lg">Start from a business like yours, <span className="grad-text">or a blank canvas.</span></h2>
              <p className="lede">Templates are only a starting point: every module, connection and workflow can be changed.</p>
            </div>
            {saved && (
              <button type="button" className="sb-resume" onClick={() => { load(saved); setSaved(null); go(1); }}>
                <History size={18} /><span><b>Continue where you left off</b><small>{saved.business.name || "Your blueprint"} · {saved.nodes.length} modules · {saved.flows.length} workflows</small></span><ArrowRight size={16} />
              </button>
            )}
            <div className="sb-tpls">
              {TEMPLATES.map((t) => (
                <button key={t.id} type="button" className={`sb-tpl${bp.template === t.id && bp.nodes.length ? " is-on" : ""}`} onClick={() => pick(t.id)}>
                  <span className="sb-tpl-ico"><t.Icon size={20} /></span>
                  <b>{t.name}</b>
                  <small>{t.blurb}</small>
                  <em>{t.mods.length ? `${t.mods.length} modules · ${t.flows.length} workflows` : "Empty canvas"}</em>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && <Canvas bp={bp} update={update} sel={sel} setSel={setSel} undo={undo} redo={redo} canUndo={past.length > 0} canRedo={future.length > 0} />}
        {step === 2 && <Flows bp={bp} update={update} />}
        {step === 3 && <Experience bp={bp} update={update} />}
        {step === 4 && <Send bp={bp} update={update} onImport={(b) => { load(b); go(1); }} />}
      </div>

      <div className="sb-nav">
        {step > 0 ? <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}><ArrowLeft size={16} />{STEPS[step - 1].name}</button> : <span />}
        {step < STEPS.length - 1 && <button type="button" className="btn btn-primary" onClick={() => go(step + 1)}>{step === 0 ? "Open the canvas" : `Next: ${STEPS[step + 1].name}`}<ArrowRight size={16} /></button>}
      </div>
    </div>
  );
}
