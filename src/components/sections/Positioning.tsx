"use client";

import { useEffect, useRef } from "react";
import { Eye, Compass, ShieldCheck, Handshake } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const statement = "Not generic software. We don't sell templates. We engineer systems around how your business actually works.";

const promises = [
  { icon: Eye, title: "No black-box development", desc: "Focused sprints with weekly demos. You see real progress continuously — no surprises." },
  { icon: Compass, title: "Aligned from day one", desc: "Architecture and UX designed in parallel, so technical decisions always serve your people and goals." },
  { icon: ShieldCheck, title: "Secure & reliable", desc: "CI/CD pipelines, monitoring and security hardening are standard — not an upsell." },
  { icon: Handshake, title: "Long-term partnership", desc: "Post-launch optimization, feature expansion and scaling as your business grows." },
];

export default function Positioning() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".philo-line .w", {
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: ".philo-line", start: "top 80%", end: "bottom 45%", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section" id="company">
      <div className="container">
        <span className="eyebrow" data-reveal style={{ marginBottom: 32 }}>Our philosophy</span>
        <h2 className="philo-line" aria-label={statement}>
          {statement.split(" ").map((w, i) => (
            <span key={i} className={`w${i < 3 ? " grad-text" : ""}`} aria-hidden="true">{w}</span>
          ))}
        </h2>
        <p className="lede philo-sub" data-reveal>
          Your workflows, your people, your goals. Every business operates differently — so every system we build does too.
        </p>

        <div className="promise-grid">
          {promises.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="glass spot promise" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <Icon className="promise-ico" size={26} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
