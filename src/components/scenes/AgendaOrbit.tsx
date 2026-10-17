"use client";

import { useState } from "react";
import gsap from "gsap";
import { useScene } from "@/components/motion/useScene";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * The consultation agenda as an orbit.
 *
 * Six questions ride a horizontal ring in the XZ plane, seen from slightly above. Scrolling turns
 * the ring and brings each question to the front. Several cards are legible at once, which is the
 * point — a consultation is one conversation that circles a business, not a sequence of stages.
 */
const agenda = [
  { title: "Business", q: "What are you trying to achieve?" },
  { title: "Operations", q: "Where are your biggest bottlenecks?" },
  { title: "Technology", q: "What systems are you currently using?" },
  { title: "Data", q: "What information do you have, and how is it being used?" },
  { title: "AI", q: "Where could intelligence or automation create value?" },
  { title: "Future", q: "What should your business be capable of next?" },
];

const STEP = 360 / agenda.length;

export default function AgendaOrbit() {
  const [active, setActive] = useState(0);

  const ref = useScene<HTMLElement>(({ q }) => {
    const n = agenda.length;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".ao-pin",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (st) => setActive(Math.min(n - 1, Math.floor(st.progress * n))),
      },
    });

    tl.to(".ao-ring", { rotationY: -STEP * n, duration: n, ease: "none" }, 0);

    // The card at the front of the orbit is the one being asked; the rest dim, so cards seen at a steep angle
    // read as the ring around it rather than as garbled text.
    q(".ao-card").forEach((card, i) => {
      if (i === 0) gsap.set(card, { scale: 1.06, opacity: 1 });
      else tl.fromTo(card, { scale: 0.92, opacity: 0.28 }, { scale: 1.06, opacity: 1, duration: 0.5, ease: "power2.out" }, i - 0.25);
      tl.to(card, { scale: 0.92, opacity: 0.28, duration: 0.5, ease: "power2.in" }, i + 0.25);
    });

    tl.to({}, { duration: 0.01 }, n - 0.01);
  });

  return (
    <section ref={ref} className="ao" id="agenda">
      <div className="container ao-head">
        <p className="eyebrow" data-reveal>What we&apos;ll discuss</p>
        <SplitHeading>
          Six questions <span className="grad-text">worth an hour.</span>
        </SplitHeading>
        <p className="lede" data-reveal>
          You don&apos;t need answers prepared. The conversation is how we find them.
        </p>
      </div>

      <div className="ao-pin">
        <div className="ao-stage">
          <div className="ao-core" aria-hidden="true">
            <span className="ao-core-ring" />
            <span className="ao-core-ring" />
            <b>{agenda[active].title}</b>
          </div>

          <div className="ao-ring">
            {agenda.map(({ title, q: question }, i) => (
              <article
                key={title}
                className="ao-card"
                style={{ transform: `rotateY(${STEP * i}deg) translateZ(var(--ao-r))` }}
              >
                <span className="ao-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{question}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
