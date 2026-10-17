"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Check, FileText, MessageSquare, Search, Send, X } from "lucide-react";

/**
 * Chatbot vs agent, told visually with as few words as possible. The same message enters two tracks: the chatbot
 * track replies and stops at a wall; the agent track lights its way through the systems to a finished job. A time
 * bar under each tells the rest: hours of waiting against seconds. Plays once when the section comes into view.
 */
const BOT = [
  { icon: MessageSquare, label: "Message" },
  { icon: Send, label: "Scripted reply" },
];
const AGENT = [
  { icon: MessageSquare, label: "Message" },
  { icon: Search, label: "Finds account" },
  { icon: FileText, label: "Pulls invoice" },
  { icon: Send, label: "Sends it" },
];

export default function AgentCompare() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("rm")) return;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      gsap.set(q(".cp-node, .cp-end, .cp-time-label"), { autoAlpha: 0, scale: 0.6 });
      gsap.set(q(".cp-link i"), { scaleX: 0 });
      gsap.set(q(".cp-bar i"), { scaleX: 0 });
      for (const lane of [".cp-bot", ".cp-agent"]) {
        const nodes = q(`${lane} .cp-node`), links = q(`${lane} .cp-link i`);
        nodes.forEach((n, i) => {
          t.to(n, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, 0.3 + i * 0.55);
          if (links[i]) t.to(links[i], { scaleX: 1, duration: 0.45, ease: "power1.inOut" }, 0.55 + i * 0.55);
        });
        t.to(q(`${lane} .cp-end`), { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.4)" }, 0.3 + nodes.length * 0.55);
      }
      t.to(q(".cp-bot .cp-bar i"), { scaleX: 1, duration: 2.6, ease: "power1.in" }, 1.2)
        .to(q(".cp-agent .cp-bar i"), { scaleX: 0.04, duration: 0.6 }, 2.6)
        .to(q(".cp-time-label"), { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.2 }, 3.4);
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { t.play(); io.disconnect(); } }, { threshold: 0.45 });
      io.observe(el);
      return () => io.disconnect();
    }, el);
    return () => ctx.revert();
  }, []);

  const track = (cls: string, steps: typeof AGENT, end: React.ReactNode, time: string) => (
    <div className={`cp-lane ${cls}`}>
      <div className="cp-track">
        {steps.map(({ icon: Icon, label }, i) => (
          <div key={label} className="cp-step">
            <span className="cp-node"><Icon size={20} /><small>{label}</small></span>
            {i < steps.length - 1 && <span className="cp-link"><i /></span>}
          </div>
        ))}
        <span className="cp-link cp-link-end"><i /></span>
        {end}
      </div>
      <div className="cp-time"><span className="cp-bar"><i /></span><b className="cp-time-label">{time}</b></div>
    </div>
  );

  return (
    <section ref={root} className="section cp">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow" data-reveal>Chatbot or agent?</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
            One talks. <span className="grad-text">One gets it done.</span>
          </h2>
        </div>

        <p className="cp-msg" data-reveal>“Can you resend last month’s invoice?”</p>

        <div className="cp-lanes">
          <div className="cp-row">
            <p className="cp-who">Chatbot</p>
            {track("cp-bot", BOT, <span className="cp-end cp-wall"><X size={22} /><small>Dead end</small></span>, "~18 hours")}
          </div>
          <div className="cp-row">
            <p className="cp-who is-agent">AI agent</p>
            {track("cp-agent", AGENT, <span className="cp-end cp-done"><Check size={22} /><small>Done</small></span>, "40 seconds")}
          </div>
        </div>
      </div>
    </section>
  );
}
