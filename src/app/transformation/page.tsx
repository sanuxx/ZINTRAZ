import type { Metadata } from "next";
import Glance from "@/components/ui/Glance";
import PageChapters from "@/components/ui/PageChapters";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CinematicHero from "@/components/hero/CinematicHero";
import { ShatterField } from "@/components/hero/backdrops";
import CTABand from "@/components/layout/CTABand";
import { SectionHead, OutcomeList } from "@/components/sections/Blocks";
import LayerFlight from "@/components/scenes/LayerFlight";
import PainPoints from "@/components/sections/PainPoints";
import Solutions from "@/components/sections/Solutions";

export const metadata: Metadata = {
  title: "Business Transformation Engineering",
  description:
    "Digital transformation shouldn't mean replacing a spreadsheet with a web application. We help organizations rethink processes, connect systems, introduce intelligence and engineer new operational capabilities.",
};

const outcomes = [
  "Less manual work",
  "Better visibility",
  "Faster processes",
  "Connected operations",
  "Better decision-making",
  "More scalable systems",
  "Reduced operational friction",
  "New digital capabilities",
  "Greater organizational agility",
];

export default function TransformationPage() {
  return (
    <div className="page">
      <CinematicHero
        eyebrow="Business Transformation Engineering"
        title={<>Don&apos;t digitize the old way of working.<br /><span className="grad-text">Reinvent it.</span></>}
        lede={
          <>
            Digital transformation shouldn&apos;t mean replacing a spreadsheet with a web application.{" "}
            <strong>Real transformation changes how the business works.</strong>
          </>
        }
        primary={{ label: "Explore your transformation", href: "/consultation" }}
        secondary={{ label: "See the layers", href: "#layers" }}
        backdrop={<ShatterField />}
      />

      <Glance items={[
        { value: "6", label: "Layers, one direction" },
        { value: "9", label: "Outcomes transformation should create" },
        { value: "8", label: "Everyday problems, each with its fix" },
      ]} />
      <PageChapters items={[
        { id: "layers", label: "Layers" },
        { id: "outcomes", label: "Outcomes" },
        { id: "problems", label: "Problems" },
        { id: "solutions", label: "The fix" },
      ]} />

      {/* Set piece: the six layers flown through, one at a time. */}
      <LayerFlight />

      <section className="section alt" id="outcomes">
        <div className="container">
          <SectionHead
            eyebrow="Transformation outcomes"
            heading={<>What transformation <span className="grad-text">should create.</span></>}
            lede="If a transformation programme doesn't produce these, it was a software project with a bigger budget."
          />
          <OutcomeList items={outcomes} />
          <p className="lede" style={{ marginTop: 40 }} data-reveal>
            <Link href="/how-we-work" className="link-chev">See how we get there, step by step <ChevronRight size={18} /></Link>
          </p>
        </div>
      </section>

      {/* The starting point, in concrete terms: the operational problems transformation begins from. */}
      <PainPoints />
      <Solutions />

      <CTABand variant="transformation" />
    </div>
  );
}
