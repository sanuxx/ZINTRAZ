"use client";

import { useState } from "react";
import gsap from "gsap";
import { useScene } from "@/components/motion/useScene";
import SplitHeading from "@/components/motion/SplitHeading";
import WorkflowFilm, { FILM_LEN, buildFilm, chapterAt } from "@/components/film/WorkflowFilm";
import { products } from "@/components/sections/Products";

const CHAPTERS: Record<number, string> = { [-2]: "Without", [-1]: "Switch on", 4: "The result" };

/**
 * A product page's "how it works", as a film scrubbed by the scroll: one unit of work (an order, a booking) is
 * followed through the product's four workflow steps (see WorkflowFilm for the four acts). Desktop only, like
 * every pinned scene; elsewhere the same markup reads as a storyboard.
 *
 * Takes the slug rather than the product, because it is rendered from a server page and a product carries its
 * icon component, which cannot cross to the client as a prop.
 */
export default function ProductFilm({ slug }: { slug: string }) {
  const product = products.find((p) => p.id === slug) ?? products[0];
  const unit = product.token.replace(/^an? /i, "one ");
  const [chapter, setChapter] = useState(-2);

  const ref = useScene<HTMLElement>(({ q }) => {
    const film = q(".fl")[0] as HTMLElement;
    film.classList.add("fl-live");

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".fm-pin",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (st) => setChapter(chapterAt(st.progress * FILM_LEN)),
      },
    });
    buildFilm(tl, film);

    return () => film.classList.remove("fl-live");
  });

  return (
    <section ref={ref} className="fm" id="how-it-works">
      <div className="container fm-head">
        <p className="eyebrow" data-reveal>How it works</p>
        <SplitHeading>
          Follow {unit}. <span className="grad-text">Step by step.</span>
        </SplitHeading>
        <p className="lede" data-reveal>
          No mock screens. Just what {product.name} actually does with {unit}, from start to finish.
        </p>
      </div>

      <div className="fm-pin">
        <div className="fm-stage">
          <WorkflowFilm product={product} />
          <p className="fm-count" aria-hidden="true">
            {chapter >= 0 && chapter < 4 ? <><span>Step</span> <b>{String(chapter + 1).padStart(2, "0")}</b> / 04</> : <span>{CHAPTERS[chapter]}</span>}
          </p>
        </div>
      </div>
    </section>
  );
}
