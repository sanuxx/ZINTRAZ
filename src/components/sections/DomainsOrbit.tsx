"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Boxes, BrainCircuit, Code2, Compass, LayoutDashboard } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Grid slots around the business-understanding core: top-left, top-right, bottom-left, bottom-right.
const nodes = [
  { pos: "tl", icon: Code2, title: "Software & Custom Systems", desc: "POS, CRM, ERP, portals and web platforms, engineered around how you work.", tags: ["Web & software", "APIs", "Custom systems"] },
  { pos: "tr", icon: BrainCircuit, title: "AI & Automation", desc: "Agents and workflow automation that act inside your systems, with your team in control.", tags: ["AI agents", "Workflow automation", "Human-in-the-loop"] },
  { pos: "bl", icon: LayoutDashboard, title: "Data & Analytics", desc: "Dashboards, reporting and forecasting built on your real data.", tags: ["Dashboards", "Forecasting", "Reporting"] },
  { pos: "br", icon: Boxes, title: "Connected Systems", desc: "Integrations, IoT and telemetry that link your operation together.", tags: ["Integrations", "IoT & telemetry", "APIs"] },
];

// Beams run from the core's side edges to the nearest edge of each card. Uses offset* so
// in-flight card transforms don't skew the geometry.
function layoutBeams(root: HTMLElement) {
  const orbit = root.querySelector<HTMLElement>(".hd-orbit");
  const core = root.querySelector<HTMLElement>(".hd-core");
  const svg = root.querySelector<SVGSVGElement>(".hd-beams");
  if (!orbit || !core || !svg) return;
  svg.setAttribute("viewBox", `0 0 ${orbit.offsetWidth} ${orbit.offsetHeight}`);
  const beams = svg.querySelectorAll<SVGPathElement>(".hd-beam");
  const flows = svg.querySelectorAll<SVGPathElement>(".hd-flow");
  root.querySelectorAll<HTMLElement>(".hd-node").forEach((n, i) => {
    const left = n.offsetLeft + n.offsetWidth / 2 < core.offsetLeft + core.offsetWidth / 2;
    const top = i < 2;
    const sx = left ? core.offsetLeft : core.offsetLeft + core.offsetWidth;
    const sy = core.offsetTop + core.offsetHeight * (top ? 0.3 : 0.7);
    const ex = left ? n.offsetLeft + n.offsetWidth : n.offsetLeft;
    const ey = n.offsetTop + n.offsetHeight / 2;
    const k = (sx - ex) / 2;
    const d = `M ${sx} ${sy} C ${sx - k} ${sy}, ${ex + k} ${ey}, ${ex} ${ey}`;
    beams[i]?.setAttribute("d", d);
    flows[i]?.setAttribute("d", d);
  });
}

export default function DomainsOrbit() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const relayout = () => layoutBeams(root);
    relayout();
    ScrollTrigger.addEventListener("refreshInit", relayout);

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add({
        desktop: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
      }, (c) => {
        const core = root.querySelector<HTMLElement>(".hd-core")!;
        const cards = gsap.utils.toArray<HTMLElement>(".hd-node", root);

        if (c.conditions?.desktop) {
          const beams = gsap.utils.toArray<SVGPathElement>(".hd-beam", root);
          // Each card starts inside the core and flies out to its slot.
          const fromCore = (axis: "x" | "y") => (_: number, n: HTMLElement) => axis === "x"
            ? core.offsetLeft + core.offsetWidth / 2 - (n.offsetLeft + n.offsetWidth / 2)
            : core.offsetTop + core.offsetHeight / 2 - (n.offsetTop + n.offsetHeight / 2);
          const len = (_: number, el: SVGPathElement) => el.getTotalLength();

          gsap.timeline({
            defaults: { ease: "power3.out" },
            // No invalidateOnRefresh: re-recording would drop the cards' hidden start state until the playhead reached them.
            scrollTrigger: { trigger: ".hd-pin", start: "top top", end: "bottom bottom", scrub: 1 },
          })
            .fromTo(core, { scale: 0.55, opacity: 0, filter: "blur(18px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1 }, 0)
            .fromTo(".hd-core-halo", { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, 0.1)
            .fromTo(cards,
              { x: fromCore("x"), y: fromCore("y"), scale: 0.2, opacity: 0, rotationX: 28, filter: "blur(10px)" },
              { x: 0, y: 0, scale: 1, opacity: 1, rotationX: 0, filter: "blur(0px)", duration: 1.3, stagger: 0.25 }, 0.9)
            .fromTo(beams, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.3, stagger: 0.25, ease: "power2.out" }, 0.9)
            .fromTo(".hd-tags span", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.025 }, 2.5)
            .fromTo(".hd-flow", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2.9)
            .fromTo(".hd-core-cta", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 2.9)
            .to({}, { duration: 0.9 });
        } else {
          [core, ...cards].forEach((el) => {
            gsap.from(el, {
              y: 60, opacity: 0, scale: 0.94, filter: "blur(8px)", duration: 1.1, ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          });
        }
      });

    }, root);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", relayout);
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} className="hd" id="services" aria-labelledby="hd-title">
      <div className="hd-pin">
        <div className="hd-stage">
          <div className="hd-glow" aria-hidden="true" />
          <div className="container">
            <div className="hd-head">
              <p className="eyebrow">What we engineer</p>
              <h2 id="hd-title" className="h-xl" data-reveal>Business transformation, <span className="grad-text">engineered.</span></h2>
            </div>

            <div className="hd-orbit">
              <svg className="hd-beams" aria-hidden="true">
                <defs>
                  <linearGradient id="hd-grad" x1="0" x2="1">
                    <stop offset="0" stopColor="#4d8dff" /><stop offset=".5" stopColor="#a78bff" /><stop offset="1" stopColor="#5fe3ff" />
                  </linearGradient>
                </defs>
                {nodes.map((n) => <path key={`b-${n.pos}`} className="hd-beam" />)}
                {nodes.map((n) => <path key={`f-${n.pos}`} className="hd-flow" />)}
              </svg>

              <Link href="/contact" className="hd-core">
                <span className="hd-core-halo" aria-hidden="true" />
                <span className="hd-core-badge">Where we start</span>
                <span className="hd-core-ico"><Compass size={30} /></span>
                <h3>Business Understanding</h3>
                <p>We map your operations, processes and goals before recommending any technology.</p>
                <span className="hd-tags"><span>Process discovery</span><span>Workflow redesign</span><span>Roadmap &amp; architecture</span></span>
                <span className="hd-core-cta">Start a transformation assessment <ArrowRight size={16} /></span>
              </Link>

              {nodes.map(({ pos, icon: Icon, title, desc, tags }) => (
                <div key={pos} className={`hd-node hd-${pos}`}>
                  <span className="hd-node-ico"><Icon size={20} /></span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <span className="hd-tags">{tags.map((t) => <span key={t}>{t}</span>)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
