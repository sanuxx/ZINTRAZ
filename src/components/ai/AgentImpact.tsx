"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * What an agent does for a business, shown the way a real operations dashboard would show it: an activity chart
 * across 24 hours, a response-time metric, a work queue, a demand chart against headcount, connected systems and an
 * approval row. Each picture is restrained, data-like and animated with calm easing — numbers count, lines draw,
 * rows settle — rather than shapes that bounce. Loops run only while the section is on screen.
 */
const HOURS = [3, 2, 2, 1, 2, 4, 9, 14, 18, 22, 20, 17, 19, 21, 18, 16, 15, 12, 9, 8, 7, 6, 5, 4]; // agent activity per hour
const QUEUE = [
  { id: "REQ-2041", what: "Invoice copy requested", who: "Finance" },
  { id: "REQ-2042", what: "Delivery status query", who: "Support" },
  { id: "REQ-2043", what: "New lead from website", who: "Sales" },
  { id: "REQ-2044", what: "Stock below reorder level", who: "Operations" },
];
const SYSTEMS = ["CRM", "Inventory", "Accounts", "Email"];

// A smooth demand curve and a flat headcount line, as SVG paths in a 240×110 box.
const DEMAND = "M0 92 C30 90 50 84 75 76 S120 58 150 44 S205 20 240 12";
const AREA = DEMAND + " L240 110 L0 110 Z";

export default function AgentImpact() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("rm")) return;
    const q = gsap.utils.selector(el);
    const loops: gsap.core.Timeline[] = [];
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      // Entrance: tiles settle into place, one after another.
      gsap.from(q(".im-tile"), {
        y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: q(".im-grid")[0], start: "top 82%", once: true },
      });

      // Always on: the 24-hour activity bars grow in, the "now" marker sweeps across the day.
      loops.push(gsap.timeline({ repeat: -1, repeatDelay: 1.6 })
        .fromTo(q(".im-hour i"), { scaleY: 0 }, { scaleY: 1, duration: 0.9, stagger: 0.035, ease: "power2.out" })
        .fromTo(q(".im-now"), { left: "0%" }, { left: "100%", duration: 4, ease: "none" }, 0)
        .to(q(".im-hour i"), { scaleY: 0, duration: 0.5, stagger: 0.01, ease: "power2.in" }, "+=1.2"));

      // Response time: today's average counts down to the agent's.
      const rt = { m: 252 };
      const rtEl = q(".im-rt b")[0] as HTMLElement;
      const fmt = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${String(Math.round(m % 60)).padStart(2, "0")}m` : `${Math.max(1, Math.round(m * 60))}s`);
      loops.push(gsap.timeline({ repeat: -1, repeatDelay: 2.4 })
        .set(rt, { m: 252 })
        .call(() => { rtEl.textContent = fmt(252); })
        .to(rt, { m: 0.65, duration: 2.2, ease: "expo.inOut", delay: 0.6, onUpdate: () => { rtEl.textContent = fmt(rt.m); } })
        .fromTo(q(".im-rt-line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: "expo.inOut" }, 0.6));

      // Queue: each request is picked up and resolved in turn.
      const qt = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
      q(".im-row").forEach((row, i) => {
        qt.to(row.querySelector(".im-st-open"), { autoAlpha: 0, duration: 0.25 }, 0.5 + i * 0.7)
          .fromTo(row.querySelector(".im-st-done"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.6 + i * 0.7)
          .fromTo(row, { backgroundColor: "rgba(11, 92, 255, 0.06)" }, { backgroundColor: "rgba(11, 92, 255, 0)", duration: 0.8 }, 0.5 + i * 0.7);
      });
      qt.to(q(".im-st-done"), { autoAlpha: 0, duration: 0.3 }, "+=1.6").to(q(".im-st-open"), { autoAlpha: 1, duration: 0.3 }, "<");
      loops.push(qt);

      // Demand: the curve draws while headcount stays level.
      loops.push(gsap.timeline({ repeat: -1, repeatDelay: 1.8 })
        .fromTo(q(".im-demand"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut" })
        .fromTo(q(".im-area"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 0.8)
        .to(q(".im-demand, .im-area"), { autoAlpha: 0, duration: 0.5 }, "+=1.6")
        .set(q(".im-demand"), { autoAlpha: 1, strokeDashoffset: 1 }));

      // Systems: a request travels to each system and back.
      loops.push(gsap.timeline({ repeat: -1 })
        .fromTo(q(".im-sys-flow"), { strokeDashoffset: 1 }, { strokeDashoffset: -1, duration: 1.6, ease: "power1.inOut", stagger: 0.45 })
        .fromTo(q(".im-sys"), { borderColor: "rgba(0, 0, 0, 0.08)" }, { borderColor: "rgba(11, 92, 255, 0.55)", duration: 0.3, yoyo: true, repeat: 1, stagger: 0.45 }, 0.7));

      // Approval: routine actions auto-approve; the one over your limit waits, then is approved.
      loops.push(gsap.timeline({ repeat: -1, repeatDelay: 1.4 })
        .fromTo(q(".im-ap-row"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.35, ease: "power3.out" })
        .fromTo(q(".im-ap-wait"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25 }, "+=1.4")
        .fromTo(q(".im-ap-ok"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, "<0.1")
        .to(q(".im-ap-row"), { autoAlpha: 0, duration: 0.4 }, "+=1.6")
        .set(q(".im-ap-wait"), { autoAlpha: 1 }).set(q(".im-ap-ok"), { autoAlpha: 0 }));

      // Hover: a soft light follows the pointer.
      if (window.matchMedia("(hover: hover)").matches) {
        q(".im-tile").forEach((tile) => {
          const move = (e: PointerEvent) => {
            const r = tile.getBoundingClientRect();
            (tile as HTMLElement).style.setProperty("--mx", `${e.clientX - r.left}px`);
            (tile as HTMLElement).style.setProperty("--my", `${e.clientY - r.top}px`);
          };
          tile.addEventListener("pointermove", move as EventListener);
          cleanups.push(() => tile.removeEventListener("pointermove", move as EventListener));
        });
      }
    }, el);

    loops.forEach((l) => l.pause());
    const io = new IntersectionObserver(([e]) => loops.forEach((l) => (e.isIntersecting ? l.play() : l.pause())), { threshold: 0.1 });
    io.observe(el);
    return () => { io.disconnect(); cleanups.forEach((f) => f()); ctx.revert(); };
  }, []);

  return (
    <section ref={root} className="im" id="impact">
      <div className="container">
        <div className="im-head">
          <p className="im-eyebrow">What it means for your business</p>
          <h2 className="h-xl">More done. <span className="grad-text">Less waiting.</span></h2>
        </div>

        <div className="im-grid">
          <article className="im-tile im-wide">
            <div className="im-vis">
              <div className="im-panel">
                <div className="im-panel-top"><span>Agent activity · last 24 hours</span><em>Live</em></div>
                <div className="im-hours" aria-hidden="true">
                  {HOURS.map((h, i) => (
                    <span key={i} className={`im-hour${i < 7 || i > 20 ? " is-night" : ""}`}><i style={{ height: `${(h / 22) * 100}%` }} /></span>
                  ))}
                  <span className="im-now" />
                </div>
                <div className="im-axis" aria-hidden="true"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
              </div>
            </div>
            <div className="im-copy"><h3>Always on</h3><p>Nights, weekends and holidays covered.</p></div>
          </article>

          <article className="im-tile">
            <div className="im-vis">
              <div className="im-panel im-rt">
                <div className="im-panel-top"><span>Avg. first response</span></div>
                <b>4h 12m</b>
                <svg viewBox="0 0 200 40" className="im-rt-svg" aria-hidden="true">
                  <path d="M0 6 C40 6 60 8 90 14 S150 34 200 36" pathLength={1} className="im-rt-line" />
                </svg>
              </div>
            </div>
            <div className="im-copy"><h3>Instant replies</h3><p>Customers stop waiting for answers.</p></div>
          </article>

          <article className="im-tile">
            <div className="im-vis">
              <div className="im-panel im-queue" aria-hidden="true">
                {QUEUE.map((r) => (
                  <div key={r.id} className="im-row">
                    <span className="im-row-id">{r.id}</span>
                    <span className="im-row-what">{r.what}</span>
                    <span className="im-st"><em className="im-st-open">Open</em><em className="im-st-done">Resolved</em></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="im-copy"><h3>Nothing dropped</h3><p>Every request followed through.</p></div>
          </article>

          <article className="im-tile">
            <div className="im-vis">
              <div className="im-panel">
                <div className="im-panel-top"><span>Requests handled</span><span className="im-key"><i className="k1" />Demand <i className="k2" />Team size</span></div>
                <svg viewBox="0 0 240 110" className="im-chart" aria-hidden="true">
                  {[22, 55, 88].map((y) => <line key={y} x1="0" x2="240" y1={y} y2={y} className="im-grid-line" />)}
                  <path d={AREA} className="im-area" />
                  <path d={DEMAND} pathLength={1} className="im-demand" />
                  <line x1="0" x2="240" y1="80" y2="80" className="im-team" />
                </svg>
              </div>
            </div>
            <div className="im-copy"><h3>Scales with demand</h3><p>Busy season, same team.</p></div>
          </article>

          <article className="im-tile">
            <div className="im-vis">
              <div className="im-panel im-systems" aria-hidden="true">
                <span className="im-agent">AI agent</span>
                <svg viewBox="0 0 240 120" className="im-sys-lines">
                  {[24, 52, 80, 108].map((y) => (
                    <g key={y}>
                      <path d={`M72 66 C120 66 120 ${y - 6} 160 ${y - 6}`} className="im-sys-line" />
                      <path d={`M72 66 C120 66 120 ${y - 6} 160 ${y - 6}`} pathLength={1} className="im-sys-flow" />
                    </g>
                  ))}
                </svg>
                <div className="im-sys-list">{SYSTEMS.map((s) => <span key={s} className="im-sys">{s}</span>)}</div>
              </div>
            </div>
            <div className="im-copy"><h3>Works across systems</h3><p>CRM, stock, accounts, email — together.</p></div>
          </article>

          <article className="im-tile im-wide">
            <div className="im-vis">
              <div className="im-panel im-approvals" aria-hidden="true">
                <div className="im-panel-top"><span>Actions · today</span><span>Approval limit: $5,000</span></div>
                <div className="im-ap-row"><span>Refund · Order #4471</span><b>$180</b><em className="im-ok">Auto-approved</em></div>
                <div className="im-ap-row"><span>Reorder · 3 items</span><b>$1,240</b><em className="im-ok">Auto-approved</em></div>
                <div className="im-ap-row is-high">
                  <span>Purchase order · PO-1042</span><b>$12,400</b>
                  <span className="im-ap-state"><em className="im-ap-wait">Awaiting you</em><em className="im-ap-ok im-ok">Approved by owner</em></span>
                </div>
              </div>
            </div>
            <div className="im-copy"><h3>Consistent, in your control</h3><p>Same rules every time. You approve what matters.</p></div>
          </article>
        </div>
      </div>
    </section>
  );
}
