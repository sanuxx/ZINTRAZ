import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CinematicHero from "@/components/hero/CinematicHero";
import { DialogPlanes } from "@/components/hero/backdrops";
import CTABand from "@/components/layout/CTABand";
import { SectionHead, OutcomeList } from "@/components/sections/Blocks";
import AgendaOrbit from "@/components/scenes/AgendaOrbit";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Request a consultation",
  description:
    "A transformation conversation starts with understanding. We'll explore your business objectives, existing processes, technology environment and opportunities for improvement.",
};


const takeaways = [
  "An honest read on where technology will pay off first",
  "A clear roadmap, timeline and estimate for your system",
  "The opportunities we'd prioritise, and the ones we'd leave alone",
  "No commitment, and no obligation to work with us afterwards",
];

export default function ConsultationPage() {
  return (
    <div className="page">
      <CinematicHero
        eyebrow="Request a consultation"
        title={<>Let&apos;s understand the problem<br /><span className="grad-text">before we build the solution.</span></>}
        lede={
          <>
            A transformation conversation starts with understanding. During the consultation, we&apos;ll explore
            your business objectives, existing processes, technology environment and{" "}
            <strong>opportunities for improvement.</strong>
          </>
        }
        primary={{ label: "Request a consultation", href: "/contact" }}
        secondary={{ label: "What we'll discuss", href: "#agenda" }}
        backdrop={<DialogPlanes />}
      />

      {/* Set piece: the six questions circling the business. */}
      <AgendaOrbit />

      <section className="section alt" id="takeaway">
        <div className="container">
          <SectionHead
            eyebrow="What you leave with"
            heading={<>Something useful, <span className="grad-text">either way.</span></>}
            lede="Whether or not we end up working together, the consultation should leave you clearer than you were."
          />
          <OutcomeList items={takeaways} />
          <div className="cta-row" style={{ marginTop: 44 }} data-reveal>
            <Link href="/contact" className="btn btn-primary btn-lg">Request a consultation</Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="link-chev">
              Or message us on WhatsApp <ChevronRight size={18} />
            </a>
          </div>
          <p className="lede" style={{ marginTop: 28, fontSize: 15 }} data-reveal>
            Prefer email or phone? <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          </p>
        </div>
      </section>

      <CTABand variant="transformation" />
    </div>
  );
}
