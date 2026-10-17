"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { whenReady } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * The page-wide choreography for /ai. The page itself is server-rendered markup; this wires the motion
 * onto it through data attributes, so the content is complete without JavaScript or with motion off:
 *
 * - the hero intro (pill, masked headline lines, copy) and its scroll-out parallax
 * - `[data-split]` headings: lines rise out of a mask
 * - `[data-words]` statements: words brighten as they scroll through the viewport
 * - `[data-ail=rise]` groups: children rise in, staggered; `[data-ail=cine]` card groups focus-pull out of a blur, then catch a light sweep
 * - `[data-rule]` lines draw across; `[data-spin]` turns with scroll
 * - the capability ticker, which speeds up with scroll velocity
 * - `.ail-mag` buttons lean toward the pointer
 */
export default function AIMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ail");
    if (!root) return;
    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];
    let stopReady = () => {};

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);

      // Hero intro, after the site's logo intro has finished.
      const hero = q(".ail-hero-copy")[0] as HTMLElement | undefined;
      if (hero) {
        const h1 = hero.querySelector("h1")!;
        // Each headline line rises out of its own mask (the lines carry a gradient, so they are not split further).
        const lines = h1.querySelectorAll(":scope > * > span");
        const rest = Array.from(hero.children).filter((c) => c !== h1);
        gsap.set(h1, { opacity: 1 });
        gsap.set(lines, { yPercent: 110, rotate: 2.5, transformOrigin: "0 100%" });
        gsap.set(rest, { y: 26 });
        stopReady = whenReady(() => {
          gsap.timeline({ defaults: { ease: "expo.out" } })
            .to(rest[0], { opacity: 1, y: 0, duration: 1 }, 0)
            .to(lines, { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.14 }, 0.1)
            .to(rest.slice(1), { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.6)
            .from(q(".ail-hero .ail-orb"), { opacity: 0, scale: 0.86, duration: 2, ease: "power3.out" }, 0.3);
        });
        // Scroll-out: the copy lifts away and the orb swells toward the viewer.
        gsap.timeline({ scrollTrigger: { trigger: ".ail-hero", start: "top top", end: "bottom top", scrub: true } })
          .to(hero, { yPercent: -18, opacity: 0.15, ease: "none" }, 0)
          .to(q(".ail-hero-stage"), { scale: 1.16, yPercent: -6, ease: "none" }, 0);
      }

      q("[data-split]").forEach((el) => {
        const s = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "ail-line" });
        splits.push(s);
        gsap.from(s.lines, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });

      q("[data-words]").forEach((el) => {
        const s = SplitText.create(el, { type: "words" });
        splits.push(s);
        gsap.fromTo(s.words, { opacity: 0.14 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: true } });
      });

      // Text and rows rise in, staggered.
      q('[data-ail="rise"]').forEach((group) => {
        gsap.from(group.children, {
          y: 44, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, clearProps: "transform,opacity",
          scrollTrigger: { trigger: group, start: "top 86%", once: true },
        });
      });

      // Cards: a cinematic focus-pull. Each one rises out of a soft, over-exposed blur into sharp focus,
      // then a band of light sweeps across it.
      q('[data-ail="cine"]').forEach((group) => {
        gsap.fromTo(group.children,
          { opacity: 0, y: 70, scale: 0.94, filter: "blur(18px) brightness(1.6)" },
          {
            opacity: 1, y: 0, scale: 1, filter: "blur(0px) brightness(1)", duration: 1.5, ease: "expo.out", clearProps: "transform,opacity,filter",
            stagger: { each: 0.13, onComplete(this: gsap.core.Tween) { (this.targets()[0] as HTMLElement).classList.add("ail-lit"); } },
            scrollTrigger: { trigger: group, start: "top 84%", once: true },
          });
      });

      q("[data-rule]").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });

      q("[data-spin]").forEach((el) => {
        const turn = Number(el.getAttribute("data-spin")) || 90;
        // SVG groups turn about the drawing's centre, not their own bounding box.
        const origin = el instanceof SVGGraphicsElement ? { svgOrigin: "200 200" } : {};
        gsap.fromTo(el, { rotate: -turn / 2, ...origin }, { rotate: turn / 2, ...origin, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // The ticker: an endless loop whose speed (and direction) follows the scroll.
      const track = q(".ail-ticker-track")[0];
      if (track) {
        const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        loop.totalTime(loop.duration() * 1000); // headroom so scrolling up can run it backwards
        const boost = gsap.quickTo(loop, "timeScale", { duration: 0.6, ease: "power3.out" });
        const settle = gsap.delayedCall(0.2, () => boost(Math.sign(loop.timeScale()) || 1)).pause();
        ScrollTrigger.create({
          trigger: track, start: "top bottom", end: "bottom top",
          onUpdate: (self) => {
            boost(self.direction * gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 400));
            settle.restart(true);
          },
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
      }

      // The final call to action: the headline assembles character by character.
      const fin = q(".ail-final h2")[0];
      if (fin) {
        const s = SplitText.create(fin, { type: "words,chars", mask: "words", wordsClass: "ail-word" });
        splits.push(s);
        gsap.from(s.chars, { yPercent: 120, duration: 1, ease: "expo.out", stagger: 0.018, scrollTrigger: { trigger: fin, start: "top 82%", once: true } });
      }
    });

    // Magnetic buttons, on devices with a real pointer.
    mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      const offs = Array.from(root.querySelectorAll<HTMLElement>(".ail-mag")).map((b) => {
        const x = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3.out" }), y = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3.out" });
        const move = (e: PointerEvent) => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.28); y((e.clientY - r.top - r.height / 2) * 0.4); };
        const leave = () => { x(0); y(0); };
        b.addEventListener("pointermove", move); b.addEventListener("pointerleave", leave);
        return () => { b.removeEventListener("pointermove", move); b.removeEventListener("pointerleave", leave); };
      });
      return () => offs.forEach((f) => f());
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    return () => { stopReady(); mm.revert(); splits.forEach((s) => s.revert()); };
  }, []);

  return null;
}
