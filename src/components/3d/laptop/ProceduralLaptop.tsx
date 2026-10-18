"use client";

import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { Html } from "@react-three/drei";
import {
  BufferGeometry, CanvasTexture, CircleGeometry, CylinderGeometry, ExtrudeGeometry, InstancedMesh, MeshBasicMaterial,
  MeshStandardMaterial, Object3D, RepeatWrapping, Shape, ShapeGeometry, type Group,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { DEVICE3D } from "@/lib/device3d";

/**
 * A 14-inch class laptop, modelled procedurally (units: cm). Contract, so a GLB model could replace it:
 * renders the closed-form chassis with the base's top surface at y = 0 and its back edge at z = 0,
 * forwards a ref to the lid group (pivot on the hinge axis; rotation.x opens/closes it), and mounts
 * `screen` (live DOM) on the display with <Html transform>.
 *
 * - Chassis and lid: rounded-rectangle profiles extruded with a multi-segment bevel, so the edges roll
 *   off softly like machined aluminium rather than meeting at box corners.
 * - Keyboard: a full Mac layout (function row, wide modifiers, inverted-T arrows) of rounded keycaps,
 *   one InstancedMesh per keycap size; a recessed dark well beneath.
 * - Trackpad with an edge line, speaker grilles either side of the keyboard (instanced perforations),
 *   ports on the left side (MagSafe, 2x USB-C, headphone jack), cylinder hinge, glass bezel + camera.
 */
const [SPX, SPY] = DEVICE3D.screenPx;
export const SCREEN_W = 28.8;
export const SCREEN_H = (SCREEN_W * SPY) / SPX; // 18.0, the display matches the content ratio exactly
const CHIN = 1.55, BROW = 0.95;
export const LID = { w: 31.2, h: SCREEN_H + CHIN + BROW, t: 0.46 };
export const BASE = { w: 31.2, d: 22, t: 1.0 };
const U = 1.8, GAP = 0.17; // key pitch and gap
const KB_BACK = 1.45; // keyboard starts this far in front of the hinge edge

/** Rounded rectangle centred on the origin. */
function rrect(w: number, h: number, r: number) {
  const s = new Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Deterministic PRNG for the brushed grain. */
function prng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function brushedTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const rnd = prng(11);
  g.fillStyle = "#8a8a8a";
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) {
    const y = rnd() * 512, a = 0.03 + rnd() * 0.06;
    g.strokeStyle = rnd() < 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    g.lineWidth = 0.4 + rnd() * 0.8;
    g.beginPath(); g.moveTo(0, y); g.lineTo(512, y + (rnd() - 0.5)); g.stroke();
  }
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(0.08, 0.6);
  t.anisotropy = 8;
  return t;
}

/** Mac layout, rows back to front; widths in key units ("ud" = stacked half-height up/down arrows). */
const ROWS: (number | "ud")[][] = [
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.7],
  [2.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2],
  [1, 1, 1, 1.25, 5, 1.25, 1, 1, "ud", 1],
];
const KB_W = 14.5 * U;
const KB_D = ROWS.length * U;

type Key = { x: number; z: number; w: number; d: number };
function layout(): Key[] {
  const keys: Key[] = [];
  ROWS.forEach((row, r) => {
    let x = -KB_W / 2;
    const zc = KB_BACK + U * (r + 0.5);
    row.forEach((k) => {
      if (k === "ud") {
        const h = (U - GAP) / 2 - GAP / 4;
        keys.push({ x: x + U / 2, z: zc - h / 2 - GAP / 4, w: U - GAP, d: h });
        keys.push({ x: x + U / 2, z: zc + h / 2 + GAP / 4, w: U - GAP, d: h });
        x += U;
        return;
      }
      keys.push({ x: x + (k * U) / 2, z: zc, w: k * U - GAP, d: U - GAP });
      x += k * U;
    });
  });
  return keys;
}

/** One InstancedMesh per keycap size (rounded corners stay round on wide keys). */
function Keycaps({ material }: { material: MeshStandardMaterial }) {
  const groups = useMemo(() => {
    const by = new Map<string, Key[]>();
    for (const k of layout()) {
      const id = `${k.w.toFixed(3)}x${k.d.toFixed(3)}`;
      by.set(id, [...(by.get(id) ?? []), k]);
    }
    return [...by.values()].map((keys) => ({ keys, geo: new RoundedBoxGeometry(keys[0].w, 0.13, keys[0].d, 2, 0.11) }));
  }, []);
  useEffect(() => () => groups.forEach((g) => g.geo.dispose()), [groups]);
  return <>{groups.map((g, i) => <KeyGroup key={i} keys={g.keys} geo={g.geo} material={material} />)}</>;
}

function KeyGroup({ keys, geo, material }: { keys: Key[]; geo: RoundedBoxGeometry; material: MeshStandardMaterial }) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new Object3D();
    keys.forEach((k, i) => { o.position.set(k.x, 0.025, k.z); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [keys]);
  return <instancedMesh ref={ref} args={[geo, material, keys.length]} />;
}

/** Speaker perforations: a dense grid of tiny dark dots either side of the keyboard. */
function Grilles({ material }: { material: MeshStandardMaterial }) {
  const ref = useRef<InstancedMesh>(null);
  const { geo, pts } = useMemo(() => {
    const pts: [number, number][] = [];
    const cols = 6, rows = 46, w = 1.3, xs = KB_W / 2 + (BASE.w / 2 - KB_W / 2) / 2;
    for (const side of [-1, 1]) for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      pts.push([side * xs + (c / (cols - 1) - 0.5) * w + (r % 2 ? 0.06 : 0), KB_BACK + 0.2 + (r / (rows - 1)) * (KB_D - 0.4)]);
    }
    return { geo: new CircleGeometry(0.05, 8), pts };
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new Object3D();
    o.rotation.x = -Math.PI / 2;
    pts.forEach(([x, z], i) => { o.position.set(x, 0.004, z); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [pts]);
  return <instancedMesh ref={ref} args={[geo, material, pts.length]} />;
}

const ProceduralLaptop = forwardRef<Group, { screen: ReactNode }>(function ProceduralLaptop({ screen }, lidRef) {
  const parts = useMemo(() => {
    const brushed = brushedTexture();
    // All MeshStandardMaterial: three.js compiles one shader program per distinct material *setup*
    // (colour, roughness and metalness are uniforms), so the plain parts below share one program and the
    // brushed aluminium adds one more. The MeshPhysicalMaterial versions (clearcoat, anisotropy) each
    // compiled their own, heavier program, which held the first frame for seconds on Windows/ANGLE.
    const alu = new MeshStandardMaterial({ color: "#cfd2d7", metalness: 1, roughness: 0.72, roughnessMap: brushed });
    // Restrained glass: a soft sheen rather than a sharp mirror of the studio walls.
    const glass = new MeshStandardMaterial({ color: "#040506", metalness: 0, roughness: 0.16, envMapIntensity: 0.3 });
    const keys = new MeshStandardMaterial({ color: "#111216", roughness: 0.72, metalness: 0 });
    const well = new MeshStandardMaterial({ color: "#08090b", roughness: 0.92 });
    const hinge = new MeshStandardMaterial({ color: "#2a2c31", metalness: 0.85, roughness: 0.38 });
    const dark = new MeshStandardMaterial({ color: "#050506", roughness: 0.55 });
    const dots = new MeshStandardMaterial({ color: "#16181c", roughness: 0.85 });
    const pad = new MeshStandardMaterial({ color: "#bfc3c9", metalness: 0.85, roughness: 0.4 });
    const padEdge = new MeshStandardMaterial({ color: "#8d9299", metalness: 0.8, roughness: 0.4 });
    const glow = new MeshBasicMaterial({ color: "#eef2f8", toneMapped: false });

    const bevel = 0.24;
    const base = new ExtrudeGeometry(rrect(BASE.w - 2 * bevel, BASE.d - 2 * bevel, 1.1), {
      depth: BASE.t - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 6, curveSegments: 28,
    });
    base.rotateX(-Math.PI / 2);
    base.translate(0, -(BASE.t - bevel), BASE.d / 2);

    const lb = 0.15;
    const lid = new ExtrudeGeometry(rrect(LID.w - 2 * lb, LID.h - 2 * lb, 1.0), {
      depth: LID.t - 2 * lb, bevelEnabled: true, bevelThickness: lb, bevelSize: lb, bevelSegments: 5, curveSegments: 28,
    });
    lid.translate(0, LID.h / 2, -(LID.t - lb));

    const bezel = new ShapeGeometry(rrect(LID.w - 0.34, LID.h - 0.34, 0.85), 24);
    bezel.translate(0, LID.h / 2, 0.003);
    const wellGeo = new ShapeGeometry(rrect(KB_W + 0.5, KB_D + 0.45, 0.35), 12);
    wellGeo.rotateX(-Math.PI / 2);
    wellGeo.translate(0, 0.002, KB_BACK + KB_D / 2);
    const padGeo = new ShapeGeometry(rrect(14.6, 7.6, 0.55), 16);
    padGeo.rotateX(-Math.PI / 2);
    padGeo.translate(0, 0.0035, KB_BACK + KB_D + 0.95 + 3.8);
    const padEdgeGeo = new ShapeGeometry(rrect(14.72, 7.72, 0.6), 16);
    padEdgeGeo.rotateX(-Math.PI / 2);
    padEdgeGeo.translate(0, 0.0025, KB_BACK + KB_D + 0.95 + 3.8);
    const hingeGeo = new CylinderGeometry(0.42, 0.42, BASE.w - 7, 32);
    hingeGeo.rotateZ(Math.PI / 2);

    // Left-side ports, facing -x, centred on the straight part of the side wall.
    const ports: BufferGeometry[] = [
      { w: 1.55, h: 0.3, z: 3.2 }, { w: 0.85, h: 0.28, z: 5.6 }, { w: 0.85, h: 0.28, z: 7.1 },
    ].map(({ w, h, z }) => {
      const g = new ShapeGeometry(rrect(w, h, h / 2), 10);
      g.rotateY(-Math.PI / 2);
      g.translate(-BASE.w / 2 - 0.004, -BASE.t / 2, z);
      return g;
    });
    const jack = new CircleGeometry(0.17, 20);
    jack.rotateY(-Math.PI / 2);
    jack.translate(-BASE.w / 2 - 0.004, -BASE.t / 2, 9.4);
    ports.push(jack);

    const cam = new CircleGeometry(0.07, 20);
    cam.translate(0, LID.h - BROW / 2, 0.006);
    const screenGlow = new ShapeGeometry(rrect(SCREEN_W, SCREEN_H, 0.25), 8);
    screenGlow.translate(0, CHIN + SCREEN_H / 2, 0.005);

    return {
      mats: { alu, glass, keys, well, hinge, dark, dots, pad, padEdge, glow }, brushed,
      geos: { base, lid, bezel, wellGeo, padGeo, padEdgeGeo, hingeGeo, ports, cam, screenGlow },
    };
  }, []);

  useEffect(() => () => {
    Object.values(parts.mats).forEach((m) => m.dispose());
    const { ports, ...rest } = parts.geos;
    Object.values(rest).forEach((g) => g.dispose());
    ports.forEach((g) => g.dispose());
    parts.brushed.dispose();
  }, [parts]);

  const { mats, geos } = parts;
  return (
    <group>
      {/* Base */}
      <mesh geometry={geos.base} material={mats.alu} />
      <mesh geometry={geos.wellGeo} material={mats.well} />
      <Keycaps material={mats.keys} />
      <Grilles material={mats.dots} />
      <mesh geometry={geos.padEdgeGeo} material={mats.padEdge} />
      <mesh geometry={geos.padGeo} material={mats.pad} />
      {geos.ports.map((g, i) => <mesh key={i} geometry={g} material={mats.dark} />)}
      <mesh geometry={geos.hingeGeo} material={mats.hinge} position={[0, -0.12, 0.32]} />
      {/* Lid, pivoting on the hinge axis */}
      <group ref={lidRef} position={[0, -0.05, 0.36]} rotation-x={DEVICE3D.lid.open}>
        <mesh geometry={geos.lid} material={mats.alu} />
        <mesh geometry={geos.bezel} material={mats.glass} />
        <mesh geometry={geos.screenGlow} material={mats.glow} />
        <mesh geometry={geos.cam} material={mats.dark} />
        <Html transform distanceFactor={(SCREEN_W * 400) / SPX} position={[0, CHIN + SCREEN_H / 2, 0.012]} zIndexRange={[20, 0]} className="lap3-html">
          <div className="lap3-screen" style={{ width: SPX, height: SPY }}>{screen}</div>
        </Html>
      </group>
    </group>
  );
});

export default ProceduralLaptop;
