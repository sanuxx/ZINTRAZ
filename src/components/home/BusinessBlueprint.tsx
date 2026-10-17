"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Boxes, ChevronRight, Eye, Send, Workflow } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// "See your business. Connected." — the home page's custom-systems tile. The hands-on builder now has its own
// page (/system-builder); this tile keeps the message and shows the four things a visitor can do there.
const steps = [
  { Icon: Boxes, title: "Drag in your modules", desc: "Nearly 100 building blocks, from POS and stock to AI agents and IoT sensors." },
  { Icon: Workflow, title: "Design your workflows", desc: "When an order lands, stock runs low or a booking is made, decide what happens next." },
  { Icon: Eye, title: "Experience your system", desc: "Step inside the app you designed, in your name and colours, on any device." },
  { Icon: Send, title: "Send us the blueprint", desc: "We review it and reply within 24 hours with a plan, timeline and estimate." },
];

export default function BusinessBlueprint() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(q(".bb-title")[0], { type: "words", mask: "words" });
      splits.push(split);
      gsap.from(split.words, { yPercent: 115, rotation: 4, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%", once: true } });
      gsap.from(q(".bb-head .tile-eyebrow, .bb-head .tile-sub, .bb-head .tile-links"), { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
      gsap.from(q(".bbt-step"), { y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: q(".bbt")[0], start: "top 85%", once: true } });
    });
    return () => { splits.forEach((s) => s.revert()); mm.revert(); };
  }, []);

  return (
    <article ref={ref} className="tile tile-full alt bb">
      <div className="bb-head">
        <p className="tile-eyebrow">Custom Business Systems</p>
        <h2 className="bb-title">See your business. <span className="grad-text">Connected.</span></h2>
        <p className="tile-sub">Pick what you run and the parts you need. Connect them, automate the work between them — and see the system it all adds up to.</p>
        <div className="tile-links">
          <Link href="/system-builder" className="btn btn-primary">Build your system</Link>
          <Link href="/contact" className="link-chev">Start a transformation assessment <ChevronRight size={18} /></Link>
        </div>
      </div>

      <div className="bbt" data-keep>
        <ol className="bbt-steps">
          {steps.map(({ Icon, title, desc }, i) => (
            <li key={title} className="bbt-step">
              <span className="bbt-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="bbt-ico"><Icon size={20} /></span>
              <b>{title}</b>
              <p>{desc}</p>
            </li>
          ))}
        </ol>
        <Link href="/system-builder" className="bbt-cta">
          <span><b>Open the system builder</b><small>Start from a template for your industry, or a blank canvas. Free, no sign-up.</small></span>
          <ArrowRight size={20} />
        </Link>
      </div>
    </article>
  );
}
