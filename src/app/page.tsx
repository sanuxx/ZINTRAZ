import HeroCinematic from "@/components/home/HeroCinematic";
import Journey from "@/components/home/Journey";
import HomePain from "@/components/home/HomePain";
import HomeOverview from "@/components/home/HomeOverview";
import HomeProcess from "@/components/home/HomeProcess";
import WorkforceScene from "@/components/home/WorkforceScene";
import BusinessBlueprint from "@/components/home/BusinessBlueprint";
import HomeIndustries from "@/components/home/HomeIndustries";
import Stats from "@/components/sections/Stats";import WhyZyntraz from "@/components/sections/WhyZyntraz";
import CTABand from "@/components/layout/CTABand";

// Hero → Journey → Pain are choreographed together (orb handover, then the .jr + .hpain curtain), so they stay adjacent.
// The narrative then follows the content architecture: problem → what we do → capabilities →
// industries → process → why us → act.
export default function Home() {
  return (
    <>
      <HeroCinematic />
      <Journey />
      <HomePain />
      <HomeOverview />
      <section className="tiles" aria-label="Zyntraz AI"><WorkforceScene /></section>
      <section className="tiles" aria-label="Custom business systems"><BusinessBlueprint /></section>
      <HomeIndustries />
      <HomeProcess />
      <Stats />
      <WhyZyntraz />
      <CTABand
        title={<>Your next stage of growth <span className="grad-text">needs more than software.</span></>}
        lede="Tell us where your business is today, where you want to go, and what's standing in the way. We'll help you identify what should change — and engineer the systems to make it happen."
      />
    </>
  );
}
