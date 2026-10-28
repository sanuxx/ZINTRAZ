"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BASE_PATH } from "@/lib/site";

// The first render is covered by the logo intro; only later client navigations get the curtain.
let firstRender = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => !firstRender && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const curtain = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    firstRender = false;
    if (!animate) return;
    const tl = gsap.timeline({ onComplete: () => { if (curtain.current) curtain.current.hidden = true; } });
    tl.to(".pt-logo", { opacity: 0, yPercent: -60, duration: 0.5, ease: "power2.in" }, 0.15)
      .to(curtain.current, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, 0.2)
      .from(content.current, { y: 90, opacity: 0, duration: 1.2, ease: "expo.out", clearProps: "all" }, 0.55);
    return () => { tl.kill(); };
  }, [animate]);

  return (
    <>
      {animate && (
        <div ref={curtain} className="pt-curtain" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pt-logo" src={`${BASE_PATH}/zintraz-logo-white.png`} alt="" width={894} height={158} />
        </div>
      )}
      <div ref={content}>{children}</div>
    </>
  );
}
