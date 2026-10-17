"use client";

import { useState } from "react";
import gsap from "gsap";
import { useScene } from "@/components/motion/useScene";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * Transformation layers as a camera flight.
 *
 * The six layers sit on planes stacked away from the viewer in Z. Scrubbing the pin flies each plane
 * forward through the camera: it rises out of the depth, squares up at z=0, then sweeps past and
 * out. Only one plane is ever near the camera, so the stack reads as depth rather than a pile.
 */
const layers = [
  { title: "Business", desc: "Understand objectives, processes, people and operational challenges.", accent: "#0b5cff" },
  { title: "Digital", desc: "Create connected digital systems that replace fragmented workflows.", accent: "#4f46e5" },
  { title: "Data", desc: "Turn operational information into usable intelligence.", accent: "#7c3aed" },
  { title: "AI", desc: "Introduce intelligence, automation and decision support where it creates value.", accent: "#0891b2" },
  { title: "Connected", desc: "Connect physical environments, devices and operations where required.", accent: "#0ea5e9" },
  { title: "Continuous", desc: "Continuously measure, optimize and evolve.", accent: "#16a34a" },
];

export default function LayerFlight() {
  const [active, setActive] = useState(0);

  const ref = useScene<HTMLElement>(({ q }) => {
    const planes = q(".lf-plane");

    // Everything starts deep and invisible; the timeline brings each one forward in turn.
    gsap.set(planes, { z: -2200, opacity: 0, rotationX: 14, scale: 0.92 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".lf-pin",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        // Plane i is squared up at time i + 1 of the (layers + 1.4)-long timeline and gone by i + 1.3, when
        // plane i + 1 is the only one in view; the counter switches there.
        onUpdate: (st) => setActive(Math.min(layers.length - 1, Math.max(0, Math.floor(st.progress * (layers.length + 1.4) - 0.3)))),
      },
    });

    planes.forEach((plane, i) => {
      tl.fromTo(
        plane,
        { z: -2200, opacity: 0, rotationX: 14, scale: 0.92 },
        { z: 0, opacity: 1, rotationX: 0, scale: 1, duration: 1 },
        i,
      )
        .to(plane, { z: 700, rotationX: -12, duration: 1 }, i + 1)
        // Gone before it grows past the frame, so the outgoing title never ghosts behind the next plane.
        .to(plane, { opacity: 0, duration: 0.3 }, i + 1);
    });

    // The grid backdrop drifts the opposite way, so the flight has something to measure against.
    tl.fromTo(".lf-grid", { backgroundPositionY: "0px" }, { backgroundPositionY: "900px", duration: layers.length + 1 }, 0);

    // Hold on the final plane rather than letting it fly off at the very end of the pin.
    tl.to({}, { duration: 0.4 });
  });

  return (
    <section ref={ref} className="lf" id="layers">
      <div className="container lf-head">
        <p className="eyebrow" data-reveal>Transformation layers</p>
        <SplitHeading>
          Six layers, <span className="grad-text">one direction.</span>
        </SplitHeading>
        <p className="lede" data-reveal>
          Transformation isn&apos;t a single project. Each layer builds on the one before it, and you don&apos;t
          have to climb all six at once.
        </p>
      </div>

      <div className="lf-pin">
        <div className="lf-stage">
          <div className="lf-grid" aria-hidden="true" />
          <div className="lf-rail" aria-hidden="true">
            <span className="lf-count">
              <b>{String(active + 1).padStart(2, "0")}</b> / {String(layers.length).padStart(2, "0")}
            </span>
            {layers.map((l, i) => (
              <i key={l.title} className={i === active ? "is-on" : undefined} style={{ ["--c" as string]: l.accent }} />
            ))}
          </div>

          <div className="lf-space">
            {layers.map(({ title, desc, accent }, i) => (
              <article key={title} className="lf-plane" style={{ ["--c" as string]: accent }}>
                <span className="lf-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="lf-bar" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
