"use client";

import { useEffect, useRef } from "react";
import { products } from "@/components/sections/Products";

/**
 * "How it works" for products without a film: one unit of work (the product's token) followed down a
 * track through the four workflow steps. The track fills with the scroll (--p) and each step lights as
 * the fill reaches it. Takes the slug, since a product carries an icon component that cannot cross to
 * the client.
 */
export default function ProductFlow({ slug }: { slug: string }) {
  const product = products.find((p) => p.id === slug) ?? products[0];
  const { name, token, workflow, accent } = product;
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = ref.current;
    if (!ol) return;
    const steps = [...ol.querySelectorAll<HTMLElement>("li")];
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = ol.getBoundingClientRect();
      const line = window.innerHeight * 0.55; // the fill follows this line down the viewport
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      ol.style.setProperty("--p", p.toFixed(3));
      steps.forEach((s) => s.classList.toggle("is-on", s.getBoundingClientRect().top + 20 < line));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="section alt pdp-flow" id="how-it-works" style={{ ["--acc" as string]: accent }}>
      <div className="container pdp-flow-grid">
        <div className="pdp-flow-head" data-keep>
          <p className="eyebrow" data-reveal>How it works</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".06s" }}>
            Follow {token.toLowerCase()} <span className="grad-text">through {name}.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".12s" }}>What actually happens when {name} is running your operation, step by step.</p>
          <span className="pdp-token" data-reveal style={{ ["--d" as string]: ".18s" }}><i />{token}</span>
        </div>
        <ol className="pdp-steps" ref={ref} data-keep>
          {workflow.map((w, i) => (
            <li key={w}>
              <span className="pdp-step-no">{String(i + 1).padStart(2, "0")}</span>
              <p>{w}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
