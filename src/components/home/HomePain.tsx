"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Bot, ChevronRight, FileSpreadsheet, Repeat } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const pains = [
  { icon: FileSpreadsheet, title: "Running on spreadsheets and WhatsApp.", desc: "Nobody has one version of the truth, so mistakes are guaranteed." },
  { icon: Repeat, title: "Your team does robot work.", desc: "Hours every week lost to copy-paste, re-typing and chasing approvals." },
  { icon: Bot, title: "AI that never leaves the demo.", desc: "Chatbots that don't know your business and can't act in your systems." },
];

export default function HomePain() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const l1 = SplitText.create(q(".hpk-1")[0], { type: "words,chars" });
      const l2 = SplitText.create(q(".hpk-2")[0], { type: "words,chars" });
      splits.push(l1, l2);
      // Phones wrap the line and set it smaller, so the break is gentler there to stay readable.
      const k = window.innerWidth < 760 ? 0.4 : 1;
      const r = (a: number, b: number) => gsap.utils.random(a, b) * k;

      // Both lines rise into place in 3D; then the second one — the systems — starts to break apart.
      gsap.timeline({ scrollTrigger: { trigger: q(".hpk")[0], start: "top 88%", end: "top 12%", scrub: 1 } })
        .from(l1.chars, { yPercent: 110, rotationX: -95, opacity: 0, transformOrigin: "50% 100% -20px", duration: 0.5, stagger: 0.015, ease: "power3.out" }, 0)
        .from(l2.chars, { yPercent: 110, rotationX: -95, opacity: 0, transformOrigin: "50% 100% -20px", duration: 0.5, stagger: 0.015, ease: "power3.out" }, 0.25)
        .to(l2.chars, {
          rotationX: () => r(25, 75), rotationZ: () => r(-16, 16), y: () => r(4, 46), z: () => r(-90, 70),
          transformOrigin: "50% 100%", duration: 0.7, stagger: { each: 0.03, from: "random" }, ease: "power2.in",
        }, 1.05);

      gsap.from(q(".hpain-item"), {
        rotationY: -35, rotationX: 12, z: -160, opacity: 0, transformOrigin: "0% 50%", duration: 1.1, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: q(".hpain-grid")[0], start: "top 85%", once: true },
      });
    });

    return () => { splits.forEach((s) => s.revert()); mm.revert(); };
  }, []);

  return (
    <section ref={ref} className="section alt hpain">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow pain" data-reveal>Sound familiar?</p>
          <h2 className="h-xl hpk" aria-label="Your business is growing. Your systems aren't.">
            <span className="hpk-1" aria-hidden="true">Your business is growing.</span>
            <span className="hpk-2 dim" aria-hidden="true">Your systems aren&apos;t.</span>
          </h2>
        </div>
        <div className="hpain-grid">
          {pains.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="hpain-item">
              <Icon size={28} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <div className="cta-row center" data-reveal>
          <Link href="/solutions" className="link-chev">See how we fix it <ChevronRight size={18} /></Link>
          <Link href="/solutions#calculator" className="link-chev">Calculate your hidden cost <ChevronRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
