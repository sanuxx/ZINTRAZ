import Link from "next/link";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { products } from "@/components/sections/Products";

/**
 * "Live now": the available product told in full, beside a product-style mock-up of it at work — a
 * live floor plan, the order ticket for one table and the day's numbers. The mock is decorative and
 * its figures illustrative (styles under "Products page" in globals.css).
 */
const tables = [
  { n: 1, s: "free" }, { n: 2, s: "seated", t: "12m" }, { n: 3, s: "order", t: "4m" }, { n: 4, s: "bill", t: "52m" },
  { n: 5, s: "seated", t: "21m" }, { n: 6, s: "free" }, { n: 7, s: "live", t: "8m" }, { n: 8, s: "seated", t: "33m" },
  { n: 9, s: "order", t: "2m" }, { n: 10, s: "free" }, { n: 11, s: "seated", t: "15m" }, { n: 12, s: "bill", t: "61m" },
];
const ticket = [
  { q: 2, item: "Chicken kottu", p: "2,400" },
  { q: 1, item: "Devilled prawns", p: "2,850" },
  { q: 3, item: "Fresh lime soda", p: "1,350" },
  { q: 1, item: "Watalappan", p: "750" },
];

export function ZynRestMock() {
  return (
    <div className="sx-win pz-win" aria-hidden="true">
      <span className="sx-glint" />
      <div className="sx-win-bar"><i /><i /><i /><span>ZynRest · Lotus Kitchen, Colombo</span></div>
      <div className="pz-app">
        <div className="pz-tabs"><b>Floor</b><span>Kitchen</span><span>Stock</span><span>Reports</span></div>
        <div className="pz-body">
          <div className="pz-floor">
            {tables.map((tb) => (
              <div key={tb.n} className={`pz-table s-${tb.s}`}>
                <b>T{tb.n}</b>
                {tb.t && <span>{tb.t}</span>}
              </div>
            ))}
          </div>
          <div className="pz-ticket">
            <div className="pz-ticket-head"><b>Table 7</b><span>4 guests</span></div>
            {ticket.map((l, i) => (
              <div key={l.item} className="pz-line" style={{ ["--i" as string]: i }}>
                <span>{l.q}×</span><span>{l.item}</span><span>{l.p}</span>
              </div>
            ))}
            <div className="pz-total"><span>Total</span><b>LKR 7,350</b></div>
            <span className="pz-sent"><i /> Sent to kitchen</span>
          </div>
        </div>
        <div className="pz-kpis">
          <div><span>Covers today</span><b>128</b></div>
          <div><span>Avg. ticket</span><b>3.2k</b></div>
          <div><span>Kitchen time</span><b>4 min</b></div>
        </div>
      </div>
    </div>
  );
}

export default function ProductSpotlight() {
  const p = products.find((x) => x.status === "available")!;
  return (
    <section className="section alt psl" id="live">
      <div className="container psl-grid">
        {/* data-keep: TextFold must not collapse this copy. */}
        <div className="psl-copy" data-keep>
          <p className="eyebrow" data-reveal>Live now</p>
          <div className="psl-id" data-reveal>
            <b>{p.name}</b><span>{p.category}</span>
          </div>
          <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".06s" }}>{p.tagline}</h2>
          <p className="psl-pain" data-reveal style={{ ["--d" as string]: ".1s" }}>{p.pain}</p>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".14s" }}>{p.desc}</p>
          <ul className="psl-feats" data-reveal style={{ ["--d" as string]: ".18s" }}>
            {p.features.slice(0, 6).map((f) => <li key={f}><Check size={14} />{f}</li>)}
          </ul>
          <p className="psl-ai" data-reveal style={{ ["--d" as string]: ".22s" }}><Sparkles size={15} /> {p.ai}</p>
          <div className="cta-row" data-reveal style={{ ["--d" as string]: ".26s" }}>
            <Link href={`/products/${p.id}`} className="btn btn-primary">Explore {p.name}</Link>
            <Link href="/contact" className="link-chev">Book a demo <ChevronRight size={18} /></Link>
          </div>
        </div>
        <div className="psl-visual" data-reveal style={{ ["--d" as string]: ".12s" }}>
          <ZynRestMock />
        </div>
      </div>
    </section>
  );
}
