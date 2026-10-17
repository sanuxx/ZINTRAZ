"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ChevronRight } from "lucide-react";
import { whenReady } from "@/lib/scroll";
import type { FieldState } from "@/components/3d/GradientField";

gsap.registerPlugin(ScrollTrigger);

const GradientField = dynamic(() => import("@/components/3d/GradientField"), { ssr: false });

/**
 * /solutions hero — a sibling of the home hero (same live sky shader and white display type), told
 * differently: as you scroll the headline lifts away and "Three capabilities. One strategy." rises in
 * on the same sky; at the very end it fades as the sky brightens into the light scene below.
 * The stage is sticky inside a tall section; with reduced motion or below 901px it is a single
 * static screen.
 */
export default function SolutionsHero() {
  const ref = useRef<HTMLElement>(null);
  const field = useRef<FieldState>({ mx: 0, my: 0, warp: 0, hue: 0.25 });

  useEffect(() => {
    const root = ref.current!;
    const f = field.current;
    let stopWaiting = () => {};

    const onMove = (e: PointerEvent) => {
      f.mx = e.clientX / window.innerWidth - 0.5;
      f.my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 901px)" }, (c) => {
      const { motion, desktop } = c.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;

      // Intro, held until the site's logo intro hands off.
      const intro = gsap.timeline({ paused: true })
        .fromTo(root.querySelectorAll(".sxh-title .w"), { opacity: 0, y: 60, filter: "blur(18px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.3, stagger: 0.12, ease: "expo.out" })
        .fromTo(root.querySelectorAll(".sxh-fade"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.4);
      stopWaiting = whenReady(() => intro.play());

      if (!desktop) return;

      // The scroll story: copy lifts away → the sky stirs → the promise appears on the hero's own sky
      // and holds → only at the very end does it fade as the sky brightens into the light scene below.
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      })
        .to(root.querySelector(".sxh-intro"), { opacity: 0, y: -90, filter: "blur(8px)", duration: 0.25 }, 0)
        .to(f, { hue: 0.85, warp: 0.6, duration: 0.3 }, 0.12)
        .to(f, { warp: 0, duration: 0.2 }, 0.42)
        .fromTo(root.querySelector(".sxh-final"), { opacity: 0, y: 50, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2 }, 0.28)
        .to(root.querySelector(".sxh-final"), { opacity: 0, y: -40, duration: 0.12 }, 0.84)
        .to(root.querySelector(".sxh-dusk"), { opacity: 1, duration: 0.16 }, 0.84)
        .to(root.querySelector(".sxh-cue"), { opacity: 0, duration: 0.1 }, 0);
    });

    return () => {
      stopWaiting();
      mm.revert();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section ref={ref} className="sxh" aria-label="Solutions — technology engineered around your business">
      <div className="sxh-stage">
        <div className="sxh-field" aria-hidden="true"><GradientField state={field} /></div>
        <div className="sxh-glow" aria-hidden="true" />

        <div className="sxh-intro">
          <p className="eyebrow sxh-fade">Solutions</p>
          <h1 className="sxh-title">
            <span className="w">Technology engineered</span>{" "}
            <span className="w grad-text">around your business.</span>
          </h1>
          <p className="sxh-sub sxh-fade">
            Software, AI and connected systems, brought together under one transformation strategy.
          </p>
          <div className="sxh-ctas sxh-fade">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment</Link>
            <Link href="#software" className="link-chev">Explore the solutions <ChevronRight size={18} /></Link>
          </div>
        </div>

        <div className="sxh-final">
          <h2>Three capabilities. <span className="grad-text">One strategy.</span></h2>
        </div>

        <div className="sxh-dusk" aria-hidden="true" />
        <div className="sxh-cue" aria-hidden="true"><i />Scroll</div>
      </div>
    </section>
  );
}
