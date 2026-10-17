import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CTABand from "@/components/layout/CTABand";
import ProductFilm from "@/components/scenes/ProductFilm";
import ProductFlow from "@/components/products/ProductFlow";
import { ProductFeatures, ProductHero, ProductMore, ProductProblem, ProductUses } from "@/components/products/ProductDetail";
import { products } from "@/components/sections/Products";

// Static export: every product page is prerendered from the registry, so adding a product to
// `products` is all it takes to get its page.
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.id === slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.category}`,
    description: p.desc,
    alternates: { canonical: `/products/${p.id}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) notFound();

  const { name, status } = product;

  return (
    // pdp-page: one continuous blue-and-white gradient behind every section (see "Product page" in globals.css).
    <div className="page pdp-page">
      {/* Spec-sheet hero over the product's interactive demo, on a laptop. */}
      <ProductHero product={product} />
      {/* The problem it exists for, as a pull quote, and the answer. */}
      <ProductProblem product={product} />
      <ProductFeatures product={product} />
      {/* ZynRest is live, so its page gets the film of its workflow (one order, followed step by step); the
          products still in development follow their unit of work down a scroll-filled track. */}
      {slug === "zynrest" ? <ProductFilm slug={slug} /> : <ProductFlow slug={slug} />}
      <ProductUses product={product} />
      {/* The rest of the range: same family first. */}
      <ProductMore product={product} />
      <CTABand
        title={<>Want to see {name} <span className="grad-text">against your operation?</span></>}
        lede={
          status === "available"
            ? `Tell us how your business runs and we'll walk you through ${name} with your workflow, not a demo script.`
            : `${name} is in development. Tell us how your business runs and we'll shape it around real requirements — and get you in early.`
        }
      />
    </div>
  );
}
