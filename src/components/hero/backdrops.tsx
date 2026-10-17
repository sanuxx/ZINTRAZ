"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Hero backdrops: one small 3D scene per page, sitting behind the headline.
 *
 * Each states the page's idea in a shape — fragments reassembling for transformation, slabs
 * converging for solutions, a path receding for process. They are deliberately quiet: low contrast,
 * slow, and never competing with the copy in front of them.
 *
 * All are CSS 3D driven by GSAP, matching the rest of the site rather than adding a WebGL context
 * to every page. Each runs one looping timeline, paused while off screen and skipped entirely under
 * reduced motion.
 */
function useLoop<T extends HTMLElement>(build: (q: gsap.utils.SelectorFunc, tl: gsap.core.Timeline) => void) {
  const ref = useRef<T>(null);
  const builder = useRef(build).current;

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let io: IntersectionObserver | undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "none" } });
      builder(gsap.utils.selector(el), tl);
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()));
      io.observe(el);
    }, el);

    return () => {
      io?.disconnect();
      ctx.revert();
    };
    // builder is captured once; these scenes never change shape.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/** /transformation — scattered fragments drifting into alignment, then breaking apart again. */
export function ShatterField() {
  const cells = Array.from({ length: 28 }, (_, i) => i);
  const ref = useLoop<HTMLDivElement>((q, tl) => {
    const bits = q(".bd-bit");
    bits.forEach((bit, i) => {
      const seed = (i * 37) % 11;
      tl.fromTo(
        bit,
        { z: -520 - seed * 60, x: (seed - 5) * 46, y: (((i * 53) % 9) - 4) * 38, rotationX: seed * 17, rotationY: seed * -23, opacity: 0 },
        { z: 0, x: 0, y: 0, rotationX: 0, rotationY: 0, opacity: 1, duration: 4, ease: "power2.inOut" },
        i * 0.045,
      ).to(bit, { z: 420, opacity: 0, duration: 2.6, ease: "power2.in" }, 6 + i * 0.03);
    });
  });

  return (
    <div ref={ref} className="bd bd-shatter">
      <div className="bd-space">
        {cells.map((i) => (
          <span key={i} className="bd-bit" style={{ gridArea: `${Math.floor(i / 7) + 1} / ${(i % 7) + 1}` }} />
        ))}
      </div>
    </div>
  );
}

/** /solutions — three slabs orbiting a common axis, the shape the page's prism will take. */
export function SlabStack() {
  const ref = useLoop<HTMLDivElement>((q, tl) => {
    tl.to(q(".bd-slab-rotor"), { rotationY: 360, duration: 34 }, 0);
    q(".bd-slab").forEach((s, i) => {
      tl.to(s, { y: i % 2 ? 18 : -18, duration: 8, yoyo: true, repeat: -1, ease: "sine.inOut" }, i * 1.4);
    });
  });

  return (
    <div ref={ref} className="bd bd-slabs">
      <div className="bd-slab-rotor">
        {[0, 1, 2].map((i) => (
          <span key={i} className="bd-slab" style={{ transform: `rotateY(${i * 120}deg) translateZ(320px)`, ["--i" as string]: i }} />
        ))}
      </div>
    </div>
  );
}

/** /industries — a wall of tiles, each turning on its own axis then settling square. */
export function GlyphWall() {
  const cells = Array.from({ length: 24 }, (_, i) => i);
  const ref = useLoop<HTMLDivElement>((q, tl) => {
    const tiles = q(".bd-tile");
    tiles.forEach((t, i) => {
      const seed = (i * 29) % 7;
      tl.fromTo(
        t,
        { rotationY: 90 + seed * 12, rotationX: seed * 8, opacity: 0.08 },
        { rotationY: 0, rotationX: 0, opacity: 0.85, duration: 2.4, ease: "power3.out" },
        i * 0.07,
      ).to(t, { rotationY: -90, opacity: 0.08, duration: 2, ease: "power3.in" }, 6.5 + i * 0.05);
    });
  });

  return (
    <div ref={ref} className="bd bd-wall">
      <div className="bd-wall-grid">
        {cells.map((i) => <span key={i} className="bd-tile" />)}
      </div>
    </div>
  );
}

/** /how-we-work — a path running away into depth, nodes lighting in order. */
export function PathNodes() {
  const nodes = Array.from({ length: 6 }, (_, i) => i);
  const ref = useLoop<HTMLDivElement>((q, tl) => {
    tl.fromTo(q(".bd-path-fill"), { scaleX: 0 }, { scaleX: 1, duration: 5, ease: "power1.inOut" }, 0);
    q(".bd-node").forEach((n, i) => {
      tl.fromTo(n, { scale: 0.4, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 0.5 + i * 0.8);
    });
    tl.to(q(".bd-node"), { opacity: 0.2, scale: 0.4, duration: 1.2, stagger: 0.08 }, 6.4)
      .to(q(".bd-path-fill"), { scaleX: 0, transformOrigin: "100% 50%", duration: 1.2 }, 6.4);
  });

  return (
    <div ref={ref} className="bd bd-path">
      <div className="bd-path-space">
        <span className="bd-path-line" />
        <span className="bd-path-fill" />
        {nodes.map((i) => (
          <span key={i} className="bd-node" style={{ left: `${6 + i * 17.6}%`, ["--d" as string]: `${i * 90}px` }} />
        ))}
      </div>
    </div>
  );
}

/** /consultation — two planes turned toward each other, the shape of a conversation. */
export function DialogPlanes() {
  const ref = useLoop<HTMLDivElement>((q, tl) => {
    tl.to(q(".bd-plane-l"), { rotationY: 46, x: -24, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" }, 0)
      .to(q(".bd-plane-r"), { rotationY: -46, x: 24, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" }, 0.9)
      .to(q(".bd-pulse"), { scale: 2.4, opacity: 0, duration: 3.2, stagger: 1.1, repeat: -1, ease: "power2.out" }, 0);
  });

  return (
    <div ref={ref} className="bd bd-dialog">
      <div className="bd-dialog-space">
        <span className="bd-plane bd-plane-l" />
        <span className="bd-plane bd-plane-r" />
        <span className="bd-pulse" />
        <span className="bd-pulse" />
      </div>
    </div>
  );
}

/** /about — labelled strata receding into depth: business, systems, intelligence. */
export function DepthSlabs() {
  const layers = ["Business", "Strategy", "Engineering", "Intelligence", "Transformation"];
  const ref = useLoop<HTMLDivElement>((q, tl) => {
    q(".bd-strata").forEach((s, i) => {
      tl.fromTo(
        s,
        { z: -900 + i * 120, opacity: 0, rotationX: 62 },
        { z: 120 - i * 10, opacity: 1, rotationX: 62, duration: 4.5, ease: "power2.out" },
        i * 0.5,
      ).to(s, { z: 500, opacity: 0, duration: 2.4, ease: "power2.in" }, 7 + i * 0.3);
    });
  });

  return (
    <div ref={ref} className="bd bd-depth">
      <div className="bd-depth-space">
        {layers.map((l) => (
          <span key={l} className="bd-strata" data-label={l} />
        ))}
      </div>
    </div>
  );
}

/** /services — a hand of cards dealt out and gathered back in. */
export function CardDeal() {
  const cards = Array.from({ length: 7 }, (_, i) => i);
  const ref = useLoop<HTMLDivElement>((q, tl) => {
    q(".bd-card3").forEach((c, i) => {
      const off = i - 3;
      tl.fromTo(
        c,
        { x: 0, y: 120, z: -300, rotationZ: 0, rotationY: 0, opacity: 0 },
        { x: off * 196, y: Math.abs(off) * 16, z: -Math.abs(off) * 90, rotationZ: off * 7, rotationY: off * -9, opacity: 1, duration: 2.6, ease: "power3.out" },
        i * 0.14,
      ).to(c, { x: 0, y: -90, z: 260, rotationZ: 0, opacity: 0, duration: 2, ease: "power2.in" }, 7 + i * 0.07);
    });
  });

  return (
    <div ref={ref} className="bd bd-deal">
      <div className="bd-deal-space">
        {cards.map((i) => <span key={i} className="bd-card3" />)}
      </div>
    </div>
  );
}

/** /products — nine modules fanning out of one stack into a suite, then gathering back. */
export function ModuleSuite() {
  const mods = Array.from({ length: 9 }, (_, i) => i);
  const ref = useLoop<HTMLDivElement>((q, tl) => {
    q(".bd-mod").forEach((m, i) => {
      const col = (i % 3) - 1, row = Math.floor(i / 3) - 1;
      tl.fromTo(
        m,
        { x: 0, y: 40, z: -420 + i * 8, rotationX: 0, opacity: 0 },
        { x: col * 230, y: row * 150, z: -Math.abs(col) * 60 - Math.abs(row) * 40, rotationX: row * -6, rotationY: col * -10, opacity: 1, duration: 2.4, ease: "power3.out" },
        i * 0.11,
      ).to(m, { x: 0, y: -60, z: 200, rotationX: 0, rotationY: 0, opacity: 0, duration: 1.9, ease: "power2.in" }, 7 + (8 - i) * 0.06);
    });
  });

  return (
    <div ref={ref} className="bd bd-suite">
      <div className="bd-suite-space">
        {mods.map((i) => <span key={i} className="bd-mod"><i /><i /></span>)}
      </div>
    </div>
  );
}
