"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { isLowPower, prefersReducedMotion } from "@/lib/device";

// Driven from outside by GSAP; each value runs 0 → 1. mx/my: pointer in -0.5..0.5.
export type AssemblyState = { fly: number; build: number; pulse: number; orbit: number; mx: number; my: number };

// Three tiers, widest at the base: business, engineering, intelligence.
export const TIERS = [
  { n: 10, y: -1.7, color: "#f4f1ea", glow: "#5b8cff" },
  { n: 8, y: 0, color: "#eef3ff", glow: "#0b5cff" },
  { n: 6, y: 1.7, color: "#f4f0ff", glow: "#7c3aed" },
];
const PITCH = 1.04, TILE = 0.92, THICK = 0.3;
const ACCENTS = ["#0b5cff", "#7c3aed", "#0891b2"];

type Tile = { target: THREE.Vector3; scatter: THREE.Vector3; spin: THREE.Vector3; delay: number; base: THREE.Color; tier: number; phase: number };

// Seeded, so the debris field is the same on every visit (and on server and client).
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTiles(): Tile[] {
  const rnd = mulberry32(7);
  const tiles: Tile[] = [];
  TIERS.forEach((L, tier) => {
    for (let gx = 0; gx < L.n; gx++) for (let gz = 0; gz < L.n; gz++) {
      // Debris sits on a shell around the centre, which keeps the headline area open.
      const r = 6 + rnd() * 9, th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1);
      const scatter = new THREE.Vector3(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.6, r * Math.sin(ph) * Math.sin(th));
      // Keep a clear corridor along the camera's path so nothing blocks the headline up close.
      if (scatter.z > 1 && Math.abs(scatter.x) < 5.5 && Math.abs(scatter.y) < 3.5) scatter.x += Math.sign(scatter.x || 1) * 5.5;
      tiles.push({
        target: new THREE.Vector3((gx - (L.n - 1) / 2) * PITCH, L.y, (gz - (L.n - 1) / 2) * PITCH),
        scatter,
        spin: new THREE.Vector3(rnd() * 6 - 3, rnd() * 6 - 3, rnd() * 6 - 3),
        // Built from the ground up, sweeping across each tier.
        delay: tier * 0.28 + ((gx + gz) / (2 * L.n)) * 0.25 + rnd() * 0.05,
        base: new THREE.Color(rnd() < (tier === 1 ? 0.18 : 0.1) ? ACCENTS[Math.floor(rnd() * 3)] : L.color),
        tier, phase: rnd() * Math.PI * 2,
      });
    }
  });
  return tiles;
}

// Per-frame scratch objects, reused so the render loop allocates nothing.
const tmp = {
  o: new THREE.Object3D(), c: new THREE.Color(), p: new THREE.Vector3(), q: new THREE.Vector3(), cam: new THREE.Vector3(),
  fly0: new THREE.Vector3(0, 0.6, 18), fly1: new THREE.Vector3(0.4, 0.2, 5.5), built: new THREE.Vector3(10, 7.5, 12),
  glow: TIERS.map((t) => new THREE.Color(t.glow)), mouse: { x: 0, y: 0 },
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Tiles({ state, labels }: { state: React.RefObject<AssemblyState>; labels: React.RefObject<(HTMLElement | null)[]> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const tiles = useMemo(() => buildTiles(), []);
  const geo = useMemo(() => new RoundedBoxGeometry(TILE, THICK, TILE, 3, 0.08), []);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.3, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.2 }), []);

  useLayoutEffect(() => {
    tiles.forEach((t, i) => mesh.current!.setColorAt(i, t.base));
  }, [tiles]);

  useFrame(({ clock, camera, size }) => {
    const s = state.current, time = clock.elapsedTime, m = mesh.current!;
    const portrait = size.width < size.height;
    const cam = camera as THREE.PerspectiveCamera;
    const fov = portrait ? 50 : 35;
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }

    // Camera: fly into the debris, crane up to a three-quarter view of the build, then orbit it.
    tmp.mouse.x += (s.mx - tmp.mouse.x) * 0.05;
    tmp.mouse.y += (s.my - tmp.mouse.y) * 0.05;
    const b = smooth(s.build * 1.15);
    tmp.cam.copy(tmp.fly0).lerp(tmp.fly1, easeInOutCubic(clamp01(s.fly))).lerp(tmp.built, b);
    tmp.cam.applyAxisAngle(THREE.Object3D.DEFAULT_UP, s.orbit * 0.8).multiplyScalar((1 + s.orbit * 0.08) * (portrait ? 1.85 : 1));
    tmp.cam.x += tmp.mouse.x * 0.9;
    tmp.cam.y -= tmp.mouse.y * 0.6;
    camera.position.copy(tmp.cam);
    // Aim above the model on wide screens so it sits in the lower part of the frame, clear of the copy.
    camera.lookAt(0, b * (portrait ? 0.15 : 1.9), 0);

    // Tiles: drift and tumble as debris, then fly home and lock into their tier.
    const waveY = -2.9 + s.pulse * 5.9;
    const pulsing = s.pulse > 0 && s.pulse < 1;
    tiles.forEach((t, i) => {
      const e = easeInOutCubic(clamp01((s.build * 1.6 - t.delay) / 0.5)), loose = 1 - e;
      tmp.p.copy(t.scatter);
      tmp.p.y += Math.sin(time * 0.4 + t.phase) * 0.35;
      tmp.p.lerp(t.target, e);
      tmp.o.position.copy(tmp.p);
      tmp.o.rotation.set((t.spin.x + time * 0.25) * loose, (t.spin.y + time * 0.2) * loose, t.spin.z * loose);
      tmp.o.updateMatrix();
      m.setMatrixAt(i, tmp.o.matrix);

      // The pulse lights each tile as it passes, and leaves the top tier glowing.
      const g = pulsing ? Math.exp(-((t.target.y - waveY) ** 2) / 0.35) : 0;
      const passed = smooth((waveY - t.target.y + 0.3) / 0.6);
      tmp.c.copy(t.base).lerp(tmp.glow[t.tier], Math.min(1, passed * (t.tier === 2 ? 0.55 : 0.18) + g * 0.9));
      m.setColorAt(i, tmp.c);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    light.current!.position.set(0, waveY, 0);
    light.current!.intensity = pulsing ? 40 : 0;

    // Tier labels follow the right-hand edge of each tier on screen.
    labels.current?.forEach((el, k) => {
      if (!el) return;
      tmp.q.set((TIERS[k].n * PITCH) / 2 + 0.5, TIERS[k].y, 0).project(camera);
      const x = Math.min(((tmp.q.x + 1) / 2) * size.width, size.width - el.offsetWidth - 20);
      el.style.transform = `translate(${x}px, ${((1 - tmp.q.y) / 2) * size.height}px)`;
      el.style.visibility = tmp.q.z < 1 ? "visible" : "hidden";
    });
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[geo, mat, tiles.length]} />
      <pointLight ref={light} color="#8b7bff" distance={9} decay={1.5} intensity={0} />
    </>
  );
}

export default function SystemScene({ state, labels }: { state: React.RefObject<AssemblyState>; labels: React.RefObject<(HTMLElement | null)[]> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [low] = useState(isLowPower);
  const [still] = useState(prefersReducedMotion);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="ha-canvas">
      <Canvas
        dpr={low ? [1, 1.5] : [1, 2]}
        camera={{ fov: 35, position: [0, 0.6, 18], near: 0.1, far: 100 }}
        gl={{ antialias: !low, alpha: true }}
        frameloop={still ? "demand" : visible ? "always" : "never"}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 10, 6]} intensity={1.5} />
        {/* A studio built from light panels — generated in the scene, nothing downloaded. */}
        <Environment resolution={256}>
          <mesh scale={100}><sphereGeometry args={[1, 32, 16]} /><meshBasicMaterial color="#e6ecf8" side={THREE.BackSide} /></mesh>
          <Lightformer form="rect" intensity={2.4} position={[0, 7, -6]} scale={[14, 4, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#bcd0ff" position={[-9, 2, 4]} scale={[4, 9, 1]} />
          <Lightformer form="rect" intensity={1.1} color="#e2d6ff" position={[9, 1, 4]} scale={[4, 9, 1]} />
          <Lightformer form="circle" intensity={1.4} position={[0, -7, 0]} rotation-x={Math.PI / 2} scale={7} />
        </Environment>
        <Tiles state={state} labels={labels} />
      </Canvas>
    </div>
  );
}
