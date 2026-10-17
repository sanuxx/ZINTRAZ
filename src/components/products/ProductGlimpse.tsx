/**
 * A tiny line drawing of a product at work, in its accent colour (via `color` → currentColor): what it
 * does, not a logo. 160×100 viewBox; one subtle CSS-animated detail per glimpse (styles under
 * "Product glimpses" in globals.css). Decorative.
 */
const INK = "rgba(8,8,8,.14)";
const SOFT = "rgba(8,8,8,.06)";

function Rest() {
  return (
    <>
      {[0, 1, 2].flatMap((c) => [0, 1].map((r) => {
        const k = r * 3 + c;
        const cls = k === 4 ? "pg-pulse" : undefined;
        const fill = k === 0 || k === 4 ? "currentColor" : k === 2 ? "color-mix(in srgb, currentColor 30%, transparent)" : SOFT;
        return <rect key={k} className={cls} x={10 + c * 30} y={18 + r * 34} width="24" height="26" rx="6" fill={fill} stroke={INK} />;
      }))}
      <rect x="106" y="14" width="46" height="72" rx="7" fill="#fff" stroke={INK} />
      {[0, 1, 2, 3].map((i) => <rect key={i} className="pg-line" style={{ ["--i" as string]: i }} x="113" y={26 + i * 11} width={i === 3 ? 20 : 32} height="4" rx="2" fill={i === 3 ? "currentColor" : INK} />)}
    </>
  );
}

function Stay() {
  const occ = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1];
  return (
    <>
      {occ.map((o, i) => (
        <rect key={i} className={o ? "pg-fill" : undefined} style={{ ["--i" as string]: i }} x={12 + (i % 6) * 23} y={12 + Math.floor(i / 6) * 22} width="18" height="16" rx="4" fill={o ? "currentColor" : SOFT} stroke={INK} />
      ))}
      <rect x="12" y="82" width="136" height="6" rx="3" fill={SOFT} />
      <rect className="pg-bar" x="12" y="82" width="112" height="6" rx="3" fill="currentColor" />
    </>
  );
}

function Events() {
  return (
    <>
      <rect x="10" y="10" width="140" height="80" rx="8" fill="#fff" stroke={INK} />
      <rect x="54" y="16" width="52" height="10" rx="3" fill="currentColor" opacity=".85" />
      {[[34, 46], [64, 46], [94, 46], [124, 46], [34, 72], [64, 72], [94, 72], [124, 72]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="9" fill={i === 5 ? "currentColor" : SOFT} stroke={INK} className={i === 5 ? "pg-pulse" : undefined} />
          {[0, 1, 2, 3].map((k) => <circle key={k} cx={cx + 12 * Math.cos((k * Math.PI) / 2)} cy={cy + 12 * Math.sin((k * Math.PI) / 2)} r="2" fill={INK} />)}
        </g>
      ))}
    </>
  );
}

function Crm() {
  const cols = [3, 2, 2, 1];
  return (
    <>
      {cols.map((n, c) => (
        <g key={c}>
          <rect x={8 + c * 37} y="10" width="33" height="80" rx="6" fill={SOFT} />
          <rect x={14 + c * 37} y="15" width="16" height="3" rx="1.5" fill={INK} />
          {Array.from({ length: n }, (_, k) => <rect key={k} x={12 + c * 37} y={24 + k * 18} width="25" height="13" rx="3" fill="#fff" stroke={INK} />)}
        </g>
      ))}
      <rect className="pg-slide" x="12" y="78" width="25" height="13" rx="3" fill="currentColor" />
    </>
  );
}

function Iq() {
  const line = "M12 74 L36 66 L58 70 L80 50 L104 54 L126 30 L148 22";
  return (
    <>
      {[30, 52, 74].map((y) => <path key={y} d={`M12 ${y} H148`} stroke={SOFT} />)}
      <path d={`${line} L148 86 L12 86 Z`} fill="currentColor" opacity=".12" />
      <path className="pg-draw" d={line} pathLength={1} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="126" cy="30" r="4" fill="#fff" stroke="currentColor" strokeWidth="2" className="pg-pulse" />
    </>
  );
}

function Agent() {
  return (
    <>
      <rect x="10" y="12" width="92" height="20" rx="10" fill={SOFT} />
      <rect x="18" y="20" width="62" height="4" rx="2" fill={INK} />
      <rect className="pg-msg" x="52" y="40" width="98" height="20" rx="10" fill="currentColor" />
      <rect className="pg-msg" x="60" y="48" width="70" height="4" rx="2" fill="#fff" opacity=".85" />
      <g className="pg-done">
        <rect x="10" y="68" width="62" height="20" rx="10" fill="#fff" stroke="currentColor" />
        <path d="M20 78 l4 4 l8 -8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="38" y="76" width="26" height="4" rx="2" fill="currentColor" />
      </g>
    </>
  );
}

function Docs() {
  return (
    <>
      <rect x="36" y="6" width="88" height="88" rx="6" fill="#fff" stroke={INK} />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="46" y={18 + i * 11} width={[60, 44, 64, 38, 56, 30][i]} height="4" rx="2" fill={INK} />)}
      <rect x="42" y="25" width="58" height="10" rx="3" fill="currentColor" opacity=".18" stroke="currentColor" />
      <rect x="42" y="58" width="44" height="10" rx="3" fill="currentColor" opacity=".18" stroke="currentColor" />
      <rect className="pg-scan" x="36" y="6" width="88" height="3" fill="currentColor" opacity=".7" />
    </>
  );
}

function Analyst() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => {
        const flag = i === 1 || i === 3;
        return (
          <g key={i}>
            <rect x="12" y={10 + i * 17} width="136" height="13" rx="4" fill={flag ? "color-mix(in srgb, currentColor 10%, transparent)" : SOFT} />
            <rect x="20" y={15 + i * 17} width={[70, 52, 84, 46, 64][i]} height="3" rx="1.5" fill={INK} />
            {flag && <circle className="pg-pulse" cx="136" cy={16.5 + i * 17} r="3.5" fill="currentColor" />}
          </g>
        );
      })}
    </>
  );
}

function Decide() {
  const w = [118, 86, 64];
  return (
    <>
      {w.map((x, i) => (
        <g key={i}>
          <rect x="12" y={16 + i * 26} width="136" height="14" rx="7" fill={SOFT} />
          <rect className="pg-grow" style={{ ["--i" as string]: i }} x="12" y={16 + i * 26} width={x} height="14" rx="7" fill={i === 0 ? "currentColor" : "color-mix(in srgb, currentColor 30%, transparent)"} />
        </g>
      ))}
      <circle cx="138" cy="23" r="7" fill="#fff" />
      <path d="M134.5 23 l2.5 2.5 l4.5 -5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const scenes: Record<string, () => React.ReactElement> = {
  zynrest: Rest, zynstay: Stay, zynevents: Events, zyncrm: Crm, zyniq: Iq, zynagent: Agent, zyndocs: Docs, zynanalyst: Analyst, zyndecide: Decide,
};

export default function ProductGlimpse({ id, accent, className }: { id: string; accent: string; className?: string }) {
  const Scene = scenes[id];
  if (!Scene) return null;
  return (
    <svg className={`pg${className ? ` ${className}` : ""}`} viewBox="0 0 160 100" style={{ color: accent }} aria-hidden="true">
      <Scene />
    </svg>
  );
}
