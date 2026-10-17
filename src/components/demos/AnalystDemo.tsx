"use client";

import { Fragment, useMemo, useState } from "react";
import { DemoShell, Empty, Meter, Tag, useLog } from "@/components/demos/DemoKit";

/**
 * ZynAnalyst, three connected systems over one editable set of meeting notes: requirement extraction
 * (ID, type, priority, actor) with conflict detection; ambiguity flagging with a suggested fix for
 * every vague phrase; and a traceability matrix from requirements to test cases with live coverage.
 */
const NOTES = `Kick-off with Lotus Hotels operations team.
The system must let front desk staff check guests in within two minutes.
Housekeeping should see room status on their phones.
Reports must be emailed to managers daily.
The finance lead said reports should be sent weekly, not daily.
It needs to be fast and user-friendly.
Guests will be able to request late checkout through WhatsApp.
We may need some integration with the existing accounting system.
Managers must approve refunds above LKR 10,000.`;

const VAGUE: Record<string, string> = {
  fast: "State a target, e.g. pages load in under 2 seconds.",
  "user-friendly": "Define a measurable goal, e.g. new staff complete check-in unaided after one session.",
  some: "Name the exact systems, fields or quantity.",
  may: "Decide whether this is in scope for the first release.",
  quickly: "Give a time limit.",
  easy: "Describe who must be able to do what, and how fast.",
  simple: "Describe the specific steps that must be avoided.",
  flexible: "List the variations it has to support.",
  appropriate: "Say who decides what is appropriate, and by what rule.",
  "etc": "Complete the list.",
};
const VAGUE_RE = new RegExp(`\\b(${Object.keys(VAGUE).map((k) => k.replace(/[-]/g, "\\-")).join("|")})\\b`, "gi");
const ACTORS = ["front desk", "housekeeping", "managers", "finance", "guests"];
const FREQ = ["daily", "weekly", "monthly"];

type Req = { id: string; text: string; type: "Functional" | "Non-functional"; priority: "Must" | "Should" | "Could"; actor: string };
function extract(notes: string): Req[] {
  return notes.split(/\n|(?<=\.)\s+/).map((s) => s.trim()).filter((s) => /\b(must|shall|should|needs?|will|may need|has to)\b/i.test(s)).map((text, i) => {
    const low = text.toLowerCase();
    return {
      id: `REQ-${String(i + 1).padStart(2, "0")}`,
      text,
      type: /(fast|within|minutes|seconds|secure|available|user-friendly|performance)/.test(low) ? "Non-functional" : "Functional",
      priority: /\bmay\b/.test(low) ? "Could" : /\b(must|shall|has to|needs?)\b/.test(low) ? "Must" : /\b(should|will)\b/.test(low) ? "Should" : "Could",
      actor: ACTORS.find((a) => low.includes(a)) ?? "System",
    };
  });
}
function conflicts(reqs: Req[]) {
  const out: [Req, Req, string][] = [];
  reqs.forEach((a, i) => reqs.slice(i + 1).forEach((b) => {
    const fa = FREQ.filter((f) => a.text.toLowerCase().includes(f)), fb = FREQ.filter((f) => b.text.toLowerCase().includes(f));
    if (/report/i.test(a.text) && /report/i.test(b.text) && fa.length && fb.length && fa.join() !== fb.join()) out.push([a, b, "Different report frequency"]);
  }));
  return out;
}
const TESTS = ["TC-01 Check-in timing", "TC-02 Mobile room board", "TC-03 Scheduled reports", "TC-04 WhatsApp requests", "TC-05 Refund approval"];
const TABS = [
  { id: "req", label: "Requirements", hint: "Extract from notes" },
  { id: "amb", label: "Ambiguity check", hint: "Flag vague wording" },
  { id: "trace", label: "Traceability", hint: "Map to test cases" },
];

export default function AnalystDemo({ accent }: { accent: string }) {
  const [tab, setTab] = useState("req");
  const { log, push } = useLog(15 * 60 + 20);
  const [notes, setNotes] = useState(NOTES);
  const [ran, setRan] = useState(false);
  const [links, setLinks] = useState<Record<string, boolean>>({ "REQ-01|0": true, "REQ-02|1": true, "REQ-03|2": true, "REQ-06|3": true });

  const reqs = useMemo(() => extract(notes), [notes]);
  const clash = useMemo(() => conflicts(reqs), [reqs]);
  const vague = notes.match(VAGUE_RE) ?? [];
  const covered = reqs.filter((r) => TESTS.some((_, j) => links[`${r.id}|${j}`]));

  return (
    <DemoShell title="ZynAnalyst · Lotus Hotels project" accent={accent} tabs={TABS} tab={tab} setTab={setTab} log={log}>
      {tab === "req" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>Meeting notes</b><small>Edit freely</small></div>
            <textarea className="dm-input dm-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={11} />
            <button type="button" className="dm-btn wide" onClick={() => { setRan(true); push(`Analysed notes · ${reqs.length} requirements · ${clash.length} conflict${clash.length === 1 ? "" : "s"} · ${vague.length} vague phrases`); }}>Analyse notes</button>
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Structured requirements</b>{ran && <Tag tone="acc">{reqs.length}</Tag>}</div>
            {ran ? <>
              {clash.map(([a, b, why]) => <div key={a.id + b.id} className="dm-alert">Conflict: {a.id} and {b.id}. {why}. Ask finance and operations to agree one rule.</div>)}
              {reqs.map((r) => (
                <div key={r.id} className="dm-req">
                  <div className="dm-row"><b className="dm-mono">{r.id}</b><span className="dm-inline"><Tag tone={r.priority === "Must" ? "acc" : r.priority === "Should" ? "warn" : undefined}>{r.priority}</Tag><Tag>{r.type}</Tag></span></div>
                  <p>{r.text}</p>
                  <small>Actor: {r.actor}</small>
                </div>
              ))}
              {!reqs.length && <Empty>No requirement statements found. Use words like must, should or will.</Empty>}
            </> : <Empty>Press Analyse to turn the notes into requirements.</Empty>}
          </div>
        </div>
      )}

      {tab === "amb" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>Notes, with vague wording highlighted</b><Tag tone={vague.length ? "warn" : "ok"}>{vague.length} found</Tag></div>
            <div className="dm-marked">
              {notes.split("\n").map((line, i) => (
                <p key={i}>{line.split(VAGUE_RE).map((part, j) => (j % 2 ? <mark key={j} title={VAGUE[part.toLowerCase()]}>{part}</mark> : <Fragment key={j}>{part}</Fragment>))}</p>
              ))}
            </div>
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Suggested rewrites</b></div>
            {vague.length ? [...new Set(vague.map((v) => v.toLowerCase()))].map((v) => (
              <div key={v} className="dm-card"><b>“{v}”</b><div className="dm-li">{VAGUE[v]}</div></div>
            )) : <Empty>No vague wording left. Nicely specified.</Empty>}
            <p className="dm-note">Edit the notes on the Requirements tab and this list updates.</p>
          </div>
        </div>
      )}

      {tab === "trace" && (
        <div className="dm-panel">
          <div className="dm-h"><b>Requirements → test cases</b><span className="dm-inline"><Tag tone={covered.length === reqs.length ? "ok" : "warn"}>{covered.length}/{reqs.length} covered</Tag></span></div>
          <Meter value={reqs.length ? (covered.length / reqs.length) * 100 : 0} tone={covered.length === reqs.length ? "ok" : "warn"} />
          <div className="dm-matrix" style={{ ["--n" as string]: TESTS.length }}>
            <span />
            {TESTS.map((t) => <span key={t} className="dm-mx-h">{t}</span>)}
            {reqs.map((r) => (
              <Fragment key={r.id}>
                <span className={`dm-mx-r${covered.includes(r) ? "" : " gap"}`} title={r.text}><b>{r.id}</b> {r.text.slice(0, 38)}{r.text.length > 38 ? "…" : ""}</span>
                {TESTS.map((t, j) => {
                  const key = `${r.id}|${j}`;
                  return <button key={key} type="button" className={`dm-mx-c${links[key] ? " on" : ""}`} aria-pressed={!!links[key]} aria-label={`${r.id} covered by ${t}`}
                    onClick={() => { setLinks((l) => ({ ...l, [key]: !l[key] })); push(`${r.id} ${links[key] ? "unlinked from" : "traced to"} ${t.split(" ")[0]}`); }} />;
                })}
              </Fragment>
            ))}
          </div>
          <button type="button" className="dm-btn ghost" onClick={() => push(`Exported SRS draft · ${reqs.length} requirements · traceability matrix attached`)}>Export SRS draft</button>
        </div>
      )}
    </DemoShell>
  );
}
