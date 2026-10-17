import type { Metadata } from "next";
import CTABand from "@/components/layout/CTABand";
import IndustriesHero from "@/components/industries/IndustriesHero";
import IndustryExplorer from "@/components/industries/IndustryExplorer";
import IndustryMindset from "@/components/industries/IndustryMindset";

export const metadata: Metadata = {
  title: "Industries — hospitality, healthcare, education, retail, corporate",
  description:
    "We don't force industries into generic technology solutions. We study the operational realities of each business and engineer systems around them.",
};

export default function IndustriesPage() {
  return (
    <div className="page">
      {/* Editorial statement, figures, and a strip of every industry. */}
      <IndustriesHero />
      {/* One dossier per industry: flip today's problems into outcomes, approach, solutions, products
          (deep-linkable: /industries#<slug>). */}
      <IndustryExplorer />
      {/* The four steps followed in any industry. */}
      <IndustryMindset />
      <CTABand variant="build" />
    </div>
  );
}
