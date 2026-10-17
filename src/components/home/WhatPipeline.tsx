import Link from "next/link";
import { Check, ChevronRight, Hammer, Search, Sparkles } from "lucide-react";

// "What ZYNTRAZ does" as a connected pipeline: a pulse carries "Your business" along a rail through the
// three stage nodes to "Transformed". Every animation runs on one 8s CSS cycle, so the node pulses
// and card highlights stay in step with the travelling pulse (see the .pipe rules in globals.css).

const stages = [
  {
    icon: Search, title: "Understand", tag: "Discover",
    desc: "We study your business, processes, challenges, opportunities and goals.",
    outcome: "A clear, prioritised roadmap",
    includes: ["Process mapping", "Requirements", "Strategy"],
    href: "/consultation", cta: "Book a consultation",
  },
  {
    icon: Hammer, title: "Engineer", tag: "Build",
    desc: "We design and build the systems, applications, automation and intelligence required to move forward.",
    outcome: "Live, connected systems",
    includes: ["Software", "AI & IoT", "Integrations"],
    href: "/solutions", cta: "Explore solutions",
  },
  {
    icon: Sparkles, title: "Transform", tag: "Evolve",
    desc: "We continuously improve the way your business operates using technology, data and intelligence.",
    outcome: "Measurable, compounding growth",
    includes: ["Automation", "Analytics", "Ongoing support"],
    href: "/transformation", cta: "See transformation",
  },
];

export default function WhatPipeline() {
  return (
    <div className="pipe">
      <div className="pipe-rail" aria-hidden="true">
        <span className="pipe-line" />
        <span className="pipe-pulse" />
        <span className="pipe-chip start">Your business</span>
        {stages.map((s, i) => (
          <span key={s.title} className={`pipe-node n${i + 1}`}><s.icon size={18} /></span>
        ))}
        <span className="pipe-chip end"><Check size={14} /> Transformed</span>
      </div>

      <ol className="pipe-cards">
        {stages.map((s, i) => (
          <li key={s.title} className={`pipe-card c${i + 1}`} data-reveal style={{ ["--d" as string]: `${i * 0.1}s` }}>
            <div className="pipe-top">
              <span className="pipe-num" aria-hidden="true">0{i + 1}</span>
              <span className="pipe-tag">Step 0{i + 1} · {s.tag}</span>
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="pipe-out">
              <span>Outcome</span>
              <b>{s.outcome}</b>
            </div>
            <ul className="pipe-inc">
              {s.includes.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <Link href={s.href} className="link-chev">{s.cta} <ChevronRight size={17} /></Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
