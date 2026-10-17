import Link from "next/link";
import { AudioLines } from "lucide-react";
import { services } from "@/lib/services";

/**
 * /services hero, full bleed: a dark stage whose centre is a deep navy ellipse, with brand blue rising
 * up both sides into a sky-cyan glow along the bottom edge (a bowl of light); a centred headline lit
 * from the middle; one glowing pill button into the portfolio; and the capability rail: the seven
 * services as plain glass tiles (number + name), each jumping to its chapter (#slug) in the explorer.
 */
export default function ServicesHero() {
  return (
    <section className="svo">
      <span className="svo-bowl" aria-hidden="true" />
      <div className="container svo-inner">
        <h1 className="svo-title" data-reveal>Engineering services for businesses <br />ready to move forward.</h1>

        <Link href="#portfolio" className="svo-btn">Explore our services <AudioLines size={16} /></Link>

        <nav className="svo-rail" aria-label="Services">
          {services.map((s, i) => (
            <Link key={s.slug} href={`#${s.slug}`} className="svo-tile" style={{ ["--acc" as string]: s.accent }}>
              <em>{String(i + 1).padStart(2, "0")}</em>
              <b>{s.name}</b>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
