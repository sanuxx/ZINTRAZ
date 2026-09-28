"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { products, statusLabel } from "@/components/sections/Products";
import { scroll } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ProductTheater() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const switchRef = useRef<HTMLElement>(null);

  // On narrow screens the switcher scrolls sideways; keep the active product in view without moving the page.
  useEffect(() => {
    const bar = switchRef.current, btn = bar?.children[active] as HTMLElement | undefined;
    if (!bar || !btn || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: btn.offsetLeft - (bar.clientWidth - btn.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const root = ref.current!;
    const splits: SplitText[] = [];
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Scroll-spy for the switcher (all widths).
      gsap.utils.toArray<HTMLElement>(".pt-scene", root).forEach((scene, i) => {
        ScrollTrigger.create({ trigger: scene, start: "top 55%", end: "bottom 55%", onToggle: (st) => { if (st.isActive) setActive(i); } });
      });

      mm.add({
        desktop: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
      }, (c) => {
        gsap.utils.toArray<HTMLElement>(".pt-scene", root).forEach((scene, i) => {
          const q = gsap.utils.selector(scene);
          const side = i % 2 ? 1 : -1;
          const split = SplitText.create(q(".pt-name")[0], { type: "chars", mask: "chars" });
          splits.push(split);

          if (c.conditions?.desktop) {
            gsap.timeline({
              defaults: { ease: "power3.out" },
              // Plays across the approach (no pin): finished by the time the scene is centred.
              scrollTrigger: { trigger: scene, start: "top 85%", end: "center 55%", scrub: 1 },
            })
              .fromTo(q(".pt-screen"), { y: 220, scale: 0.78, opacity: 0, rotationX: 32, rotationY: side * 20 },
                { y: 0, scale: 1, opacity: 1, rotationX: 10, rotationY: side * 9, duration: 1.1 }, 0)
              .fromTo(q(".pt-glow"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.3 }, 0)
              .fromTo(q(".pt-cat"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.15)
              .fromTo(split.chars, { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.04 }, 0.2)
              .fromTo(q(".pt-tag, .pt-pain, .pt-desc"), { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 }, 0.5)
              .to(q(".pt-screen"), { rotationX: 0, rotationY: 0, duration: 1.8, ease: "none" }, 1.2)
              .fromTo(q(".pt-callout"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.4, ease: "back.out(2)" }, 1.3)
              .fromTo(q(".pt-feats li, .pt-ai, .pt-cta"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06 }, 2.9)
              .to({}, { duration: 0.8 });
          } else {
            gsap.from(split.chars, { yPercent: 110, duration: 0.9, stagger: 0.035, ease: "expo.out", scrollTrigger: { trigger: scene, start: "top 75%", once: true } });
            gsap.from(q(".pt-screen"), { y: 80, opacity: 0, rotationX: 20, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: q(".pt-screen")[0], start: "top 90%", once: true } });
            gsap.from(q(".pt-tag, .pt-pain, .pt-desc, .pt-feats li, .pt-ai, .pt-cta"), { y: 30, opacity: 0, duration: 0.9, stagger: 0.06, ease: "expo.out", scrollTrigger: { trigger: q(".pt-copy")[0], start: "top 85%", once: true } });
          }
        });
      });
    }, root);

    return () => { splits.forEach((s) => s.revert()); mm.revert(); ctx.revert(); };
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (scroll.lenis) scroll.lenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={ref} className="pt">
      <nav ref={switchRef} className="pt-switch" aria-label="Products">
        {products.map((p, i) => (
          <button key={p.id} type="button" className={i === active ? "is-active" : undefined} style={{ ["--c" as string]: p.accent }} onClick={() => jump(p.id)}>
            <i aria-hidden="true" />{p.name}
          </button>
        ))}
      </nav>

      {products.map((p, i) => (
        <section key={p.id} id={p.id} className={`pt-scene${i % 2 ? " flip" : ""}`} data-mood={p.mood} style={{ ["--c" as string]: p.accent }}>
          <div className="pt-stage">
            <div className="container pt-grid">
              <div className="pt-copy">
                <p className="pt-cat">
                  <span>{String(i + 1).padStart(2, "0")}</span>{p.category}
                  <em className={`pstatus pstatus-${p.status}`}>{statusLabel[p.status]}</em>
                </p>
                <h2 className="pt-name">{p.name}</h2>
                <p className="pt-tag">{p.tagline}</p>
                <p className="pt-pain"><AlertCircle size={17} /> {p.pain}</p>
                <p className="pt-desc">{p.desc}</p>
                <ul className="pt-feats">{p.features.map((f) => <li key={f}><CheckCircle2 size={15} /> {f}</li>)}</ul>
                <p className="pt-ai"><Sparkles size={15} /> {p.ai}</p>
                <Link href="/contact" className="btn btn-primary pt-cta">
                  {p.status === "available" ? `Book a ${p.name} demo` : `Register interest in ${p.name}`}
                </Link>
              </div>
              <div className="pt-visual">
                <div className="pt-glow" aria-hidden="true" />
                <div className="pt-screen">
                  {p.mockup}
                  {p.callouts.map((c) => (
                    <span key={c.label} className="pt-callout" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                      <span className="pt-dot" aria-hidden="true" />
                      <span className="pt-label">{c.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="container pt-eco">
              <p className="pt-eco-cap">How {p.name} {p.status === "available" ? "runs" : "will run"} {p.eco.where}</p>
              <ol className="pt-eco-flow">
                <li data-reveal><small>Who</small><b>{p.eco.who}</b></li>
                <li data-reveal style={{ ["--d" as string]: ".08s" }}><small>Through</small><b>{p.eco.channel}</b></li>
                <li data-reveal className="is-core" style={{ ["--d" as string]: ".16s" }}><small>Platform</small><b>{p.name}</b></li>
                <li data-reveal className="is-runs" style={{ ["--d" as string]: ".24s" }}>
                  <small>Runs</small>
                  <span>{p.eco.runs.map((r) => <i key={r}>{r}</i>)}</span>
                </li>
                <li data-reveal className="is-ai" style={{ ["--d" as string]: ".32s" }}>
                  <small><Sparkles size={12} /> Zyntraz AI add-on</small>
                  <span>{p.eco.ai.map((r) => <i key={r}>{r}</i>)}</span>
                </li>
              </ol>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
