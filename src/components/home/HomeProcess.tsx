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

// Stages float at increasing depth along the camera path, alternating sides; the last one lands centre stage.
const GAP = 1500;
const SIDE = [-1, 1, -1, 0] as const;

export default function HomeProcess() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const panels = q(".hf-panel") as HTMLElement[];
      const narrow = () => window.innerWidth < 760;
      const off = () => (narrow() ? 0.1 : 0.2) * window.innerWidth;
      gsap.set(panels, { xPercent: -50, yPercent: -50, x: (i) => SIDE[i] * off(), z: (i) => -(i + 1) * GAP });

      // Depth fog on the way in, a quick fade as each stage passes the camera.
      const fog = (worldZ: number) => panels.forEach((p, i) => {
        const z = -(i + 1) * GAP + worldZ;
        const far = gsap.utils.clamp(0, 1, (z + 3400) / 2200);
        const near = gsap.utils.clamp(0, 1, 1 - (z - 150) / 450);
        gsap.set(p, { opacity: Math.min(far, near) });
      });
      const cam = { z: 0 };
      const END = 4 * GAP - 250;
      fog(0);

      gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      })
        .to(cam, { z: END, duration: 1, ease: "none", onUpdate: () => { gsap.set(q(".hf-world")[0], { z: cam.z }); fog(cam.z); } }, 0)
        .fromTo(q(".hf-floor"), { backgroundPositionY: "0px" }, { backgroundPositionY: `${END * 0.35}px`, duration: 1, ease: "none" }, 0)
        .fromTo(q(".hf-rail-fill"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0)
        .fromTo(q(".hf-head"), { opacity: 1, y: 0 }, { opacity: 0.25, y: -20, duration: 0.2 }, 0.05);

      q(".hf-rail-item").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: root, start: () => `top+=${(i / 4) * (root.offsetHeight - window.innerHeight)} top`, end: () => `top+=${((i + 1) / 4) * (root.offsetHeight - window.innerHeight)} top`,
          invalidateOnRefresh: true, onToggle: (st) => el.classList.toggle("is-on", st.isActive),
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="hf" aria-label="The transformation model">
      <div className="hf-stage">
        <div className="hf-floor" aria-hidden="true" />
        <div className="container hf-head">
          <p className="eyebrow">The transformation model</p>
          <h2 className="h-lg">From how you work today <span className="grad-text">to how you should.</span></h2>
        </div>

        <div className="hf-space">
          <ol className="hf-world">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="hf-panel">
                <span className="hf-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="hf-ico"><Icon size={24} /></span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="hf-rail" aria-hidden="true">
          <div className="hf-rail-bar"><div className="hf-rail-fill" /></div>
          {steps.map((s, i) => <span key={s.title} className="hf-rail-item">{String(i + 1).padStart(2, "0")} {s.title}</span>)}
        </div>
      </div>
    </section>
  );
}
