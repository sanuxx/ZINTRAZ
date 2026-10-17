import type { Metadata } from "next";
import CTABand from "@/components/layout/CTABand";
import { SolutionBlocks, SolutionsReel } from "@/components/solutions/SolutionsPage";
import BetterTogether from "@/components/solutions/BetterTogether";
import SolutionsHero from "@/components/solutions/SolutionsHero";
import SolutionsStage from "@/components/solutions/SolutionsStage";

export const metadata: Metadata = {
  title: "Solutions — software, AI and connected systems",
  description:
    "From core business software to AI-powered intelligence and connected systems, Zyntraz brings multiple technology capabilities together under one transformation strategy.",
};

export default function SolutionsPage() {
  return (
    <div className="page">
      <SolutionsStage>
        <SolutionsHero />
        <SolutionsReel />
        <SolutionBlocks />
        <BetterTogether />
      </SolutionsStage>
      <CTABand variant="build" />
    </div>
  );
}
