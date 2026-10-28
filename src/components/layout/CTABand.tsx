import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { WHATSAPP } from "@/lib/contact";

// The reusable closing bands from the content architecture. `variant` picks one; `title` and `lede`
// still override whichever it picked, so one-off bands (e.g. /company#founding) keep working.
export type CTAVariant = "default" | "transformation" | "build" | "ai" | "products" | "contact";

const variants: Record<CTAVariant, { title: React.ReactNode; lede: string; label: string; href: string }> = {
  default: {
    title: <>Tell us how your business works. <span className="grad-text">We&apos;ll show you what could be transformed.</span></>,
    lede: "No commitment. We'll map your operations, pinpoint where software, AI and automation will pay off first, and outline a clear roadmap.",
    label: "Start a transformation assessment",
    href: "/contact",
  },
  transformation: {
    title: <>Ready to transform <span className="grad-text">the way your business operates?</span></>,
    lede: "Let's identify the opportunities, define the strategy and engineer what comes next.",
    label: "Start a Transformation",
    href: "/consultation",
  },
  build: {
    title: <>Have a system <span className="grad-text">in mind?</span></>,
    lede: "From the first idea to a production-ready platform, we'll help you turn it into something real.",
    label: "Build With ZINTRAZ",
    href: "/contact",
  },
  ai: {
    title: <>Wonder where AI fits <span className="grad-text">into your business?</span></>,
    lede: "You don't need an AI strategy filled with buzzwords. You need to know where intelligence can create real value.",
    label: "Explore AI Opportunities",
    href: "/consultation",
  },
  products: {
    title: <>Looking for a <span className="grad-text">ready-made solution?</span></>,
    lede: "Explore ZINTRAZ products designed around real business operations.",
    label: "Explore Products",
    href: "/products",
  },
  contact: {
    title: <>Let&apos;s build <span className="grad-text">what&apos;s next.</span></>,
    lede: "Every transformation starts with a conversation.",
    label: "Talk to ZINTRAZ",
    href: "/contact",
  },
};

type Props = { title?: React.ReactNode; lede?: string; dark?: boolean; variant?: CTAVariant };

export default function CTABand({ title, lede, dark = false, variant = "default" }: Props) {
  const v = variants[variant];
  return (
    <section className={`ctaband${dark ? " dark" : ""}`}>
      <div className="ctaband-glow" aria-hidden="true" />
      <div className="container ctaband-inner">
        <h2 className="h-xl" data-reveal>{title ?? v.title}</h2>
        <p className="lede" data-reveal style={{ ["--d" as string]: ".1s" }}>{lede ?? v.lede}</p>
        <div className="cta-row" data-reveal style={{ ["--d" as string]: ".2s" }}>
          <Link href={v.href} className="btn btn-primary btn-lg">{v.label}</Link>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="link-chev">Chat on WhatsApp <ChevronRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}
