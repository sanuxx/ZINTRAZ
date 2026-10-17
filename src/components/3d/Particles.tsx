"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { isLowPower, prefersReducedMotion } from "@/lib/device";
import { BASE_PATH } from "@/lib/site";

// m: shape morph 0..3 (process map → software panels → AI lattice → logo). a: assemble 0 (scattered
// burst) → 1 (formed). mx/my: pointer.
export type SwarmState = { m: number; mx: number; my: number; a: number };

// Shared between the WebGL scene and the HTML labels so both agree on where shapes sit.
export const CAMERA_Z = 6;
const VIEW_H = 2 * CAMERA_Z * Math.tan((45 / 2) * (Math.PI / 180));

export function swarmLayout(aspect: number, m: number) {
  const viewW = VIEW_H * aspect;
  const scale = Math.min(0.78, viewW / 5.8);
  const final = Math.min(Math.max(m - 2, 0), 1);
  const wide = aspect > 1.15;
  const offX = wide ? viewW * 0.2 * (1 - final) : 0;
  const offY = wide ? 0 : VIEW_H * (0.17 - 0.07 * final);
  return { viewW, viewH: VIEW_H, scale, offX, offY };
}

function prng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildShapes(n: number) {
  const r = prng(7);
  const s0 = new Float32Array(n * 3), s1 = new Float32Array(n * 3), s2 = new Float32Array(n * 3);
  const rand = new Float32Array(n);
  const v = new THREE.Vector3();
  const put = (arr: Float32Array, i: number, p: THREE.Vector3) => { arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z; };

  // Samples a point on the perimeter of an axis-aligned rectangle; t runs 0..1 around it.
  const perim = (cx: number, cy: number, w: number, h: number, t: number): [number, number] => {
    let d = t * 2 * (w + h);
    if (d < w) return [cx - w / 2 + d, cy + h / 2];
    d -= w;
    if (d < h) return [cx + w / 2, cy + h / 2 - d];
    d -= h;
    if (d < w) return [cx + w / 2 - d, cy - h / 2];
    d -= w;
    return [cx - w / 2, cy - h / 2 + d];
  };

  // 0 — Business analysis & design: the operation charted. Boxes sit in three lanes, wired left to
  // right, with elbows stepping between them — a process map, drawn before anything gets built.
  const BW = 0.74, BH = 0.42;
  const lane = [1.18, 0, -1.18];
  const col = [-2.0, -0.68, 0.64, 1.96];
  const boxes: [number, number][] = [
    [col[0], lane[0]], [col[1], lane[0]], [col[2], lane[0]],
    [col[0], lane[1]], [col[1], lane[1]], [col[2], lane[1]], [col[3], lane[1]],
    [col[1], lane[2]], [col[2], lane[2]], [col[3], lane[2]],
  ];
  const wires: [number, number, number, number][] = [];
  const wire = (x0: number, y0: number, x1: number, y1: number) => wires.push([x0, y0, x1, y1]);
  ([[0, 0, 1], [0, 1, 2], [1, 0, 1], [1, 1, 2], [1, 2, 3], [2, 1, 2], [2, 2, 3]] as [number, number, number][])
    .forEach(([l, a, b]) => wire(col[a] + BW / 2, lane[l], col[b] - BW / 2, lane[l]));
  wire(col[0], lane[0] - BH / 2, col[0], lane[1] + BH / 2);
  wire(col[2], lane[1] - BH / 2, col[2], lane[2] + BH / 2);
  wire(col[3], lane[1] - BH / 2, col[3], lane[2] + BH / 2);
  const mapTilt = new THREE.Euler(-0.2, 0.36, 0);
  for (let i = 0; i < n; i++) {
    rand[i] = r();
    const roll = r();
    let x: number, y: number;
    if (roll < 0.46) {
      const [bx, by] = boxes[Math.floor(r() * boxes.length)];
      [x, y] = perim(bx, by, BW, BH, r());
    } else if (roll < 0.68) {
      // Two content lines inside a box, so each step reads as populated rather than empty.
      const [bx, by] = boxes[Math.floor(r() * boxes.length)];
      const top = r() < 0.5;
      x = bx - BW * 0.3 + r() * BW * (top ? 0.6 : 0.42);
      y = by + (top ? 0.09 : -0.05);
    } else {
      const [x0, y0, x1, y1] = wires[Math.floor(r() * wires.length)];
      const t = r();
      x = x0 + (x1 - x0) * t;
      y = y0 + (y1 - y0) * t;
    }
    v.set(x + (r() - 0.5) * 0.02, y + (r() - 0.5) * 0.02, (r() - 0.5) * 0.05).applyEuler(mapTilt);
    put(s0, i, v);
  }

  // 1 — Software & custom systems: three screens stacked in depth, the top one carrying a chart.
  // Tilted far enough to read as panels rather than slabs seen edge-on.
  const PW = 3.1, PH = 1.95;
  const panelTilt = new THREE.Euler(-0.62, 0.46, 0);
  for (let i = 0; i < n; i++) {
    const layer = i % 3;
    const ly = (layer - 1) * 0.92;
    const roll = r();
    let x: number, z: number, lift = 0;
    if (roll < 0.34) {
      [x, z] = perim(0, 0, PW, PH, r());
    } else if (roll < 0.8 || layer !== 2) {
      // Content snapped to a grid, so rows and columns stay visible at distance.
      x = Math.round((r() - 0.5) * PW * 0.84 * 7) / 7;
      z = Math.round((r() - 0.5) * PH * 0.78 * 5) / 5;
      x += (r() - 0.5) * 0.02;
      z += (r() - 0.5) * 0.02;
    } else {
      // Bars standing off the top panel.
      const bar = Math.floor(r() * 8);
      const h = [0.38, 0.66, 0.52, 0.9, 0.74, 1.15, 0.98, 1.32][bar];
      x = -1.26 + bar * 0.36;
      z = 0.34;
      lift = r() * h;
    }
    v.set(x, 0, z).applyEuler(panelTilt).add(new THREE.Vector3(0, ly + lift, 0));
    put(s1, i, v);
  }

  // 2 — AI & automation: an ordered lattice. Four layers wired forward, signal riding the edges.
  // Deliberately regular — the shape has to read as a network, not as a tangle.
  const layerX = [-1.95, -0.66, 0.66, 1.95];
  const layerN = [4, 6, 6, 3];
  const SPAN = 2.7;
  const net = layerX.map((lx, li) => {
    const c = layerN[li];
    return Array.from({ length: c }, (_, j) =>
      new THREE.Vector3(lx, c === 1 ? 0 : (j / (c - 1) - 0.5) * SPAN, (r() - 0.5) * 0.1));
  });
  const links: [THREE.Vector3, THREE.Vector3][] = [];
  for (let li = 0; li < net.length - 1; li++) {
    for (const a of net[li]) for (const b of net[li + 1]) links.push([a, b]);
  }
  const allNodes = net.flat();
  for (let i = 0; i < n; i++) {
    if (r() < 0.3) {
      const c = allNodes[Math.floor(r() * allNodes.length)];
      const rr = 0.13 * Math.cbrt(r()), th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1);
      v.set(c.x + rr * Math.sin(ph) * Math.cos(th), c.y + rr * Math.cos(ph), c.z + rr * Math.sin(ph) * Math.sin(th));
    } else {
      const [a, b] = links[Math.floor(r() * links.length)];
      v.copy(a).lerp(b, r());
      v.x += (r() - 0.5) * 0.02;
      v.y += (r() - 0.5) * 0.02;
    }
    put(s2, i, v);
  }

  // 3 is the logo, sampled from an image once it has loaded; s0 stands in until then.
  return { s0, s1, s2, s3: s0.slice(), rand };
}

async function sampleLogo(n: number, width: number) {
  const img = new Image();
  img.src = `${BASE_PATH}/zyntraz-logo-white.png`;
  await img.decode();
  const W = 520, H = Math.round((W * img.height) / img.width);
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, 0, 0, W, H);
  const data = g.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) if (data[(y * W + x) * 4 + 3] > 140) pts.push(x, y);
  const r = prng(11), out = new Float32Array(n * 3), k = width / W;
  for (let i = 0; i < n; i++) {
    const j = Math.floor(r() * (pts.length / 2)) * 2;
    out[i * 3] = (pts[j] - W / 2 + (r() - 0.5)) * k;
    out[i * 3 + 1] = -(pts[j + 1] - H / 2 + (r() - 0.5)) * k;
    out[i * 3 + 2] = (r() - 0.5) * 0.08;
  }
  return out;
}

const vertexShader = /* glsl */ `
attribute vec3 aS0; attribute vec3 aS1; attribute vec3 aS2; attribute vec3 aS3;
attribute float aRand;
uniform float uM; uniform float uA; uniform float uTime; uniform float uSize; uniform float uPixel;
varying float vRand; varying float vGlow;
float seg(float k){ return smoothstep(0.0, 1.0, clamp((uM - k) * 1.35 - aRand * 0.35, 0.0, 1.0)); }
void main(){
  float t1 = seg(0.0), t2 = seg(1.0), t3 = seg(2.0);
  vec3 p = mix(aS0, aS1, t1); p = mix(p, aS2, t2); p = mix(p, aS3, t3);
  float mid = max(max(t1 * (1.0 - t1), t2 * (1.0 - t2)), t3 * (1.0 - t3)) * 4.0;
  // Assemble from a burst: each particle flies in from its own far-out direction.
  vec3 dir = normalize(vec3(sin(aRand * 91.7), cos(aRand * 47.3), sin(aRand * 13.1 + 1.3)) + 0.001);
  float ga = smoothstep(0.0, 1.0, clamp(uA * 1.3 - aRand * 0.3, 0.0, 1.0));
  p = mix(dir * (3.5 + aRand * 5.0), p, ga);
  mid = max(mid, ga * (1.0 - ga) * 3.0);
  float tt = uTime * 0.6 + aRand * 6.2831;
  vec3 swirl = vec3(sin(p.y * 2.7 + tt), sin(p.z * 2.3 + tt * 1.3), sin(p.x * 2.9 + tt * 0.7));
  p += swirl * (0.018 + 0.7 * mid) * (1.0 - t3 * 0.7);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.55 + aRand * 0.9) * uPixel / -mv.z * (1.0 - t3 * 0.25);
  vRand = aRand; vGlow = mid;
}`;

const fragmentShader = /* glsl */ `
varying float vRand; varying float vGlow;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d); a *= a;
  vec3 col = mix(vec3(0.28, 0.52, 1.0), vec3(0.64, 0.45, 1.0), vRand);
  col = mix(col, vec3(0.45, 0.92, 1.0), step(0.86, vRand));
  col += vGlow * 0.35;
  gl_FragColor = vec4(col * a * 1.25, a);
}`;

function Swarm({ state, n }: { state: React.RefObject<SwarmState>; n: number }) {
  const group = useRef<THREE.Group>(null);
  const geo = useRef<THREE.BufferGeometry>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const shapes = useMemo(() => buildShapes(n), [n]);
  const uniforms = useMemo(() => ({ uM: { value: 0 }, uA: { value: 0 }, uTime: { value: 0 }, uSize: { value: 26 }, uPixel: { value: 1 } }), []);

  useEffect(() => {
    let alive = true;
    sampleLogo(n, 5.2).then((pts) => {
      if (!alive || !geo.current) return;
      const attr = geo.current.getAttribute("aS3") as THREE.BufferAttribute;
      (attr.array as Float32Array).set(pts);
      attr.needsUpdate = true;
    }).catch(() => {});
    return () => { alive = false; };
  }, [n]);

  useFrame((three, dt) => {
    const s = state.current;
    const u = mat.current!.uniforms;
    u.uTime.value += Math.min(dt, 0.05);
    u.uM.value += (s.m - u.uM.value) * 0.12;
    u.uA.value += (s.a - u.uA.value) * 0.1;
    u.uPixel.value = three.gl.getPixelRatio();
    const L = swarmLayout(size.width / size.height, u.uM.value);
    const g = group.current!;
    const settle = 1 - Math.min(Math.max(u.uM.value - 2, 0), 1);
    g.scale.setScalar(L.scale);
    g.position.set(L.offX, L.offY, 0);
    g.rotation.y += ((Math.sin(u.uTime.value * 0.18) * 0.45 + s.mx * 0.5) * settle - g.rotation.y) * 0.05;
    g.rotation.x += ((s.my * 0.3) * settle - g.rotation.x) * 0.05;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry ref={geo}>
          <bufferAttribute attach="attributes-position" args={[shapes.s0, 3]} />
          <bufferAttribute attach="attributes-aS0" args={[shapes.s0, 3]} />
          <bufferAttribute attach="attributes-aS1" args={[shapes.s1, 3]} />
          <bufferAttribute attach="attributes-aS2" args={[shapes.s2, 3]} />
          <bufferAttribute attach="attributes-aS3" args={[shapes.s3, 3]} />
          <bufferAttribute attach="attributes-aRand" args={[shapes.rand, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={mat} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function Particles({ state }: { state: React.RefObject<SwarmState> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [low] = useState(isLowPower);
  const [still] = useState(prefersReducedMotion);
  const n = low ? 3500 : 11000;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} style={{ position: "absolute", inset: 0 }}>
      <Canvas resize={{ offsetSize: true }} dpr={low ? [1, 1.25] : [1, 1.75]} frameloop={still ? "demand" : visible ? "always" : "never"} camera={{ position: [0, 0, CAMERA_Z], fov: 45 }} gl={{ alpha: true, antialias: false }}>
        <Swarm state={state} n={n} />
      </Canvas>
    </div>
  );
}
