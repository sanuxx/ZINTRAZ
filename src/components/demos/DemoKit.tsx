"use client";

import { useCallback, useState, type ReactNode } from "react";

/**
 * Shared kit for the product demos (/products/[slug] "Try it"): the window shell with system tabs and a
 * live activity line, a small event log with a simulated clock, and tiny SVG charts. Every demo runs
 * entirely in the browser on sample data. Styles under "Product demos" in globals.css (dm-*).
 */

export type DemoTab = { id: string; label: string; hint: string };
export type LogEntry = { t: string; msg: string };

/** Group thousands without locale differences between server and browser. */
export const money = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const clock = (mins: number) => `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

/** Event log with a simulated clock that advances two minutes per event (newest first). */
export function useLog(start = 9 * 60 + 30) {
  const [log, setLog] = useState<LogEntry[]>([]);
  const push = useCallback((msg: string) => {
    setLog((l) => [{ t: clock(start + (l.length + 1) * 2), msg }, ...l].slice(0, 40));
  }, [start]);
  return { log, push, now: clock(start + log.length * 2 + 2) };
}

export function DemoShell({ title, accent, tabs, tab, setTab, log, children }: {
  title: string; accent: string; tabs: DemoTab[]; tab: string; setTab: (id: string) => void; log: LogEntry[]; children: ReactNode;
}) {
  const last = log[0];
  return (
    <div className="dm" style={{ ["--acc" as string]: accent }}>
      <div className="dm-bar"><i /><i /><i /><span>{title}</span><em>Interactive · sample data</em></div>
      <div className="dm-tabs" role="tablist" aria-label={`${title} systems`}>
        {tabs.map((t, i) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? "is-on" : undefined} onClick={() => setTab(t.id)}>
            <small>{String(i + 1).padStart(2, "0")}</small>
            <b>{t.label}</b>
            <span>{t.hint}</span>
          </button>
        ))}
      </div>
      {/* data-lenis-prevent: wheel scrolls the demo (it scrolls inside the laptop screen), not the page. */}
      <div className="dm-body" role="tabpanel" data-lenis-prevent>{children}</div>
      <div className="dm-foot" aria-live="polite">
        <i />
        {last ? <span key={last.t + last.msg}><em>{last.t}</em>{last.msg}</span> : <span>Waiting for your first action…</span>}
        <b>{log.length} events</b>
      </div>
    </div>
  );
}

export function Meter({ value, tone }: { value: number; tone?: "ok" | "warn" | "bad" }) {
  return <span className={`dm-meter${tone ? ` ${tone}` : ""}`}><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></span>;
}

export function Tag({ children, tone }: { children: ReactNode; tone?: "ok" | "warn" | "bad" | "acc" }) {
  return <span className={`dm-tag${tone ? ` ${tone}` : ""}`}>{children}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="dm-empty">{children}</div>;
}

/** Bar chart: values with labels; `hi` marks indexes to draw in the accent colour. */
export function Bars({ data, hi = [], unit = "" }: { data: { label: string; value: number }[]; hi?: number[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="dm-bars">
      {data.map((d, i) => (
        <div key={d.label} className={hi.includes(i) ? "is-hi" : undefined}>
          <em>{unit}{d.value < 100 ? Math.round(d.value * 10) / 10 : money(d.value)}</em>
          <span><i style={{ height: `${(d.value / max) * 100}%` }} /></span>
          <small>{d.label}</small>
        </div>
      ))}
    </div>
  );
}

/** Line chart scaled to its own min/max; `flags` marks point indexes as anomalies. */
export function Line({ values, flags = [], band }: { values: number[]; flags?: number[]; band?: [number, number] }) {
  const W = 600, H = 180, P = 10;
  const min = Math.min(...values, band?.[0] ?? Infinity), max = Math.max(...values, band?.[1] ?? -Infinity);
  const x = (i: number) => P + (i / (values.length - 1)) * (W - P * 2);
  const y = (v: number) => H - P - ((v - min) / (max - min || 1)) * (H - P * 2);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg className="dm-line" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {band && <rect x={P} y={y(band[1])} width={W - P * 2} height={Math.max(0, y(band[0]) - y(band[1]))} className="dm-band" />}
      <path d={`${d} L${x(values.length - 1)} ${H - P} L${x(0)} ${H - P} Z`} className="dm-area" />
      <path d={d} className="dm-stroke" vectorEffect="non-scaling-stroke" />
      {flags.map((i) => <circle key={i} cx={x(i)} cy={y(values[i])} r="5" className="dm-flag" />)}
    </svg>
  );
}
