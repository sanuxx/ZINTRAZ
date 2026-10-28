import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CTABand from "@/components/layout/CTABand";
import OrbVisual from "@/components/3d/OrbVisual";
import { AIDeploy, AITrust } from "@/components/sections/AgenticAI";
import AgentCompare from "@/components/ai/AgentCompare";
import AgentImpact from "@/components/ai/AgentImpact";
import AgentDay from "@/components/ai/AgentDay";
import CapabilityStack from "@/components/ai/CapabilityStack";

export const metadata: Metadata = {
  title: "AI & Intelligence — agentic AI for business",
  description: "AI agents that understand requests, reason through the steps and take action across your systems — with your team in control.",
};

export default function AIPage() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Zintraz AI"
        title={<>AI that doesn&apos;t just talk.<br /><span className="grad-text">It works.</span></>}
        lede={<>We design, build and deploy AI agents that understand requests, reason through the steps and <strong>take action across your systems</strong> — around the clock, with your team in control.</>}
        primary={{ label: "Start an AI assessment", href: "/contact" }}
        secondary={{ label: "Watch an agent work", href: "#demo" }}
      >
        <OrbVisual />
      </PageHero>

      {/* Set piece: one business day on a dial — the team's shift and the agent's, side by side. */}
      <AgentDay />

      {/* The same message sent to a chatbot and to an agent, played side by side. */}
      <AgentCompare />

      {/* What an agent does for the business: six advantages, each shown as a small living picture. */}
      <AgentImpact />

      <CapabilityStack />

      <section className="section" id="trust">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow" data-reveal>Trust &amp; safety</p>
            <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>Powerful. <span className="grad-text">And in your control.</span></h2>
            <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>
              Every agent we ship is designed with guardrails from day one.
            </p>
          </div>
          <AITrust />
        </div>
      </section>

      <section className="section alt" id="deploy">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow" data-reveal>How we deploy AI</p>
            <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>From idea to impact, <span className="dim">step by step.</span></h2>
          </div>
          <AIDeploy />
        </div>
      </section>

      <CTABand variant="ai" />
    </div>
  );
}
