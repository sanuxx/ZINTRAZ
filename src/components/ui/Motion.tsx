"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const HEADINGS = ".h-hero[data-reveal], .h-xl[data-reveal], .h-lg[data-reveal], .final-title[data-reveal]";
const MAGNETIC = ".btn-primary.btn-lg, .gnav-cta";

// Site-wide GSAP layer, rebuilt for every page.
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const splits: SplitText[] = [];
    const cleanups: (() => void)[] = [];
    let ctx: gsap.Context | undefined;

    // Wait a frame so page-level ScrollTriggers (pins) exist first and ordering stays correct.
    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        // Headlines rise line-by-line out of masks.
        document.querySelectorAll<HTMLElement>(HEADINGS).forEach((el) => {
          el.removeAttribute("data-reveal");
          splits.push(SplitText.create(el, {
            type: "lines", mask: "lines", linesClass: "split-line", autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, {
              yPercent: 115, rotate: 2, duration: 1.25, stagger: 0.1, ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
          }));
        });

        // Home tiles open from a rounded inset; their visuals parallax.
        gsap.utils.toArray<HTMLElement>(".tile").forEach((t) => {
          gsap.fromTo(t, { clipPath: "inset(8% 5% 0% 5% round 48px)" }, {
            clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none",
            scrollTrigger: { trigger: t, start: "top bottom", end: "top 30%", scrub: true },
          });
          const v = t.querySelector(".tile-visual");
          if (v) gsap.fromTo(v, { yPercent: 22 }, {
            yPercent: 0, ease: "none", scrollTrigger: { trigger: t, start: "top bottom", end: "bottom 70%", scrub: true },
          });
        });


        // Page intros drift up and fade as you scroll away; their visuals grow toward you.
        gsap.utils.toArray<HTMLElement>(".phero").forEach((hero) => {
          const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
          const inner = hero.querySelector(".phero-inner");
          if (inner) gsap.to(inner, { y: -140, opacity: 0.15, ease: "none", scrollTrigger: st });
          const visual = hero.querySelector(".phero-visual");
          if (visual) gsap.fromTo(visual, { scale: 0.92 }, { scale: 1.12, ease: "none", scrollTrigger: { ...st, start: "top 40%" } });
        });

        // Closing call-to-action: glow swells, content settles in.
        gsap.utils.toArray<HTMLElement>(".ctaband").forEach((band) => {
          const st = { trigger: band, start: "top bottom", end: "center center", scrub: true };
          gsap.fromTo(band.querySelector(".ctaband-glow"), { scale: 0.5, opacity: 0 }, { scale: 1.15, opacity: 1, ease: "none", scrollTrigger: st });
          gsap.fromTo(band.querySelector(".ctaband-inner"), { scale: 0.9 }, { scale: 1, ease: "none", scrollTrigger: st });
        });

        // Footer content rises into place at the end of the page.
        const foot = document.querySelector(".gfoot .container");
        if (foot) gsap.fromTo(foot, { y: 80, opacity: 0 }, {
          y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".gfoot", start: "top bottom", end: "bottom bottom", scrub: true },
        });

        // Marquees speed up with scroll velocity, then ease back.
        const anims = Array.from(document.querySelectorAll<HTMLElement>(".marquee-track")).flatMap((el) => el.getAnimations());
        if (anims.length) {
          const proxy = { rate: 1 };
          const apply = () => anims.forEach((a) => { a.playbackRate = proxy.rate; });
          ScrollTrigger.create({
            onUpdate: (self) => {
              const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 6);
              gsap.to(proxy, {
                rate: boost, duration: 0.25, overwrite: true, onUpdate: apply,
                onComplete: () => { gsap.to(proxy, { rate: 1, duration: 1.2, ease: "power2.out", onUpdate: apply }); },
              });
            },
          });
        }

        // Nav hides on scroll down, returns on scroll up.
        ScrollTrigger.create({
          start: 0, end: "max",
          onUpdate: (self) => {
            if (html.classList.contains("menu-open")) return;
            html.classList.toggle("nav-hidden", self.direction === 1 && self.scroll() > 240);
          },
        });
      });

      if (!finePointer) return;

      // Primary buttons lean toward the cursor.
      document.querySelectorAll<HTMLElement>(MAGNETIC).forEach((el) => {
        const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
        const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
        const move = (e: PointerEvent) => {
          el.style.transition = "background .25s, color .25s";
          const r = el.getBoundingClientRect();
          x((e.clientX - r.left - r.width / 2) * 0.3);
          y((e.clientY - r.top - r.height / 2) * 0.35);
        };
        const leave = () => { gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.35)", overwrite: true }); };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanups.forEach((f) => f());
      splits.forEach((s) => s.revert());
      ctx?.revert();
      html.classList.remove("nav-hidden");
    };
  }, [pathname]);

  return null;
}
