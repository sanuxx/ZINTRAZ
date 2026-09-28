"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, CheckCircle2, ChevronRight, SearchCheck } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SkipSection from "@/components/ui/SkipSection";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { name: "Customer enquiry", who: "WhatsApp" },
  { name: "Quote prepared", who: "Sales · Excel", flag: "Copied between 3 files" },
  { name: "Manager approval", who: "Owner · phone", flag: "Waits 2 days" },
  { name: "Order fulfilled", who: "Kitchen · paper", flag: "Retyped by hand" },
  { name: "Invoice & report", who: "Finance · email", flag: "Found at month-end" },
];

const layers = [
  { name: "Interfaces", mods: ["Staff app", "Customer portal", "Dashboards"] },
  { name: "Workflows", mods: ["Orders", "Approvals", "Billing"] },
  { name: "Integrations", mods: ["WhatsApp", "POS", "Accounting", "Payments"] },
  { name: "Data", mods: ["One source of truth"] },
];

const STAGES = ["Signal", "Understand", "Check", "Decide", "Approve", "Act"];
const agents: { name: string; steps: string[]; human: boolean }[] = [
  {
    name: "Sales agent", human: true,
    steps: ["New lead on WhatsApp: “Price for 200 branded mugs?”", "Bulk order · 200 units · wants a quote", "CRM: new company · Inventory: 240 in stock",
      "Quotation drafted from volume pricing", "Discount over 10% — sales lead approves", "Quote sent on WhatsApp · follow-up in 2 days"],
  },
  {
    name: "Support agent", human: false,
    steps: ["Email: “Order #1042 arrived damaged”", "Damaged delivery · priority high", "Order found · replacement policy applies",
      "Replacement reserved from stock", "Within policy — approved automatically", "Customer replied with tracking · case logged"],
  },
  {
    name: "Operations agent", human: true,
    steps: ["Scheduled run · every day at 6:00 AM", "Reads yesterday's sales and stock", "3 items below reorder level",
      "Purchase orders drafted per supplier", "Owner approves on WhatsApp in one tap", "POs emailed · morning summary delivered"],
  },
];

function BusinessMap() {
  return (
    <div className="wv wv-biz">
      <p className="wv-cap">Order-to-cash, as it runs today</p>
      <div className="wb-wrap">
        <span className="wb-line" aria-hidden="true" />
        <ol className="wb-steps">
          {steps.map((s, i) => (
            <li key={s.name} className="wb-step">
              <span className="wb-num">{i + 1}</span>
              <span className="wb-what"><b>{s.name}</b><small>{s.who}</small></span>
              {s.flag && <em className="wb-flag"><AlertTriangle size={13} /> {s.flag}</em>}
            </li>
          ))}
        </ol>
      </div>
      <p className="wv-stamp wb-stamp"><SearchCheck size={16} /> 4 bottlenecks found — before a line of code</p>
    </div>
  );
}

function EngineeringStack() {
  return (
    <div className="wv wv-eng">
      <p className="wv-cap">System architecture · v1</p>
      <div className="we-stack">
        {layers.map((l) => (
          <div key={l.name} className="we-layer">
            <span className="we-name">{l.name}</span>
            <span className="we-mods">{l.mods.map((m) => <span key={m} className="we-mod">{m}</span>)}</span>
          </div>
        ))}
      </div>
      <p className="wv-stamp we-stamp"><CheckCircle2 size={16} /> One system in place of eight disconnected tools</p>
    </div>
  );
}

// The nodes stay mounted across tab switches (keyed by stage) so the scroll-driven lighting persists;
// only the step text re-mounts, which replays its fade-in.
function IntelligenceFlow() {
  const [a, setA] = useState(0);
  const agent = agents[a];
  return (
    <div className="wv wv-ai">
      <div className="wi-tabs" role="tablist" aria-label="Example agents">
        {agents.map((x, i) => (
          <button key={x.name} type="button" role="tab" aria-selected={i === a} className="wi-tab" onClick={() => setA(i)}>{x.name}</button>
        ))}
      </div>
      <div className="wi-wrap">
        <span className="wi-line" aria-hidden="true"><i className="wi-line-fill" /></span>
        <ol className="wi-flow">
          {STAGES.map((k, i) => (
            <li key={k} className={`wi-node${k === "Approve" && agent.human ? " is-human" : ""}`}>
              <i className="wi-dot" aria-hidden="true" />
              <span className="wi-k">{k === "Approve" && agent.human ? "Human approves" : k}</span>
              <span key={`${a}-${i}`} className="wi-t">{agent.steps[i]}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const worlds = [
  {
    tag: "Business", title: <>We understand <span className="grad-text">how you work.</span></>,
    desc: "Before any technology, we map your people, processes, documents and data — and find exactly where time and money leak out.",
    points: ["Process discovery", "Bottleneck mapping", "Future operating model"],
    href: "/services", cta: "Our approach", visual: <BusinessMap />,
  },
  {
    tag: "Engineering", title: <>We build what <span className="grad-text">your business needs.</span></>,
    desc: "Custom software, web systems and integrations, architected around your operation — one source of truth instead of scattered tools.",
    points: ["Custom systems", "Integrations & APIs", "Data & dashboards"],
    href: "/services", cta: "What we engineer", visual: <EngineeringStack />,
  },
  {
    tag: "Intelligence", title: <>We make it capable of <span className="grad-text">reasoning and acting.</span></>,
    desc: "AI agents and automation that work inside your systems — understanding requests, checking your data and taking action, with your team in control.",
    points: ["AI agents", "Workflow automation", "Human-in-the-loop"],
    href: "/ai", cta: "Explore Zyntraz AI", visual: <IntelligenceFlow />,
  },
];

const W1 = 3.2, W2 = 6.6;

export default function Worlds() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const stage = root.querySelector<HTMLElement>(".wd-stage")!;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);

      // 01 Business: the process map draws itself, then the bottlenecks surface. It starts while the
      // section is still scrolling in, so the card is never empty when the stage pins.
      gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: root, start: "top 70%", end: "top -70%", scrub: 0.8 } })
        .fromTo(q(".wb-line"), { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: "none" }, 0)
        .fromTo(q(".wb-step"), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.28 }, 0)
        .fromTo(q(".wb-flag"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.2, ease: "back.out(2)" }, 1.5)
        .fromTo(q(".wb-stamp"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 2.3);

      // Each world's visual pivots around a point far behind it, so a change of world swings the
      // outgoing visual away on an arc and brings the next one round — a turntable, in 3D.
      gsap.set(q(".wd-visual"), { transformOrigin: "50% 50% -800px" });
      const turn = (tl: gsap.core.Timeline, from: number, to: number, at: number) => tl
        .to(q(`.wd-w-${from} .wd-copy`), { autoAlpha: 0, y: -50, duration: 0.5 }, at)
        .to(q(`.wd-w-${from} .wd-visual`), { rotationY: -70, autoAlpha: 0, duration: 0.9, ease: "power2.in" }, at)
        .set(q(`.wd-w-${from}`), { autoAlpha: 0 }, at + 0.9)
        .set(q(`.wd-w-${to}`), { autoAlpha: 1 }, at)
        .fromTo(q(`.wd-w-${to} .wd-visual`), { rotationY: 70, autoAlpha: 0 }, { rotationY: 0, autoAlpha: 1, duration: 0.9, ease: "power2.out" }, at + 0.35)
        .fromTo(q(`.wd-w-${to} .wd-copy`), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.45);

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      turn(tl, 0, 1, W1);
      turn(tl, 1, 2, W2);
      tl
        // 02 Engineering: the architecture assembles from the data layer up.
        .fromTo(q(".wd-bg-1"), { opacity: 0 }, { opacity: 1, duration: 0.7 }, W1)
        .fromTo(q(".we-layer"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: { each: 0.3, from: "end" } }, W1 + 0.6)
        .fromTo(q(".we-mod"), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.2, stagger: { each: 0.06, from: "end" } }, W1 + 0.9)
        .fromTo(q(".we-stamp"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4 }, W1 + 2.3)

        // 03 Intelligence: the world goes dark; the agent works through the request step by step.
        .fromTo(q(".wd-bg-2"), { opacity: 0 }, { opacity: 1, duration: 0.7 }, W2)
        .fromTo(stage, { "--wd-ink": "#1d1d1f", "--wd-line": "rgba(0,0,0,.12)", "--wd-chip": "rgba(0,0,0,.04)" },
          { "--wd-ink": "#f5f5f7", "--wd-line": "rgba(255,255,255,.16)", "--wd-chip": "rgba(255,255,255,.06)", duration: 0.7 }, W2)
        .fromTo(q(".wi-line-fill"), { scaleY: 0 }, { scaleY: 1, duration: 1.8, ease: "none" }, W2 + 0.7)
        .fromTo(q(".wi-node"), { opacity: 0.25 }, { opacity: 1, duration: 0.25, stagger: 0.3 }, W2 + 0.7)
        .fromTo(q(".wi-dot"), { backgroundColor: "#0b0f1f", boxShadow: "0 0 0 0 rgba(77,141,255,0)" },
          { backgroundColor: "#4d8dff", boxShadow: "0 0 16px 2px rgba(77,141,255,.8)", duration: 0.25, stagger: 0.3 }, W2 + 0.7)

        // Rail
        .fromTo(q(".wd-rail-fill"), { scaleX: 0 }, { scaleX: 1, duration: W2 + 2.5, ease: "none" }, 0)
        .fromTo(q(".wd-rail-0"), { opacity: 1 }, { opacity: 0.35, duration: 0.3 }, W1)
        .fromTo(q(".wd-rail-1"), { opacity: 0.35 }, { opacity: 1, duration: 0.3 }, W1)
        .to(q(".wd-rail-1"), { opacity: 0.35, duration: 0.3 }, W2)
        .fromTo(q(".wd-rail-2"), { opacity: 0.35 }, { opacity: 1, duration: 0.3 }, W2)
        // Hold on the last world, then let the next section slide over it (see .wd + .hpain).
        .to({}, { duration: 2 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="wd" aria-label="How Zyntraz transforms a business: business, engineering, intelligence">
      <div className="wd-stage">
        <div className="wd-bg wd-bg-0" aria-hidden="true" />
        <div className="wd-bg wd-bg-1" aria-hidden="true" />
        <div className="wd-bg wd-bg-2" aria-hidden="true" />

        {worlds.map((w, k) => (
          <article key={w.tag} className={`wd-world wd-w-${k}`}>
            <div className="wd-copy">
              <p className="wd-tag"><span>{String(k + 1).padStart(2, "0")}</span> {w.tag}</p>
              <h2>{w.title}</h2>
              <p className="wd-desc">{w.desc}</p>
              <ul className="wd-pts">{w.points.map((p) => <li key={p}><Check size={16} /> {p}</li>)}</ul>
              <Link href={w.href} className="link-chev">{w.cta} <ChevronRight size={18} /></Link>
            </div>
            <div className="wd-visual">{w.visual}</div>
          </article>
        ))}

        <div className="wd-rail" aria-hidden="true">
          <div className="wd-rail-bar"><div className="wd-rail-fill" /></div>
          {worlds.map((w, k) => <span key={w.tag} className={`wd-rail-item wd-rail-${k}`}>{String(k + 1).padStart(2, "0")} {w.tag}</span>)}
        </div>

        <SkipSection />
      </div>
    </section>
  );
}
