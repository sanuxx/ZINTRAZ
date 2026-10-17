"use client";

import gsap from "gsap";
import { useScene } from "@/components/motion/useScene";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * What we believe, as a dealt deck.
 *
 * The cards are dealt onto the table: each turns in on a hinge from the edge of its own column,
 * slightly out of sync with its neighbours. Short scrubbed entrances rather than a pin — this sits
 * near the end of the About page, where holding the scroll would feel like an obstacle.
 */
const beliefs = [
  { title: "Business understanding before technology", desc: "The right technology starts with understanding the problem." },
  { title: "Simplicity beats unnecessary complexity", desc: "Powerful systems should still feel understandable and usable." },
  { title: "Data should drive better decisions", desc: "Information becomes valuable when it improves action." },
  { title: "AI should solve real problems", desc: "We use AI where it creates measurable operational value — not simply because it is available." },
  { title: "Transformation never really ends", desc: "A successful system should evolve with the organization." },
];

export default function BeliefDeck() {
  const ref = useScene<HTMLElement>(({ q }) => {
    q(".bd-card").forEach((card, i) => {
      const side = i % 2 ? 1 : -1;
      gsap.fromTo(
        card,
        { rotationY: side * 34, rotationX: 12, z: -260, y: 60, opacity: 0 },
        {
          rotationY: 0, rotationX: 0, z: 0, y: 0, opacity: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 92%", end: "top 55%", scrub: 1 },
        },
      );
    });
  });

  return (
    <section ref={ref} className="bd section" id="beliefs">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow" data-reveal>What we believe</p>
          <SplitHeading>
            Technology should create capability, <span className="grad-text">not complexity.</span>
          </SplitHeading>
          <p className="lede" data-reveal>
            Every system we build should make something better. A process simpler. A decision clearer. A team more
            productive. Data more useful. Operations more connected.
          </p>
        </div>

        <div className="bd-deck">
          {beliefs.map(({ title, desc }, i) => (
            <article key={title} className="bd-card">
              <span className="bd-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
