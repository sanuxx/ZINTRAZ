"use client";

import { Component, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { DEVICE3D } from "@/lib/device3d";

/**
 * The device mockup around a product's live demo. On desktop (and when WebGL is available) it is the
 * studio-lit 3D laptop (LaptopScene, React Three Fiber + Drei, loaded client-only) with the demo on its
 * screen. Otherwise (narrow screens, where a 3D-scaled screen would be too small to use; no WebGL; or
 * the scene throws) the same live demo is shown in a flat device frame, so it always stays usable.
 *
 * The 3D set takes seconds to arrive on a first visit (its bundle, then GPU shader compiles), so on
 * desktop the demo does not wait for it: it is rendered once, through a portal, into one DOM node that
 * starts in a flat stand-in screen over the loading stage and is moved onto the laptop's screen when
 * the scene reports ready. Moving the node keeps the demo mounted, so nothing the visitor did resets.
 */
const loadScene = () => import("@/components/3d/LaptopScene");
const LaptopScene = dynamic(loadScene, { ssr: false, loading: () => <div className="lap3 is-loading" /> });

const QUERY = `(min-width: ${DEVICE3D.minWidth}px)`;
// Start the 3D bundle download as soon as this module runs on a desktop, rather than after hydration
// renders the placeholder; the dynamic() above then resolves from the same promise.
if (typeof window !== "undefined" && window.matchMedia(QUERY).matches) loadScene();
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
class SceneBoundary extends Component<{ fallback: ReactNode; onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

/** Where the shared demo node is shown; while `active`, this slot holds it. */
function Slot({ node, active }: { node: HTMLElement; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (active && ref.current && node.parentNode !== ref.current) ref.current.appendChild(node);
  }, [node, active]);
  return <div ref={ref} className="lap3-slot" />;
}

/** The flat stand-in over the loading stage: the demo at its laptop size (960x600), scaled to fit. */
function Early({ node, gone }: { node: HTMLElement; gone: boolean }) {
  const screen = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / DEVICE3D.screenPx[0]));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className={`lap3-early${gone ? " is-gone" : ""}`} inert={gone}>
      <div className="lap3-early-dev">
        <div ref={screen} className="lap3-early-screen">
          <div className="lap3-screen" style={{ width: DEVICE3D.screenPx[0], height: DEVICE3D.screenPx[1], transform: `scale(${scale})` }}>
            <Slot node={node} active={!gone} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Laptop3D({ children }: { children: ReactNode }) {
  // null on the server: nothing device-specific until the browser says which layout applies.
  const mode = useSyncExternalStore(subscribe, () => (window.matchMedia(QUERY).matches && hasWebGL() ? "3d" : "flat"), () => null);
  // The demo's one DOM home on desktop (see above); created on first use in the browser.
  const [node] = useState(() => (typeof document === "undefined" ? null : Object.assign(document.createElement("div"), { className: "lap3-slot" })));
  const [stage, setStage] = useState<"loading" | "ready" | "failed">("loading");
  const onReady = useCallback(() => setStage("ready"), []);
  const onFail = useCallback(() => setStage("failed"), []);

  return (
    <>
      {/* Fetch the studio HDRI from the first byte of HTML (desktop only), in parallel with the 3D bundle,
          instead of after the scene mounts. React hoists this into <head>. */}
      <link rel="preload" href={DEVICE3D.envMap} as="fetch" crossOrigin="anonymous" media={QUERY} />
      {mode === null ? (
        <div className="lap3 is-loading" />
      ) : mode === "flat" ? (
        <Flat>{children}</Flat>
      ) : (
        node && (
          <div className="lap3-host">
            <SceneBoundary fallback={<Flat><Slot node={node} active /></Flat>} onFail={onFail}>
              <LaptopScene onReady={onReady}><Slot node={node} active={stage === "ready"} /></LaptopScene>
            </SceneBoundary>
            {stage !== "failed" && <Early node={node} gone={stage === "ready"} />}
            {createPortal(children, node)}
          </div>
        )
      )}
    </>
  );
}
