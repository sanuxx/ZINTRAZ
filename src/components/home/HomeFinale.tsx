"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  BarChart3, Bot, CalendarCheck, ChevronRight, Contact, CreditCard, Landmark, Mail, Package, Receipt, ShoppingBag, Truck, Users,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { WHATSAPP } from "@/lib/contact";

gsap.registerPlugin(ScrollTrigger);

const modules: [string, LucideIcon][] = [
  ["Orders", ShoppingBag], ["Inventory", Package], ["Suppliers", Truck], ["Payments", CreditCard], ["Invoicing", Receipt], ["Bookings", CalendarCheck],
  ["Staff", Users], ["Inbox", Mail], ["Reports", BarChart3], ["CRM", Contact], ["AI agents", Bot], ["Accounts", Landmark],
];

// The modules orbit the headline on a tilted ring. Depth is projected by hand each frame — size, blur,
// opacity and stacking follow the angle — so front chips pass over the headline and back chips behind it.
export default function HomeFinale() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const chips = gsap.utils.toArray<HTMLElement>(".fo-chip", root);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { spin: 0, scroll: 0 };

    const place = () => {
      const w = root.clientWidth, narrow = w < 760;
      const rx = narrow ? w * 0.44 : Math.min(620, w * 0.4), ry = narrow ? 155 : 170;
      chips.forEach((c, i) => {
        const a = (i / chips.length) * Math.PI * 2 + state.spin + state.scroll;
        const d = Math.cos(a); // 1 = nearest the viewer, -1 = furthest
        const t = (d + 1) / 2;
        gsap.set(c, {
          xPercent: -50, yPercent: -50, x: Math.sin(a) * rx, y: d * ry, scale: 0.62 + t * 0.48, opacity: 0.3 + t * 0.7,
          filter: `blur(${(1 - t) * 3}px)`, zIndex: d > 0 ? 3 : 1, rotationY: Math.sin(a) * -18,
        });
      });
    };
    place();
    if (reduce) return;

    const tick = () => { state.spin += 0.0022; place(); };
    const onScreen = ScrollTrigger.create({
      trigger: root, start: "top bottom", end: "bottom top",
      onToggle: (st) => (st.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
    });
    const spin = gsap.to(state, {
      scroll: Math.PI, ease: "none", onUpdate: place,
      scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 },
    });

    return () => { gsap.ticker.remove(tick); onScreen.kill(); spin.scrollTrigger?.kill(); spin.kill(); };
  }, []);

  return (
    <section ref={ref} className="fo">
      <div className="fo-glow" aria-hidden="true" />
      <div className="fo-copy">
        <div className="fo-core">
          <div className="fo-orbit" aria-hidden="true">
            {modules.map(([name, Icon]) => (
              <span key={name} className="fo-chip"><Icon size={16} /> {name}</span>
            ))}
          </div>
          <h2 className="h-xl">Tell us how your business works. <span className="grad-text">We&apos;ll show you what could be transformed.</span></h2>
        </div>
        <p className="lede">No commitment. We&apos;ll map your operations, pinpoint where software, AI and automation will pay off first, and outline a clear roadmap.</p>
        <div className="cta-row">
          <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment</Link>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="link-chev">Chat on WhatsApp <ChevronRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}
