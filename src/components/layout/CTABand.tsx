import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { WHATSAPP } from "@/lib/contact";

type Props = { title?: React.ReactNode; lede?: string; dark?: boolean };

export default function CTABand({
  title = <>Tell us how your business works. <span className="grad-text">We&apos;ll show you what could be transformed.</span></>,
  lede = "No commitment. We'll map your operations, pinpoint where software, AI and automation will pay off first, and outline a clear roadmap.",
  dark = false,
}: Props) {
  return (
    <section className={`ctaband${dark ? " dark" : ""}`}>
      <div className="ctaband-glow" aria-hidden="true" />
      <div className="container ctaband-inner">
        <h2 className="h-xl" data-reveal>{title}</h2>
        <p className="lede" data-reveal style={{ ["--d" as string]: ".1s" }}>{lede}</p>
        <div className="cta-row" data-reveal style={{ ["--d" as string]: ".2s" }}>
          <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment</Link>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="link-chev">Chat on WhatsApp <ChevronRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}
