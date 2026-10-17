import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Contact from "@/components/sections/Contact";
import FAQ from "@/components/sections/FAQ";
import { SectionHead, OutcomeList } from "@/components/sections/Blocks";

// The same six questions the consultation is built around (AgendaOrbit on /consultation).
const agenda = [
  "What you're trying to achieve",
  "Where your biggest bottlenecks are",
  "The systems you use today",
  "What data you have, and how it's used",
  "Where AI or automation could create value",
  "What your business should be capable of next",
];

export const metadata: Metadata = {
  title: "Contact — tell us what you're trying to change",
  description:
    "You don't need to know exactly what technology you need. Tell us about the business challenge, the current situation and where you want to go. We'll help you identify the path forward.",
};

export default function ContactPage() {
  return (
    <div className="page">
      <Contact />

      <section className="section alt" id="talk">
        <div className="container">
          <SectionHead
            eyebrow="Prefer to talk directly?"
            heading={<>Let&apos;s discuss your business, your challenges <span className="grad-text">and what&apos;s possible.</span></>}
            lede="A consultation is a conversation, not a sales call. Here's exactly what we'd cover."
            center
          />
          <div style={{ maxWidth: 820, margin: "0 auto 44px" }}>
            <OutcomeList items={agenda} />
          </div>
          <div className="cta-row" style={{ justifyContent: "center" }} data-reveal>
            <Link href="/consultation" className="btn btn-primary btn-lg">Book a consultation</Link>
            <Link href="/how-we-work" className="link-chev">See how we work <ChevronRight size={18} /></Link>
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  );
}
