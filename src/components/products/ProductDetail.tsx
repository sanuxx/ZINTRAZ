import Link from "next/link";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import ProductGlimpse from "@/components/products/ProductGlimpse";
import ProductDemo from "@/components/demos/ProductDemo";
import Laptop3D from "@/components/products/Laptop3D";
import { groupLabel, products, statusLabel, type Product } from "@/components/sections/Products";

/**
 * The sections of a product page (/products/[slug]), in the editorial style of /products: a spec-sheet
 * hero over the product's working demo on a laptop, the problem as a pull quote, capabilities as a numbered grid,
 * who it is for, and the rest of the family. Server components; styles under "Product page" in
 * globals.css. The workflow section is ProductFlow (client).
 */
const pad = (n: number) => String(n).padStart(2, "0");

export function ProductHero({ product }: { product: Product }) {
  const { id, name, category, tagline, desc, status, group, accent } = product;
  const no = products.findIndex((p) => p.id === id) + 1;
  return (
    <section className="pdh" style={{ ["--acc" as string]: accent }}>
      <div className="pdh-glow" aria-hidden="true" />
      <div className="container">
        <nav className="pdh-crumb" aria-label="Breadcrumb" data-reveal>
          <Link href="/products">Products</Link><i>/</i>
          <Link href={`/products#${group}`}>{groupLabel[group]}</Link><i>/</i>
          <span>{name}</span>
        </nav>
        <div className="pdh-head">
          <h1 className="pdh-name" data-reveal style={{ ["--d" as string]: ".05s" }}>{name}<sup>{pad(no)}</sup></h1>
          <div className="pdh-side" data-reveal style={{ ["--d" as string]: ".12s" }}>
            <p className="pdh-tag">{tagline}</p>
            <p className="pdh-desc">{desc}</p>
            <div className="cta-row">
              <Link href="/contact" className="btn btn-primary">{status === "available" ? `Book a ${name} demo` : "Get early access"}</Link>
              <Link href="#try" className="link-chev">Try it live <ChevronRight size={18} /></Link>
            </div>
          </div>
        </div>
        <dl className="pdh-spec" data-reveal style={{ ["--d" as string]: ".18s" }}>
          <div><dt>Category</dt><dd>{category}</dd></div>
          <div><dt>Family</dt><dd>{groupLabel[group]}</dd></div>
          <div><dt>Status</dt><dd className={`pdh-status ${status}`}><i />{statusLabel[status]}</dd></div>
          <div><dt>Intelligence</dt><dd>AI-ready</dd></div>
        </dl>
        {/* The product itself, working: its interactive demo on a 3D laptop. */}
        <div className="pdh-device" id="try" data-reveal data-keep style={{ ["--d" as string]: ".24s" }}>
          <p className="pdh-try"><i />Interactive demo · every button works · sample data</p>
          <Laptop3D><ProductDemo slug={id} /></Laptop3D>
        </div>
      </div>
    </section>
  );
}

export function ProductProblem({ product }: { product: Product }) {
  const { name, pain, tagline, ai, accent } = product;
  return (
    <section className="section pdp-problem" style={{ ["--acc" as string]: accent }}>
      <div className="container">
        <p className="eyebrow" data-reveal>The problem</p>
        <blockquote className="pdp-quote" data-reveal style={{ ["--d" as string]: ".06s" }}>{pain}</blockquote>
        <div className="pdp-answer" data-reveal data-keep style={{ ["--d" as string]: ".12s" }}>
          <div><small>The answer</small><p><b>{name}.</b> {tagline}</p></div>
          <div><small><Sparkles size={13} /> AI-ready</small><p>{ai.replace(/^AI-ready:\s*/i, "").replace(/^./, (c) => c.toUpperCase())}.</p></div>
        </div>
      </div>
    </section>
  );
}

export function ProductFeatures({ product }: { product: Product }) {
  const { name, features, accent } = product;
  return (
    <section className="section pdp-feats" id="capabilities" style={{ ["--acc" as string]: accent }}>
      <div className="container pdp-feats-grid">
        <div className="pdp-feats-head" data-keep>
          <p className="eyebrow" data-reveal>What&apos;s inside</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".06s" }}>Everything {name} <span className="grad-text">does.</span></h2>
          <p className="pdp-count" data-reveal style={{ ["--d" as string]: ".12s" }}><b>{pad(features.length)}</b> capabilities, one system</p>
        </div>
        <ol className="pdp-cells" data-reveal style={{ ["--d" as string]: ".1s" }}>
          {features.map((f, i) => (
            <li key={f} style={{ ["--i" as string]: i }}>
              <span>{pad(i + 1)}</span>
              <b>{f}</b>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProductUses({ product }: { product: Product }) {
  const { useCases, accent } = product;
  return (
    <section className="section pdp-uses" style={{ ["--acc" as string]: accent }}>
      <div className="container">
        <div className="section-head" data-keep>
          <p className="eyebrow" data-reveal>Who it&apos;s for</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".06s" }}>You&apos;ll recognise <span className="grad-text">at least one of these.</span></h2>
        </div>
        <ul className="pdp-use-grid" data-reveal data-keep style={{ ["--d" as string]: ".12s" }}>
          {useCases.map((u, i) => (
            <li key={u}><span>{pad(i + 1)}</span><p>{u}</p></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ProductMore({ product }: { product: Product }) {
  const { id, group } = product;
  const others = products.filter((p) => p.id !== id);
  // Same family first, then the rest of the range, three in all.
  const list = [...others.filter((p) => p.group === group), ...others.filter((p) => p.group !== group)].slice(0, 3);
  return (
    <section className="section alt pdp-more">
      <div className="container">
        <div className="pdp-more-head" data-keep>
          <div>
            <p className="eyebrow" data-reveal>Works with</p>
            <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".06s" }}>Built on the same core, <span className="grad-text">ready to connect.</span></h2>
          </div>
          <Link href="/products" className="link-chev" data-reveal>All products <ChevronRight size={18} /></Link>
        </div>
        <div className="pdp-more-grid" data-reveal data-keep style={{ ["--d" as string]: ".12s" }}>
          {list.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="pdp-more-card" style={{ ["--acc" as string]: p.accent }}>
              <div className="pdp-more-screen"><ProductGlimpse id={p.id} accent={p.accent} /></div>
              <div className="pdp-more-meta"><span>{p.category}</span><em>{p.status === "available" ? "Live" : "Soon"}</em></div>
              <b>{p.name} <ArrowUpRight size={18} /></b>
              <p>{p.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
