"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductGlimpse from "@/components/products/ProductGlimpse";
import { groupLabel, products, statusLabel, type ProductGroup } from "@/components/sections/Products";

/**
 * The three families as sticky chapters that stack as you scroll: each card pins under the header and
 * the next slides over it while the covered one recedes (scale + dim, driven by --cover 0→1). Each
 * chapter: the family named large, its products as an index, and a collage of their glimpses.
 * /products#hospitality, #business-systems and #ai-products land on the matching chapter.
 */
const GROUPS = Object.keys(groupLabel) as ProductGroup[];
const blurb: Record<ProductGroup, string> = {
  hospitality: "Guests, tables, rooms and events, run as one operation.",
  "business-systems": "Customers, data and the day-to-day work of the business.",
  "ai-products": "Agents and intelligence that do real work inside your systems.",
};

export default function ProductStack() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>(".pst-card")];
    let raf = 0;
    const update = () => {
      raf = 0;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const a = card.getBoundingClientRect(), b = next.getBoundingClientRect();
        // 0 while the next card is a card-height away, 1 once it has fully slid over.
        const t = Math.min(1, Math.max(0, 1 - (b.top - a.top) / a.height));
        card.style.setProperty("--cover", t.toFixed(3));
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="section pst" id="catalogue">
      <div className="container">
        <div className="section-head pst-head" data-keep>
          <p className="eyebrow" data-reveal>The family</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
            Three families. <span className="grad-text">One way of working.</span>
          </h2>
        </div>

        <div className="pst-stack" ref={rootRef}>
          {GROUPS.map((g, gi) => {
            const list = products.filter((p) => p.group === g);
            return (
              <Fragment key={g}>
                <span id={g} className="pst-anchor" aria-hidden="true" />
                <article className="pst-card" style={{ ["--i" as string]: gi }} data-keep>
                  <header className="pst-bar">
                    <span>{String(gi + 1).padStart(2, "0")} / {String(GROUPS.length).padStart(2, "0")}</span>
                    <span>{list.length} products</span>
                  </header>
                  <div className="pst-body">
                    <div className="pst-copy">
                      <h3 className="pst-title">{groupLabel[g]}</h3>
                      <p className="pst-blurb">{blurb[g]}</p>
                      <ul className="pst-list">
                        {list.map((p) => (
                          <li key={p.id} style={{ ["--acc" as string]: p.accent }}>
                            <Link href={`/products/${p.id}`}>
                              <span className="pst-dot" />
                              <span className="pst-name"><b>{p.name}</b><em>{p.tagline}</em></span>
                              <span className={`pst-status ${p.status}`}>{statusLabel[p.status]}</span>
                              <ArrowUpRight size={18} className="pst-go" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={`pst-visual n${list.length}`} aria-hidden="true">
                      {list.map((p, k) => (
                        <div key={p.id} className="pst-screen" style={{ ["--acc" as string]: p.accent, ["--k" as string]: k }}>
                          <div className="pst-screen-bar"><i /><i /><i /><span>{p.name}</span></div>
                          <ProductGlimpse id={p.id} accent={p.accent} />
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
