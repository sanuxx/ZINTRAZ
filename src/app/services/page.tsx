import type { Metadata } from "next";
import CTABand from "@/components/layout/CTABand";
import ServiceStarts from "@/components/sections/ServiceStarts";
import TechStack from "@/components/sections/TechStack";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceTabs from "@/components/services/ServiceTabs";
import ServiceEngage from "@/components/services/ServiceEngage";
import PageChapters from "@/components/ui/PageChapters";
import Glance from "@/components/ui/Glance";

export const metadata: Metadata = {
  title: "Services — software, AI, data, IoT and ongoing engineering",
  description:
    "Whether you need a new platform, AI capability, connected system or complete digital transformation, Zyntraz brings strategy and engineering together.",
};

// The page at a glance, under the hero: the four facts a skimmer should leave with.
const glance = [
  { value: "7", label: "Services, one engineering team" },
  { value: "1", label: "Service is enough to start" },
  { value: "3", label: "Ways to work with us" },
  { value: "24h", label: "Reply to every enquiry" },
];

export default function ServicesPage() {
  return (
    <div className="page">
      {/* Editorial statement, the portfolio in figures, and a contents strip of all seven services. */}
      <ServicesHero />
      <Glance items={glance} />
      <PageChapters items={[
        { id: "portfolio", label: "Services" },
        { id: "start", label: "Where to start" },
        { id: "engage", label: "How we engage" },
        { id: "tech", label: "Toolkit" },
      ]} />
      {/* The seven services as tabs, one on screen at a time (anchors: /services#<slug>). */}
      <ServiceTabs />
      {/* Ways in: small first steps, then the three engagement models. */}
      <ServiceStarts />
      <ServiceEngage />
      <TechStack />
      <CTABand variant="build" />
    </div>
  );
}
