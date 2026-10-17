"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Runs a looping demo timeline only while its panel is on screen.
function useLoop(build: (q: gsap.utils.SelectorFunc, tl: gsap.core.Timeline) => void) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
      build(gsap.utils.selector(el), tl);
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()));
      io.observe(el);
      return () => io.disconnect();
    }, el);
    return () => ctx.revert();
    // build is static per demo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

const T = { fill: "#c7cbe0", fontSize: 11, fontFamily: "var(--font)" } as const;

function WorkflowDemo({ c }: { c: string }) {
  const xs = [44, 122, 200, 278, 356];
  const ref = useLoop((q, tl) => {
    tl.set(q(".wf-node"), { attr: { fill: "#161c33", stroke: "#2a3350" } }).set(q(".wf-dot"), { attr: { cx: xs[0] }, opacity: 1 })
      .set(q(".wf-prog"), { strokeDashoffset: 312 });
    xs.forEach((x, k) => {
      tl.to(q(".wf-dot"), { attr: { cx: x }, duration: k ? 0.55 : 0.01, ease: "power2.inOut" })
        .to(q(".wf-prog"), { strokeDashoffset: 312 * (1 - k / 4), duration: k ? 0.55 : 0.01, ease: "power2.inOut" }, "<")
        .to(q(`.wf-node-${k}`), { attr: { fill: c, stroke: c }, duration: 0.2 });
    });
    tl.to(q(".wf-done"), { opacity: 1, scale: 1, duration: 0.3, transformOrigin: "50% 50%", ease: "back.out(2)" })
      .to({}, { duration: 1 }).to(q(".wf-done, .wf-dot"), { opacity: 0, duration: 0.3 }).set(q(".wf-done"), { scale: 0.6 });
  });
  return (
    <svg ref={ref} viewBox="0 0 400 240" className="cap-svg">
      <line x1="44" y1="120" x2="356" y2="120" stroke="#2a3350" strokeWidth="2" />
      <line className="wf-prog" x1="44" y1="120" x2="356" y2="120" stroke={c} strokeWidth="2.5" strokeDasharray="312" strokeDashoffset="312" />
      {["Trigger", "Classify", "Tools", "Approve", "Done"].map((l, k) => (
        <g key={l}>
          <rect className={`wf-node wf-node-${k}`} x={xs[k] - 30} y="104" width="60" height="32" rx="10" fill="#161c33" stroke="#2a3350" />
          <text x={xs[k]} y="124" textAnchor="middle" {...T} fill="#fff">{l}</text>
        </g>
      ))}
      <circle className="wf-dot" cx="44" cy="120" r="6" fill="#fff" style={{ filter: `drop-shadow(0 0 6px ${c})` }} />
      <g className="wf-done" opacity="0" transform="translate(0 0)">
        <rect x="130" y="170" width="140" height="30" rx="15" fill={c} />
        <text x="200" y="189" textAnchor="middle" {...T} fill="#fff">Order handled ✓</text>
      </g>
      <text x="200" y="64" textAnchor="middle" {...T}>New order → check stock → invoice → notify</text>
    </svg>
  );
}

function ChatDemo({ c }: { c: string }) {
  const ref = useLoop((q, tl) => {
    tl.set(q(".ch-user, .ch-typing, .ch-bot, .ch-chip"), { opacity: 0 }).set(q(".ch-clip"), { attr: { width: 0 } })
      .to(q(".ch-user"), { opacity: 1, y: 0, duration: 0.4 })
      .to(q(".ch-typing"), { opacity: 1, duration: 0.2 }, "+=0.3")
      .to(q(".ch-typing circle"), { opacity: 0.2, duration: 0.25, stagger: { each: 0.12, repeat: 3, yoyo: true } })
      .to(q(".ch-typing"), { opacity: 0, duration: 0.2 })
      .to(q(".ch-bot"), { opacity: 1, duration: 0.2 }, "<")
      .to(q(".ch-clip"), { attr: { width: 240 }, duration: 1.4, ease: "none" })
      .to(q(".ch-chip"), { opacity: 1, duration: 0.3 }, "+=0.2")
      .to({}, { duration: 1.4 }).to(q(".ch-user, .ch-bot, .ch-chip"), { opacity: 0, duration: 0.3 });
  });
  return (
    <svg ref={ref} viewBox="0 0 400 240" className="cap-svg">
      <defs><clipPath id="ch-clip"><rect className="ch-clip" x="60" y="100" width="0" height="60" /></clipPath></defs>
      <g className="ch-user"><rect x="190" y="40" width="180" height="34" rx="14" fill="#2a3350" /><text x="280" y="61" textAnchor="middle" {...T} fill="#fff">Do you deliver on Sundays?</text></g>
      <g className="ch-typing" opacity="0"><rect x="40" y="104" width="54" height="28" rx="14" fill="#1c2540" />{[56, 67, 78].map((x) => <circle key={x} cx={x} cy="118" r="3.5" fill={c} />)}</g>
      <g className="ch-bot" opacity="0">
        <rect x="40" y="96" width="270" height="54" rx="14" fill="#1c2540" stroke={c} strokeOpacity=".5" />
        <g clipPath="url(#ch-clip)">
          <text x="58" y="118" {...T} fill="#fff">Yes — 9am to 6pm on Sundays.</text>
          <text x="58" y="136" {...T} fill="#fff">Want me to book a slot for you?</text>
        </g>
      </g>
      <g className="ch-chip" opacity="0"><rect x="40" y="168" width="104" height="26" rx="13" fill={c} /><text x="92" y="185" textAnchor="middle" {...T} fill="#fff">Slot booked ✓</text></g>
    </svg>
  );
}

function ForecastDemo({ c }: { c: string }) {
  const hist = "M30 180 L70 168 L110 172 L150 150 L190 156 L230 132 L250 128";
  const fc = "M250 128 L290 110 L330 96 L370 78";
  const ref = useLoop((q, tl) => {
    tl.set(q(".fc-hclip"), { attr: { width: 0 } }).set(q(".fc-fclip"), { attr: { width: 0 } }).set(q(".fc-band, .fc-tag"), { opacity: 0 })
      .to(q(".fc-hclip"), { attr: { width: 230 }, duration: 1.3, ease: "power1.inOut" })
      .to(q(".fc-fclip"), { attr: { width: 130 }, duration: 1, ease: "power1.out" })
      .to(q(".fc-band"), { opacity: 1, duration: 0.6 }, "<")
      .to(q(".fc-tag"), { opacity: 1, duration: 0.3, ease: "back.out(2)" })
      .to({}, { duration: 1.4 }).to(q(".fc-band, .fc-tag"), { opacity: 0, duration: 0.3 });
  });
  return (
    <svg ref={ref} viewBox="0 0 400 240" className="cap-svg">
      <defs>
        <clipPath id="fc-h"><rect className="fc-hclip" x="25" y="0" width="0" height="240" /></clipPath>
        <clipPath id="fc-f"><rect className="fc-fclip" x="248" y="0" width="0" height="240" /></clipPath>
      </defs>
      {[60, 100, 140, 180].map((y) => <line key={y} x1="30" y1={y} x2="380" y2={y} stroke="#1f2742" />)}
      <line x1="250" y1="40" x2="250" y2="200" stroke="#2a3350" strokeDasharray="3 4" />
      <text x="254" y="50" {...T} fontSize={10}>Forecast</text>
      <path className="fc-band" d="M250 128 L290 98 L330 78 L370 56 L370 100 L330 114 L290 122 L250 128 Z" fill={c} opacity="0" fillOpacity=".22" />
      <path d={hist} clipPath="url(#fc-h)" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={fc} clipPath="url(#fc-f)" fill="none" stroke={c} strokeWidth="2.5" strokeDasharray="6 5" />
      <g className="fc-tag" opacity="0"><rect x="292" y="32" width="84" height="26" rx="13" fill={c} /><text x="334" y="49" textAnchor="middle" {...T} fill="#fff">+22% demand</text></g>
      <text x="30" y="220" {...T} fontSize={10}>Weekend sales · 8 weeks</text>
    </svg>
  );
}

function VisionDemo({ c }: { c: string }) {
  const boxes = [[50, 40], [150, 40], [250, 40], [50, 130], [150, 130], [250, 130]];
  const ref = useLoop((q, tl) => {
    tl.set(q(".cv-bb"), { opacity: 0, scale: 1.25, transformOrigin: "50% 50%" }).set(q(".cv-scan"), { attr: { y: 20 } })
      .to(q(".cv-scan"), { attr: { y: 210 }, duration: 1.8, ease: "none" })
      .to(q(".cv-bb"), { opacity: 1, scale: 1, duration: 0.35, stagger: 0.18, ease: "back.out(2)" }, 0.3)
      .to({}, { duration: 1.2 }).to(q(".cv-bb"), { opacity: 0, duration: 0.3 });
  });
  return (
    <svg ref={ref} viewBox="0 0 400 240" className="cap-svg">
      <defs><linearGradient id="cv-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={c} stopOpacity="0" /><stop offset="1" stopColor={c} stopOpacity=".55" /></linearGradient></defs>
      <line x1="30" y1="112" x2="370" y2="112" stroke="#2a3350" strokeWidth="3" /><line x1="30" y1="202" x2="370" y2="202" stroke="#2a3350" strokeWidth="3" />
      {boxes.map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y + 10} width="80" height="60" rx="6" fill={i === 4 ? "#3a2330" : "#1c2540"} />
          <rect x={x + 26} y={y + 30} width="28" height="6" rx="3" fill="#2a3350" />
        </g>
      ))}
      {boxes.map(([x, y], i) => (
        <g key={`bb${i}`} className="cv-bb" opacity="0">
          <rect x={x - 4} y={y + 6} width="88" height="68" rx="8" fill="none" stroke={i === 4 ? "#ff5a6a" : c} strokeWidth="2" />
          <rect x={x - 4} y={y - 10} width={i === 4 ? 70 : 58} height="16" rx="4" fill={i === 4 ? "#ff5a6a" : c} />
          <text x={x + 2} y={y + 2} {...T} fontSize={9} fill="#fff">{i === 4 ? "Damaged ⚠" : `Box · ${97 + (i % 3)}%`}</text>
        </g>
      ))}
      <rect className="cv-scan" x="20" y="20" width="360" height="26" fill="url(#cv-g)" />
    </svg>
  );
}

function ComplianceDemo({ c }: { c: string }) {
  const lines = [0, 1, 2, 3, 4, 5, 6, 7];
  const ref = useLoop((q, tl) => {
    tl.set(q(".cp-hl"), { attr: { width: 0 } }).set(q(".cp-flag"), { opacity: 0, x: 10 })
      .to(q(".cp-hl-0"), { attr: { width: 150 }, duration: 0.7, ease: "power1.inOut" })
      .to(q(".cp-flag-0"), { opacity: 1, x: 0, duration: 0.3 })
      .to(q(".cp-hl-1"), { attr: { width: 120 }, duration: 0.6, ease: "power1.inOut" }, "+=0.2")
      .to(q(".cp-flag-1"), { opacity: 1, x: 0, duration: 0.3 })
      .to({}, { duration: 1.5 }).to(q(".cp-flag"), { opacity: 0, duration: 0.3 });
  });
  return (
    <svg ref={ref} viewBox="0 0 400 240" className="cap-svg">
      <rect x="40" y="22" width="190" height="200" rx="10" fill="#eef1f8" />
      <text x="56" y="44" {...T} fill="#1d1d1f" fontSize={10}>Supplier contract.pdf</text>
      <rect className="cp-hl cp-hl-0" x="54" y="98" width="0" height="12" rx="3" fill="#ff5a6a" fillOpacity=".35" />
      <rect className="cp-hl cp-hl-1" x="54" y="158" width="0" height="12" rx="3" fill={c} fillOpacity=".35" />
      {lines.map((i) => <rect key={i} x="56" y={60 + i * 20} width={i % 3 === 2 ? 110 : 150} height="6" rx="3" fill="#c9cfdd" />)}
      <g className="cp-flag cp-flag-0" opacity="0"><rect x="244" y="92" width="130" height="26" rx="13" fill="#ff5a6a" /><text x="309" y="109" textAnchor="middle" {...T} fill="#fff">Clause 4.2 · risk</text></g>
      <g className="cp-flag cp-flag-1" opacity="0"><rect x="244" y="152" width="130" height="26" rx="13" fill={c} /><text x="309" y="169" textAnchor="middle" {...T} fill="#fff">Data policy ✓</text></g>
    </svg>
  );
}

function GenerativeDemo({ c }: { c: string }) {
  const widths = [150, 128, 142, 96];
  const ref = useLoop((q, tl) => {
    tl.set(q(".gn-line"), { attr: { width: 0 } }).set(q(".gn-chip"), { opacity: 0 }).set(q(".gn-arrow"), { strokeDashoffset: 60 })
      .to(q(".gn-arrow"), { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" });
    widths.forEach((w, i) => tl.to(q(`.gn-line-${i}`), { attr: { width: w }, duration: 0.45, ease: "power1.out" }));
    tl.to(q(".gn-chip"), { opacity: 1, duration: 0.3 }).to({}, { duration: 1.4 }).to(q(".gn-chip"), { opacity: 0, duration: 0.3 });
  });
  return (
    <svg ref={ref} viewBox="0 0 400 240" className="cap-svg">
      <rect x="28" y="54" width="110" height="130" rx="10" fill="#1c2540" />
      <text x="40" y="76" {...T} fontSize={10}>Meeting notes</text>
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="40" y={90 + i * 14} width={i % 2 ? 70 : 86} height="5" rx="2.5" fill="#2f3a5c" />)}
      <path className="gn-arrow" d="M148 119 L200 119" stroke={c} strokeWidth="2.5" strokeDasharray="60" strokeDashoffset="60" markerEnd="" />
      <path d="M194 113 L202 119 L194 125" fill="none" stroke={c} strokeWidth="2.5" />
      <rect x="212" y="54" width="170" height="130" rx="10" fill="#161c33" stroke={c} strokeOpacity=".45" />
      <text x="224" y="76" {...T} fontSize={10} fill="#fff">AI summary</text>
      {widths.map((_, i) => <rect key={i} className={`gn-line gn-line-${i}`} x="224" y={92 + i * 18} width="0" height="7" rx="3.5" fill={c} fillOpacity={0.9 - i * 0.15} />)}
      <g className="gn-chip" opacity="0"><rect x="238" y="196" width="120" height="26" rx="13" fill={c} /><text x="298" y="213" textAnchor="middle" {...T} fill="#fff">Summary ready ✓</text></g>
    </svg>
  );
}

const caps = [
  { title: "Agentic workflows", accent: "#0b5cff", Demo: WorkflowDemo, desc: "Multi-step agents that run business processes end to end — across every system you use.", tags: ["Order processing", "Approvals", "Reorders"] },
  { title: "LLM-powered assistants", accent: "#7c3aed", Demo: ChatDemo, desc: "Custom assistants trained on your knowledge base, embedded in your website, app and WhatsApp.", tags: ["Customer support", "Sales", "Internal help"] },
  { title: "Business & decision intelligence", accent: "#0891b2", Demo: ForecastDemo, desc: "Dashboards, forecasts and what-if simulations built on your real data — so decisions stop running on gut feel.", tags: ["BI dashboards", "Forecasting", "What-if simulations"] },
  { title: "Computer vision", accent: "#4f46e5", Demo: VisionDemo, desc: "Automated image analysis, quality inspection and visual data extraction at scale.", tags: ["Inspection", "Counting", "OCR"] },
  { title: "Document intelligence", accent: "#0284c7", Demo: ComplianceDemo, desc: "AI that reads your contracts, invoices and policies — extracting data, comparing versions and flagging risks.", tags: ["Contracts", "Invoices", "Policies"] },
  { title: "Generative pipelines", accent: "#9333ea", Demo: GenerativeDemo, desc: "Content generation, summarization and data transformation for your whole team.", tags: ["Summaries", "Reports", "Content"] },
];

export default function CapabilityStack() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = ref.current!;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".cap-card", root);
        // Start well below the stage so waiting cards stay hidden until dealt.
        gsap.set(cards.slice(1), { yPercent: 175, rotationX: -18 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: ".cap-pin", start: "top top", end: "bottom bottom", scrub: 1,
            onUpdate: (st) => setActive(Math.min(cards.length - 1, Math.round(st.progress * (cards.length - 0.6)))),
          },
        });
        cards.slice(1).forEach((card, n) => {
          const i = n + 1;
          tl.to(card, { yPercent: 0, rotationX: 0, duration: 1 }, i - 1);
          // Earlier cards recede into the stack.
          cards.slice(0, i).forEach((prev, j) => {
            const depth = i - j;
            tl.to(prev, { scale: 1 - depth * 0.05, y: -depth * 26, opacity: depth > 2 ? 0 : 1, duration: 1 }, i - 1);
          });
        });
        tl.to({}, { duration: 0.6 });
      });
    }, root);
    return () => { mm.revert(); ctx.revert(); };
  }, []);

  return (
    <section ref={ref} className="cap" id="capabilities">
      <div className="container cap-head">
        <p className="eyebrow" data-reveal>Capabilities</p>
        <h2 className="h-xl" data-reveal>Agentic workflows first. <span className="grad-text">The rest, on tap.</span></h2>
        <p className="lede" data-reveal>Agents and workflow automation are where we go deepest. The rest of the stack comes in as your systems need it.</p>
      </div>
      <div className="cap-pin">
        <div className="cap-stage">
          <div className="cap-rail" aria-hidden="true">
            <span className="cap-count"><b>{String(active + 1).padStart(2, "0")}</b> / {String(caps.length).padStart(2, "0")}</span>
            {caps.map((c, i) => <i key={c.title} className={i === active ? "is-on" : undefined} style={{ ["--c" as string]: c.accent }} />)}
          </div>
          <div className="cap-deck">
            {caps.map(({ title, accent, Demo, desc, tags }, i) => (
              <article key={title} className="cap-card" style={{ ["--c" as string]: accent, zIndex: i + 1 }}>
                <div className="cap-copy">
                  <span className="cap-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <span className="cap-tags">{tags.map((t) => <span key={t}>{t}</span>)}</span>
                </div>
                <div className="cap-screen"><Demo c={accent} /></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
