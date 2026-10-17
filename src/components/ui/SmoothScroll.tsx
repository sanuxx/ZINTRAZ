"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { scroll } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

// A hash only means "take me to that section" when arriving from a link. On a refresh it is usually a
// leftover from an in-page jump, so the first render of a reloaded document ignores it (see below).
let firstRender = true;
const cleanUrl = () => history.replaceState(history.state, "", window.location.pathname + window.location.search);

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (t: number) => lenisRef.current?.raf(t * 1000);
    if (!reduce) {
      // Anchor offset comes from CSS scroll-margin-top on [id], which Lenis honours.
      const lenis = new Lenis({ lerp: 0.1, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      lenisRef.current = lenis;
      scroll.lenis = lenis;
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(".spot") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    // In-page anchor links (#section on the current page) scroll there without writing the hash into
    // the URL, so a later refresh starts from the top instead of re-jumping to that section. This runs
    // in the capture phase, ahead of next/link's handler: preventDefault stops both its router push and
    // the native jump, while Lenis's own click listener still performs the smooth scroll. Without Lenis
    // (reduced motion) we jump to the section ourselves.
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.origin !== window.location.origin || a.pathname !== window.location.pathname || !a.hash) return;
      e.preventDefault();
      if (!lenisRef.current) {
        try { document.querySelector(a.hash)?.scrollIntoView(); } catch {}
      }
    };
    document.addEventListener("click", onClick, { capture: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      scroll.lenis = null;
    };
  }, []);

  // Per page: sync scroll position, arm reveals, re-measure ScrollTriggers.
  useEffect(() => {
    const lenis = lenisRef.current;
    let target: HTMLElement | null = null;
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const reloaded = firstRender && nav?.type === "reload";
    firstRender = false;
    if (reloaded && window.location.hash) cleanUrl();
    else try { target = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null; } catch {}
    if (lenis) {
      lenis.resize();
      if (target) lenis.scrollTo(target, { immediate: true });
      else lenis.scrollTo(0, { immediate: true });
    }

    // IntersectionObserver rather than ScrollTrigger so pin spacers never skew reveal timing.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => { io.disconnect(); clearTimeout(t); };
  }, [pathname]);

  return null;
}
