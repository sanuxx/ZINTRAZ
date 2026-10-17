"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const stats = [
  { target: 5, suffix: "", label: "Disciplines under one roof" },
  { target: 6, suffix: "", label: "Industries we engineer for" },
  { target: 9, suffix: "", label: "Products on one shared core" },
  { target: 100, suffix: "%", label: "Human approval on high-stakes AI actions" },
];

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const nums = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      stats.forEach((s, i) => {
        const o = { v: 0 };
        tweens.push(gsap.to(o, {
          v: s.target, duration: 2.4, ease: "power3.out", delay: i * 0.1,
          onUpdate: () => {
            const el = nums.current[i];
            if (el) el.textContent = s.target % 1 ? o.v.toFixed(1) : String(Math.round(o.v));
          },
        }));
      });
    }, { threshold: 0.4 });
    io.observe(ref.current!);
    return () => { io.disconnect(); tweens.forEach((t) => t.kill()); };
  }, []);

  return (
    <section ref={ref} className="stats" id="numbers" aria-label="Zyntraz in numbers">
      <div className="container stats-grid">
        {stats.map((s, i) => (
          <div key={s.label} className="stat" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
            <div className="stat-num grad-text">
              <span ref={(el) => { nums.current[i] = el; }}>{s.target}</span>{s.suffix}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
