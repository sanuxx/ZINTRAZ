"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { AssemblyState } from "@/components/3d/SystemScene";
import { whenReady } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

const SystemScene = dynamic(() => import("@/components/3d/SystemScene"), { ssr: false });

const tiers = ["Business", "Engineering", "Intelligence"];

export default function HeroAssembly() {
  const ref = useRef<HTMLElement>(null);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Reduced motion shows the finished system as a single still frame.
  const state = useRef<AssemblyState>(reduce ? { fly: 1, build: 1, pulse: 1, orbit: 0, mx: 0, my: 0 } : { fly: 0, build: 0, pulse: 0, orbit: 0, mx: 0, my: 0 });
  const labels = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const root = ref.current!;
    const s = state.current;
    let stopWaiting = () => {};

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ paused: true, delay: 0.05 });
      stopWaiting = whenReady(() => intro.play());
      intro
        .fromTo(".ha-canvas", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2.2, ease: "expo.out" }, 0)
        .fromTo(".hx-title .w", { opacity: 0, y: 60, filter: "blur(20px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, stagger: 0.18, ease: "expo.out" }, 0.3)
        .fromTo(".hx-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" }, 0.9);

      if (reduce) { gsap.set(".ha-label", { opacity: 1 }); return; }

      const beat = (tl: gsap.core.Timeline, sel: string, at: number, out?: number) => {
        tl.fromTo(sel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 }, at);
        if (out !== undefined) tl.to(sel, { opacity: 0, y: -40, duration: 0.4 }, out);
      };
      const tl = gsap.timeline({ defaults: { ease: "power1.inOut" }, scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1 } });
      tl.to(".hx-intro", { opacity: 0, y: -70, duration: 0.7 }, 0)
        // Into the debris.
        .to(s, { fly: 1, duration: 1.7 }, 0)
        // Every fragment flies home; the system builds from the ground up.
        .to(s, { build: 1, duration: 1.9, ease: "none" }, 2)
        .to(".ha-label", { opacity: 1, duration: 0.3, stagger: 0.12 }, 3.4)
        // A pulse of intelligence rises through the tiers.
        .to(s, { pulse: 1, duration: 1.4 }, 4.2)
        // Slow orbit of the finished system.
        .to(s, { orbit: 1, duration: 1.7 }, 5.5)
        .to({}, { duration: 0.5 });
      beat(tl, ".ha-b1", 0.7, 1.9);
      beat(tl, ".ha-b2", 2.3, 4);
      beat(tl, ".ha-b3", 4.2, 5.6);
      beat(tl, ".ha-final", 5.9);
    }, root);

    const onMove = (e: PointerEvent) => { s.mx = e.clientX / window.innerWidth - 0.5; s.my = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { stopWaiting(); ctx.revert(); window.removeEventListener("pointermove", onMove); };
    // reduce is read once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={ref} className="hx ha" aria-label="Zyntraz — your business, engineered into one intelligent system">
      <div className="hx-stage">
        <SystemScene state={state} labels={labels} />
        <div className="ha-labels" aria-hidden="true">
          {tiers.map((t, i) => (
            <span key={t} ref={(el) => { labels.current[i] = el; }} className={`ha-label ha-label-${i}`}><i />{t}</span>
          ))}
        </div>

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

        <div className="hx-beat ha-beat ha-b1">
          <h2>Right now, it&apos;s in pieces.</h2>
          <p>Orders, stock, invoices, bookings, people — scattered across chats, spreadsheets and memory.</p>
        </div>
        <div className="hx-beat ha-beat ha-b2">
          <h2>Zyntraz engineers it <span className="grad-text">into one.</span></h2>
          <p>Every piece placed with purpose — business, engineering and intelligence, built as one system.</p>
        </div>
        <div className="hx-beat ha-beat ha-b3">
          <h2>Then it <span className="grad-text">comes alive.</span></h2>
          <p>AI works through every layer — answering, forecasting, acting — with your team in control.</p>
        </div>
        <div className="hx-final ha-beat ha-final">
          <h2>One intelligent <span className="grad-text">business system.</span></h2>
          <div className="hx-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment</Link>
            <Link href="/services" className="link-chev">See how we work <ChevronRight size={18} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
