import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CTABand from "@/components/layout/CTABand";
import Positioning from "@/components/sections/Positioning";
import Stats from "@/components/sections/Stats";

export const metadata: Metadata = {
  title: "Company — we rebuild how businesses operate",
  description: "Not generic software. Zyntraz engineers AI and business systems around how your business actually works.",
};

export default function CompanyPage() {
  return (
    <div className="page">
      <PageHero
        eyebrow="About Zyntraz"
        title={<>We rebuild how<br /><span className="grad-text">businesses operate.</span></>}
        lede={<>Zyntraz is a business transformation engineering company. We understand how your business works, then build the <strong>software, AI, data and automation</strong> it needs — for companies ready to stop patching the chaos.</>}
        primary={{ label: "Work with us", href: "/contact" }}
        secondary={{ label: "Explore Zyntraz AI", href: "/ai" }}
      />
      <Stats />
      <Positioning />
      <CTABand />
    </div>
  );
}
