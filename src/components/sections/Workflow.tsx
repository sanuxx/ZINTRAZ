"use client";

import { useEffect, useRef } from "react";
import { MessagesSquare, Search, Compass, Layers, Terminal, Rocket, Activity } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The phase tag groups each phase under the four-step model shown on the homepage.
const steps = [
  { title: "Consultation", stage: "Understand", desc: "A free, no-commitment conversation about your business, your goals and what's slowing you down.", icon: MessagesSquare },
  { title: "Business Analysis", stage: "Understand", desc: "We map your processes, roles, bottlenecks and information flows — how the business really runs today.", icon: Search },
  { title: "Strategy", stage: "Design", desc: "We decide what to change, what to build and what to automate — and where AI will actually pay off.", icon: Compass },
  { title: "System Design", stage: "Design", desc: "Architecture, data model and user experience designed together, with a prototype on your real workflows.", icon: Layers },
  { title: "Build", stage: "Engineer", desc: "Focused sprints with weekly demos and testing throughout — you see real progress, with no surprises.", icon: Terminal },
  { title: "Deployment", stage: "Engineer", desc: "We launch, migrate your data, connect your existing tools and train your team.", icon: Rocket },
  { title: "Ongoing Support", stage: "Transform", desc: "Support, monitoring, optimisation and new modules as your business grows. We don't disappear after launch.", icon: Activity },
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
            <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".1s" }}>From first conversation <span className="grad-text">to continuous support.</span></h2>
            <p className="lede" data-reveal style={{ ["--d" as string]: ".2s" }}>
              Understand, design, engineer, transform — seven phases, with real progress every week and no surprises.
            </p>
          </div>
        </div>
        <div className="process-track">
          {steps.map(({ title, stage, desc, icon: Icon }, i) => (
            <article key={title} className="glass spot phase">
              <div className="phase-top">
                <span className="phase-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="phase-ico"><Icon size={22} /></span>
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="phase-tag">{stage}</span>
            </article>
          ))}
        </div>
        <div className="process-bar" aria-hidden="true"><div /></div>
      </div>
    </section>
  );
}
