"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { PLATFORM_CENTERS, swarmLayout, type SwarmState } from "@/components/3d/Particles";
import SkipSection from "@/components/ui/SkipSection";
import { EASE } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const Particles = dynamic(() => import("@/components/3d/Particles"), { ssr: false });

const chapters = [
  {
    tag: "Business Analysis & Design", title: <>We start with <span className="grad-text">how your business works.</span></>,
    desc: "Before writing a line of code, we map your operations, processes and bottlenecks — so every system we build fits how you work, not the other way around.",
    points: ["Process discovery", "Workflow redesign", "Roadmap & architecture"],
    href: "/services", cta: "See our approach",
  },
  {
    tag: "Software & Custom Systems", title: <>Software built around <span className="grad-text">how you actually work.</span></>,
    desc: "Custom software and business systems engineered from the ground up — POS, CRM, ERP, inventory and anything your operation needs, in one place.",
    points: ["Software development", "Custom system development", "Dashboards, data & IoT"],
    href: "/services", cta: "See our services",
  },
  {
    tag: "AI & Automation", title: <>AI that works <span className="grad-text">inside your systems.</span></>,
    desc: "Agents that answer customers on WhatsApp and email, qualify leads, process orders and automate the repetitive work — connected to your real data, with your team in control.",
    points: ["Sales & support agents", "Workflow automation", "Human-in-the-loop control"],
    href: "/ai", cta: "Explore Zyntraz AI",
  },
  {
    tag: "Ready-made Platforms", title: <>Purpose-built platforms, <span className="grad-text">tailored to you.</span></>,
    desc: "Launch fast on a Zyntraz platform, then we customise it to the way your business runs. Every one is AI-ready.",
    points: ["ZynRest — restaurants", "ZynStay — hospitality", "ZynDesk & ZynCRM — support and sales (coming soon)"],
    href: "/products", cta: "Explore the platforms",
  },
];

const platforms = ["ZynRest", "ZynStay", "ZynDesk", "ZynCRM"];

const subscribeResize = (cb: () => void) => { window.addEventListener("resize", cb); return () => window.removeEventListener("resize", cb); };
const getAspect = () => window.innerWidth / window.innerHeight;
const getServerAspect = () => 16 / 9;

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const swarm = useRef<SwarmState>({ m: 0, mx: 0, my: 0, a: 0 });
  const aspect = useSyncExternalStore(subscribeResize, getAspect, getServerAspect);

  useEffect(() => {
    const s = swarm.current;
    const onMove = (e: PointerEvent) => { s.mx = e.clientX / window.innerWidth - 0.5; s.my = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener("pointermove", onMove, { passive: true });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) { swarm.current.a = 1; return; }
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      gsap.set(".jr-ch, .jr-final, .jr-label", { autoAlpha: 0 });
      // Light → dark on entry, continuing the hero.
      // Opening beat, played while the section scrolls in: the hero orb's burst reassembles into the AI sphere.
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 20%", end: "top -25%", scrub: 0.8 } })
        // Fade through brand blue rather than grey.
        .fromTo(".jr-veil-in", { backgroundColor: "rgba(238,244,255,1)" }, { backgroundColor: "rgba(11,60,200,0)", duration: 0.8, ease: "power1.in" }, 0)
        .fromTo(swarm.current, { a: 0 }, { a: 1, duration: 1, ease: EASE.inOut }, 0)
        .fromTo(".skip-btn", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.6);
      chapters.forEach((_, k) => {
        const at = 2 * k + 0.6;
        tl.fromTo(`.jr-ch-${k}`, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.25)
          .fromTo(`.jr-ch-${k} .jr-pt`, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.08 }, at + 0.5)
          .to(`.jr-rail-${k}`, { opacity: 1, duration: 0.3 }, at + 0.25)
          .to(`.jr-ch-${k}`, { autoAlpha: 0, y: -60, duration: 0.45 }, at + 1.5)
          .to(`.jr-rail-${k}`, { opacity: 0.35, duration: 0.3 }, at + 1.6)
          .to(swarm.current, { m: k + 1, duration: 1, ease: "power1.inOut" }, at + 1.5);
      });
      tl.fromTo(".jr-label", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.08 }, 7.1)
        .to(".jr-label", { autoAlpha: 0, duration: 0.3 }, 8.0)
        .fromTo(".jr-rail-fill", { scaleX: 0 }, { scaleX: 1, duration: 8, ease: "none" }, 0.6)
        .to(".jr-rail", { autoAlpha: 0, duration: 0.4 }, 8.7)
        .fromTo(".jr-final", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 9.3)
        .to(".jr-final, .jr .skip-btn", { autoAlpha: 0, y: -30, duration: 0.5 }, 10.9)
        // The next section slides up over the scene like a curtain (see .jr + .hpain).
        .to({}, { duration: 0.8 });
    }, ref);

    return () => {
      ctx.revert();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const L = swarmLayout(aspect, 3);
  const labelPos = PLATFORM_CENTERS.map(([x, y]) => ({
    left: `${50 + ((L.offX + x * L.scale) / L.viewW) * 100}%`,
    top: `${50 - ((L.offY + (y - 0.7) * L.scale) / L.viewH) * 100}%`,
  }));

  return (
    <section ref={ref} className="jr dark" aria-label="What Zyntraz provides">
      <div className="jr-stage">
        <div className="jr-nebula" aria-hidden="true"><i /><i /></div>
        <div className="jr-canvas" aria-hidden="true"><Particles state={swarm} /></div>
        <div className="jr-veil jr-veil-in" aria-hidden="true" />

        <div className="jr-rail" aria-hidden="true">
          <div className="jr-rail-bar"><div className="jr-rail-fill" /></div>
          {chapters.map((c, k) => <span key={c.tag} className={`jr-rail-item jr-rail-${k}`}>{String(k + 1).padStart(2, "0")} {c.tag}</span>)}
        </div>

        {chapters.map((c, k) => (
          <article key={c.tag} className={`jr-ch jr-ch-${k}`}>
            <p className="jr-tag"><span>{String(k + 1).padStart(2, "0")}</span> {c.tag}</p>
            <h2>{c.title}</h2>
            <p className="jr-desc">{c.desc}</p>
            <ul>{c.points.map((p) => <li key={p} className="jr-pt"><Check size={16} /> {p}</li>)}</ul>
            <Link href={c.href} className="link-chev">{c.cta} <ChevronRight size={18} /></Link>
          </article>
        ))}

        {platforms.map((p, i) => (
          <span key={p} className="jr-label" style={labelPos[i]} aria-hidden="true">{p}</span>
        ))}

        <SkipSection />

        <div className="jr-final">
          <p className="jr-final-tag">We understand how your business works, then engineer the <span className="grad-text">software, AI and systems</span> it needs.</p>
          <p className="jr-final-list">Business Analysis · Software · AI · Data · Automation</p>
          <div className="cta-row">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment</Link>
            <Link href="/ai" className="link-chev">See it in action <ChevronRight size={18} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
