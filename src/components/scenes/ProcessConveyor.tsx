"use client";

import { useState } from "react";
import { MessagesSquare, Search, Compass, Hammer, Rocket, RefreshCw } from "lucide-react";
import gsap from "gsap";
import { useScene } from "@/components/motion/useScene";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * The six-step process as a curved conveyor.
 *
 * The track travels sideways while each card turns through the camera — angled in as it approaches,
 * square at centre, angled away as it leaves. Horizontal travel is the point: the journey is a line,
 * not a stack, and it is the only scene on the site that moves across rather than through.
 */
const steps = [
  { icon: MessagesSquare, title: "Consultation", desc: "We start by listening. We understand your business objectives, challenges, current systems and the outcomes you want to achieve." },
  { icon: Search, title: "Business Analysis", desc: "We examine how your business actually operates. Processes, people, workflows, systems and bottlenecks are analyzed to identify opportunities." },
  { icon: Compass, title: "Strategy", desc: "We turn findings into a transformation roadmap — priorities, technology direction, solution architecture, stages and measurable objectives." },
  { icon: Hammer, title: "Engineering", desc: "This is where strategy becomes reality. We design and build applications, platforms, AI systems, automation, analytics and connected solutions." },
  { icon: Rocket, title: "Deployment", desc: "Technology must work in the real world. We help introduce the solution into your operational environment and support adoption." },
  { icon: RefreshCw, title: "Optimization", desc: "We measure how the solution performs and identify opportunities to improve it. The best system is one that keeps getting better." },
];

export default function ProcessConveyor() {
  const [active, setActive] = useState(0);

  const ref = useScene<HTMLElement>(({ q }) => {
    const cards = q(".cv-card");
    const last = cards.length - 1;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".cv-pin",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (st) => setActive(Math.min(last, Math.round(st.progress * last))),
      },
    });

    // The track slides one card-width per step; `--cv-step` keeps JS and CSS on the same measurement.
    const step = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--cv-step")) || 560;
    tl.fromTo(".cv-track", { x: 0 }, { x: -last * step, duration: last }, 0);

    cards.forEach((card, i) => {
      tl.fromTo(card, { rotationY: 34, z: -300, opacity: 0.25 }, { rotationY: 0, z: 0, opacity: 1, duration: 1 }, Math.max(0, i - 1));
      if (i < last) tl.to(card, { rotationY: -34, z: -300, opacity: 0.25, duration: 1 }, i);
    });

    tl.fromTo(".cv-line-fill", { scaleX: 0 }, { scaleX: 1, duration: last }, 0);
  });

  return (
    <section ref={ref} className="cv" id="steps">
      <div className="container cv-head">
        <p className="eyebrow" data-reveal>The journey</p>
        <SplitHeading>
          Six steps, <span className="grad-text">no black boxes.</span>
        </SplitHeading>
        <p className="lede" data-reveal>
          You see where the work is, what it produced and what happens next — at every stage.
        </p>
      </div>

      <div className="cv-pin">
        <div className="cv-stage">
          <div className="cv-line" aria-hidden="true"><span className="cv-line-fill" /></div>

          <div className="cv-rail" aria-hidden="true">
            {steps.map((s, i) => (
              <i key={s.title} className={i === active ? "is-on" : undefined} />
            ))}
          </div>

          <div className="cv-track">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <article key={title} className="cv-card">
                <span className="cv-num">{String(i + 1).padStart(2, "0")}</span>
                <Icon className="cv-ico" size={30} />
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
