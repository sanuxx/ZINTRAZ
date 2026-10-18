"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Check, FileText, Search, Sparkles } from "lucide-react";
import { solutions, type Solution } from "./data";

gsap.registerPlugin(ScrollTrigger);

/**
 * 02 Our AI Solutions. On desktop the section pins and the six solutions travel past horizontally,
 * each one's illustration playing as it reaches the centre; a counter and progress bar track the reel.
 * On phones (and with motion off) the same panels simply stack.
 */

// A small illustration per solution. Sample content only. `data-v` marks the parts that animate in.
function Visual({ vis }: { vis: Solution["vis"] }) {
  switch (vis) {
    case "integrate": return (
      <div className="ail-sv integrate">
        <div className="ail-sv-win" data-v><span className="ail-sv-bar"><i /><i /><i /><em>Your existing app</em></span>
          <div className="ail-sv-rows">{[72, 54, 88, 40].map((w, i) => <i key={i} style={{ width: `${w}%` }} />)}</div>
          <div className="ail-sv-search" data-v><Search size={13} />late deliveries this week</div>
          <div className="ail-sv-ai" data-v><small><Sparkles size={11} />AI assist</small><span>7 late deliveries, 5 from one route. Suggest re-routing Van 2?</span></div>
        </div>
      </div>
    );
    case "agents": return (
      <div className="ail-sv flow">
        {["Request arrives", "Agent reads it", "Uses approved tools", "Asks for approval", "Done & logged"].map((s, i) => (
          <span key={s} data-v className={i === 3 ? "warn" : i === 4 ? "ok" : undefined}><b>{i + 1}</b>{s}</span>
        ))}
      </div>
    );
    case "app": return (
      <div className="ail-sv chat">
        <p className="q" data-v>What is our leave policy for new staff?</p>
        <p className="a" data-v>New staff earn 1.5 days of annual leave per month in their first year.<small><FileText size={11} />HR-Handbook.pdf · p. 12</small></p>
        <p className="typing" data-v><i /><i /><i /></p>
      </div>
    );
    case "analytics": return (
      <div className="ail-sv chart">
        <p className="q" data-v>Why did sales dip in March?</p>
        <span className="ail-sv-bars" data-v>{[62, 70, 48, 66, 74, 80].map((h, i) => <i key={i} className={i === 2 ? "dip" : undefined} style={{ height: `${h}%` }}><em>{["J", "F", "M", "A", "M", "J"][i]}</em></i>)}</span>
        <p className="a" data-v>Two branches closed for 9 days; online sales held steady.</p>
      </div>
    );
    case "docs": return (
      <div className="ail-sv docs">
        <span className="ail-sv-stack">{["Contract-A.pdf", "Contract-B.docx", "Pricing.xlsx"].map((f) => <i key={f} data-v><FileText size={12} />{f}</i>)}</span>
        <p className="q" data-v>Which contracts renew automatically?</p>
        <p className="a" data-v>Contract B renews automatically; A requires 60 days&apos; notice.<small><FileText size={11} />2 sources cited</small></p>
      </div>
    );
    default: return (
      <ol className="ail-sv road">
        {["Assess readiness", "Prioritize use cases", "Proof of concept", "Roadmap & metrics"].map((s, i) => <li key={s} data-v className={i < 2 ? "done" : undefined}><span>{i < 2 ? <Check size={13} /> : i + 1}</span>{s}</li>)}
      </ol>
    );
  }
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function SolutionsReel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const section = el.closest("section")!;
    const track = el.querySelector<HTMLElement>(".ail-reel-track")!;
    const panels = gsap.utils.toArray<HTMLElement>(".ail-panel", el);
    const count = el.querySelector<HTMLElement>(".ail-reel-count b")!;
    const bar = el.querySelector<HTMLElement>(".ail-reel-bar i")!;
    const mm = gsap.matchMedia();

    const playIn = (panel: HTMLElement) =>
      gsap.from(panel.querySelectorAll("[data-v]"), { y: 18, opacity: 0, scale: 0.96, duration: 0.7, ease: "back.out(1.6)", stagger: 0.14, paused: true });
    const bars = (panel: HTMLElement) => {
      const b = panel.querySelectorAll(".ail-sv-bars i");
      return b.length ? gsap.from(b, { scaleY: 0, transformOrigin: "50% 100%", duration: 0.8, ease: "expo.out", stagger: 0.06, paused: true }) : gsap.timeline({ paused: true });
    };

    mm.add("(min-width: 1001px) and (prefers-reduced-motion: no-preference)", () => {
      // The section is one screen tall; if the tallest panel would not fit the space left under the
      // heading, zoom every panel down so whole cards always stay inside the frame.
      const hud = el.querySelector<HTMLElement>(".ail-reel-hud")!;
      const fit = () => {
        panels.forEach((p) => (p.style.zoom = ""));
        const room = el.clientHeight - hud.offsetHeight - parseFloat(getComputedStyle(hud).marginTop) - 8;
        const tallest = Math.max(...panels.map((p) => p.offsetHeight));
        const z = Math.min(1, room / tallest);
        if (z < 1) panels.forEach((p) => (p.style.zoom = z.toFixed(3)));
      };
      fit();
      ScrollTrigger.addEventListener("refreshInit", fit);
      const dist = () => track.scrollWidth - window.innerWidth;
      const reel = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: section, pin: true, start: "top top", end: () => `+=${dist()}`, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (self) => {
            bar.style.transform = `scaleX(${self.progress})`;
            count.textContent = pad(Math.min(panels.length, Math.round(self.progress * (panels.length - 1)) + 1));
          },
        },
      });
      panels.forEach((p, i) => {
        const a = playIn(p), b = bars(p);
        if (i === 0) { ScrollTrigger.create({ trigger: section, start: "top 60%", once: true, onEnter: () => { a.play(); b.play(); } }); }
        else ScrollTrigger.create({ trigger: p, containerAnimation: reel, start: "left 70%", once: true, onEnter: () => { a.play(); b.play(); } });
        ScrollTrigger.create({ trigger: p, containerAnimation: reel, start: "left 60%", end: "right 40%", toggleClass: "is-on" });
        // Each panel's big numeral drifts against the travel for depth.
        gsap.fromTo(p.querySelector(".ail-panel-n"), { xPercent: 40 }, { xPercent: -40, ease: "none", scrollTrigger: { trigger: p, containerAnimation: reel, start: "left right", end: "right left", scrub: true } });
      });
      panels[0].classList.add("is-on");
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", fit);
        panels.forEach((p) => { p.classList.remove("is-on"); p.style.zoom = ""; });
      };
    });

    mm.add("(max-width: 1000px) and (prefers-reduced-motion: no-preference)", () => {
      panels.forEach((p) => {
        const a = playIn(p), b = bars(p);
        ScrollTrigger.create({ trigger: p.querySelector(".ail-sv"), start: "top 85%", once: true, onEnter: () => { a.play(); b.play(); } });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="ail-reel">
      <div className="ail-reel-track">
        {solutions.map((s, i) => (
          <article key={s.title} className="ail-panel">
            <div className="ail-panel-copy">
              <span className="ail-panel-n" aria-hidden="true">{pad(i + 1)}</span>
              <span className="ail-panel-ico"><s.Icon size={22} /></span>
              <h3>{s.title}</h3>
              <p className="ail-panel-tag">{s.tagline}</p>
              <ul>{s.points.map((p) => <li key={p}><Check size={14} />{p}</li>)}</ul>
            </div>
            <div className="ail-panel-vis"><Visual vis={s.vis} /></div>
          </article>
        ))}
      </div>
      <div className="ail-reel-hud" aria-hidden="true">
        <span className="ail-reel-count"><b>01</b> / {pad(solutions.length)}</span>
        <span className="ail-reel-bar"><i /></span>
        <span className="ail-reel-hint">Keep scrolling</span>
      </div>
    </div>
  );
}
