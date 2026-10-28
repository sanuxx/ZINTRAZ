"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, PerformanceMonitor } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import ProceduralLaptop, { BASE } from "@/components/3d/laptop/ProceduralLaptop";
import Studio from "@/components/3d/laptop/Studio";
import { DEVICE3D } from "@/lib/device3d";
import { BASE_PATH } from "@/lib/site";

/**
 * The 3D device showcase: a studio-lit laptop (ProceduralLaptop + Studio) with live DOM content on its
 * screen. Loaded client-only (see components/products/Laptop3D).
 *
 * - Pose: a fixed three-quarter turn (DEVICE3D.pose), so the left side, its ports and the chassis
 *   thickness read. Framing: <Bounds> fits a static proxy of the open laptop to the canvas (and
 *   refits on resize), so the device is never clipped at any size.
 * - Motion, all in useFrame on refs (no React renders per frame): while the pointer is over the stage
 *   the device leans a few degrees toward it, and settles back to the default pose when it leaves.
 *   It appears already open (no entrance): the live demo is on screen in Laptop3D's flat stand-in
 *   while this scene loads, and a lid opening would hide it. Reduced motion: still.
 * - Quality: PerformanceMonitor drops the pixel ratio and the floor reflection on weak GPUs; the frame
 *   loop stops while the stage is off screen.
 * - Loading: the frame loop stays off (the stage shows its loading glow) until Studio reports every
 *   shader compiled, then the set fades in and `onReady` fires, so the first frames never stall the page.
 */
function Rig({ still, pointer, children }: { still: boolean; pointer: React.RefObject<{ x: number; y: number; over: boolean }>; children: (lid: React.RefObject<Group | null>) => ReactNode }) {
  const body = useRef<Group>(null);
  const lid = useRef<Group>(null);

  useFrame((_, dt) => {
    const b = body.current, l = lid.current;
    if (!b || !l) return;
    l.rotation.x = DEVICE3D.lid.open;
    if (still) return;
    const p = pointer.current;
    const px = p.over ? p.x : 0, py = p.over ? p.y : 0;
    b.rotation.y = MathUtils.damp(b.rotation.y, px * 0.12, 3, dt);
    b.rotation.x = MathUtils.damp(b.rotation.x, py * 0.035, 3, dt);
  });

  return <group ref={body}>{children(lid)}</group>;
}

export default function LaptopScene({ children, onReady }: { children: ReactNode; onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, over: false });
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const onWarm = useCallback(() => { setReady(true); onReady?.(); }, [onReady]);
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [still] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("rm"));

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5, over: true };
    };
    const leave = () => { pointer.current = { x: 0, y: 0, over: false }; };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => { io.disconnect(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);

  return (
    <div ref={wrap} className={`lap3 ${ready ? "is-ready" : "is-loading"}`}>
      <Canvas
        camera={{ position: DEVICE3D.camera.position, fov: DEVICE3D.camera.fov, near: 1, far: 400 }}
        dpr={quality === "high" ? DEVICE3D.dpr : [1, 1.25]}
        frameloop={visible && ready ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => { gl.toneMappingExposure = DEVICE3D.exposure; }}
      >
        <PerformanceMonitor onDecline={() => setQuality("low")} onIncline={() => setQuality("high")} flipflops={2} />
        <Studio quality={quality} onWarm={onWarm} />
        <group rotation-y={DEVICE3D.pose.yaw}>
          {/* Framing proxy: the open laptop's width and height, kept shallow so Bounds fits to what the camera
              sees rather than to the deck's depth (static, so the pointer lean never refits). */}
          <Bounds fit clip observe margin={0.86} maxDuration={0}>
            <mesh visible={false} position={[0, 9.2, -1]}>
              <boxGeometry args={[BASE.w + 0.6, 21, 3]} />
            </mesh>
          </Bounds>
          <Rig still={still} pointer={pointer}>
            {(lid) => (
              <group position={[0, 0, -BASE.d / 2]}>
                <ProceduralLaptop ref={lid} screen={children} />
              </group>
            )}
          </Rig>
        </group>
      </Canvas>
      <span className="lap3-vignette" aria-hidden="true" />
      {/* Brand mark in the set's top-right corner (plain <img>, so BASE_PATH is applied by hand). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lap3-logo" src={`${BASE_PATH}/zyntraz-logo-white.png`} alt="ZINTRAZ" width={894} height={158} />
    </div>
  );
}
