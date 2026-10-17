import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { WHATSAPP } from "@/lib/contact";
import { functions, opportunity, ticker, trust, why } from "@/components/aipage/data";
import Orb from "@/components/aipage/Orb";
import SolutionsReel from "@/components/aipage/SolutionsReel";
import ApproachDial from "@/components/aipage/ApproachDial";
import Faq from "@/components/aipage/Faq";
import AIMotion from "@/components/aipage/AIMotion";

/**
 * /ai — Artificial Intelligence & Intelligent Systems. Content from the client's AI page brief.
 * Design: light, glassy sections alternating with deep-navy "night" sections; a canvas neural orb in the
 * hero and the closing call; GSAP drives the choreography (see AIMotion, SolutionsReel, ApproachDial).
 * Structure: hero, the opportunity, six AI solutions, AI across the business, the approach, why Zyntraz,
 * security & responsible AI, FAQs, final CTA.
 */
export const metadata: Metadata = {
  title: "AI & Intelligent Systems — make intelligence your competitive advantage",
  description:
    "Zyntraz designs, builds and integrates intelligent systems that help businesses automate operations, unlock insights, improve decision-making and create new opportunities for growth.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function AIPage() {
  return (
    <div className="page ail" data-keep>
      <noscript><style>{".ail-hero-copy > * { opacity: 1 !important; }"}</style></noscript>

      {/* Hero */}
      <section className="ail-hero">
        <div className="ail-hero-bg" aria-hidden="true"><i /><i /><i /></div>
        <div className="ail-hero-copy">
          <p className="ail-pill"><span><Sparkles size={12} />AI</span>Artificial Intelligence &amp; Intelligent Systems</p>
          <h1 className="ail-h1"><b><span>Make Intelligence</span></b> <i><span>Your Competitive Advantage.</span></i></h1>
          <p className="ail-sub">Turn AI into a practical business advantage. We design, build, and integrate intelligent systems that help businesses automate operations, unlock insights, improve decision-making, and create new opportunities for growth.</p>
          <div className="ail-ctas">
            <Link href="/contact" className="ail-btn ail-mag">Discuss Your AI Project <ArrowRight size={16} /></Link>
            <Link href="#solutions" className="ail-btn ghost ail-mag">Explore AI Solutions <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="ail-hero-stage">
          <Orb chips />
        </div>
        <div className="ail-hero-note" data-ail="rise">
          <p>From AI-powered applications to enterprise workflow automation and advanced data analytics, Zyntraz helps you move beyond experimentation and put intelligence to work.</p>
        </div>
      </section>

      <div className="ail-ticker">
        <div className="ail-ticker-track">
          {[0, 1].map((k) => (
            <ul key={k} aria-hidden={k === 1 || undefined}>{ticker.map((t) => <li key={t}>{t}</li>)}</ul>
          ))}
        </div>
      </div>

      {/* 01 The Opportunity */}
      <section className="ail-sec" id="opportunity">
        <div className="ail-opp-top">
          <p className="ail-eyebrow"><em>01</em>The Opportunity</p>
          <h2 className="ail-statement" data-words>Your business already has the potential. <span>AI helps you unlock it.</span></h2>
        </div>
        <div className="ail-opp-cols" data-ail="rise">
          <p className="ail-lede">Many businesses have valuable data, repetitive processes, and untapped opportunities hidden within their daily operations. The challenge is connecting these pieces into systems that deliver measurable value.</p>
          <p className="ail-lede">Zyntraz bridges that gap by combining AI engineering, software development, data intelligence, and business process understanding.</p>
        </div>
        <ul className="ail-opps" data-ail="cine">
          {opportunity.map(({ Icon, title, desc }, i) => (
            <li key={title} className="spot">
              <span className="ail-card-n">{pad(i + 1)}</span>
              <span className="ail-ico"><Icon size={20} /></span>
              <b>{title}</b>
              <p>{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 02 Our AI Solutions */}
      <section className="ail-sec ail-dark ail-sol-sec" id="solutions">
        <div className="ail-head row">
          <p className="ail-eyebrow"><em>02</em>Our AI Solutions</p>
          <h2 className="ail-h2" data-split><b>Practical intelligence.</b> <i>Purpose-built solutions. Measurable business value.</i></h2>
        </div>
        <SolutionsReel />
      </section>

      {/* 03 AI Across Your Business */}
      <section className="ail-sec" id="across-business">
        <div className="ail-head split">
          <div>
            <p className="ail-eyebrow"><em>03</em>AI Across Your Business</p>
            <h2 className="ail-h2" data-split><b>One technology.</b> <i>Multiple opportunities.</i></h2>
          </div>
          <p className="ail-lede">AI can support different functions across an organization. We identify the opportunities that matter most to your business and develop solutions around them.</p>
        </div>
        <ul className="ail-funcs" data-ail="cine">
          {functions.map(({ Icon, title, uses }, i) => (
            <li key={title} className="spot">
              <Icon className="ail-funcs-ghost" aria-hidden="true" />
              <header><span className="ail-ico"><Icon size={20} /></span><span className="ail-card-n">{pad(i + 1)}</span></header>
              <b>{title}</b>
              <div>{uses.map((u) => <i key={u}>{u}</i>)}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* 04 Our Approach */}
      <section className="ail-sec ail-tint ail-ap-sec" id="approach">
        <ApproachDial>
          <div className="ail-head">
            <p className="ail-eyebrow"><em>04</em>Our Approach</p>
            <h2 className="ail-h2" data-split><b>From business challenge</b> <i>to intelligent solution.</i></h2>
            <p className="ail-lede">We approach AI as an engineering and transformation process — not a technology experiment. Every engagement starts with a business objective and progresses through a structured implementation lifecycle.</p>
          </div>
        </ApproachDial>
      </section>

      {/* 05 Why Zyntraz */}
      <section className="ail-sec" id="why">
        <div className="ail-head center">
          <p className="ail-eyebrow"><em>05</em>Why Zyntraz for AI?</p>
          <h2 className="ail-h2" data-split><b>Intelligence engineered</b> <i>around your business.</i></h2>
        </div>
        <ol className="ail-why" data-ail="rise">
          {why.map(({ Icon, title, desc }, i) => (
            <li key={title}>
              <span className="ail-rule" data-rule aria-hidden="true" />
              <span className="ail-why-n">{pad(i + 1)}</span>
              <span className="ail-ico"><Icon size={20} /></span>
              <b>{title}</b>
              <p>{desc}</p>
              <ArrowUpRight className="ail-why-arrow" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      {/* 06 Security, Privacy & Responsible AI */}
      <section className="ail-sec ail-dark" id="responsible-ai">
        <div className="ail-split">
          <div className="ail-split-copy">
            <p className="ail-eyebrow"><em>06</em>Security, Privacy &amp; Responsible AI</p>
            <h2 className="ail-h2" data-split><b>Intelligence you can build on</b> <i>with confidence.</i></h2>
            <p className="ail-lede">AI solutions must do more than produce useful outputs. They must operate within appropriate security, privacy, and governance boundaries.</p>
            <p className="ail-lede">Zyntraz considers these requirements throughout solution design and implementation, based on the needs of each project.</p>
          </div>
          <div className="ail-shield" aria-hidden="true">
            <svg viewBox="0 0 400 400">
              <g data-spin="140"><circle cx="200" cy="200" r="186" className="r1" /><circle cx="200" cy="14" r="5" className="dot" /><circle cx="386" cy="200" r="3.5" className="dot" /></g>
              <g data-spin="-200"><circle cx="200" cy="200" r="150" className="r2" /><circle cx="50" cy="200" r="4" className="dot" /><circle cx="200" cy="350" r="4" className="dot" /></g>
              <g data-spin="90"><circle cx="200" cy="200" r="112" className="r3" /></g>
            </svg>
            <span className="ail-shield-sweep" />
            <span className="ail-shield-core"><LockKeyhole size={34} /></span>
          </div>
        </div>
        <ul className="ail-trust" data-ail="cine">
          {trust.map(({ Icon, title, desc }) => (
            <li key={title} className="spot"><span className="ail-ico"><Icon size={18} /></span><b>{title}</b><p>{desc}</p></li>
          ))}
        </ul>
        <p className="ail-note"><ShieldCheck size={18} />Your data requirements, regulatory obligations, and deployment preferences help determine the right architecture. Specific privacy and security guarantees should be established for each solution rather than assumed.</p>
      </section>

      {/* 07 FAQs */}
      <section className="ail-sec" id="faq">
        <div className="ail-faq">
          <div className="ail-head">
            <p className="ail-eyebrow"><em>07</em>Frequently Asked Questions</p>
            <h2 className="ail-h2" data-split><b>Questions,</b> <i>answered.</i></h2>
            <p className="ail-lede">Something else on your mind? <Link href="/contact">Ask us directly</Link>.</p>
          </div>
          <Faq />
        </div>
      </section>

      {/* 08 Final CTA */}
      <section className="ail-final">
        <div className="ail-final-card">
          <Orb tone="dark" className="ail-final-orb" />
          <p className="ail-final-eyebrow">Your next advantage starts here</p>
          <h2>Don&apos;t just adapt to the future. <span>Engineer it.</span></h2>
          <p>Whether you&apos;re exploring your first AI initiative or transforming an established business operation, let&apos;s identify where intelligent technology can create meaningful value.</p>
          <p>Bring us your challenge. We&apos;ll help you explore the right solution, define a practical path forward, and turn the opportunity into an actionable plan.</p>
          <div className="ail-ctas">
            <Link href="/contact" className="ail-btn light ail-mag">Start Your AI Project <ArrowRight size={16} /></Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="ail-btn outline ail-mag">Talk to Our Team <ArrowRight size={16} /></a>
          </div>
          <p className="ail-final-tag">ZYNTRAZ — Innovate • Dominate • Elevate</p>
        </div>
      </section>

      <AIMotion />
    </div>
  );
}
