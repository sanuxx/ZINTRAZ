import type { Metadata } from "next";
import CinematicHero from "@/components/hero/CinematicHero";
import { DepthSlabs } from "@/components/hero/backdrops";
import CTABand from "@/components/layout/CTABand";
import CompanyStory from "@/components/sections/CompanyStory";
import Positioning from "@/components/sections/Positioning";
import Stats from "@/components/sections/Stats";
import { SectionHead } from "@/components/sections/Blocks";
import BeliefDeck from "@/components/scenes/BeliefDeck";

export const metadata: Metadata = {
  title: "About ZYNTRAZ — engineering the next way businesses operate",
  description:
    "ZYNTRAZ is a business transformation engineering company founded in Sri Lanka. We combine business analysis, strategy, software engineering, AI, data and connected technologies to create systems that make businesses more capable.",
};


export default function AboutPage() {
  return (
    <div className="page">
      <CinematicHero
        eyebrow="About ZYNTRAZ"
        title={<>Engineering the next way<br /><span className="grad-text">businesses operate.</span></>}
        lede={
          <>
            ZYNTRAZ is a business transformation engineering company focused on helping organizations turn
            operational challenges into technology-driven opportunities. We combine business analysis, strategy,
            software engineering, <strong>artificial intelligence, data and connected technologies</strong> to
            create systems that make businesses more capable.
          </>
        }
        primary={{ label: "Start a transformation assessment", href: "/contact" }}
        secondary={{ label: "Our story", href: "#story" }}
        backdrop={<DepthSlabs />}
      />

      <section className="section" id="who-we-are">
        <div className="container">
          <SectionHead
            eyebrow="Who we are"
            heading={<>We sit where business <span className="grad-text">meets technology.</span></>}
          />
          {/* data-keep: two short columns side by side; folding one would leave a lone "Read more" beside the other. */}
          <div className="pcols" data-keep>
            <p className="lede" data-reveal>
              Traditional technology companies often start with technology. Traditional consultants often stop at
              strategy. ZYNTRAZ connects both — we understand the business problem, define the transformation
              strategy and engineer the technology required to execute it.
            </p>
            <p className="lede" data-reveal style={{ ["--d" as string]: ".1s" }}>
              Our role isn&apos;t simply to deliver a system. Our role is to help build{" "}
              <strong>a better way for the business to operate.</strong>
            </p>
          </div>
        </div>
      </section>

      <CompanyStory />
      <Positioning />

      <section className="section alt" id="vision-mission">
        <div className="container">
          <div className="pcols">
            <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
              <p className="eyebrow" data-reveal>Vision</p>
              <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".06s" }}>
                A world where <span className="grad-text">every business can operate intelligently.</span>
              </h2>
              <p className="lede" data-reveal style={{ ["--d" as string]: ".12s" }}>
                We envision a future where businesses of every size can use software, AI, data and connected
                technologies to operate with the intelligence and agility traditionally available only to large
                enterprises.
              </p>
            </div>
            <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
              <p className="eyebrow" data-reveal>Mission</p>
              <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".06s" }}>
                Make transformation <span className="grad-text">achievable.</span>
              </h2>
              <p className="lede" data-reveal style={{ ["--d" as string]: ".12s" }}>
                Our mission is to engineer practical technology that helps businesses eliminate inefficiency,
                unlock intelligence and create new opportunities for growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Set piece: the beliefs dealt onto the table. */}
      <BeliefDeck />

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
