// Section shapes the content architecture repeats across pages. Built on the existing vocabulary
// (.section-head, .promise-grid, .audit-list) so new pages inherit the site's look for free rather
// than each inventing its own layout.
import Link from "next/link";
import { Check, ChevronRight, type LucideIcon } from "lucide-react";

export function SectionHead({
  eyebrow,
  heading,
  lede,
  center = false,
}: {
  eyebrow?: string;
  heading: React.ReactNode;
  lede?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`section-head${center ? " center" : ""}`}>
      {eyebrow && <p className="eyebrow" data-reveal>{eyebrow}</p>}
      <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>{heading}</h2>
      {lede && <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>{lede}</p>}
    </div>
  );
}

/** Card grid of titled points — the architecture's highlight cards, pillars and beliefs. */
export function PillarGrid({
  items,
  cols = 4,
}: {
  items: { icon?: LucideIcon; title: string; desc: string }[];
  cols?: 2 | 3 | 4;
}) {
  return (
    <div className={`promise-grid cols-${cols}`}>
      {items.map(({ icon: Icon, title, desc }, i) => (
        <div key={title} className="glass spot promise" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
          {Icon && <Icon className="promise-ico" size={26} />}
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
      ))}
    </div>
  );
}

/** Numbered layers — the transformation stack, and anywhere order carries meaning. */
export function LayerList({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <ol className="layers">
      {items.map(({ title, desc }, i) => (
        <li key={title} className="layer" data-reveal style={{ ["--d" as string]: `${i * 0.07}s` }}>
          <span className="layer-num">{String(i + 1).padStart(2, "0")}</span>
          <div className="layer-body">
            <h3>{title}</h3>
            {desc && <p>{desc}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Checked outcome list. Two columns by default, since these lists run long. */
export function OutcomeList({ items, cols = 2 }: { items: string[]; cols?: 1 | 2 }) {
  return (
    <ul className={`audit-list outcomes cols-${cols}`} data-reveal>
      {items.map((t) => (
        <li key={t}><Check size={18} /> {t}</li>
      ))}
    </ul>
  );
}

/**
 * Heading + lede + capability bullets + optional CTA. Used by every solution block on /solutions
 * and every service block on /services, so the two read as one system.
 */
export function CapabilityBlock({
  id,
  icon: Icon,
  eyebrow,
  heading,
  lede,
  items,
  cta,
  alt = false,
}: {
  id: string;
  icon?: LucideIcon;
  eyebrow?: string;
  heading: React.ReactNode;
  lede: React.ReactNode;
  items: string[];
  cta?: { label: string; href: string };
  alt?: boolean;
}) {
  return (
    <section className={`section capblock${alt ? " alt" : ""}`} id={id}>
      <div className="container capblock-inner">
        <div className="capblock-copy">
          {Icon && <Icon className="capblock-ico" size={30} data-reveal />}
          {eyebrow && <p className="eyebrow" data-reveal>{eyebrow}</p>}
          <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".08s" }}>{heading}</h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>{lede}</p>
          {cta && (
            <Link href={cta.href} className="link-chev" data-reveal style={{ ["--d" as string]: ".24s" }}>
              {cta.label} <ChevronRight size={18} />
            </Link>
          )}
        </div>
        <ul className="capblock-list" data-reveal style={{ ["--d" as string]: ".12s" }}>
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
