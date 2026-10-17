"use client";

import { Component, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { DEVICE3D } from "@/lib/device3d";

/**
 * The device mockup around a product's live demo. On desktop (and when WebGL is available) it is the
 * studio-lit 3D laptop (LaptopScene, React Three Fiber + Drei, loaded client-only) with the demo on its
 * screen. Otherwise (narrow screens, where a 3D-scaled screen would be too small to use; no WebGL; or
 * the scene throws) the same live demo is shown in a flat device frame, so it always stays usable.
 */
const LaptopScene = dynamic(() => import("@/components/3d/LaptopScene"), { ssr: false, loading: () => <div className="lap3 is-loading" /> });

const QUERY = `(min-width: ${DEVICE3D.minWidth}px)`;
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
let webgl: boolean | undefined;
function hasWebGL() {
  if (webgl === undefined) {
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch { webgl = false; }
  }
  return webgl;
}

function Flat({ children }: { children: ReactNode }) {
  return (
    <div className="lap-flat">
      <span className="lap-flat-cam" aria-hidden="true" />
      <div className="lap-flat-screen">{children}</div>
    </div>
  );
}

/** If the 3D scene fails at runtime, fall back to the flat frame instead of losing the demo. */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function Laptop3D({ children }: { children: ReactNode }) {
  // null on the server: nothing device-specific until the browser says which layout applies.
  const mode = useSyncExternalStore(subscribe, () => (window.matchMedia(QUERY).matches && hasWebGL() ? "3d" : "flat"), () => null);

  if (mode === null) return <div className="lap3 is-loading" />;
  if (mode === "flat") return <Flat>{children}</Flat>;
  return (
    <SceneBoundary fallback={<Flat>{children}</Flat>}>
      <LaptopScene>{children}</LaptopScene>
    </SceneBoundary>
  );
}
