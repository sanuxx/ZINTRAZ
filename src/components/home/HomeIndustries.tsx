"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Plus } from "lucide-react";
import { industries } from "@/lib/industries";

// Industries as stacked horizontal slabs: the active industry opens into a compact card (headline, three
// outcomes, the products behind it); the rest stay as full-width accent bars. The open card has a fixed
// height, so switching industries never changes the section's height or shifts the page. It
// auto-advances while on screen, pauses while the pointer is over it, and slabs open on click/focus.
const CYCLE_MS = 6500;

export default function HomeIndustries() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // "Visible" only ever turns true for motion-OK users, so reduced motion never auto-advances.
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("rm");
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && !still), { threshold: 0.35 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  const running = visible && !paused;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % industries.length), CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [running, active]);

  return (
    <section ref={ref} className="section alt ind-home" id="industries">
      <div className="container">
        <div className="ind-head">
          <div className="section-head">
            <p className="eyebrow" data-reveal>Industries we serve</p>
            <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
              Your industry&apos;s problems, <span className="grad-text">and the systems that fix them.</span>
            </h2>
          </div>
          <p className="ind-note" data-reveal style={{ ["--d" as string]: ".16s" }}>
            {industries.length} industries, one engineering approach. Select an industry to explore.
          </p>
        </div>

        {/* The reveal lives on a wrapper: the reveal script adds .is-in to the element's class list, and
            React rewriting the slabs' className (is-running toggles) would strip it and hide them. */}
        <div data-reveal style={{ ["--d" as string]: ".2s" }}>
          <div className={`ind-slabs${running ? " is-running" : ""}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {industries.map((ind, i) => {
              const open = i === active;
              const Icon = ind.icon;
              // Collapsed bars fade from full brand-blue (first slab) toward white (last); text flips to ink once the bar is light.
              const t = 1 - (i / (industries.length - 1)) * 0.86;
              return (
                <article key={ind.slug} className={`ind-s${open ? " is-open" : ""}${t > 0.62 ? " on-dark" : ""}`} style={{ ["--t" as string]: t }}>
                  <button className="ind-bar" aria-expanded={open} aria-controls={`ind-${ind.slug}`} onClick={() => setActive(i)} tabIndex={open ? -1 : 0}>
                    <span className="ind-bar-num">0{i + 1}</span>
                    <Icon className="ind-bar-ico" size={20} />
                    <span className="ind-bar-name">{ind.name}</span>
                    <span className="ind-bar-hint">{ind.outcomes[0]}</span>
                    <Plus className="ind-bar-plus" size={20} />
                  </button>

                  {/* data-keep: TextFold must not collapse the lede into "Read more" — the card has a fixed height. */}
                  <div className="ind-card" id={`ind-${ind.slug}`} aria-hidden={!open} inert={!open} data-keep>
                    <div className="ind-card-in">
                      <div className="ind-main">
                        <span className="ind-tag"><Icon size={16} /> {ind.name}</span>
                        <h3>{ind.heading}</h3>
                        <Link href={`/industries#${ind.slug}`} className="btn btn-primary">Explore {ind.short} <ArrowRight size={15} /></Link>
                      </div>
                      <div className="ind-side">
                        <ul className="ind-outs">
                          {ind.outcomes.slice(0, 3).map((o) => <li key={o}><Check size={15} />{o}</li>)}
                        </ul>
                        <div className="ind-prods">
                          <span>Built with</span>
                          {ind.products.map((p) => (
                            <Link key={p} href={`/products/${p.toLowerCase()}`}>{p}</Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="ind-progress" key={`${active}-${running}`} aria-hidden="true" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="ind-more" data-reveal>
          <Link href="/industries" className="link-chev">See all industry use cases <ChevronRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
