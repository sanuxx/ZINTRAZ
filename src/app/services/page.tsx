import type { Metadata } from "next";
import CTABand from "@/components/layout/CTABand";
import ServiceStarts from "@/components/sections/ServiceStarts";
import TechStack from "@/components/sections/TechStack";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceExplorer from "@/components/services/ServiceExplorer";
import ServiceEngage from "@/components/services/ServiceEngage";

export const metadata: Metadata = {
  title: "Services — software, AI, data, IoT and ongoing engineering",
  description:
    "Whether you need a new platform, AI capability, connected system or complete digital transformation, Zyntraz brings strategy and engineering together.",
};

export default function ServicesPage() {
  return (
    <div className="page">
      {/* Editorial statement, the portfolio in figures, and a contents strip of all seven services. */}
      <ServicesHero />
      {/* Each service as a chapter beside a sticky index (anchors: /services#<slug>). */}
      <ServiceExplorer />
      {/* Ways in: small first steps, then the three engagement models. */}
      <ServiceStarts />
      <ServiceEngage />
      <TechStack />
      <CTABand variant="build" />
    </div>
  );
}
