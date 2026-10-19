"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { services } from "@/lib/services";

/**
 * The seven services as tabs: one service on screen at a time — its heading, description and call to action
 * on the left; what you get and what's included on the right — so the portfolio reads in one screen
 * instead of seven. Anchors (/services#<slug>, used by the nav, footer and hero tiles) select the
 * matching tab and bring the section into view. Styles: "Service tabs" in globals.css.
 */
export default function ServiceTabs() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Select the tab named in the URL hash (on load and when a #<slug> link is followed).
  useEffect(() => {
    const fromHash = () => {
      const i = services.findIndex((s) => `#${s.slug}` === window.location.hash);
      if (i >= 0) setActive(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const select = (i: number, focus = false) => {
    setActive(i);
    history.replaceState(null, "", `#${services[i].slug}`);
    if (focus) tabs.current[i]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const n = services.length;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); select((active + 1) % n, true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); select((active - 1 + n) % n, true); }
  };

  const s = services[active];
  const Icon = s.icon;

  return (
    <section className="svt" id="portfolio" style={{ ["--acc" as string]: s.accent }} data-keep>
      {services.map((x) => <span key={x.slug} id={x.slug} className="svt-anchor" aria-hidden="true" />)}
      <div className="container">
        <div className="svt-head">
          <p className="eyebrow" data-reveal>The portfolio</p>
          <h2 className="svt-h" data-reveal>Seven services. <span>One engineering team.</span></h2>
          <p className="svt-lede" data-reveal>Start with one. Grow as the results do.</p>
        </div>

        <div className="svt-body" data-reveal>
          <div className="svt-tabs" role="tablist" aria-label="Services" aria-orientation="vertical" onKeyDown={onKey}>
            {services.map((x, i) => (
              <button
                key={x.slug}
                ref={(el) => { tabs.current[i] = el; }}
                type="button"
                role="tab"
                id={`svt-tab-${x.slug}`}
                aria-selected={i === active}
                aria-controls="svt-panel"
                tabIndex={i === active ? 0 : -1}
                className={i === active ? "is-on" : undefined}
                style={{ ["--acc" as string]: x.accent }}
                onClick={() => select(i)}
              >
                <em>{String(i + 1).padStart(2, "0")}</em>{x.name}
              </button>
            ))}
          </div>

          <div className="svt-panel" id="svt-panel" role="tabpanel" aria-labelledby={`svt-tab-${s.slug}`} key={s.slug}>
            <div className="svt-copy">
              <p className="svt-kicker"><Icon size={16} /> {s.name}</p>
              <h3>{s.heading}</h3>
              <p className="svt-text">{s.lede}</p>
              <Link href="/contact" className="svt-cta">Talk to us about {s.name} <ChevronRight size={17} /></Link>
            </div>
            <div className="svt-detail">
              <div className="svt-block">
                <small>What you get</small>
                <ul className="svt-out">{s.outcomes.map((o) => <li key={o}><Check size={15} />{o}</li>)}</ul>
              </div>
              <div className="svt-block">
                <small>What&apos;s included</small>
                <ul className="svt-inc">{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
