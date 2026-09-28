import HeroGenesis from "@/components/home/HeroGenesis";
import Worlds from "@/components/home/Worlds";
import HomePain from "@/components/home/HomePain";
import HomeProcess from "@/components/home/HomeProcess";
import HomePlatforms from "@/components/home/HomePlatforms";
import BusinessSystemScene from "@/components/home/BusinessSystemScene";
import HomeIndustries from "@/components/home/HomeIndustries";
import Stats from "@/components/sections/Stats";
import WhyZyntraz from "@/components/sections/WhyZyntraz";
import HomeFinale from "@/components/home/HomeFinale";

// Worlds → Pain stay adjacent: the .wd + .hpain curtain slides one over the other.
export default function Home() {
  return (
    <>
      <HeroGenesis />
      <Worlds />
      <HomePain />
      <HomeProcess />
      <HomePlatforms />
      <section className="tiles" aria-label="Custom business systems"><BusinessSystemScene /></section>
      <HomeIndustries />
      <Stats />
      <WhyZyntraz />
      <HomeFinale />
    </>
  );
}
