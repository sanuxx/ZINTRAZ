import type { Metadata } from "next";
import CinematicHero from "@/components/hero/CinematicHero";
import { PathNodes } from "@/components/hero/backdrops";
import CTABand from "@/components/layout/CTABand";
import Workflow from "@/components/sections/Workflow";

export const metadata: Metadata = {
  title: "How we work — from idea to intelligent operation",
  description:
    "Transformation isn't a single project. It's a structured journey from understanding the current state to engineering a better one — consultation, analysis, strategy, engineering, deployment and optimization.",
};

export default function HowWeWorkPage() {
  return (
    <div className="page">
      <CinematicHero
        eyebrow="How we work"
        title={<>From idea to<br /><span className="grad-text">intelligent operation.</span></>}
        lede={
          <>
            Transformation isn&apos;t a single project. It&apos;s a structured journey from{" "}
            <strong>understanding the current state to engineering a better one.</strong>
          </>
        }
        primary={{ label: "Book a discovery session", href: "/consultation" }}
        secondary={{ label: "See the steps", href: "#process" }}
        backdrop={<PathNodes />}
      />

      {/* The process as the engineering team runs it, with the detail behind each stage. (The six-step
          ProcessConveyor used to sit above it, repeating the same process with a different step count.) */}
      <Workflow />

      <CTABand variant="transformation" />
    </div>
  );
}
