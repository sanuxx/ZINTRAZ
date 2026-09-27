"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { products } from "@/components/sections/Products";

gsap.registerPlugin(ScrollTrigger);

// Fan layout: slot offset (in card widths), Y rotation and depth for each screen.
const FAN = [
  { x: -1.35, ry: 24, z: -160, y: 34 },
  { x: -0.45, ry: 9, z: -20, y: 0 },
  { x: 0.45, ry: -9, z: -20, y: 0 },
  { x: 1.35, ry: -24, z: -160, y: 34 },
];

export default function ProductsHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = gsap.utils.toArray<HTMLElement>(".ph-card", root);
    // Wider spacing on phones so the fan reads as a carousel peek rather than a pile.
    const unit = () => (root.offsetWidth < 760 ? root.offsetWidth * 0.34 : Math.min(root.offsetWidth * 0.2, 250));

    const ctx = gsap.context(() => {
      gsap.set(cards, { x: (i) => FAN[i].x * unit(), y: (i) => FAN[i].y, z: (i) => FAN[i].z, rotationY: (i) => FAN[i].ry, xPercent: -50 });
      if (reduce) return;

      // Separate layers: .ph-enter = entrance, .ph-float = idle bob, .ph-card = fan position + scroll spread.
      gsap.from(gsap.utils.toArray(".ph-enter", root), { y: 260, opacity: 0, rotationX: 40, duration: 1.6, stagger: 0.12, ease: "expo.out", delay: 0.3 });
      cards.forEach((c, i) => {
        gsap.to(c.querySelector(".ph-float"), { y: -12, duration: 2.6 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.4 });
      });

      // Scrolling away: the fan spreads, rises and fades.
      gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } })
        .fromTo(cards, { x: (i) => FAN[i].x * unit(), y: (i) => FAN[i].y, opacity: 1 }, { x: (i) => FAN[i].x * unit() * 1.7, y: (i) => FAN[i].y - 120, opacity: 0.2, ease: "none" }, 0)
        .to(".ph-copy", { y: -80, opacity: 0.2, ease: "none" }, 0);
    }, root);

    // Mouse: tilt the whole fan and steer the colour glows at different depths.
    const fan = root.querySelector<HTMLElement>(".ph-fan")!;
    const rx = gsap.quickTo(fan, "rotationX", { duration: 1, ease: "power3" });
    const ry = gsap.quickTo(fan, "rotationY", { duration: 1, ease: "power3" });
    const blobs = gsap.utils.toArray<HTMLElement>(".ph-blob", root).map((el, i) => ({
      x: gsap.quickTo(el, "x", { duration: 1.6 + i * 0.3, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: 1.6 + i * 0.3, ease: "power3" }),
      k: (i % 2 ? -1 : 1) * (60 + i * 30),
    }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      if (!reduce) { rx(-ny * 8); ry(nx * 10); }
      blobs.forEach((b) => { b.x(nx * b.k); b.y(ny * b.k); });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => { ctx.revert(); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <section ref={ref} className="ph">
      <div className="ph-bg" aria-hidden="true">
        {products.map((p) => <span key={p.id} className="ph-blob" style={{ ["--c" as string]: p.accent }} />)}
      </div>
      <div className="container ph-copy">
        <p className="phero-eyebrow" data-reveal>Zyntraz Platforms</p>
        <h1 className="h-hero" data-reveal>Platforms,<br /><span className="grad-text">ready to run.</span></h1>
        <p className="lede ph-lede" data-reveal>
          Purpose-built platforms — <strong>deployed fast</strong>, then tailored to the way
          your business works. Every one is AI-ready.
        </p>
        <div className="cta-row" data-reveal>
          <Link href="/contact" className="btn btn-primary btn-lg">Book a demo</Link>
          <a href="#zynrest" className="link-chev">Explore the platforms <ChevronRight size={18} /></a>
        </div>
      </div>
      <div className="ph-stage" aria-hidden="true">
        <div className="ph-fan">
          {products.map((p) => (
            <div key={p.id} className="ph-card" style={{ ["--c" as string]: p.accent }}>
              <div className="ph-enter">
                <div className="ph-float">
                  <span className="ph-card-label">{p.name}{p.status === "soon" && <small> · Coming soon</small>}</span>
                  {p.mockup}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
