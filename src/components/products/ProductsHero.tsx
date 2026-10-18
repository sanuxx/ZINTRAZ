import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import ProductGlimpse from "@/components/products/ProductGlimpse";
import { products, statusLabel } from "@/components/sections/Products";

/**
 * /products hero, full bleed: a deep navy stage with a wide brand-blue horizon glow rising from the
 * bottom edge; the copy centred (tag, silver-white headline, lede, glowing pill + link); and below it a
 * fan of three glass product windows (ZynStay, ZynRest in front, ZynAgent), each showing its live mini
 * interface, angled in 3D above the horizon, floating out of step and lifting on hover. Each window
 * links to its product page. Beneath the fan, a slim strip names every product, so the hero shows the
 * whole family and not only the three featured.
 */
const FAN = ["zynstay", "zynrest", "zynagent"];

export default function ProductsHero() {
  const live = products.find((p) => p.status === "available")!;
  const fan = FAN.map((id) => products.find((p) => p.id === id)!).filter(Boolean);
  return (
    <section className="pho">
      <span className="pho-horizon" aria-hidden="true" />
      <div className="container pho-inner">
        <div className="pho-copy">
          <p className="pho-tag"><Sparkles size={13} /> {products.length} products, one connected core</p>
          <h1 className="pho-title">Business technology,<br />already engineered.</h1>
          <p className="pho-lede">Proven business workflows turned into ready-to-use systems, each designed around a real operational need.</p>
        </div>

        <div className="pho-ctas">
          <Link href="#catalogue" className="pho-btn"><Sparkles size={15} /> Explore the products</Link>
          <Link href={`/products/${live.id}`} className="pho-link">{live.name} is live now <ChevronRight size={16} /></Link>
        </div>

        <ul className="pho-fan" aria-label="Featured products">
          {fan.map((p, i) => (
            <li key={p.id} className={`pho-card pos-${i}`} style={{ ["--acc" as string]: p.accent, ["--i" as string]: i }}>
              <Link href={`/products/${p.id}`}>
                <span className="pho-card-bar"><i /><i /><i /><b>{p.name}</b></span>
                <span className="pho-card-screen"><ProductGlimpse id={p.id} accent={p.accent} /></span>
                <span className="pho-card-foot">
                  <em>{p.category}</em>
                  <span className={p.status === "available" ? "live" : undefined}><i />{statusLabel[p.status]}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="pho-strip" aria-label="All products">
          {products.map((p) => (
            <li key={p.id} style={{ ["--acc" as string]: p.accent }}>
              <Link href={`/products/${p.id}`}><i />{p.name}{p.status === "available" && <b>Live</b>}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
