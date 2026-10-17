import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { solutions } from "@/lib/solutions";
import { AIVisual, IoTVisual, SoftwareVisual } from "@/components/solutions/SolutionVisuals";

// /solutions sections after the hero (SolutionsHero.tsx): the title reel, one block per solution, and how they combine.

const visuals = { software: SoftwareVisual, ai: AIVisual, iot: IoTVisual } as const;

export function SolutionBlocks() {
  return (
    <>
      {solutions.map((s, i) => {
        const Visual = visuals[s.id];
        return (
          <section key={s.id} id={s.id} className={`section sx-block${i % 2 === 0 ? " alt" : ""}${i % 2 ? " flip" : ""}`}>
            <span className="sx-chapter" aria-hidden="true">{s.num}</span>
            <div className={`container sx-block-grid${i % 2 ? " flip" : ""}`}>
              {/* data-keep: these short ledes sit beside the capability grid; TextFold shouldn't collapse them. */}
              <div className="sx-copy" data-keep>
                <p className="eyebrow" data-reveal>Solution {s.num}</p>
                <span className="sx-name" data-reveal><s.icon size={16} /> {s.name}</span>
                <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".06s" }}>{s.heading}</h2>
                <p className="lede" data-reveal style={{ ["--d" as string]: ".12s" }}>{s.lede}</p>
                <ul className="sx-caps" data-reveal style={{ ["--d" as string]: ".18s" }}>
                  {s.capabilities.map((c) => <li key={c}><Check size={14} />{c}</li>)}
                </ul>
                <div data-reveal style={{ ["--d" as string]: ".24s" }}>
                  <Link href={s.cta.href} className="btn btn-primary">{s.cta.label} <ArrowUpRight size={15} /></Link>
                </div>
              </div>
              <div className="sx-visual" data-reveal style={{ ["--d" as string]: ".1s" }}>
                <Visual />
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

/**
 * Pinned scene between the hero and the blocks, in the site's light theme and deliberately quiet: three
 * editorial rows (number, label, statement) divided by hairlines arrive in turn, a gradient rule draws
 * beneath them and the payoff rises in. On small screens / reduced motion it is the same, static.
 */
const reelLines: Record<string, React.ReactNode> = {
  software: <>Software that <em>runs</em> your business.</>,
  ai: <>Intelligence that <em>thinks</em> ahead.</>,
  iot: <>Systems that <em>sense</em> the real world.</>,
};

export function SolutionsReel() {
  return (
    <section className="sx-reel" aria-label="Three capabilities, one connected system">
      <div className="sx-reel-stage">
        <div className="sx-reel-orb" aria-hidden="true" />
        <div className="sx-reel-scene">
          <div className="sx-reel-lines">
            {solutions.map((s) => (
              <div key={s.id} className="sx-reel-line">
                <span className="sx-reel-num">{s.num}</span>
                <span className="sx-reel-label">{s.name}</span>
                <p className="sx-reel-text">{reelLines[s.id]}</p>
              </div>
            ))}
          </div>
          <span className="sx-reel-streak" aria-hidden="true" />
          <div className="sx-reel-final">
            <p className="sx-reel-final-line">One <em>connected</em> system.</p>
            <p className="sx-reel-final-sub">Engineered around the way your business actually works.</p>
          </div>
        </div>
        <div className="sx-reel-rail" aria-hidden="true">
          {solutions.map((s) => <span key={s.id}><i /></span>)}
        </div>
      </div>
    </section>
  );
}

