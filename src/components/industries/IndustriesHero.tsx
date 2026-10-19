import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BASE_PATH } from "@/lib/site";

/**
 * /industries hero, full bleed, dark (near-black navy with deep-blue / violet washes). On the right, after the client's
 * reference: a huge circle mostly off-screen, only its left edge visible as a glowing crescent of light
 * (violet at the top, through indigo and brand blue, to sky at the bottom), fading out at both ends, with
 * a soft glow bleeding outward. On the left: the ZYNTRAZ mark, the headline in the same type as the
 * other heroes (display 600, brand gradient on the key phrase), a thin rule, the subtitle and one action.
 * Kept short on purpose: the industry tabs and figures are in the explorer directly below.
 */
export default function IndustriesHero() {
  return (
    <section className="inx">
      <span className="inx-aurora" aria-hidden="true" />
      <span className="inx-grid" aria-hidden="true" />
      <span className="inx-stars" aria-hidden="true" />
      <span className="inx-shoot" aria-hidden="true" />
      <span className="inx-planet" aria-hidden="true">
        <i className="inx-halo" />
        <i className="inx-body" />
        <i className="inx-glow" />
        <i className="inx-core" />
        <i className="inx-rim" />
        <i className="inx-hot" />
      </span>
      <span className="inx-grain" aria-hidden="true" />
      <div className="container inx-inner">
        <div className="inx-copy" data-reveal>
          <p className="inx-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE_PATH}/zyntraz-mark.png`} alt="" width={94} height={94} />
            <span>ZYNTRAZ <em>Industries</em></span>
          </p>
          <h1 className="inx-title">Different industries.<br /><span className="grad-text">One engineering mindset.</span></h1>
          <span className="inx-rule" aria-hidden="true" />
          <p className="inx-sub">We study the operational realities of each business and engineer systems around them.</p>
          <div className="inx-cta">
            <Link href="#explorer" className="inx-btn">Find your industry <ChevronRight size={16} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
