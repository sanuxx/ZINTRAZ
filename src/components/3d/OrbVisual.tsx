"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { createOrbState, type OrbState } from "@/components/3d/Orb";

const Orb = dynamic(() => import("@/components/3d/Orb"), { ssr: false });

export default function OrbVisual({ intensity = 0.6, hue = 0.6 }: { intensity?: number; hue?: number }) {
  const state = useRef<OrbState>({ ...createOrbState(), intensity, hue });

  useEffect(() => {
    const s = state.current;
    const onMove = (e: PointerEvent) => {
      s.mx = e.clientX / window.innerWidth - 0.5;
      s.my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="orb-visual" aria-hidden="true">
      <div className="orb-visual-glow" />
      <Orb state={state} cameraZ={3.6} light />
    </div>
  );
}
