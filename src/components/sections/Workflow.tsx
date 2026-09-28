"use client";

import { useEffect, useRef } from "react";
import { Search, Layers, PenTool, Terminal, CheckCircle, Shield, Rocket, Activity } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { group: "Understand", title: "Discovery & Strategy", desc: "Deep discovery into your operational problems, business goals and constraints — before writing a single line of code.", icon: Search },
  { group: "Design", title: "Architecture & Planning", desc: "Designing the data model, choosing the right technology and planning every integration your operation depends on.", icon: Layers },
  { group: "Design", title: "Experience design", desc: "Prototypes your team can click through, shaped around the people who will use the system every day.", icon: PenTool },
  { group: "Engineer", title: "Build", desc: "Focused sprints with weekly demos. Clean, modular code — no black-box development.", icon: Terminal },
  { group: "Engineer", title: "Quality assurance", desc: "Automated tests, stress testing and edge cases resolved before anything reaches your team.", icon: CheckCircle },
  { group: "Engineer", title: "Security", desc: "Penetration testing, encryption checks and compliance reviews to keep your business data safe.", icon: Shield },
  { group: "Transform", title: "Launch", desc: "A zero-downtime launch, monitoring from day one and training for your team.", icon: Rocket },
  { group: "Transform", title: "Continuous evolution", desc: "Monitoring, optimisation and new features as your business grows. A long-term partnership, not a hand-off.", icon: Activity },
];

export default function Workflow() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const track = ref.current!.querySelector<HTMLElement>(".process-track")!;
        const dist = () => track.scrollWidth - window.innerWidth;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".process-pin", start: "top top", end: () => `+=${dist()}`,
            pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          },
        });
        tl.to(track, { x: () => -dist(), ease: "none" }, 0)
          .to(".process-bar > div", { scaleX: 1, ease: "none" }, 0);
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="process" id="process">
      <div className="process-pin">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 48 }}>
            <span className="eyebrow" data-reveal>How we work</span>
            <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".1s" }}>Understand, design, engineer, <span className="grad-text">transform.</span></h2>
            <p className="lede" data-reveal style={{ ["--d" as string]: ".2s" }}>
              Eight phases, from the first conversation to continuous improvement — with real progress every week and no surprises.
            </p>
          </div>
        </div>
        <div className="process-track">
          {steps.map(({ group, title, desc, icon: Icon }, i) => (
            <article key={title} className="phase">
              <span className="phase-tag">{group}</span>
              <div className="phase-top">
                <span className="phase-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="phase-ico"><Icon size={22} /></span>
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
        <div className="process-bar" aria-hidden="true"><div /></div>
      </div>
    </section>
  );
}
