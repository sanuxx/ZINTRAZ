"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isLowPower, prefersReducedMotion } from "@/lib/device";
import { BASE_PATH } from "@/lib/site";

// Driven by GSAP. m: shape 0..4 (words → sphere → tiers → network → logo). a: assemble on load 0..1.
// dark: 0 light scene, 1 night scene. alpha: overall particle opacity. mx/my: pointer in -0.5..0.5.
export type MorphState = { m: number; a: number; dark: number; alpha: number; mx: number; my: number };

export const CAMERA_Z = 6;
const VIEW_H = 2 * CAMERA_Z * Math.tan((45 / 2) * (Math.PI / 180));
// Where the field sits: centred horizontally, at 61% of the stage height (the orb is placed to match).
export const FIELD_Y = 0.61;

export const WORDS: { text: string; at: [number, number, number]; ry: number; rz: number }[] = [
  { text: "WhatsApp", at: [-2.3, 0.15, -0.4], ry: 0.4, rz: 0.06 },
  { text: "Excel", at: [2.35, 0.3, -0.6], ry: -0.45, rz: -0.08 },
  { text: "Invoices", at: [-2.45, -0.85, 0.1], ry: 0.3, rz: -0.05 },
  { text: "Email", at: [2.4, -0.7, 0.1], ry: -0.35, rz: 0.07 },
  { text: "POS", at: [-1.2, -1.45, 0.3], ry: 0.15, rz: 0.1 },
  { text: "Paper forms", at: [1.15, -1.5, 0.3], ry: -0.2, rz: -0.06 },
];

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
  const s0 = new Float32Array(n * 3), s1 = new Float32Array(n * 3), s2 = new Float32Array(n * 3), s3 = new Float32Array(n * 3);
  const rand = new Float32Array(n);
  const v = new THREE.Vector3();
  const put = (arr: Float32Array, i: number, p: THREE.Vector3) => { arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z; };

  for (let i = 0; i < n; i++) {
    rand[i] = r();
    // 0 — placeholder cloud; replaced by the sampled words once fonts are ready.
    const w = WORDS[i % WORDS.length].at;
    v.set(w[0] + (r() - 0.5) * 1.4, w[1] + (r() - 0.5) * 0.4, w[2]);
    put(s0, i, v);

    // 1 — the core: a sphere shell with a swirl, wrapped around the orb.
    const y = 1 - (i / (n - 1)) * 2, rad = Math.sqrt(1 - y * y), th = i * 2.399963;
    const R = 1.32 + (r() - 0.5) * 0.06;
    put(s1, i, v.set(Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R));
  }

  // 2 — engineered: three stacked platforms (business, engineering, intelligence), seen from above.
  // A gentle forward tilt: the platforms read as flat plates seen from slightly above.
  const tilt = new THREE.Euler(0.42, 0, 0);
  const tiers = [{ y: -0.8, R: 1.9 }, { y: 0, R: 1.5 }, { y: 0.8, R: 1.1 }];
  for (let i = 0; i < n; i++) {
    const T = tiers[i % 3], roll = r();
    if (roll < 0.55) {
      // Concentric rings.
      const ring = 0.35 + Math.floor(r() * 4) * 0.2167, a = r() * Math.PI * 2;
      v.set(Math.cos(a) * T.R * ring, 0, Math.sin(a) * T.R * ring);
    } else if (roll < 0.8) {
      // Radial spokes.
      const a = Math.floor(r() * 12) * (Math.PI / 6), d = (0.35 + r() * 0.65) * T.R;
      v.set(Math.cos(a) * d, 0, Math.sin(a) * d);
    } else {
      // Outer rim, a little denser so each platform reads as an object.
      const a = r() * Math.PI * 2;
      v.set(Math.cos(a) * T.R, (r() - 0.5) * 0.05, Math.sin(a) * T.R);
    }
    v.applyEuler(tilt).add(new THREE.Vector3(0, T.y, 0));
    put(s2, i, v);
  }

  // 3 — intelligence: a network of nodes with signals running along the links.
  const nodes: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)];
  for (let k = 0; k < 22; k++) {
    const th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1), R = 1.2 + r() * 1.3;
    nodes.push(new THREE.Vector3(R * Math.sin(ph) * Math.cos(th) * 1.35, R * Math.cos(ph) * 0.62, R * Math.sin(ph) * Math.sin(th) * 0.8));
  }
  const edges: [number, number][] = [];
  nodes.forEach((a, ai) => {
    nodes.map((b, bi) => ({ bi, d: a.distanceTo(b) })).filter((e) => e.bi !== ai).sort((x, y) => x.d - y.d).slice(0, 3)
      .forEach(({ bi }) => { if (!edges.some(([p, q]) => (p === bi && q === ai) || (p === ai && q === bi))) edges.push([ai, bi]); });
  });
  for (let i = 0; i < n; i++) {
    if (r() < 0.38) {
      const c = nodes[Math.floor(r() * nodes.length)], rr = (c.lengthSq() === 0 ? 0.3 : 0.13) * Math.cbrt(r());
      const th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1);
      v.set(c.x + rr * Math.sin(ph) * Math.cos(th), c.y + rr * Math.cos(ph), c.z + rr * Math.sin(ph) * Math.sin(th));
    } else {
      const [a, b] = edges[Math.floor(r() * edges.length)];
      v.copy(nodes[a]).lerp(nodes[b], r());
    }
    put(s3, i, v);
  }

  return { s0, s1, s2, s3, s4: s1.slice(), rand };
}

// Samples filled pixels of a 2D canvas drawing into n points, centred and scaled to `width` world units.
function samplePixels(draw: (g: CanvasRenderingContext2D) => [number, number], seed: number) {
  const c = document.createElement("canvas");
  c.width = 1400; c.height = 260;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  const [W, H] = draw(g);
  const data = g.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (data[(y * W + x) * 4 + 3] > 140) pts.push(x, y);
  return { pts, W, H, r: prng(seed) };
}

function sampleWords(n: number) {
  const font = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "sans-serif";
  const out = new Float32Array(n * 3);
  const per = WORDS.map((w, wi) => samplePixels((g) => {
    g.font = `700 130px ${font}`;
    const W = Math.ceil(g.measureText(w.text).width) + 20, H = 170;
    g.fillStyle = "#fff";
    g.fillText(w.text, 10, 130);
    return [W, H];
  }, 20 + wi));
  const v = new THREE.Vector3(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) {
    const wi = i % WORDS.length, w = WORDS[wi], { pts, W, H, r } = per[wi];
    const j = Math.floor(r() * (pts.length / 2)) * 2, k = 0.0038;
    v.set((pts[j] - W / 2) * k, -(pts[j + 1] - H / 2) * k, (r() - 0.5) * 0.05);
    v.applyEuler(e.set(0, w.ry, w.rz)).add(new THREE.Vector3(...w.at));
    out[i * 3] = v.x; out[i * 3 + 1] = v.y; out[i * 3 + 2] = v.z;
  }
  return out;
}

async function sampleLogo(n: number, width: number) {
  const img = new Image();
  img.src = `${BASE_PATH}/zyntraz-logo-white.png`;
  await img.decode();
  const { pts, W, H, r } = samplePixels((g) => {
    const W = 700, H = Math.round((W * img.height) / img.width);
    g.drawImage(img, 0, 0, W, H);
    return [W, H];
  }, 11);
  const out = new Float32Array(n * 3), k = width / W;
  for (let i = 0; i < n; i++) {
    const j = Math.floor(r() * (pts.length / 2)) * 2;
    out[i * 3] = (pts[j] - W / 2 + (r() - 0.5) * 2) * k;
    out[i * 3 + 1] = -(pts[j + 1] - H / 2 + (r() - 0.5) * 2) * k;
    out[i * 3 + 2] = (r() - 0.5) * 0.06;
  }
  return out;
}

const vertexShader = /* glsl */ `
attribute vec3 aS0; attribute vec3 aS1; attribute vec3 aS2; attribute vec3 aS3; attribute vec3 aS4;
attribute float aRand;
uniform float uM; uniform float uA; uniform float uTime; uniform float uSize; uniform float uPixel;
varying float vRand; varying float vGlow; varying float vSignal;
float seg(float k){ return smoothstep(0.0, 1.0, clamp((uM - k) * 1.4 - aRand * 0.4, 0.0, 1.0)); }
void main(){
  float t1 = seg(0.0), t2 = seg(1.0), t3 = seg(2.0), t4 = seg(3.0);
  vec3 p = mix(aS0, aS1, t1); p = mix(p, aS2, t2); p = mix(p, aS3, t3); p = mix(p, aS4, t4);
  float mid = max(max(t1 * (1.0 - t1), t2 * (1.0 - t2)), max(t3 * (1.0 - t3), t4 * (1.0 - t4))) * 4.0;
  // Mid-morph, particles spiral around the vertical axis — a vortex, not a straight tween.
  float ang = mid * (1.4 + aRand * 1.6);
  p.xz = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p.xz;
  // On load, each particle flies in from its own far direction.
  vec3 dir = normalize(vec3(sin(aRand * 91.7), cos(aRand * 47.3), sin(aRand * 13.1 + 1.3)) + 0.001);
  float ga = smoothstep(0.0, 1.0, clamp(uA * 1.3 - aRand * 0.3, 0.0, 1.0));
  p = mix(dir * (4.0 + aRand * 6.0), p, ga);
  float tt = uTime * 0.6 + aRand * 6.2831;
  vec3 swirl = vec3(sin(p.y * 2.7 + tt), sin(p.z * 2.3 + tt * 1.3), sin(p.x * 2.9 + tt * 0.7));
  p += swirl * (0.012 + 0.45 * mid) * (1.0 - t4 * 0.8);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.55 + aRand * 0.8) * uPixel / -mv.z;
  vRand = aRand; vGlow = mid;
  // A travelling signal: bright pulses sweep through the network shape.
  vSignal = t3 * (1.0 - t4) * smoothstep(0.93, 1.0, sin(uTime * 2.4 + length(p) * 3.0 - aRand * 2.0));
}`;

const fragmentShader = /* glsl */ `
uniform float uDark; uniform float uAlpha;
varying float vRand; varying float vGlow; varying float vSignal;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  // Deep, saturated inks on the light scene; luminous tones in the night scene.
  vec3 dayA = vec3(0.04, 0.26, 0.95), dayB = vec3(0.42, 0.2, 0.9), dayC = vec3(0.02, 0.5, 0.7);
  vec3 nightA = vec3(0.36, 0.6, 1.0), nightB = vec3(0.7, 0.52, 1.0), nightC = vec3(0.45, 0.93, 1.0);
  vec3 day = mix(dayA, dayB, vRand); day = mix(day, dayC, step(0.86, vRand));
  vec3 night = mix(nightA, nightB, vRand); night = mix(night, nightC, step(0.86, vRand));
  vec3 col = mix(day, night, uDark) + vGlow * 0.25 * uDark + vSignal * vec3(0.9, 0.95, 1.0);
  gl_FragColor = vec4(col, a * uAlpha * (0.75 + vSignal * 0.25));
}`;

function Field({ state, n }: { state: React.RefObject<MorphState>; n: number }) {
  const group = useRef<THREE.Group>(null);
  const geo = useRef<THREE.BufferGeometry>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const shapes = useMemo(() => buildShapes(n), [n]);
  const uniforms = useMemo(() => ({
    uM: { value: 0 }, uA: { value: 0 }, uTime: { value: 0 }, uSize: { value: 24 }, uPixel: { value: 1 }, uDark: { value: 0 }, uAlpha: { value: 0 },
  }), []);

  useEffect(() => {
    let alive = true;
    const set = (name: string, pts: Float32Array) => {
      if (!alive || !geo.current) return;
      const attr = geo.current.getAttribute(name) as THREE.BufferAttribute;
      (attr.array as Float32Array).set(pts);
      attr.needsUpdate = true;
    };
    document.fonts.ready.then(() => set("aS0", sampleWords(n))).catch(() => {});
    sampleLogo(n, 5.4).then((pts) => set("aS4", pts)).catch(() => {});
    return () => { alive = false; };
  }, [n]);

  useFrame(({ gl, size }, dt) => {
    const s = state.current;
    const u = mat.current!.uniforms;
    u.uTime.value += Math.min(dt, 0.05);
    u.uM.value += (s.m - u.uM.value) * 0.1;
    u.uA.value += (s.a - u.uA.value) * 0.08;
    u.uDark.value += (s.dark - u.uDark.value) * 0.1;
    u.uAlpha.value += (s.alpha - u.uAlpha.value) * 0.1;
    u.uPixel.value = gl.getPixelRatio();

    // Fit the field to the viewport and seat its centre at FIELD_Y of the stage height.
    const aspect = size.width / size.height, viewW = VIEW_H * aspect;
    const g = group.current!;
    // Phones crop the sides a little so the field stays legible rather than tiny.
    g.scale.setScalar(Math.min(1, viewW / (aspect < 1 ? 6.4 : 7.8)));
    g.position.set(0, (0.5 - FIELD_Y) * VIEW_H, 0);
    // The logo settles square to camera; every other shape sways gently and follows the pointer.
    const free = 1 - Math.min(Math.max(u.uM.value - 3, 0), 1);
    g.rotation.y += ((Math.sin(u.uTime.value * 0.2) * 0.12 + s.mx * 0.25) * free - g.rotation.y) * 0.05;
    g.rotation.x += ((s.my * 0.15) * free - g.rotation.x) * 0.05;
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry ref={geo}>
          <bufferAttribute attach="attributes-position" args={[shapes.s1, 3]} />
          <bufferAttribute attach="attributes-aS0" args={[shapes.s0, 3]} />
          <bufferAttribute attach="attributes-aS1" args={[shapes.s1, 3]} />
          <bufferAttribute attach="attributes-aS2" args={[shapes.s2, 3]} />
          <bufferAttribute attach="attributes-aS3" args={[shapes.s3, 3]} />
          <bufferAttribute attach="attributes-aS4" args={[shapes.s4, 3]} />
          <bufferAttribute attach="attributes-aRand" args={[shapes.rand, 1]} />
        </bufferGeometry>
        <shaderMaterial ref={mat} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} />
      </points>
    </group>
  );
}

export default function MorphField({ state }: { state: React.RefObject<MorphState> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [low] = useState(isLowPower);
  const [still] = useState(prefersReducedMotion);
  const n = low ? 7000 : 16000;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="hg-field">
      <Canvas resize={{ offsetSize: true }} dpr={low ? [1, 1.5] : [1, 2]} frameloop={still ? "demand" : visible ? "always" : "never"}
        camera={{ position: [0, 0, CAMERA_Z], fov: 45 }} gl={{ alpha: true, antialias: false }}>
        <Field state={state} n={n} />
      </Canvas>
    </div>
  );
}
