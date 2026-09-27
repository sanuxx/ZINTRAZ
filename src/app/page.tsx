import HeroCinematic from "@/components/home/HeroCinematic";
import Journey from "@/components/home/Journey";
import HomePain from "@/components/home/HomePain";
import HomeProcess from "@/components/home/HomeProcess";
import WorkforceScene from "@/components/home/WorkforceScene";
import HomePlatforms from "@/components/home/HomePlatforms";
import BusinessSystemScene from "@/components/home/BusinessSystemScene";
import HomeIndustries from "@/components/home/HomeIndustries";
import Stats from "@/components/sections/Stats";
import WhyZyntraz from "@/components/sections/WhyZyntraz";
import CTABand from "@/components/layout/CTABand";

// Hero → Journey → Pain are choreographed together (orb handover, then the .jr + .hpain curtain), so they stay adjacent.
export default function Home() {
  return (
    <>
      <HeroCinematic />
      <Journey />
      <HomePain />
      <HomeProcess />
      <section className="tiles" aria-label="Zyntraz AI"><WorkforceScene /></section>
      <HomePlatforms />
      <section className="tiles" aria-label="Custom business systems"><BusinessSystemScene /></section>
      <HomeIndustries />
      <Stats />
      <WhyZyntraz />
      <CTABand />
    </>
  );
}
