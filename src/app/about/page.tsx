import type { Metadata } from "next";
import CTABand from "@/components/layout/CTABand";
import Stats from "@/components/sections/Stats";
import PageChapters from "@/components/ui/PageChapters";
import {
  AboutBeliefs, AboutHero, AboutManifesto, AboutMethod, AboutPhilosophy, AboutStory, AboutVision,
} from "@/components/about/AboutSections";

export const metadata: Metadata = {
  title: "About ZINTRAZ — engineering the next way businesses operate",
  description:
    "ZINTRAZ is a business transformation engineering company founded in Sri Lanka. We combine business analysis, strategy, software engineering, AI, data and connected technologies to create systems that make businesses more capable.",
};

export default function AboutPage() {
  return (
    <div className="page ab">
      <AboutHero />
      <PageChapters items={[
        { id: "who-we-are", label: "Who we are" },
        { id: "story", label: "Story" },
        { id: "how-we-work-with-you", label: "How we work" },
        { id: "philosophy", label: "Philosophy" },
        { id: "vision-mission", label: "Vision" },
        { id: "beliefs", label: "Beliefs" },
      ]} />
      <AboutManifesto />
      <AboutStory />
      <AboutMethod />
      <AboutPhilosophy />
      <AboutVision />
      <AboutBeliefs />
      <Stats />
      <div id="founding">
        <CTABand
          title={<>Become a <span className="grad-text">founding client.</span></>}
          lede="We're taking on a small number of founding clients. You get the founding team working directly on your business, early access to our platforms, and a system shaped around you from day one."
        />
      </div>
    </div>
  );
}
