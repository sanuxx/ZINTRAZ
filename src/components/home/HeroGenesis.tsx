"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { createOrbState, type OrbState } from "@/components/3d/Orb";
import type { MorphState } from "@/components/3d/MorphField";
import { whenReady } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

const Orb = dynamic(() => import("@/components/3d/Orb"), { ssr: false });
const GradientField = dynamic(() => import("@/components/3d/GradientField"), { ssr: false });
const MorphField = dynamic(() => import("@/components/3d/MorphField"), { ssr: false });

const tiers = ["Intelligence", "Engineering", "Business"];

export default function HeroGenesis() {
  const ref = useRef<HTMLElement>(null);
  const orb = useRef<OrbState>(createOrbState());
  const field = useRef<MorphState>({ m: 0, a: 0, dark: 0, alpha: 0, mx: 0, my: 0 });

  useEffect(() => {
    const root = ref.current!;
    const o = orb.current, f = field.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = () => window.innerWidth < 760;
    const H = () => window.innerHeight;
    let stopWaiting = () => {};

    const ctx = gsap.context(() => {
      gsap.set(".hg-orb", { xPercent: -50, yPercent: -50 });

      // Opening: the orb rises into the light; the scattered words gather out of nowhere around it.
      const intro = gsap.timeline({ paused: true, delay: 0.05 });
      stopWaiting = whenReady(() => intro.play());
      intro
        .fromTo(".hg-orb-in", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 2.4, ease: "expo.out" }, 0)
        .fromTo(o, { intensity: 0 }, { intensity: 0.4, duration: 2.4, ease: "power2.out" }, 0)
        .fromTo(".hx-title .w", { opacity: 0, y: 60, filter: "blur(20px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, stagger: 0.16, ease: "expo.out" }, 0.3)
        .fromTo(".hx-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" }, 0.9)
        .to(f, { a: 1, alpha: () => (phone() ? 0 : 0.2), duration: 2.6, ease: "power2.out" }, 0.4);

      if (reduce) { gsap.set(".hg-orb", { y: () => H() * 0.16, scale: 0.75 }); return; }

      gsap.set(".hg-orb", { y: () => H() * 0.2, scale: 0.72 });
      const beat = (tl: gsap.core.Timeline, sel: string, at: number, out?: number) => {
        tl.fromTo(sel, { opacity: 0, y: 50, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, at);
        if (out !== undefined) tl.to(sel, { opacity: 0, y: -50, filter: "blur(10px)", duration: 0.5 }, out);
      };
      const pulse = (tl: gsap.core.Timeline, at: number, k = 1) => tl
        .to(o, { warp: k, duration: 0.35, ease: "power2.in" }, at)
        .to(o, { warp: 0, duration: 0.6, ease: "power2.out" }, at + 0.35);

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      });
      tl.to(".hx-intro", { opacity: 0, y: -80, filter: "blur(8px)", duration: 0.8 }, 0)

        // 1 — In pieces: the words sharpen around a quiet orb.
        .to(f, { alpha: 1, duration: 0.8 }, 0.3)
        .to(".hg-orb", { y: () => H() * 0.02, scale: 0.55, duration: 1 }, 0.2)
        .to(o, { intensity: 0.25, speed: 0.7, duration: 1 }, 0.2);
      beat(tl, ".hg-b1", 0.9, 2.3);

      // 2 — Pulled together: the words spiral into a shell around the orb, which wakes up.
      pulse(tl, 2.4);
      tl.to(f, { m: 1, duration: 1.3 }, 2.5)
        .to(".hg-orb", { y: 0, scale: 0.78, duration: 1.3 }, 2.5)
        .to(o, { intensity: 1, speed: 2.2, hue: 0.2, duration: 1.3 }, 2.5);
      beat(tl, ".hg-b2", 2.9, 4.3);

      // 3 — Engineered: the shell bursts into three platforms; the orb settles into the middle one as its core.
      pulse(tl, 4.4, 1.3);
      tl.to(f, { m: 2, duration: 1.3 }, 4.5)
        .to(".hg-orb", { scale: 0.26, duration: 1.3 }, 4.5)
        .to(o, { intensity: 0.5, speed: 1, hue: 0.3, duration: 1.3 }, 4.5)
        .fromTo(".hg-tier", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.12 }, 5.3)
        .to(".hg-tier", { opacity: 0, duration: 0.3 }, 6.3);
      beat(tl, ".hg-b3", 4.9, 6.3);

      // 4 — It thinks: night falls; the platforms rewire into a network with signals running through it.
      pulse(tl, 6.4);
      tl.to(".hg-night", { opacity: 1, duration: 0.9 }, 6.4)
        .to(f, { dark: 1, m: 3, duration: 1.3 }, 6.5)
        .to(".hg-orb", { scale: 0.34, y: 0, duration: 1.3 }, 6.5)
        .to(o, { intensity: 1.15, hue: 1, speed: 2.4, duration: 1.3 }, 6.5);
      beat(tl, ".hg-b4", 6.9, 8.3);

      // 5 — Transformed: day returns and everything resolves into one mark.
      pulse(tl, 8.4, 1.4);
      tl.to(".hg-night", { opacity: 0, duration: 1 }, 8.5)
        .to(f, { dark: 0, m: 4, duration: 1.4 }, 8.5)
        .to(".hg-orb", { scale: 0.05, opacity: 0, duration: 1 }, 8.5)
        .to(o, { intensity: 0.35, hue: 0, speed: 1, duration: 1 }, 8.5);
      beat(tl, ".hg-final", 9.3);
      tl.to({}, { duration: 0.7 });
    }, root);

    const onMove = (e: PointerEvent) => {
      const mx = e.clientX / window.innerWidth - 0.5, my = e.clientY / window.innerHeight - 0.5;
      o.mx = mx; o.my = my; f.mx = mx; f.my = my;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { stopWaiting(); ctx.revert(); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <section ref={ref} className="hx hg" aria-label="Zyntraz — business transformation, engineered">
      <div className="hx-stage">
        <div className="hx-field" aria-hidden="true"><GradientField state={orb} /></div>
        <div className="hg-night" aria-hidden="true" />
        <div className="hg-orb" aria-hidden="true"><div className="hg-orb-in"><Orb state={orb} light /></div></div>
        <MorphField state={field} />
        <ul className="hg-tiers" aria-hidden="true">
          {tiers.map((t) => <li key={t} className="hg-tier"><i />{t}</li>)}
        </ul>

        <div className="hx-intro">
          <h1 className="hx-title">
            <span className="w">Your business is already a system.</span>
            <span className="w grad-text">It just wasn&apos;t designed as one.</span>
          </h1>
          <p className="hx-sub hx-fade">
            Zyntraz understands how your business works, then engineers the software, AI, data and automation to run it as one.
          </p>
          <div className="hx-ctas hx-fade">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment</Link>
            <Link href="/services" className="link-chev">See how we work <ChevronRight size={18} /></Link>
          </div>
        </div>

        <div className="hx-beat hg-b1">
          <h2>Right now, it runs <span className="grad-text">in pieces.</span></h2>
          <p>Chats, spreadsheets, invoices, inboxes and paper — each holding part of the truth.</p>
        </div>
        <div className="hx-beat hg-b2">
          <h2>Zyntraz pulls it <span className="grad-text">together.</span></h2>
          <p>We start by understanding how your business really works — every tool, step and person.</p>
        </div>
        <div className="hx-beat hg-b3">
          <h2>Then engineers it <span className="grad-text">into one.</span></h2>
          <p>Business, engineering and intelligence — built as layers of one system.</p>
        </div>
        <div className="hx-beat hg-b4 hg-dark-text">
          <h2>And teaches it <span className="grad-text">to think.</span></h2>
          <p>AI agents run through every layer — answering, forecasting, acting — with your team in control.</p>
        </div>
        <div className="hx-final hg-final">
          <h2>Business transformation, <span className="grad-text">engineered.</span></h2>
          <div className="hx-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment</Link>
            <Link href="/services" className="link-chev">See how we work <ChevronRight size={18} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
