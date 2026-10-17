import type { Metadata } from "next";
import CTABand from "@/components/layout/CTABand";
import ProductsHero from "@/components/products/ProductsHero";
import ProductSpotlight from "@/components/products/ProductSpotlight";
import ProductStack from "@/components/products/ProductStack";
import ProductCore from "@/components/products/ProductCore";

export const metadata: Metadata = {
  title: "Products — business technology, already engineered",
  description:
    "ZynRest is live today for restaurants. ZynStay, ZynEvents, ZynCRM, ZynIQ, ZynAgent, ZynDocs, ZynAnalyst and ZynDecide are coming — each designed around a real operational need.",
};

export default function ProductsPage() {
  return (
    <div className="page">
      {/* Every product as an editorial index, with a cursor-following preview. */}
      <ProductsHero />
      {/* The live product, told in full beside a mock-up of it at work. */}
      <ProductSpotlight />
      {/* The three families as stacking chapters (deep-linkable: #hospitality, #business-systems, #ai-products). */}
      <ProductStack />
      {/* Why they belong together: one shared core under every product. */}
      <ProductCore />
      <CTABand
        title={<>Have a business problem <span className="grad-text">we haven&apos;t built for yet?</span></>}
        lede="Our products are only part of what we do. If your organization needs something different, we can engineer it around your business."
      />
    </div>
  );
}
