import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CTABand from "@/components/layout/CTABand";
import PainPoints from "@/components/sections/PainPoints";
import Solutions from "@/components/sections/Solutions";
import Industries from "@/components/sections/Industries";

export const metadata: Metadata = {
  title: "Transformation — the problems we solve",
  description: "Spreadsheets, manual work, disconnected tools and AI that never leaves the demo. See the system that replaces each one.",
};

export default function SolutionsPage() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Transformation"
        title={<>Every problem<br /><span className="grad-text">has a system.</span></>}
        lede={<>Most growing businesses don&apos;t have a people problem or a demand problem. <strong>They have an operations problem.</strong> We build the system that fixes it.</>}
        primary={{ label: "Start a transformation assessment", href: "/contact" }}
        secondary={{ label: "Calculate your hidden cost", href: "#calculator" }}
      />
      <PainPoints />
      <Solutions />
      <Industries />
      <CTABand />
    </div>
  );
}
