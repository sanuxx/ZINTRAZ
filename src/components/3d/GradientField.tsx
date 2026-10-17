"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { isLowPower, prefersReducedMotion } from "@/lib/device";

// mx/my: pointer in -0.5..0.5. warp: 0..1+ bursts of flow speed. hue: 0..1 shift toward violet.
export type FieldState = { mx: number; my: number; warp: number; hue: number };

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime; uniform float uAspect; uniform vec2 uMouse; uniform float uHue;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p){ float f = 0.0, a = 0.5; for (int i = 0; i < 3; i++){ f += a * snoise(p); p *= 2.02; a *= 0.5; } return f; }

void main(){
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 m = vec2(uMouse.x * uAspect, uMouse.y);
  float md = distance(p, m);
  float t = uTime * 0.06;
  // Domain-warped flow; the pointer pulls the field toward itself.
  vec2 pull = (m - p) * 0.35 * exp(-md * 2.2);
  float n1 = fbm(p * 0.55 + vec2(t, -t * 0.7) + pull);
  float n2 = fbm(p * 0.8 + n1 * 1.1 + vec2(-t * 0.6, t * 0.5));
  float v = n2 * 0.5 + 0.5;

  vec3 cloud = vec3(0.93, 0.96, 1.0);
  vec3 sky = vec3(0.50, 0.68, 1.0);
  vec3 blue = vec3(0.07, 0.36, 0.98);
  vec3 deep = vec3(0.02, 0.19, 0.74);
  vec3 violet = vec3(0.40, 0.30, 0.95);

  // Saturated blue sky at the top where the white headline sits, drifting clouds toward the bottom.
  float y = vUv.y + (v - 0.5) * 0.22;
  vec3 col = mix(cloud, sky, smoothstep(0.02, 0.42, y));
  col = mix(col, blue, smoothstep(0.32, 0.72, y));
  col = mix(col, deep, smoothstep(0.68, 1.05, vUv.y + n1 * 0.08));
  col = mix(col, cloud, smoothstep(0.55, 0.92, fbm(p * 1.1 - t)) * smoothstep(0.55, 0.08, vUv.y) * 0.75);
  col = mix(col, violet, uHue * 0.3 * smoothstep(0.4, 0.9, v) * smoothstep(0.3, 0.8, vUv.y));
  col = mix(col, sky, exp(-md * md * 9.0) * 0.25);
  gl_FragColor = vec4(col, 1.0);
}`;

function Field({ state }: { state: React.RefObject<FieldState> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uAspect: { value: 1 }, uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uHue: { value: 0 },
  }), []);

  useFrame((_, dt) => {
    const s = state.current;
    const u = mat.current!.uniforms;
    u.uTime.value += Math.min(dt, 0.05) * (1 + s.warp * 14);
    u.uAspect.value = size.width / size.height;
    const mouse = u.uMouse.value as THREE.Vector2;
    mouse.x += (s.mx + 0.5 - mouse.x) * 0.05;
    mouse.y += (0.5 - s.my - mouse.y) * 0.05;
    u.uHue.value += (s.hue - u.uHue.value) * 0.05;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

export default function GradientField({ state }: { state: React.RefObject<FieldState> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [low] = useState(isLowPower);
  const [still] = useState(prefersReducedMotion);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  // The field is soft by nature, so it renders at reduced resolution for speed.
  return (
    <div ref={wrap} style={{ position: "absolute", inset: 0 }}>
      <Canvas resize={{ offsetSize: true }} dpr={low ? 0.4 : 0.6} frameloop={still ? "demand" : visible ? "always" : "never"} gl={{ antialias: false, alpha: false }}>
        <Field state={state} />
      </Canvas>
    </div>
  );
}
