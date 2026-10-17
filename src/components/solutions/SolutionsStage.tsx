"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { useScene } from "@/components/motion/useScene";

/**
 * The cinematic layer for /solutions. Wraps the page's sections and drives, on desktop with motion
 * allowed (useScene's DESKTOP query), the scroll-linked effects below the hero (the hero runs its
 * own timeline in SolutionsHero):
 *  - reel: the pinned title sequence — lines focus in from blur, hold, then fall away; streak and rail
 *  - blocks: chapter numerals parallax, mock-up windows swing in from 3D with a glint, tiles cascade
 * GSAP only ever animates elements that don't carry data-reveal (those use CSS transitions on
 * transform/opacity, which inline GSAP transforms would fight). Below 901px or with reduced motion
 * nothing here runs and the CSS shows the static layout.
 */
export default function SolutionsStage({ children }: { children: React.ReactNode }) {
  const ref = useScene<HTMLDivElement>(({ q }) => {
    /* ── Reel: one pinned scene ───────────────────────── */
    // Quiet by design: the rows rise and focus in one after another and stay; then the rule draws, the
    // payoff rises and the rows settle back so it leads.
    const lines = q(".sx-reel-line");
    const bars = q(".sx-reel-rail i");
    const reel = gsap.timeline({
      defaults: { ease: "none" },
      // Starts while the scene is still entering, so the first row arrives as the hero hands over.
      scrollTrigger: { trigger: ".sx-reel", start: "top 55%", end: "bottom bottom", scrub: 1 },
    });
    gsap.set(lines, { opacity: 0, y: 24, filter: "blur(8px)" });
    gsap.set(q(".sx-reel-final-line, .sx-reel-final-sub"), { opacity: 0, y: 30, filter: "blur(8px)" });
    lines.forEach((line, i) => {
      reel.to(line, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }, i * 0.75);
      if (bars[i]) reel.to(bars[i], { scaleX: 1, duration: 0.75 }, i * 0.75);
    });
    const end = lines.length * 0.75;
    reel.fromTo(q(".sx-reel-streak"), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, end)
      .to(q(".sx-reel-final-line, .sx-reel-final-sub"), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.1, ease: "power2.out" }, end + 0.3)
      .to(lines, { opacity: 0.5, duration: 0.4 }, end + 0.3)
      .to({}, { duration: 0.4 })
      .to(q(".sx-reel-orb"), { xPercent: 60, yPercent: -20, scale: 1.4, duration: end + 1.2 }, 0);

    /* ── Solution blocks ──────────────────────────────── */
    q(".sx-block").forEach((block, i) => {
      const sel = gsap.utils.selector(block);
      gsap.fromTo(sel(".sx-chapter"), { yPercent: 35 }, {
        yPercent: -35, ease: "none", scrollTrigger: { trigger: block, start: "top bottom", end: "bottom top", scrub: true },
      });
      const enter = { trigger: block, start: "top 85%", end: "center 55%", scrub: 1 };
      gsap.fromTo(sel(".sx-win"),
        { rotationX: 16, rotationY: i % 2 ? 16 : -16, scale: 0.86, y: 70, transformPerspective: 1400 },
        { rotationX: 0, rotationY: 0, scale: 1, y: 0, ease: "none", scrollTrigger: enter });
      gsap.fromTo(sel(".sx-glint"), { xPercent: -140 }, { xPercent: 260, ease: "none", scrollTrigger: enter });
      gsap.from(sel(".sx-caps li"), {
        y: 26, opacity: 0, duration: 0.7, stagger: 0.045, ease: "power3.out",
        scrollTrigger: { trigger: sel(".sx-caps")[0], start: "top 85%", once: true },
      });
    });
  });

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

  return <div ref={ref} className="sx-stage">{children}</div>;
}
