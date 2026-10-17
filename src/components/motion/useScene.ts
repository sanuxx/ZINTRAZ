"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Set-piece scenes are desktop-only: below 901px the CSS lays the same markup out as a plain
 * stacked list, and `prefers-reduced-motion` opts out entirely (mirrored by the `html.rm` rules in
 * globals.css). Everything is registered through one `gsap.matchMedia`, so `mm.revert()` on unmount
 * tears down the timelines, the ScrollTriggers and any inline transforms GSAP set.
 */
export const DESKTOP = "(min-width: 901px) and (prefers-reduced-motion: no-preference)";

type Build = (ctx: { root: HTMLElement; q: gsap.utils.SelectorFunc }) => void | (() => void);

export function useScene<T extends HTMLElement = HTMLDivElement>(builder: Build) {
  const ref = useRef<T>(null);
  // Captured from the first render and deliberately never refreshed: a scene is built once on mount,
  // and its builder closes only over module-level data. Rebuilding it per render would tear down and
  // recreate every ScrollTrigger, which is both expensive and visibly jumpy mid-scroll.
  const build = useRef(builder).current;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => build({ root, q: gsap.utils.selector(root) }));

    // Pinned scenes measure the document, which fonts and images change after first paint.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => mm.revert();
    // `build` is pinned to the first render by design (see above), so it is intentionally not a
    // dependency — listing it would still be stable, but omitting it states the intent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/** Depth helper: a value that eases from `from` to `to` across a 0–1 progress. */
export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
