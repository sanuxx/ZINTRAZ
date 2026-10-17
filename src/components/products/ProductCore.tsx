import { BrainCircuit, Plug, ShieldCheck } from "lucide-react";
import { products } from "@/components/sections/Products";

/**
 * "Built on one core": every product as a name tag on top, each joined by a thin line down into the three
 * shared layers it stands on. A soft pulse occasionally travels down the lines (CSS, decorative).
 */
const layers = [
  { icon: BrainCircuit, name: "Intelligence layer", desc: "AI agents, document intelligence, analytics and decision support, available to every product." },
  { icon: Plug, name: "Integration layer", desc: "POS hardware, accounting, payment gateways, WhatsApp and your existing systems through open APIs." },
  { icon: ShieldCheck, name: "Data & security layer", desc: "One customer record, role-based access, a full audit trail and automatic backups." },
];

export default function ProductCore() {
  return (
    <section className="section alt pcore">
      <div className="container">
        <div className="section-head center" data-keep>
          <p className="eyebrow" data-reveal>The platform</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
            Separate products. <span className="grad-text">One shared core.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".14s" }}>
            Every ZYNTRAZ product is built on the same foundation, so they connect from the first day and grow together as your business does.
          </p>
        </div>

        <div className="pcore-diagram" data-reveal data-keep style={{ ["--d" as string]: ".2s" }}>
          <ul className="pcore-row" aria-label="Products" style={{ ["--n" as string]: products.length }}>
            {products.map((p, i) => (
              <li key={p.id} style={{ ["--i" as string]: i, ["--acc" as string]: p.accent }}>
                <span className="pcore-chip">{p.name}</span>
                <i className="pcore-wire" aria-hidden="true" />
              </li>
            ))}
          </ul>
          <div className="pcore-layers">
            {layers.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="pcore-layer">
                <span className="pcore-ico"><Icon size={20} /></span>
                <b>{name}</b>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
