import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * The site's one hero: a deep-navy "night" stage (film grain, a soft brand glow) with large display type,
 * the lede and actions, and a thin ruled row of key facts. Every page uses it, so the site opens with one
 * voice; what varies is `visual`, a CSS-only abstract backdrop that hints at the page's subject:
 *  - horizon: a glowing planet edge (default)   - grid: a perspective floor of hairlines
 *  - rings: concentric orbits                    - beams: soft vertical light shafts
 *  - path: a glowing line with evenly spaced nodes (process pages)
 * Motion is ambient only (one slow light sweep, off for reduced motion); the copy uses the site's
 * data-reveal fade. Accent words go in <span className="grad-text">. Styles: "Night hero" in globals.css.
 */
export type NightVisual = "horizon" | "grid" | "rings" | "beams" | "path";

export default function NightHero({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
  meta,
  visual = "horizon",
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** A thin ruled row of facts under the hero (2–4 items read best). */
  meta?: { label: string; value: React.ReactNode }[];
  visual?: NightVisual;
  /** Optional extra row under the actions (e.g. an index of the page's sections). */
  children?: React.ReactNode;
}) {
  return (
    <section className={`nh night nh-${visual}`} data-keep>
      <div className="nh-bg" aria-hidden="true">
        <i className="nh-glow" />
        <i className="nh-sweep" />
        <i className="nh-art" />
      </div>
      <div className="container nh-in">
        <p className="nh-kicker" data-reveal>{eyebrow}</p>
        <h1 className="nh-title" data-reveal style={{ ["--d" as string]: ".08s" }}>{title}</h1>
        <div className="nh-foot" data-reveal style={{ ["--d" as string]: ".18s" }}>
          <p className="nh-lede">{lede}</p>
          {(primary || secondary) && (
            <div className="nh-ctas">
              {primary && <Link href={primary.href} className="btn btn-primary">{primary.label}</Link>}
              {secondary && <Link href={secondary.href} className="nh-link">{secondary.label} <ChevronRight size={17} /></Link>}
            </div>
          )}
        </div>
        {children && <div className="nh-extra" data-reveal style={{ ["--d" as string]: ".24s" }}>{children}</div>}
        {meta && meta.length > 0 && (
          <dl className="nh-meta" data-reveal style={{ ["--d" as string]: ".3s", ["--n" as string]: meta.length }}>
            {meta.map((m) => <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>)}
          </dl>
        )}
      </div>
    </section>
  );
}
