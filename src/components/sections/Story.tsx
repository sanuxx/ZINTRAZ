"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { BASE_PATH } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const [t1, t2, t3] = gsap.utils.toArray<HTMLElement>(".story-text");
      gsap.set([t1, t2, t3], { opacity: 0, scale: 1.25, filter: "blur(24px)" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top top", end: "+=350%", pin: true, scrub: 1, anticipatePin: 1 },
      });

      tl.to(t1, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" })
        .to(t1, { opacity: 0, scale: 0.9, filter: "blur(10px)", duration: 1.2, ease: "power2.in" }, "+=0.6")
        .to(t2, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" })
        .to(t2, { opacity: 0, scale: 0.9, filter: "blur(10px)", duration: 1.2, ease: "power2.in" }, "+=0.6")
        .to(".story-portal", { scale: 40, duration: 3, ease: "power2.inOut" }, "-=0.8")
        .to(t3, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "power3.out" }, "-=1.4")
        .to({}, { duration: 0.8 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="story" aria-label="There is a better way">
      <div className="story-portal" aria-hidden="true" />
      <h2 className="story-text">Stop patching<br />the chaos.</h2>
      <h2 className="story-text">Start running on a system<br /><span className="grad-text">built around you.</span></h2>
      <div className="story-text">
        <div className="story-final">
          <small>Welcome to</small>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE_PATH}/zyntraz-logo-white.png`} alt="Zyntraz" width={894} height={158} />
        </div>
      </div>
    </section>
  );
}
