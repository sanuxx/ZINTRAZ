"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import type { LucideIcon } from "lucide-react";
import { isLowPower, prefersReducedMotion } from "@/lib/device";

/**
 * The visitor's business as a small 3D floor plan: six areas (one per stage), an office holding the system core,
 * and an entrance. Every module switched on puts a live screen in the area it serves and wires it back to the core;
 * areas without a module stay grey and say "not connected". Add-ons go where they'd really live — the AI agent and
 * customer app at the entrance, accounts and payroll in the office, extra branches out back.
 */
export type Prop = "counter" | "kitchen" | "shelves" | "tables" | "desk" | "reception" | "waiting" | "consult" | "classroom" | "bed" | "racks" | "boxes" | "van";
export type Spot = "entrance" | "office" | "wall" | "branch";
export type Zone = { key: string; name: string; Icon: LucideIcon; prop: Prop; on: boolean };
export type Extra = { key: string; name: string; Icon: LucideIcon; spot: Spot; at: [number, number] };

const CW = 2.3, CD = 2.3, ZONE_CELLS = [0, 1, 2, 4, 5, 6], OFFICE = 3, ENTRANCE = 7;
const cell = (c: number): [number, number] => [((c % 4) - 1.5) * CW, (Math.floor(c / 4) - 0.5) * CD];
const [OX, OZ] = cell(OFFICE), [EX, EZ] = cell(ENTRANCE);
const CORE: [number, number] = [OX + 0.7, OZ - 0.42];
const BRANCH: [number, number] = [-0.6, -CD - 1.6];
const C = { white: "#ffffff", wall: "#edf1f8", wood: "#e6d8c4", metal: "#cbd4e4", dark: "#2b3a5c", soft: "#d3def3", green: "#8cc49a", box: "#d8b98d", blue: "#0b5cff" };

function B({ p, s, c, o }: { p: [number, number, number]; s: [number, number, number]; c: string; o?: number }) {
  return <mesh position={p}><boxGeometry args={s} /><meshStandardMaterial color={c} roughness={0.6} transparent={o !== undefined} opacity={o ?? 1} /></mesh>;
}
function Cyl({ p, r, h, c, rx = 0 }: { p: [number, number, number]; r: number; h: number; c: string; rx?: number }) {
  return <mesh position={p} rotation-x={rx}><cylinderGeometry args={[r, r, h, 24]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh>;
}
function Plant({ x, z }: { x: number; z: number }) {
  return <group position={[x, 0, z]}><Cyl p={[0, 0.11, 0]} r={0.11} h={0.22} c={C.white} /><mesh position-y={0.38}><sphereGeometry args={[0.19, 16, 12]} /><meshStandardMaterial color={C.green} roughness={0.8} /></mesh></group>;
}
function Chair({ x, z, ry = 0, c = C.white }: { x: number; z: number; ry?: number; c?: string }) {
  return <group position={[x, 0, z]} rotation-y={ry}><B p={[0, 0.11, 0]} s={[0.18, 0.22, 0.18]} c={c} /><B p={[0, 0.27, -0.08]} s={[0.18, 0.22, 0.03]} c={c} /></group>;
}

// Furniture for each kind of area, built from simple blocks; kept clear of the back-left corner where the screen stands.
function PropModel({ type }: { type: Prop }) {
  switch (type) {
    case "counter": return (<group>
      <B p={[0.2, 0.22, 0.1]} s={[1.3, 0.44, 0.42]} c={C.white} /><B p={[0.2, 0.455, 0.1]} s={[1.38, 0.03, 0.5]} c={C.dark} />
      <B p={[-0.15, 0.53, 0.05]} s={[0.24, 0.13, 0.2]} c={C.metal} /><Cyl p={[0, 0.15, 0.6]} r={0.09} h={0.3} c={C.dark} /><Cyl p={[0.45, 0.15, 0.6]} r={0.09} h={0.3} c={C.dark} />
    </group>);
    case "kitchen": return (<group>
      <B p={[0.25, 0.22, -0.35]} s={[1.4, 0.44, 0.5]} c={C.metal} /><Cyl p={[-0.05, 0.51, -0.35]} r={0.12} h={0.14} c={C.dark} /><Cyl p={[0.45, 0.51, -0.35]} r={0.12} h={0.14} c={C.dark} />
      <B p={[0.25, 0.2, 0.45]} s={[1.0, 0.4, 0.45]} c={C.white} /><B p={[0.25, 0.41, 0.45]} s={[1.04, 0.02, 0.48]} c={C.metal} />
    </group>);
    case "shelves": return (<group>
      {[-0.3, 0.5].map((z) => (<group key={z} position={[0.2, 0, z]}>
        <B p={[0, 0.43, 0]} s={[1.4, 0.86, 0.32]} c="#e3e8f2" />
        {[0.28, 0.62].flatMap((y) => [-0.48, -0.16, 0.16, 0.48].map((x, i) => <B key={`${y}${x}`} p={[x, y, 0.17]} s={[0.26, 0.2, 0.04]} c={["#9fb3d9", "#f2c46d", "#e7a4a4", "#a8d5b4"][(i + (y > 0.5 ? 1 : 0)) % 4]} />))}
      </group>))}
    </group>);
    case "tables": return (<group>
      {[[0, 0.35], [0.65, -0.3]].map(([x, z]) => (<group key={x} position={[x, 0, z]}>
        <Cyl p={[0, 0.4, 0]} r={0.3} h={0.04} c={C.wood} /><Cyl p={[0, 0.2, 0]} r={0.04} h={0.38} c={C.metal} />
        {[0, 1, 2, 3].map((i) => <Chair key={i} x={Math.sin((i * Math.PI) / 2) * 0.44} z={Math.cos((i * Math.PI) / 2) * 0.44} ry={(i * Math.PI) / 2 + Math.PI} />)}
      </group>))}
    </group>);
    case "desk": return (<group>
      <B p={[0.25, 0.2, 0.1]} s={[1.0, 0.4, 0.5]} c={C.white} /><B p={[0.25, 0.57, -0.04]} s={[0.44, 0.28, 0.03]} c={C.dark} />
      <B p={[0.25, 0.43, -0.04]} s={[0.06, 0.06, 0.06]} c={C.metal} /><Chair x={0.25} z={0.6} ry={Math.PI} c="#5d6b8a" /><Plant x={0.9} z={0.75} />
    </group>);
    case "reception": return (<group>
      <B p={[0.2, 0.24, 0.05]} s={[1.4, 0.48, 0.38]} c={C.white} /><B p={[0.2, 0.33, 0.245]} s={[1.4, 0.07, 0.01]} c={C.blue} />
      <B p={[0.86, 0.24, -0.35]} s={[0.36, 0.48, 0.6]} c={C.white} /><Plant x={-0.35} z={0.65} />
    </group>);
    case "waiting": return (<group>
      {[-0.15, 0.25, 0.65].map((x) => <Chair key={x} x={x} z={0.45} ry={Math.PI} c={C.soft} />)}
      <B p={[0.25, 0.12, -0.15]} s={[0.7, 0.24, 0.35]} c={C.wood} /><Plant x={0.95} z={-0.45} />
    </group>);
    case "consult": return (<group>
      <B p={[-0.05, 0.2, 0.5]} s={[0.8, 0.4, 0.4]} c={C.white} /><B p={[0.55, 0.18, -0.2]} s={[0.5, 0.32, 1.0]} c={C.white} />
      <B p={[0.55, 0.35, -0.2]} s={[0.52, 0.03, 1.02]} c="#dbe8ff" /><B p={[0.55, 0.4, -0.6]} s={[0.36, 0.07, 0.18]} c={C.soft} />
    </group>);
    case "classroom": return (<group>
      <B p={[0.25, 0.6, -0.95]} s={[1.3, 0.55, 0.04]} c="#2f4a3f" />
      {[-0.25, 0.25, 0.75].flatMap((x) => [0.05, 0.6].map((z) => <group key={`${x}${z}`}><B p={[x, 0.14, z]} s={[0.32, 0.28, 0.24]} c={C.wood} /><Chair x={x} z={z + 0.25} ry={Math.PI} c={C.soft} /></group>))}
    </group>);
    case "bed": return (<group>
      <B p={[0.25, 0.16, 0.1]} s={[0.9, 0.32, 1.2]} c={C.white} /><B p={[0.25, 0.335, 0.25]} s={[0.92, 0.04, 0.86]} c="#dbe8ff" />
      <B p={[0.05, 0.37, -0.35]} s={[0.32, 0.08, 0.18]} c={C.white} /><B p={[0.45, 0.37, -0.35]} s={[0.32, 0.08, 0.18]} c={C.white} />
      <B p={[0.25, 0.4, -0.52]} s={[0.96, 0.5, 0.06]} c={C.wood} /><B p={[0.88, 0.15, -0.4]} s={[0.25, 0.3, 0.25]} c={C.wood} />
    </group>);
    case "racks": return (<group>
      {[-0.3, 0.5].map((z) => (<group key={z} position={[0.25, 0, z]}>
        {[0.05, 0.45, 0.85].map((y) => <B key={y} p={[0, y, 0]} s={[1.5, 0.04, 0.38]} c={C.metal} />)}
        {[-0.72, 0.72].flatMap((x) => [-0.17, 0.17].map((zz) => <Cyl key={`${x}${zz}`} p={[x, 0.5, zz]} r={0.025} h={1.0} c={C.dark} />))}
        {[[-0.45, 0.22], [0.05, 0.22], [0.5, 0.62], [-0.45, 0.62]].map(([x, y]) => <B key={`${x}${y}`} p={[x, y, 0]} s={[0.4, 0.3, 0.3]} c={C.box} />)}
      </group>))}
    </group>);
    case "boxes": return (<group>
      <B p={[0.25, 0.05, 0.15]} s={[1.0, 0.1, 0.8]} c={C.wood} />
      {[-0.0, 0.48].flatMap((x) => [-0.05, 0.35].flatMap((z) => [0.26, 0.6].map((y) => (y > 0.5 && x > 0.3 && z > 0.2 ? null : <B key={`${x}${z}${y}`} p={[x + 0.02, y, z]} s={[0.44, 0.32, 0.36]} c={C.box} />))))}
    </group>);
    case "van": return (<group position={[-0.05, 0, 0.25]}>
      <B p={[0.0, 0.43, 0]} s={[1.2, 0.6, 0.6]} c={C.white} /><B p={[0.78, 0.35, 0]} s={[0.36, 0.44, 0.58]} c={C.white} />
      <B p={[0.965, 0.45, 0]} s={[0.02, 0.2, 0.5]} c="#7aa7ff" /><B p={[0, 0.45, 0.305]} s={[1.18, 0.08, 0.01]} c={C.blue} />
      {[-0.35, 0.7].flatMap((x) => [-0.29, 0.29].map((z) => <Cyl key={`${x}${z}`} p={[x, 0.13, z]} r={0.13} h={0.1} c={C.dark} rx={Math.PI / 2} />))}
    </group>);
  }
}

// One shared "app on a screen" texture: a little dashboard in the brand blue.
function useScreenTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 160;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 256, 160);
    grad.addColorStop(0, "#0b3fd0"); grad.addColorStop(1, "#4f46e5");
    g.fillStyle = grad; g.fillRect(0, 0, 256, 160);
    g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(0, 0, 56, 160);
    g.fillStyle = "rgba(255,255,255,.9)"; [24, 44, 64, 84].forEach((y) => g.fillRect(12, y, 32, 6));
    g.fillStyle = "rgba(255,255,255,.95)"; g.fillRect(70, 18, 70, 10);
    g.fillStyle = "rgba(255,255,255,.22)"; g.fillRect(70, 40, 80, 44); g.fillRect(160, 40, 80, 44); g.fillRect(70, 94, 170, 52);
    g.fillStyle = "#5fe3ff"; [30, 52, 40, 64, 48, 72, 58].forEach((h, i) => g.fillRect(80 + i * 22, 140 - h * 0.6, 12, h * 0.6));
    g.fillStyle = "#ffffff"; g.fillRect(80, 54, 40, 14); g.fillRect(170, 54, 34, 14);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function usePop(still: boolean) {
  const g = useRef<THREE.Group>(null), s = useRef<number | null>(null), v = useRef(0);
  useFrame((_, dt) => {
    if (s.current === null) s.current = still ? 1 : 0;
    const d = Math.min(dt, 1 / 30);
    v.current += ((1 - s.current) * 170 - v.current * 13) * d;
    s.current += v.current * d;
    g.current!.scale.setScalar(Math.max(0.001, s.current));
  });
  return g;
}

function Screen({ x, z, label, Icon, add, focus, still, tex, wall = false }: { x: number; z: number; label: string; Icon: LucideIcon; add: boolean; focus: boolean; still: boolean; tex: THREE.Texture; wall?: boolean }) {
  const g = usePop(still);
  const frame = add ? "#5b21b6" : C.dark;
  return (
    <group position={[x, 0, z]}>
      <group ref={g}>
        {!wall && <><Cyl p={[0, 0.015, 0]} r={0.14} h={0.03} c={C.metal} /><Cyl p={[0, 0.34, 0]} r={0.03} h={0.66} c={C.metal} /></>}
        <group position-y={wall ? 0.95 : 0.8} rotation-y={wall ? 0 : Math.PI / 4} scale={wall ? 1.7 : 1}>
          <B p={[0, 0, 0]} s={[0.64, 0.42, 0.04]} c={frame} />
          <mesh position-z={0.021}><planeGeometry args={[0.58, 0.36]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
        </group>
        <Html position={[0, wall ? 1.55 : 1.3, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className={`pm-tag${add ? " is-add" : ""}${focus ? " is-focus" : ""}`}><Icon size={13} strokeWidth={2.2} />{label}</div>
        </Html>
      </group>
    </group>
  );
}

// A cable back to the core, run along the central aisle; data pulses travel along it.
function Wire({ pts, add, still, seed }: { pts: [number, number][]; add: boolean; still: boolean; seed: number }) {
  const segs = useMemo(() => pts.slice(1).map((b, i) => {
    const a = pts[i], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return { a, b, len, mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as const, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  }), [pts]);
  const total = segs.reduce((s, x) => s + x.len, 0);
  const pulse = useRef<THREE.Mesh>(null), grow = useRef<THREE.Group>(null), k = useRef(still ? 1 : 0);
  useFrame((state, dt) => {
    k.current = Math.min(1, k.current + dt * 1.6);
    grow.current!.scale.y = k.current;
    let d = ((state.clock.elapsedTime * 1.1 + seed * 0.37) % (total / 1.1 + 0.6)) * 1.1;
    const p = pulse.current!;
    p.visible = !still && k.current >= 1 && d <= total;
    for (const s of segs) {
      if (d <= s.len) { const t = d / s.len; p.position.set(s.a[0] + (s.b[0] - s.a[0]) * t, 0.07, s.a[1] + (s.b[1] - s.a[1]) * t); break; }
      d -= s.len;
    }
  });
  const color = add ? "#7c3aed" : C.blue;
  return (
    <group>
      <group ref={grow}>
        {segs.map((s, i) => (
          <mesh key={i} position={[s.mid[0], 0.025, s.mid[1]]} rotation-y={-s.ang}><boxGeometry args={[s.len + 0.04, 0.025, 0.04]} /><meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} /></mesh>
        ))}
      </group>
      <mesh ref={pulse}><sphereGeometry args={[0.06, 12, 10]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    </group>
  );
}

function Core({ still }: { still: boolean }) {
  const ring = useRef<THREE.Mesh>(null), mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    if (still) return;
    const t = (state.clock.elapsedTime * 0.6) % 1;
    ring.current!.scale.setScalar(1 + t * 1.6);
    mat.current!.opacity = (1 - t) * 0.5;
  });
  return (
    <group position={[CORE[0], 0, CORE[1] - 0.25]}>
      <B p={[0, 0.55, 0]} s={[0.42, 1.1, 0.42]} c={C.dark} />
      {[0.35, 0.55, 0.75, 0.95].map((y) => <mesh key={y} position={[0, y, 0.215]}><boxGeometry args={[0.3, 0.03, 0.01]} /><meshBasicMaterial color="#5fe3ff" toneMapped={false} /></mesh>)}
      <Html position={[0, 1.45, 0]} center zIndexRange={[21, 0]} style={{ pointerEvents: "none" }}><div className="pm-core">System core</div></Html>
      <mesh ref={ring} position-y={0.02} rotation-x={-Math.PI / 2}><ringGeometry args={[0.32, 0.37, 48]} /><meshBasicMaterial ref={mat} color="#4d8dff" transparent opacity={0} depthWrite={false} toneMapped={false} /></mesh>
    </group>
  );
}

// Zone screens stand in the back-left corner of their area; their cables drop to the central aisle and run to the core.
const screenAt = (i: number): [number, number] => { const [x, z] = cell(ZONE_CELLS[i]); return [x - 0.72, z - 0.72]; };
const route = ([x, z]: [number, number]): [number, number][] => [[x, z], [x, 0], [CORE[0], 0], [CORE[0], CORE[1]]];
const extraAt = (e: Extra): [number, number] => {
  if (e.spot === "branch") return [BRANCH[0] + e.at[0], BRANCH[1] + e.at[1]];
  const [x, z] = e.spot === "entrance" ? [EX, EZ] : [OX, OZ];
  return [x + e.at[0], z + e.at[1]];
};

function Floor({ zones, focus }: { zones: Zone[]; focus: string | null }) {
  return (
    <group>
      <B p={[0, -0.1, 0]} s={[4 * CW + 0.3, 0.2, 2 * CD + 0.3]} c="#f6f8fc" />
      {Array.from({ length: 8 }, (_, c) => {
        const [x, z] = cell(c), zi = ZONE_CELLS.indexOf(c), on = zi < 0 || zones[zi].on;
        const tint = c === OFFICE ? "#e6eeff" : zi < 0 ? "#ffffff" : on ? (focus === zones[zi].key ? "#d4e2ff" : "#eaf1ff") : "#eef0f4";
        return <B key={c} p={[x, 0.006, z]} s={[CW - 0.07, 0.012, CD - 0.07]} c={tint} />;
      })}
      <B p={[0, 0.3, -CD - 0.09]} s={[4 * CW + 0.3, 0.6, 0.12]} c={C.wall} />
      <B p={[-2 * CW - 0.09, 0.3, 0]} s={[0.12, 0.6, 2 * CD + 0.3]} c={C.wall} />
      {[0.85, 1.45].map((z) => <B key={z} p={[2 * CW + 0.03, 0.35, z]} s={[0.04, 0.7, 0.5]} c="#a9c4ff" o={0.5} />)}
    </group>
  );
}

function Rig({ still }: { still: boolean }) {
  const { camera, size } = useThree();
  useFrame((state) => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height, half = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const r = Math.max(5.75 / (half * aspect), 3.8 / half);
    const az = Math.PI / 4 + (still ? 0 : Math.sin(state.clock.elapsedTime * 0.25) * 0.1), pol = 0.86;
    camera.position.set(r * Math.sin(pol) * Math.sin(az), -0.6 + r * Math.cos(pol), -0.6 + r * Math.sin(pol) * Math.cos(az));
    camera.lookAt(0, -0.6, -0.6);
  });
  return null;
}

function Scene({ zones, extras, focus, still }: { zones: Zone[]; extras: Extra[]; focus: string | null; still: boolean }) {
  const tex = useScreenTexture();
  const branch = extras.some((e) => e.spot === "branch");
  return (
    <>
      <Floor zones={zones} focus={focus} />
      {zones.map((z, i) => {
        const [x, zz] = cell(ZONE_CELLS[i]);
        return (
          <group key={`${z.key}-area`}>
            <group position={[x, 0, zz]}><PropModel type={z.prop} /></group>
            {!z.on && (
              <Html position={[x, 0.08, zz + 0.2]} center zIndexRange={[19, 0]} style={{ pointerEvents: "none" }}>
                <div className="pm-zone"><z.Icon size={12} />{z.name}<small>not connected</small></div>
              </Html>
            )}
          </group>
        );
      })}
      <group position={[OX, 0, OZ]}><B p={[-0.35, 0.2, -0.45]} s={[1.0, 0.4, 0.5]} c={C.white} /><Chair x={-0.35} z={0.05} ry={Math.PI} c="#5d6b8a" /></group>
      <Plant x={EX + 0.8} z={EZ - 0.8} />
      <Html position={[EX + 0.3, 0.08, EZ + 0.55]} center zIndexRange={[19, 0]} style={{ pointerEvents: "none" }}><div className="pm-zone">Entrance</div></Html>
      <Core still={still} />

      {zones.map((z, i) => z.on && (
        <group key={z.key}>
          <Screen x={screenAt(i)[0]} z={screenAt(i)[1]} label={z.name} Icon={z.Icon} add={false} focus={focus === z.key} still={still} tex={tex} />
          <Wire pts={route(screenAt(i))} add={false} still={still} seed={i} />
        </group>
      ))}

      {branch && (
        <group position={[BRANCH[0], 0, BRANCH[1]]}>
          <B p={[0, -0.06, 0]} s={[2.0, 0.12, 1.3]} c="#f6f8fc" />
          <B p={[0.45, 0.35, -0.2]} s={[0.8, 0.7, 0.6]} c={C.white} /><B p={[0.45, 0.72, -0.2]} s={[0.86, 0.05, 0.66]} c={C.blue} />
        </group>
      )}
      {extras.map((e, i) => {
        const at = extraAt(e);
        const pts: [number, number][] = e.spot === "office" || e.spot === "wall" ? [at, [CORE[0], at[1]], CORE] : e.spot === "branch" ? [at, [CORE[0], at[1]], CORE] : route(at);
        return (
          <group key={e.key}>
            <Screen x={at[0]} z={at[1]} label={e.name} Icon={e.Icon} add focus={focus === e.key} still={still} tex={tex} wall={e.spot === "wall"} />
            <Wire pts={pts} add still={still} seed={i + 7} />
          </group>
        );
      })}
    </>
  );
}

export default function Premises({ zones, extras, focus }: { zones: Zone[]; extras: Extra[]; focus: string | null }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [webgl] = useState(() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } });
  const [low] = useState(isLowPower);
  const [still] = useState(prefersReducedMotion);
  // If the browser drops the WebGL context (memory pressure, GPU reset), remount the scene once it's back.
  const [gen, setGen] = useState(0);
  const onCreated = ({ gl }: { gl: THREE.WebGLRenderer }) => {
    gl.domElement.addEventListener("webglcontextrestored", () => setGen((g) => g + 1), { once: true });
  };
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="pm3">
      {webgl && (
        <Canvas key={gen} onCreated={onCreated} flat dpr={low ? [1, 1.25] : [1, 2]} frameloop={visible ? "always" : "never"}
          camera={{ fov: 26, near: 0.1, far: 120, position: [14, 12, 14] }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={1.0} />
          <hemisphereLight args={["#ffffff", "#b8c6e6", 0.85]} />
          <directionalLight position={[6, 10, 5]} intensity={1.45} />
          <Scene zones={zones} extras={extras} focus={focus} still={still} />
          <ContactShadows position-y={-0.21} scale={16} blur={2.6} far={3} opacity={0.3} resolution={low ? 256 : 512} color="#1b2a5a" />
          <Rig still={still} />
        </Canvas>
      )}
    </div>
  );
}
