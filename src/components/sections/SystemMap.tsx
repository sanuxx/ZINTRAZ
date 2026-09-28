"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BASE_PATH } from "@/lib/site";

const pillars = [
  { name: "Business", c: "#d97706", line: "We understand how you work.", items: ["Processes", "Operations", "Strategy", "Data"], href: "/solutions", cta: "Transformation" },
  { name: "Engineering", c: "#0b5cff", line: "We build what your business needs.", items: ["Software", "Web systems", "Platforms", "Integrations"], href: "/services", cta: "Engineering" },
  { name: "Intelligence", c: "#7c3aed", line: "We make it reason and act.", items: ["AI agents", "Analytics", "Automation", "Decision flows"], href: "/ai", cta: "Zyntraz AI" },
];

// Branch curves in a 100×80 box; the three columns are centred at 1/6, 1/2 and 5/6 of the width.
const X = [100 / 6, 50, 500 / 6];
const down = (x: number) => `M50 0 C50 40, ${x} 40, ${x} 80`;
const up = (x: number) => `M${x} 0 C${x} 40, 50 40, 50 80`;

function Branches({ dir, active }: { dir: "down" | "up"; active: number | null }) {
  const d = dir === "down" ? down : up;
  return (
    <svg className="sm-band" viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true">
      {pillars.map((p, i) => (
        <g key={p.name} className={active !== null && active !== i ? "is-dim" : undefined} style={{ ["--c" as string]: p.c }}>
          <path className="sm-path" d={d(X[i])} vectorEffect="non-scaling-stroke" />
          <path className="sm-flow" d={d(X[i])} vectorEffect="non-scaling-stroke" />
        </g>
      ))}
    </svg>
  );
}

export default function SystemMap() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="section sm" id="system">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow" data-reveal>How Zyntraz is built</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
            Three disciplines. <span className="grad-text">One transformed business.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>
            Business understanding, engineering and intelligence — working as one system around your operation.
          </p>
        </div>

        <div className="sm-map" data-reveal onMouseLeave={() => setActive(null)}>
          <div className="sm-node sm-top">
            <Image src={`${BASE_PATH}/zyntraz-logo.png`} alt="Zyntraz" width={894} height={174} />
          </div>
          <Branches dir="down" active={active} />

          <div className="sm-cols">
            {pillars.map((p, i) => (
              <div
                key={p.name}
                className={`sm-col${active === i ? " is-on" : active !== null ? " is-dim" : ""}`}
                style={{ ["--c" as string]: p.c }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <h3>{p.name}</h3>
                <p>{p.line}</p>
                <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
                <Link href={p.href} className="link-chev">{p.cta} <ChevronRight size={16} /></Link>
              </div>
            ))}
          </div>

          <Branches dir="up" active={active} />
          <div className="sm-node sm-bottom">
            <b>Transformed business</b>
            <small>One intelligent system, designed around how you work.</small>
          </div>
        </div>
      </div>
    </section>
  );
}
