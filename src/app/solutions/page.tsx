import type { Metadata } from "next";
import Glance from "@/components/ui/Glance";
import PageChapters from "@/components/ui/PageChapters";
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
        <Glance items={[
          { value: "3", label: "Capabilities: software, AI and IoT" },
          { value: "1", label: "Strategy and one connected system" },
          { value: "9", label: "Products on one shared core" },
          { value: "100%", label: "Human approval on high-stakes AI actions" },
        ]} />
        <PageChapters items={[
          { id: "software", label: "Software" },
          { id: "ai", label: "AI & Intelligence" },
          { id: "iot", label: "IoT & AIoT" },
          { id: "together", label: "Better together" },
        ]} />
        <SolutionsReel />
        <SolutionBlocks />
        <BetterTogether />
      </SolutionsStage>
      <CTABand variant="build" />
    </div>
  );
}
