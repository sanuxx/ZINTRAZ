"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  {
    pain: "Data scattered across spreadsheets and chats",
    fix: "One unified operating system",
    desc: "Orders, stock, customers, staff and finance in a single platform — one source of truth your whole team trusts.",
  },
  {
    pain: "Hours lost to repetitive manual tasks",
    fix: "Intelligent workflow automation",
    desc: "Invoices, reminders, approvals, reorders and reports run themselves — eliminating manual work and human error.",
  },
  {
    pain: "AI experiments that never do real work",
    fix: "AI agents that take action",
    desc: "Agentic AI that understands requests, reasons through the steps and completes work across your systems — with human approval where it matters.",
  },
  {
    pain: "Disconnected tools and double data entry",
    fix: "Seamless integrations",
    desc: "We connect your POS, payments, accounting and existing apps through robust APIs, so data flows automatically.",
  },
  {
    pain: "Decisions made on gut feel and old reports",
    fix: "Real-time dashboards & analytics",
    desc: "Live reporting that turns operational data into strategic insight — see what's happening now, not last month.",
  },
  {
    pain: "Leads going cold, customers drifting away",
    fix: "Smart CRM & follow-up automation",
    desc: "Every enquiry tracked, every follow-up scheduled, with predictive lead scoring so your team focuses on the deals that close.",
  },
  {
    pain: "Software that forces you to work its way",
    fix: "Custom-built around your workflow",
    desc: "Not generic software. We engineer the system around how your business actually works — your workflows, your people, your goals.",
  },
  {
    pain: "Systems that break as soon as you grow",
    fix: "Scalable cloud architecture",
    desc: "Secure, high-performance infrastructure designed to grow with you — from one branch to fifty, without starting over.",
  },
];

export default function Solutions() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // ScrollTrigger (not IO) so rows skipped by a fast scroll or nav jump still resolve.
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".sol-row").forEach((row) => {
        ScrollTrigger.create({ trigger: row, start: "top 58%", once: true, onEnter: () => row.classList.add("is-solved") });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section solutions" id="solutions">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow" data-reveal>The Zyntraz fix</span>
          <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".1s" }}>
            Watch the chaos<br /><span className="grad-text">turn into a system.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".2s" }}>
            Scroll through each problem and see the system that replaces it — intelligent workflows, AI agents and
            scalable technology.
          </p>
        </div>

        <div className="sol-list" data-keep>
          {rows.map((r, i) => (
            <div key={r.fix} className="sol-row">
              <span className="sol-num">{String(i + 1).padStart(2, "0")}</span>
              <p className="sol-pain"><span>{r.pain}</span></p>
              <span className="sol-arrow" aria-hidden="true"><ArrowRight size={20} /></span>
              <div className="sol-fix">
                <h3>{r.fix}</h3>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
