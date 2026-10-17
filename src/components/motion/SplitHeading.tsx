"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * The site's signature headline move: lines rise out of a mask as the heading enters.
 *
 * SplitText rewrites the element's DOM, so the heading renders its real text server-side and is only
 * split on the client — a crawler and a reduced-motion user both get the plain heading.
 */
export default function SplitHeading({
  children,
  as: Tag = "h2",
  className = "h-xl",
  start = "top 82%",
  stagger = 0.09,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  start?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "sh-line" });
      gsap.from(split.lines, {
        yPercent: 115,
        duration: 1,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [start, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
