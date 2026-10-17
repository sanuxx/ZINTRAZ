"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Bars, DemoShell, Line, Meter, Tag, useLog } from "@/components/demos/DemoKit";

/**
 * ZynIQ, three connected systems over one sample dataset (a three-branch business, 12 months): ask a
 * question in plain language and get the answer, the chart and the query behind it; a dashboard you
 * slice by period and branch; and anomaly detection over daily orders with adjustable sensitivity.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const REV: Record<string, number[]> = {
  Colombo: [8.2, 8.4, 8.9, 9.1, 9.6, 9.9, 10.2, 10.4, 10.1, 10.8, 11.2, 11.9],
  Kandy: [4.1, 4.0, 4.3, 4.6, 4.8, 5.2, 5.5, 5.9, 6.2, 6.6, 6.9, 7.4],
  Galle: [3.2, 3.5, 3.9, 4.2, 4.4, 4.6, 3.1, 4.7, 4.9, 5.0, 5.3, 5.6],
};
const MARGIN: Record<string, number> = { Colombo: 22, Kandy: 26, Galle: 19 };
const BR = Object.keys(REV);
const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
const pct = (a: number, b: number) => Math.round(((a - b) / b) * 1000) / 10;
const m = (v: number) => `${v.toFixed(1)}M`;

type Answer = { q: string; text: string; chart: { label: string; value: number }[]; hi: number[]; line?: number[]; flags?: number[]; sql: string };
const SUGGEST = ["Which branch grew fastest this quarter?", "What were total sales last month?", "Show revenue by branch this year", "Why did Galle dip in July?", "Which branch has the best margin?"];

function answer(q: string): Answer | null {
  const s = q.toLowerCase();
  if (/(grew|growth|fastest)/.test(s)) {
    const g = BR.map((b) => ({ label: b, value: pct(sum(REV[b].slice(9)), sum(REV[b].slice(6, 9))) }));
    const top = g.reduce((a, b) => (b.value > a.value ? b : a));
    return { q, text: `${top.label} grew fastest: revenue up ${top.value}% in Q4 against Q3, ahead of ${g.filter((x) => x !== top).map((x) => `${x.label} (${x.value}%)`).join(" and ")}.`, chart: g, hi: [g.indexOf(top)], sql: "SELECT branch, SUM(rev) FILTER (q=4) / SUM(rev) FILTER (q=3) - 1 AS growth\nFROM sales GROUP BY branch ORDER BY growth DESC" };
  }
  if (/(last month|december|total sales)/.test(s)) {
    const c = BR.map((b) => ({ label: b, value: REV[b][11] * 1e6 }));
    return { q, text: `Total sales in December were LKR ${m(sum(BR.map((b) => REV[b][11])))}, up ${pct(sum(BR.map((b) => REV[b][11])), sum(BR.map((b) => REV[b][10])))}% on November. Colombo contributed ${Math.round((REV.Colombo[11] / sum(BR.map((b) => REV[b][11]))) * 100)}%.`, chart: c, hi: [0], sql: "SELECT branch, SUM(rev) FROM sales\nWHERE month = '2026-12' GROUP BY branch" };
  }
  if (/(by branch|each branch|this year|revenue)/.test(s) && !/(dip|drop|why)/.test(s)) {
    const c = BR.map((b) => ({ label: b, value: sum(REV[b]) * 1e6 }));
    return { q, text: `This year's revenue is LKR ${m(sum(BR.map((b) => sum(REV[b]))))} across three branches. Colombo leads with ${m(sum(REV.Colombo))}; Kandy is the smallest but the most consistent grower.`, chart: c, hi: [0], sql: "SELECT branch, SUM(rev) FROM sales\nWHERE year = 2026 GROUP BY branch" };
  }
  if (/(dip|drop|why|july|galle)/.test(s)) {
    return { q, text: "Galle fell 33% in July against June, the only month any branch declined. It lines up with three weeks of roadworks at the main entrance in the facilities log; August recovered to above June's level.", chart: [], hi: [], line: REV.Galle, flags: [6], sql: "SELECT month, SUM(rev) FROM sales\nWHERE branch = 'Galle' GROUP BY month\n-- joined with facilities_log on date" };
  }
  if (/(margin|profit)/.test(s)) {
    const c = BR.map((b) => ({ label: b, value: MARGIN[b] }));
    return { q, text: `Kandy has the best margin at ${MARGIN.Kandy}%, despite the lowest revenue. Galle trails at ${MARGIN.Galle}%, mostly from higher food cost.`, chart: c, hi: [1], sql: "SELECT branch, (SUM(rev) - SUM(cost)) / SUM(rev) AS margin\nFROM sales GROUP BY branch" };
  }
  return null;
}

// Daily orders: weekly rhythm plus three injected events.
const EXPECTED = Array.from({ length: 30 }, (_, d) => 420 + ((d % 7) >= 5 ? 85 : 0));
const BASE = EXPECTED.map((v, d) => v + Math.round(Math.sin(d * 2.3) * 14));
const EVENTS: Record<number, [number, string]> = { 11: [250, "Festival weekend: demand spike, matched by a promotion"], 20: [-210, "POS outage for 2 hours at the Colombo branch"], 25: [30, "Unexplained: worth a look"] };
const DAILY = BASE.map((v, d) => v + (EVENTS[d]?.[0] ?? 0));
const TABS = [
  { id: "ask", label: "Ask", hint: "Plain-language questions" },
  { id: "dash", label: "Dashboard", hint: "Slice the numbers" },
  { id: "anom", label: "Anomalies", hint: "Spot what's unusual" },
];

export default function IqDemo({ accent }: { accent: string }) {
  const [tab, setTab] = useState("ask");
  const { log, push } = useLog(8 * 60 + 50);
  const [q, setQ] = useState("");
  const [ans, setAns] = useState<Answer | null>(() => answer(SUGGEST[0]));
  const [miss, setMiss] = useState(false);
  const [busy, setBusy] = useState(false);
  const [period, setPeriod] = useState<"Month" | "Quarter" | "Half-year">("Quarter");
  const [branch, setBranch] = useState("All");
  const [k, setK] = useState(2);

  const ask = (text: string) => {
    if (!text.trim() || busy) return;
    setBusy(true);
    setQ(text);
    setTimeout(() => {
      const a = answer(text);
      setAns(a); setMiss(!a); setBusy(false);
      push(a ? `Answered “${text}”` : `Couldn't map “${text}” to the data model · suggested alternatives`);
    }, 650);
  };

  const len = period === "Month" ? 1 : period === "Quarter" ? 3 : 6;
  const pick = branch === "All" ? BR : [branch];
  const series = MONTHS.map((_, i) => sum(pick.map((b) => REV[b][i])));
  const cur = sum(series.slice(12 - len)), prev = sum(series.slice(12 - len * 2, 12 - len));
  const margin = sum(pick.map((b) => sum(REV[b].slice(12 - len)) * MARGIN[b])) / sum(pick.map((b) => sum(REV[b].slice(12 - len))));

  // Residual against the expected weekly rhythm; flag beyond k standard deviations of normal days.
  const resid = DAILY.map((v, d) => v - EXPECTED[d]);
  const normal = resid.filter((_, d) => !EVENTS[d]);
  const sd = Math.sqrt(sum(normal.map((r) => r * r)) / normal.length) || 1;
  const flags = resid.map((r, i) => (Math.abs(r) > k * sd ? i : -1)).filter((i) => i >= 0);

  return (
    <DemoShell title="ZynIQ · Lanka Foods Group" accent={accent} tabs={TABS} tab={tab} setTab={setTab} log={log}>
      {tab === "ask" && (
        <>
          <form className="dm-inline" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
            <input className="dm-input" value={q} placeholder="Ask anything about sales, branches or margins…" onChange={(e) => setQ(e.target.value)} />
            <button type="submit" className="dm-btn" disabled={busy || !q.trim()}><Send size={14} /> Ask</button>
          </form>
          <div className="dm-chips">{SUGGEST.map((s) => <button key={s} type="button" onClick={() => ask(s)}>{s}</button>)}</div>
          <div className="dm-panel">
            {busy ? <div className="dm-think"><i /><i /><i /> Reading 3 data sources…</div>
              : miss ? <p className="dm-note">I couldn&apos;t match that to your data yet. Try one of the suggestions above.</p>
              : ans && (
                <div className="dm-split flat">
                  <div>
                    <p className="dm-answer">{ans.text}</p>
                    <pre className="dm-sql">{ans.sql}</pre>
                  </div>
                  <div>{ans.line ? <><Line values={ans.line} flags={ans.flags} /><div className="dm-axis">{MONTHS.map((mm) => <span key={mm}>{mm}</span>)}</div></> : <Bars data={ans.chart} hi={ans.hi} />}</div>
                </div>
              )}
          </div>
        </>
      )}

      {tab === "dash" && (
        <>
          <div className="dm-toolbar">
            <div className="dm-chips">{(["Month", "Quarter", "Half-year"] as const).map((p) => <button key={p} type="button" className={p === period ? "is-on" : undefined} onClick={() => { setPeriod(p); push(`Dashboard period → ${p}`); }}>{p}</button>)}</div>
            <div className="dm-chips">{["All", ...BR].map((b) => <button key={b} type="button" className={b === branch ? "is-on" : undefined} onClick={() => { setBranch(b); push(`Dashboard filtered → ${b}`); }}>{b}</button>)}</div>
          </div>
          <div className="dm-kpis four">
            <div><small>Revenue · last {period.toLowerCase()}</small><b>LKR {m(cur)}</b></div>
            <div><small>vs previous</small><b className={cur >= prev ? "pos" : "neg"}>{cur >= prev ? "+" : ""}{pct(cur, prev)}%</b></div>
            <div><small>Margin</small><b>{margin.toFixed(1)}%</b></div>
            <div><small>Best month</small><b>{MONTHS[series.indexOf(Math.max(...series.slice(12 - len)))]}</b></div>
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Monthly revenue · {branch === "All" ? "all branches" : branch}</b><small>LKR millions</small></div>
            <Bars data={MONTHS.map((mm, i) => ({ label: mm, value: Math.round(series[i] * 10) / 10 }))} hi={Array.from({ length: len }, (_, i) => 11 - i)} />
          </div>
        </>
      )}

      {tab === "anom" && (
        <div className="dm-split">
          <div className="dm-panel">
            <div className="dm-h"><b>Daily orders · last 30 days</b><Tag tone={flags.length ? "warn" : "ok"}>{flags.length} flagged</Tag></div>
            <Line values={DAILY} flags={flags} />
            <label className="dm-field"><span>Sensitivity · flag beyond {k.toFixed(1)}σ</span><input type="range" className="dm-range" min={0.6} max={3} step={0.1} value={k} onChange={(e) => setK(+e.target.value)} /></label>
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>What stood out</b></div>
            {flags.length ? flags.map((d) => (
              <div key={d} className="dm-card">
                <div className="dm-row"><b>Day {d + 1}</b><Tag tone={resid[d] > 0 ? "ok" : "bad"}>{resid[d] > 0 ? "+" : ""}{resid[d]} orders</Tag></div>
                <Meter value={Math.min(100, (Math.abs(resid[d]) / 260) * 100 + 4)} tone={resid[d] > 0 ? "ok" : "bad"} />
                <div className="dm-li">{EVENTS[d]?.[1] ?? "Within normal weekly swing at this sensitivity"}</div>
              </div>
            )) : <p className="dm-note">Nothing unusual at this sensitivity. Lower it to see smaller deviations.</p>}
          </div>
        </div>
      )}
    </DemoShell>
  );
}
