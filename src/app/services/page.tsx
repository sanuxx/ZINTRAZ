import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CTABand from "@/components/layout/CTABand";
import DomainsOrbit from "@/components/sections/DomainsOrbit";
import Workflow from "@/components/sections/Workflow";
import TechStack from "@/components/sections/TechStack";

export const metadata: Metadata = {
  title: "Services — AI, software, cloud, IoT and automation",
  description: "AI & agentic AI, software development, web development, web system development and custom system development — engineered end to end.",
};

export default function ServicesPage() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Services"
        title={<>Engineering,<br /><span className="grad-text">end to end.</span></>}
        lede={<>We understand how your business works, then engineer <strong>the software, AI, data and automation</strong> it needs — with real progress every week.</>}
        primary={{ label: "Start a project", href: "/contact" }}
        secondary={{ label: "See how we work", href: "#process" }}
      />
      <DomainsOrbit />
      <Workflow />
      <TechStack />
      <CTABand />
    </div>
  );
}
