"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { faqs } from "./data";

/** 07 FAQs: one answer open at a time; answers glide open and closed with GSAP. */
export default function Faq() {
  const [open, setOpen] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const panels = gsap.utils.toArray<HTMLElement>(".ail-faq-a", ref.current);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panels.forEach((p, i) => {
      const on = i === open;
      if (first.current || still) { gsap.set(p, { height: on ? "auto" : 0, opacity: on ? 1 : 0 }); return; }
      gsap.to(p, { height: on ? "auto" : 0, opacity: on ? 1 : 0, duration: on ? 0.6 : 0.45, ease: "expo.out", overwrite: true });
    });
    first.current = false;
  }, [open]);

  return (
    <div ref={ref} className="ail-faq-list">
      {faqs.map(([q, a], i) => (
        <div key={q} className={`ail-faq-item${i === open ? " is-open" : ""}`}>
          <h3>
            <button type="button" id={`ail-faq-q${i}`} aria-expanded={i === open} aria-controls={`ail-faq-a${i}`} onClick={() => setOpen(i === open ? -1 : i)}>
              <span className="ail-faq-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ail-faq-q">{q}</span>
              <span className="ail-faq-x" aria-hidden="true" />
            </button>
          </h3>
          <div className="ail-faq-a" id={`ail-faq-a${i}`} role="region" aria-labelledby={`ail-faq-q${i}`} inert={i !== open}>
            <p>{a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
