import type { Metadata } from "next";
import CTABand from "@/components/layout/CTABand";
import AIHero from "@/components/ai/AIHero";
import { AgentDemo, AIDeploy, AITrust, ChatbotVsAgent } from "@/components/sections/AgenticAI";
import CapabilityStack from "@/components/ai/CapabilityStack";

export const metadata: Metadata = {
  title: "Agentic AI for business",
  description: "AI agents that understand requests, reason through the steps and take action across your systems — with your team in control.",
};

export default function AIPage() {
  return (
    <div className="page page-flush dark ai-world">
      <AIHero />

      <section className="section" id="demo">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow" data-reveal>Live example</p>
            <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>See an agent at work.</h2>
            <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>
              Pick a scenario. Watch the agent understand the request, use the right tools, ask for approval when it
              matters — and finish the job.
            </p>
          </div>
          <div data-reveal><AgentDemo /></div>
          <ChatbotVsAgent />
        </div>
      </section>

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

      <CTABand />
    </div>
  );
}
