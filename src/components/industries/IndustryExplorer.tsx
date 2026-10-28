"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import ProductGlimpse from "@/components/products/ProductGlimpse";
import { products } from "@/components/sections/Products";
import { industries } from "@/lib/industries";
import OperationSlider from "./OperationSlider";

/**
 * The industries as one interactive dossier: pick an industry from the selector and its panel shows
 * - "Flip the operation": a before/after slider from today's desk (spreadsheet, sticky note, group chat,
 *   paper form) to the same work inside the ZINTRAZ app, problem by problem (see OperationSlider);
 * - the approach as a pull quote, what we build, and the ZINTRAZ products it runs on (live mini screens).
 * /industries#<slug> (nav, footer, hero strip) opens that industry and scrolls to the explorer.
 */
const SLUGS = industries.map((i) => i.slug);
const COUNT = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export default function IndustryExplorer() {
  const [active, setActive] = useState(0);

  // Deep links: open the industry named in the hash (now and on later hash changes).
  useEffect(() => {
    const apply = () => {
      const i = SLUGS.indexOf(window.location.hash.slice(1));
      if (i >= 0) {
        setActive(i);
        document.getElementById("explorer")?.scrollIntoView();
      }
    };
    // Same-page #slug links (hero strip) are intercepted by SmoothScroll without changing the URL, so
    // also select on the click itself (window capture runs before SmoothScroll's document handler).
    const click = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']");
      const i = a ? SLUGS.indexOf(a.getAttribute("href")!.split("#")[1]) : -1;
      if (i >= 0 && !a!.closest(".ixp-tabs")) setActive(i);
    };
    queueMicrotask(apply);
    window.addEventListener("hashchange", apply);
    window.addEventListener("click", click, true);
    return () => { window.removeEventListener("hashchange", apply); window.removeEventListener("click", click, true); };
  }, []);

  const ind = industries[active];
  const Icon = ind.icon;
  const built = ind.products.map((n) => products.find((p) => p.name === n)).filter((p): p is (typeof products)[number] => !!p);
  const choose = (i: number) => { setActive(i); history.replaceState(null, "", `#${SLUGS[i]}`); };

  return (
    <section className="section alt ixp" id="explorer" style={{ ["--acc" as string]: ind.accent }}>
      {SLUGS.map((s) => <span key={s} id={s} className="ixp-anchor" aria-hidden="true" />)}
      <div className="container">
        <div className="section-head" data-keep>
          <p className="eyebrow" data-reveal>{COUNT[industries.length] ?? industries.length} industries</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".06s" }}>
            Find your industry. <span className="grad-text">See it engineered.</span>
          </h2>
        </div>

        <div className="ixp-tabs" role="tablist" aria-label="Industries" data-reveal>
          {industries.map((it, i) => {
            const I = it.icon;
            return (
              <button key={it.slug} type="button" role="tab" aria-selected={i === active} aria-controls="ixp-panel" className={i === active ? "is-on" : undefined} style={{ ["--acc" as string]: it.accent }} onClick={() => choose(i)}>
                <I size={16} />{it.short}
              </button>
            );
          })}
        </div>

        <div className="ixp-panel" id="ixp-panel" role="tabpanel" aria-label={ind.name} key={ind.slug} data-keep>
          <header className="ixp-head">
            <span className="ixp-ico"><Icon size={22} /></span>
            <div>
              <small>{String(active + 1).padStart(2, "0")} / {String(industries.length).padStart(2, "0")} · {ind.name}</small>
              <h3>{ind.heading}</h3>
              <p>{ind.lede}</p>
            </div>
          </header>

          <OperationSlider ind={ind} key={ind.slug} />

          <div className="ixp-detail">
            <blockquote className="ixp-quote"><small>How we approach it</small>{ind.approach}</blockquote>
            <div className="ixp-build">
              <small>What we build</small>
              <ul>{ind.solutions.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          </div>

          {built.length > 0 && (
            <div className="ixp-products">
              <small>Built on ZINTRAZ products</small>
              <div className="ixp-prod-grid">
                {built.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="ixp-prod" style={{ ["--acc" as string]: p.accent }}>
                    <span className="ixp-prod-screen"><ProductGlimpse id={p.id} accent={p.accent} /></span>
                    <span className="ixp-prod-meta"><b>{p.name}</b><em>{p.category}</em></span>
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link href="/contact" className="link-chev ixp-cta">Talk to us about {ind.short.toLowerCase()} <ChevronRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
