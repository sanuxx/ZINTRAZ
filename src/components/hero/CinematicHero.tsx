"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * The shared hero shell.
 *
 * Every page gets the same headline move — characters arriving out of depth, rotating up onto the
 * picture plane — so the site keeps one voice. What differs per page is `backdrop`: a small 3D scene
 * that states what the page is about before a word is read.
 *
 * The copy renders as real text server-side; SplitText only rewrites it on the client, and under
 * reduced motion nothing is split or animated at all.
 */
export default function CinematicHero({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
  backdrop,
  tone = "light",
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  backdrop?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "center" | "left";
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      const heading = el.querySelector<HTMLElement>(".chero-title")!;
      // Lines only, never words or chars. `.grad-text` paints its colour with `background-clip:
      // text`, and SplitText's per-word/char wrappers inherit the transparent fill without the
      // gradient behind it — the gradient line would render invisible. Splitting at line level keeps
      // the span whole inside its line.
      split = SplitText.create(heading, { type: "lines", mask: "lines", linesClass: "chero-line" });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(".chero-eyebrow", { y: 26, opacity: 0, duration: 0.9 }, 0)
        // Each line swings up out of the depth on its own axis, alternating which side leads.
        .from(
          split.lines,
          {
            z: -620,
            rotationX: -72,
            yPercent: 110,
            opacity: 0,
            duration: 1.35,
            stagger: 0.12,
            rotationY: (i: number) => (i % 2 ? 14 : -14),
          },
          0.12,
        )
        .from(".chero-lede", { y: 30, opacity: 0, duration: 1 }, 0.55)
        .from(".chero-ctas > *", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.7)
        .from(".chero-backdrop", { opacity: 0, scale: 1.08, duration: 1.6, ease: "power2.out" }, 0);

      // Scrolling away pushes the copy back into the depth rather than just fading it.
      gsap.to(".chero-inner", {
        z: -260,
        y: -40,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to(".chero-backdrop", {
        y: 80,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1.4 },
      });
    }, el);

    // Pointer parallax on the backdrop only — the copy stays still so it never fights the reader.
    let onMove: ((e: PointerEvent) => void) | undefined;
    if (window.matchMedia("(hover: hover)").matches) {
      const bd = el.querySelector<HTMLElement>(".chero-backdrop");
      if (bd) {
        const rx = gsap.quickTo(bd, "rotationX", { duration: 1.1, ease: "power3" });
        const ry = gsap.quickTo(bd, "rotationY", { duration: 1.1, ease: "power3" });
        onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0) return;
          rx(-(e.clientY / window.innerHeight - 0.5) * 7);
          ry((e.clientX / window.innerWidth - 0.5) * 11);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
      }
    }

    return () => {
      if (onMove) window.removeEventListener("pointermove", onMove);
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={root} className={`chero chero-${tone} chero-${align}`}>
      {backdrop && <div className="chero-backdrop" aria-hidden="true">{backdrop}</div>}
      <div className="chero-veil" aria-hidden="true" />
      <div className="container chero-inner">
        <p className="chero-eyebrow">{eyebrow}</p>
        <h1 className="chero-title h-hero">{title}</h1>
        <p className="lede chero-lede">{lede}</p>
        {(primary || secondary) && (
          <div className="cta-row chero-ctas">
            {primary && <Link href={primary.href} className="btn btn-primary btn-lg">{primary.label}</Link>}
            {secondary && <Link href={secondary.href} className="link-chev">{secondary.label} <ChevronRight size={18} /></Link>}
          </div>
        )}
      </div>
    </section>
  );
}
