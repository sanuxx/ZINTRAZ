"use client";

import { useEffect, useRef } from "react";
import { Hammer, PencilRuler, Search, TrendingUp } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { icon: Search, title: "Understand", desc: "We map your processes, roles, bottlenecks, information flows and business goals — before recommending any technology." },
  { icon: PencilRuler, title: "Design", desc: "We redesign the processes that slow you down and define the future operating model, with a working prototype on your real workflows." },
  { icon: Hammer, title: "Engineer", desc: "We build the software, data, AI and automation it needs — in focused sprints with weekly demos." },
  { icon: TrendingUp, title: "Transform", desc: "We deploy, train your team and measure the results — then keep optimising and expanding." },
];

export default function HomeProcess() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const st = { trigger: ".hp-track", start: "top 75%", end: "bottom 55%", scrub: true };
      gsap.fromTo(".hp-line-fill", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st });
      gsap.fromTo(".hp-line-fill-v", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st });
      gsap.utils.toArray<HTMLElement>(".hp-step").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0.25, y: 30 }, {
          opacity: 1, y: 0, ease: "none",
          scrollTrigger: { trigger: ".hp-track", start: `top ${75 - i * 7}%`, end: `top ${60 - i * 7}%`, scrub: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section hp">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow" data-reveal>The transformation model</p>
          <h2 className="h-xl" data-reveal>From how you work today <span className="grad-text">to how you should.</span></h2>
        </div>
        <div className="hp-track">
          <div className="hp-line" aria-hidden="true"><div className="hp-line-fill" /><div className="hp-line-fill-v" /></div>
          <ol className="hp-steps">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="hp-step">
                <span className="hp-node"><Icon size={22} /></span>
                <span className="hp-num">Step {i + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
