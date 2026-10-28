"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { READY_EVENT, scroll } from "@/lib/scroll";
import { BASE_PATH } from "@/lib/site";

const TAGLINE = "Intelligence, engineered.";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current!;
    if (!html.classList.contains("intro-active")) {
      el.hidden = true;
      return;
    }

    scroll.lenis?.stop();
    const ready = () => {
      html.classList.add("is-ready");
      window.dispatchEvent(new Event(READY_EVENT));
    };

    const EXIT = 1.55;
    let tl: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          html.classList.remove("intro-active");
          scroll.lenis?.start();
          el.hidden = true;
        },
      })
        .to(".intro-line", { scaleX: 1, duration: 0.6, ease: "expo.inOut" }, 0.05)
        .to(".intro-glow", { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, 0.25)
        .to(".intro-logo-base", { clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", duration: 0.9 }, 0.45)
        .to(".intro-line", { scaleX: 1.8, opacity: 0, duration: 0.7, ease: "power2.out" }, 0.55)
        .to(".intro-logo", { scale: 1, duration: 1.4, ease: "power2.out" }, 0.45)
        .to(".intro-logo-sheen", { backgroundPosition: "-60% 0", duration: 0.8, ease: "power2.inOut" }, 0.8)
        .to(".intro-tag span", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.012, ease: "power3.out" }, 0.85)
        // Exit: fly through the logo and hand off to the page.
        .addLabel("exit", EXIT)
        .to(".intro-tag, .intro-hint", { opacity: 0, y: -10, duration: 0.35, ease: "power2.in" }, EXIT)
        .to(".intro-logo", { scale: 1.35, opacity: 0, filter: "blur(16px)", duration: 0.7, ease: "power2.in" }, EXIT + 0.05)
        .to(".intro-glow", { scale: 1.8, opacity: 0, duration: 0.7, ease: "power2.in" }, EXIT + 0.05)
        .add(ready, EXIT + 0.3)
        .to(el, { opacity: 0, duration: 0.55, ease: "power2.inOut" }, EXIT + 0.3);
    }, el);

    // Any tap, click, key or scroll jumps straight to the exit.
    const skip = () => {
      if (tl && tl.time() < EXIT) tl.seek("exit");
      off();
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const off = () => events.forEach((ev) => window.removeEventListener(ev, skip));
    events.forEach((ev) => window.addEventListener(ev, skip, { passive: true }));

    return () => {
      off();
      ctx.revert();
      html.classList.remove("intro-active");
      scroll.lenis?.start();
    };
  }, []);

  return (
    <div ref={root} className="intro" aria-hidden="true">
      <div className="intro-glow" />
      <div className="intro-stage">
        <div className="intro-line" />
        <div className="intro-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="intro-logo-base" src={`${BASE_PATH}/zyntraz-logo-white.png`} alt="" width={894} height={158} />
          <div className="intro-logo-sheen" style={{ "--sheen-logo": `url(${BASE_PATH}/zyntraz-logo-white.png)` } as React.CSSProperties} />
        </div>
      </div>
      <p className="intro-tag">
        {TAGLINE.split("").map((ch, i) => <span key={i}>{ch === " " ? " " : ch}</span>)}
      </p>
      <p className="intro-hint">Tap anywhere to skip</p>
    </div>
  );
}
