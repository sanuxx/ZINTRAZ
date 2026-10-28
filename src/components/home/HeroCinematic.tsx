"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowRight, ChevronRight } from "lucide-react";
import { createOrbState, type OrbState } from "@/components/3d/Orb";
import { whenReady } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

const Orb = dynamic(() => import("@/components/3d/Orb"), { ssr: false });
const GradientField = dynamic(() => import("@/components/3d/GradientField"), { ssr: false });

export default function HeroCinematic() {
  const ref = useRef<HTMLElement>(null);
  const orb = useRef<OrbState>(createOrbState());

  useEffect(() => {
    const root = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const H = () => window.innerHeight;
    const s = orb.current;
    let stopWaiting = () => {};

    const ctx = gsap.context(() => {
      // Intro — held until the logo intro hands off.
      const intro = gsap.timeline({ paused: true, delay: 0.05 });
      stopWaiting = whenReady(() => intro.play());
      intro
        .fromTo(".hx-orb-inner", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 2.4, ease: "expo.out" })
        .fromTo(s, { intensity: 0 }, { intensity: 0.4, duration: 2.4, ease: "power2.out" }, 0)
        .fromTo(".hx-glow", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 2.6, ease: "expo.out" }, 0)
        .fromTo(".hx-title .w", { opacity: 0, y: 60, filter: "blur(20px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, stagger: 0.14, ease: "expo.out" }, 0.4)
        .fromTo(".hx-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" }, 1.0);

      if (reduce) return;

      // Orb starts low, rising from the bottom edge, so the headline and CTAs stay clear.
      gsap.set(".hx-orb", { y: () => H() * 0.17, scale: 0.9 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      });

      tl.to(".hx-intro", { opacity: 0, y: -80, duration: 1 }, 0)
        .to(".hx-orb", { y: 0, scale: 1.08, duration: 1 }, 0)

        .to(s, { warp: 1, duration: 0.45, ease: "power2.in" }, 0.45)
        .to(s, { warp: 0, duration: 0.6, ease: "power2.out" }, 0.9)

        // Beat 1 — listens
        .fromTo(".hx-b1", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7 }, 1)
        .to(s, { intensity: 0.75, duration: 1.4 }, 1.5)
        .to(".hx-b1", { opacity: 0, y: -50, duration: 0.6 }, 3.3)

        .to(s, { warp: 1, duration: 0.4, ease: "power2.in" }, 3.4)
        .to(s, { warp: 0, duration: 0.6, ease: "power2.out" }, 3.8)

        // Beat 2 — reasons
        .fromTo(".hx-b2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7 }, 3.9)
        .to(s, { intensity: 1.15, hue: 1, speed: 2.4, duration: 1 }, 3.9)
        .to(".hx-orb", { scale: 1.2, duration: 1.2 }, 3.9)
        .to(".hx-b2", { opacity: 0, y: -50, duration: 0.6 }, 5.9)

        .to(s, { warp: 1, duration: 0.4, ease: "power2.in" }, 6.0)
        .to(s, { warp: 0, duration: 0.6, ease: "power2.out" }, 6.4)

        // Beat 3 — acts
        .fromTo(".hx-b3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7 }, 6.5)
        .to(s, { intensity: 0.6, hue: 0.3, speed: 1.3, duration: 1 }, 6.5)
        .to(".hx-orb", { scale: 0.95, duration: 1 }, 6.5)
        .to(".hx-b3", { opacity: 0, y: -50, duration: 0.6 }, 8.7)

        .to(s, { warp: 1.4, duration: 0.5, ease: "power2.in" }, 8.7)
        .to(s, { warp: 0, duration: 0.8, ease: "power2.out" }, 9.2)

        // Final
        .to(s, { intensity: 0.35, hue: 0, speed: 1, duration: 1 }, 9.2)
        .to(".hx-orb", { scale: 0.85, y: () => H() * 0.04, duration: 1 }, 9.2)
        .fromTo(".hx-final", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 }, 9.4)
        .to({}, { duration: 0.4 });

      // Handover, played while the hero scrolls away: the orb bursts; the particle universe below reassembles it.
      gsap.timeline({ scrollTrigger: { trigger: root, start: "bottom bottom", end: "bottom 25%", scrub: 0.8 } })
        .to(s, { intensity: 1.3, speed: 3.2, duration: 0.8 }, 0)
        .to(".hx-orb", { scale: 2.1, opacity: 0, duration: 1, ease: "power2.in" }, 0);
    }, root);

    const onMove = (e: PointerEvent) => {
      s.mx = e.clientX / window.innerWidth - 0.5;
      s.my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { stopWaiting(); ctx.revert(); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <section ref={ref} className="hx" aria-label="Zintraz — business transformation, engineered">
      <div className="hx-stage">
        <div className="hx-field" aria-hidden="true"><GradientField state={orb} /></div>
        <div className="hx-glow" aria-hidden="true" />
        <div className="hx-orb" aria-hidden="true">
          <div className="hx-orb-inner"><Orb state={orb} light /></div>
        </div>

        <div className="hx-intro">
          <h1 className="hx-title">
            <span className="w">Business transformation,</span>{" "}
            <span className="w grad-text">engineered.</span>
          </h1>
          <p className="hx-sub hx-fade">
            We understand how your business works, then engineer the software, AI, data and automation it needs — from strategy to system.
          </p>
          <div className="hx-ctas hx-fade">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment</Link>
            <Link href="/how-we-work" className="link-chev">See how we work <ChevronRight size={18} /></Link>
          </div>
          <ul className="hx-trust hx-fade">
            <li><b>Analysis</b> before technology</li>
            <li><b>One team</b> from strategy to support</li>
            <li><b>100%</b> human-approved AI</li>
          </ul>
        </div>

        <div className="hx-beat hx-b1">
          <h2>We understand.</h2>
          <p>Every order, message, invoice and signal — we map how your business really runs before recommending any technology.</p>
        </div>
        <div className="hx-beat hx-b2">
          <h2><span className="grad-text">We design.</span></h2>
          <p>We find the bottlenecks and design the right process and system — with AI only where it pays off.</p>
        </div>
        <div className="hx-beat hx-b3">
          <h2>We engineer.</h2>
          <p>Software, data, AI and automation, built and connected — so quotes, reorders, approvals and reports just happen.</p>
        </div>

        <div className="hx-final">
          <h2>Then we <span className="grad-text">keep it evolving.</span></h2>
          <p>Support, monitoring and new modules as your business grows. That&apos;s business transformation engineering — that&apos;s Zintraz.</p>
          <div className="hx-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment <ArrowRight size={17} /></Link>
            <Link href="/services" className="link-chev">Explore our services <ChevronRight size={18} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
