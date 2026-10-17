"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { steps } from "./data";

gsap.registerPlugin(ScrollTrigger);

/**
 * 04 Our Approach. On desktop the section pins and scrolling turns a dial through the six steps: the
 * progress arc draws, each node lights as it is reached and the step in the centre hands over to the
 * next. On phones it is a vertical timeline whose line fills as you scroll.
 */
const R = 230, C = 260;
// Rounded so the server and client render identical coordinates.
const rnd = (n: number) => Math.round(n * 100) / 100;
const node = (i: number) => {
  const a = (-90 + i * 60) * (Math.PI / 180);
  return { x: rnd(C + Math.cos(a) * R), y: rnd(C + Math.sin(a) * R) };
};

export default function ApproachDial({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const section = el.closest("section")!;
    const q = gsap.utils.selector(el);
    const items = q(".ail-ap-list > li") as HTMLElement[];
    const rail = q(".ail-ap-rail li") as HTMLElement[];
    const dots = gsap.utils.toArray<SVGGElement>(".ail-ap-node", el);
    const mm = gsap.matchMedia();

    const mark = (k: number) => {
      rail.forEach((r, i) => r.classList.toggle("is-on", i === k));
      rail.forEach((r, i) => r.classList.toggle("is-done", i < k));
      dots.forEach((d, i) => d.classList.toggle("is-on", i <= k));
    };

    mm.add("(min-width: 1001px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(items, { opacity: 0, y: 30 });
      gsap.set(items[0], { opacity: 1, y: 0 });
      let last = -1;
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: section, pin: true, start: "top top", end: () => `+=${window.innerHeight * 3.2}`, scrub: 0.7, anticipatePin: 1,
          onUpdate: (self) => {
            const k = Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999 + 0.0001));
            if (k !== last) { last = k; mark(k); }
          },
        },
      });
      tl.fromTo(q(".ail-ap-arc"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", duration: steps.length }, 0)
        .fromTo(q(".ail-ap-ticks"), { rotate: 0 }, { rotate: 120, ease: "none", duration: steps.length, svgOrigin: `${C} ${C}` }, 0);
      for (let i = 1; i < steps.length; i++) {
        tl.to(items[i - 1], { opacity: 0, y: -30, duration: 0.3 }, i - 0.15)
          .to(items[i], { opacity: 1, y: 0, duration: 0.3 }, i + 0.05);
      }
      mark(0);
      return () => { last = -1; rail.forEach((r) => r.classList.remove("is-on", "is-done")); dots.forEach((d) => d.classList.remove("is-on")); };
    });

    mm.add("(max-width: 1000px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(q(".ail-ap-list"), { "--fill": 0 }, { "--fill": 1, ease: "none", scrollTrigger: { trigger: q(".ail-ap-list")[0], start: "top 70%", end: "bottom 60%", scrub: true } });
      items.forEach((it) => gsap.from(it, { x: 30, opacity: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: it, start: "top 85%", once: true } }));
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="ail-ap">
      <div className="ail-ap-side">
        {children}
        <ol className="ail-ap-rail" aria-hidden="true">
          {steps.map((s, i) => <li key={s.title}><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</li>)}
        </ol>
      </div>
      <div className="ail-ap-dial">
        <svg viewBox={`0 0 ${C * 2} ${C * 2}`} aria-hidden="true">
          <defs>
            <linearGradient id="ail-ap-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b8bff" /><stop offset="1" stopColor="#6d5dfc" /></linearGradient>
          </defs>
          <g className="ail-ap-ticks">
            {Array.from({ length: 72 }, (_, i) => {
              const a = (i * 5 * Math.PI) / 180, r1 = R + 26, r2 = R + (i % 6 ? 32 : 40);
              return <line key={i} x1={rnd(C + Math.cos(a) * r1)} y1={rnd(C + Math.sin(a) * r1)} x2={rnd(C + Math.cos(a) * r2)} y2={rnd(C + Math.sin(a) * r2)} />;
            })}
          </g>
          <circle className="ail-ap-track" cx={C} cy={C} r={R} />
          <circle className="ail-ap-arc" cx={C} cy={C} r={R} pathLength={1} transform={`rotate(-90 ${C} ${C})`} />
          <circle className="ail-ap-inner" cx={C} cy={C} r={R - 46} />
          {steps.map((s, i) => {
            const p = node(i);
            return (
              <g key={s.title} className={`ail-ap-node${i === 0 ? " is-on" : ""}`}>
                <circle cx={p.x} cy={p.y} r="22" />
                <text x={p.x} y={p.y + 5} textAnchor="middle">{i + 1}</text>
              </g>
            );
          })}
        </svg>
        <ol className="ail-ap-list">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="ail-ap-n">{String(i + 1).padStart(2, "0")}</span>
              <b>{s.title}</b>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
