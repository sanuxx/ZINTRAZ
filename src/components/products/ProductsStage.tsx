"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { useScene } from "@/components/motion/useScene";
import { whenReady } from "@/lib/scroll";

/**
 * The cinematic layer for /products, a sibling of SolutionsStage. Wraps the page's sections and drives:
 *  - hero intro (any width, motion allowed): copy focuses in from blur, the product windows rise into
 *    their fan, the name strip cascades — held until the site's logo intro hands off
 *  - desktop scroll (useScene's DESKTOP query): the hero copy lifts away as the fan rises over the
 *    horizon; the ZynRest window swings in from 3D with a glint; the family lists and screens cascade;
 *    the platform chips drop in, their wires draw and the layers slide under them
 * GSAP never animates elements carrying data-reveal (CSS transitions own those), nor properties a CSS
 * animation already drives (.pho-card and .pst-screen float with `translate`, .pz-line with transform),
 * and intro tweens clear their inline styles so hover transitions keep working.
 */
export default function ProductsStage({ children }: { children: React.ReactNode }) {
  const ref = useScene<HTMLDivElement>(({ q }) => {
    /* ── Hero: copy lifts away, the fan rises over the horizon ── */
    const hero = { trigger: ".pho", start: "top top", end: "bottom top", scrub: 1 };
    gsap.to(q(".pho-copy, .pho-ctas"), { y: -110, opacity: 0, filter: "blur(6px)", ease: "none", scrollTrigger: hero });
    gsap.to(q(".pho-fan"), { y: -70, scale: 1.05, ease: "none", scrollTrigger: hero });
    gsap.to(q(".pho-horizon"), { scale: 1.2, opacity: 0.55, ease: "none", scrollTrigger: hero });

    /* ── Live now: the window swings in from 3D ───────────── */
    const enter = { trigger: ".psl", start: "top 80%", end: "center 55%", scrub: 1 };
    gsap.fromTo(q(".psl .sx-win"),
      { rotationX: 16, rotationY: -16, scale: 0.86, y: 70, transformPerspective: 1400 },
      { rotationX: 0, rotationY: 0, scale: 1, y: 0, ease: "none", scrollTrigger: enter });
    gsap.fromTo(q(".psl .sx-glint"), { xPercent: -140 }, { xPercent: 260, ease: "none", scrollTrigger: enter });
    gsap.from(q(".psl-feats li"), {
      y: 22, opacity: 0, duration: 0.7, stagger: 0.05, ease: "power3.out",
      scrollTrigger: { trigger: ".psl-feats", start: "top 85%", once: true },
    });
    gsap.from(q(".pz-table"), {
      scale: 0.6, opacity: 0, duration: 0.5, stagger: { each: 0.04, from: "start" }, ease: "back.out(1.6)",
      scrollTrigger: { trigger: ".pz-floor", start: "top 80%", once: true },
    });
    gsap.from(q(".pz-kpis > div"), {
      y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
      scrollTrigger: { trigger: ".pz-kpis", start: "top 90%", once: true },
    });

    /* ── The family: each chapter's index and screens cascade in ── */
    q(".pst-card").forEach((card) => {
      const sel = gsap.utils.selector(card);
      const once = { trigger: card, start: "top 70%", once: true };
      gsap.from(sel(".pst-list li"), { x: -28, opacity: 0, duration: 0.7, stagger: 0.07, ease: "power3.out", scrollTrigger: once });
      gsap.from(sel(".pst-screen"), { y: 60, scale: 0.9, opacity: 0, duration: 0.9, stagger: 0.12, ease: "expo.out", scrollTrigger: once });
    });

    /* ── Platform: chips drop in, wires draw, layers slide in ── */
    const core = { trigger: ".pcore-diagram", start: "top 75%", once: true };
    gsap.timeline({ scrollTrigger: core })
      .from(q(".pcore-chip"), { y: -24, opacity: 0, duration: 0.6, stagger: 0.05, ease: "back.out(1.7)" })
      .from(q(".pcore-wire"), { scaleY: 0, transformOrigin: "50% 0%", duration: 0.5, stagger: 0.04, ease: "power2.out" }, 0.3)
      .from(q(".pcore-layer"), { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.5);
  });

  // Hero intro: runs at any width when motion is allowed, after the logo intro.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let stopWaiting = () => {};
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (document.documentElement.classList.contains("rm")) return;
      const q = gsap.utils.selector(root);
      const intro = gsap.timeline({ paused: true, defaults: { clearProps: "transform,opacity,filter" } })
        .fromTo(q(".pho-tag, .pho-title, .pho-lede"), { opacity: 0, y: 50, filter: "blur(16px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.12, ease: "expo.out" })
        .fromTo(q(".pho-ctas > *"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0.45)
        .fromTo(q(".pho-card > a"), { opacity: 0, y: 140, rotationX: 28, transformPerspective: 1200 }, { opacity: 1, y: 0, rotationX: 0, duration: 1.4, stagger: 0.12, ease: "expo.out" }, 0.55)
        .fromTo(q(".pho-strip li"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power2.out" }, 1);
      stopWaiting = whenReady(() => intro.play());
      return () => intro.kill();
    });
    return () => {
      stopWaiting();
      mm.revert();
    };
  }, [ref]);

  // Glare that follows the pointer over the mock-up windows (any device with hover; pure CSS vars).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const win = (e.target as Element | null)?.closest?.(".sx-win") as HTMLElement | null;
      if (!win) return;
      const r = win.getBoundingClientRect();
      win.style.setProperty("--gx", `${e.clientX - r.left}px`);
      win.style.setProperty("--gy", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return <div ref={ref}>{children}</div>;
}
