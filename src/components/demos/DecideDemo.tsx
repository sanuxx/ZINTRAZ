"use client";

import { useState } from "react";
import { DemoShell, Meter, Tag, useLog } from "@/components/demos/DemoKit";

/**
 * ZynDecide, three connected systems around one decision (where to open the next branch): weighted
 * criteria that rank the options and explain the recommendation; scenario modelling that tests whether
 * the recommendation survives different futures; and the risks and assumptions behind it, which feed a
 * confidence score and a recorded decision.
 */
const CRITERIA = ["Footfall", "Affordable rent", "Low competition", "Staff availability", "Growth potential"];
const OPTIONS: Record<string, number[]> = {
  Kandy: [7, 6, 5, 8, 7],
  Galle: [8, 4, 6, 6, 9],
  Negombo: [6, 8, 4, 7, 6],
};
const SCENARIOS: Record<string, { note: string; d: Record<string, number[]> }> = {
  Base: { note: "Today's outlook", d: {} },
  "Tourism slump": { note: "Arrivals fall 30%", d: { Galle: [-3, 0, 0, 0, -3], Negombo: [-2, 0, 0, 0, -1], Kandy: [-1, 0, 0, 0, 0] } },
  "Rent +20%": { note: "Commercial rents rise", d: { Galle: [0, -2, 0, 0, 0], Kandy: [0, -1, 0, 0, 0], Negombo: [0, -1, 0, 0, 0] } },
  "Fast growth": { note: "Economy grows 6%+", d: { Galle: [1, 0, 0, 0, 1], Kandy: [0, 0, 0, 0, 1], Negombo: [0, 0, 0, 0, 1] } },
};
const RISKS: Record<string, { risks: string[]; assumptions: string[] }> = {
  Galle: { risks: ["Tourist seasonality: footfall swings about 40% between seasons", "Rents near the Fort are the highest of the three"], assumptions: ["Tourist arrivals hold at this year's level", "We can hire 12 trained staff locally"] },
  Kandy: { risks: ["Strong competition on the main street", "Limited parking reduces evening trade"], assumptions: ["Student and office footfall holds through holidays", "The Dalada Veediya lease is still available"] },
  Negombo: { risks: ["Lower average ticket size", "Competition from airport hotels"], assumptions: ["Airport traffic keeps recovering", "Rent stays below LKR 450k a month"] },
};
const TABS = [
  { id: "weigh", label: "Weigh options", hint: "Set what matters" },
  { id: "scen", label: "Scenarios", hint: "Stress-test the answer" },
  { id: "risk", label: "Risks & record", hint: "Check, then decide" },
];

function rank(weights: number[], scen = "Base") {
  const wsum = weights.reduce((a, b) => a + b, 0) || 1;
  return Object.entries(OPTIONS).map(([name, s]) => {
    const adj = s.map((v, i) => Math.max(0, Math.min(10, v + (SCENARIOS[scen].d[name]?.[i] ?? 0))));
    return { name, adj, score: adj.reduce((t, v, i) => t + v * weights[i], 0) / wsum };
  }).sort((a, b) => b.score - a.score);
}

export default function DecideDemo({ accent }: { accent: string }) {
  const [tab, setTab] = useState("weigh");
  const { log, push } = useLog(16 * 60 + 5);
  const [w, setW] = useState([4, 3, 2, 2, 3]);
  const [scen, setScen] = useState("Base");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [records, setRecords] = useState<{ id: string; choice: string; conf: number; why: string }[]>([]);

  const base = rank(w);
  const [top, second] = base;
  // The criterion that most separates the leader from the runner-up, weighted.
  const edge = CRITERIA.map((c, i) => ({ c, i, d: (top.adj[i] - second.adj[i]) * w[i] })).sort((a, b) => b.d - a.d)[0];
  const gap = top.score - second.score;
  const winners = Object.keys(SCENARIOS).map((s) => ({ s, r: rank(w, s) }));
  const holds = winners.filter((x) => x.r[0].name === top.name).length;
  const R = RISKS[top.name];
  const done = (k: string) => !!checks[`${top.name}|${k}`];
  const conf = Math.min(95, Math.round(40 + holds * 6 + Math.min(gap, 1.5) * 8 + R.assumptions.filter(done).length * 7 + R.risks.filter(done).length * 4));

  return (
    <DemoShell title="ZynDecide · Next branch location" accent={accent} tabs={TABS} tab={tab} setTab={setTab} log={log}>
      {tab === "weigh" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>What matters most?</b><small>Weight 0–5</small></div>
            {CRITERIA.map((c, i) => (
              <label key={c} className="dm-field"><span>{c} · {w[i]}</span>
                <input type="range" className="dm-range" min={0} max={5} value={w[i]} onChange={(e) => setW((ws) => ws.map((v, j) => (j === i ? +e.target.value : v)))} onPointerUp={() => push(`Weight for ${c} set to ${w[i]}`)} />
              </label>
            ))}
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Ranking</b><Tag tone="acc">Base case</Tag></div>
            {base.map((o, i) => (
              <div key={o.name} className={`dm-rank${i === 0 ? " top" : ""}`}>
                <div className="dm-row"><b>{i + 1}. {o.name}</b><span className="dm-mono">{o.score.toFixed(2)} / 10</span></div>
                <Meter value={o.score * 10} tone={i === 0 ? "ok" : undefined} />
              </div>
            ))}
            <div className="dm-reco">
              <small>Recommendation</small>
              <p><b>{top.name}</b>{gap < 0.25 ? ", but it's a close call with " + second.name + "." : "."} It leads mainly on <b>{edge.c.toLowerCase()}</b> ({top.adj[edge.i]} vs {second.adj[edge.i]} for {second.name}), which you weighted {w[edge.i]}/5.</p>
            </div>
          </div>
        </div>
      )}

      {tab === "scen" && (
        <>
          <div className="dm-chips">{Object.keys(SCENARIOS).map((s) => <button key={s} type="button" className={s === scen ? "is-on" : undefined} onClick={() => { setScen(s); push(`Scenario “${s}” · ${rank(w, s)[0].name} leads`); }}>{s}</button>)}</div>
          <div className="dm-split">
            <div className="dm-panel">
              <div className="dm-h"><b>{scen}</b><small>{SCENARIOS[scen].note}</small></div>
              {rank(w, scen).map((o, i) => (
                <div key={o.name} className={`dm-rank${i === 0 ? " top" : ""}`}>
                  <div className="dm-row"><b>{i + 1}. {o.name}</b><span className="dm-mono">{o.score.toFixed(2)}</span></div>
                  <Meter value={o.score * 10} tone={i === 0 ? "ok" : undefined} />
                </div>
              ))}
            </div>
            <div className="dm-panel">
              <div className="dm-h"><b>Does the answer hold?</b><Tag tone={holds === 4 ? "ok" : holds >= 3 ? "warn" : "bad"}>{holds} of 4</Tag></div>
              {winners.map(({ s, r }) => <div key={s} className="dm-row"><span>{s}</span><b className={r[0].name === top.name ? "pos" : "neg"}>{r[0].name}</b></div>)}
              <p className="dm-note">{holds === 4 ? `${top.name} wins in every scenario: a robust choice.` : `${top.name} wins in ${holds} of 4 scenarios. Watch the ones where it doesn't before committing.`}</p>
            </div>
          </div>
        </>
      )}

      {tab === "risk" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>{top.name}: what has to be true</b></div>
            <p className="dm-note">Assumptions: verify them</p>
            {R.assumptions.map((a) => <label key={a} className="dm-check"><input type="checkbox" checked={done(a)} onChange={(e) => setChecks((c) => ({ ...c, [`${top.name}|${a}`]: e.target.checked }))} /> {a}</label>)}
            <p className="dm-note">Risks: mark when mitigated</p>
            {R.risks.map((r) => <label key={r} className="dm-check"><input type="checkbox" checked={done(r)} onChange={(e) => setChecks((c) => ({ ...c, [`${top.name}|${r}`]: e.target.checked }))} /> {r}</label>)}
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Confidence</b><Tag tone={conf >= 75 ? "ok" : conf >= 55 ? "warn" : "bad"}>{conf}%</Tag></div>
            <Meter value={conf} tone={conf >= 75 ? "ok" : conf >= 55 ? "warn" : "bad"} />
            <p className="dm-note">Built from the score gap, how many scenarios agree, and the assumptions and risks you&apos;ve checked.</p>
            <button type="button" className="dm-btn wide" onClick={() => {
              const id = `DR-${String(14 + records.length).padStart(3, "0")}`;
              const why = `${edge.c} weighted ${w[edge.i]}/5; holds in ${holds}/4 scenarios`;
              setRecords((r) => [{ id, choice: top.name, conf, why }, ...r]);
              push(`Decision ${id} recorded · open in ${top.name} · ${conf}% confidence`);
            }}>Record decision</button>
            {records.map((r) => (
              <div key={r.id} className="dm-card">
                <div className="dm-row"><b>{r.id} · Open in {r.choice}</b><Tag tone="ok">{r.conf}%</Tag></div>
                <div className="dm-li">{r.why}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DemoShell>
  );
}
