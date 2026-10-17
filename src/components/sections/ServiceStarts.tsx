import Link from "next/link";
import { ChevronRight, Compass, Globe, Sparkles, UtensilsCrossed } from "lucide-react";

const starts = [
  {
    icon: Globe, title: "A website or online store",
    desc: "A fast, modern business website or e-commerce store — designed around your customers and ready to grow into a full system later.",
  },
  {
    icon: Compass, title: "A transformation assessment",
    desc: "We map how your business runs today and give you a clear roadmap, timeline and estimate before any commitment.",
  },
  {
    icon: Sparkles, title: "An AI or automation pilot",
    desc: "One high-value process — replies, orders, reports or approvals — automated on your real data, so you see results before scaling.",
  },
  {
    icon: UtensilsCrossed, title: "A ready-made platform",
    desc: "Restaurants can go live on ZynRest, then we customise it to the way you work and connect it to the rest of your business.",
  },
];

export default function ServiceStarts() {
  return (
    <section className="section" id="start">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow" data-reveal>Where to start</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
            Start small. <span className="grad-text">Grow into a system.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>
            You don&apos;t need a big project to work with us. Most clients begin with one of these.
          </p>
        </div>

        <div className="promise-grid">
          {starts.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="glass spot promise" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <Icon className="promise-ico" size={26} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        <div className="cta-row center" data-reveal>
          <Link href="/contact" className="link-chev">Tell us where you want to start <ChevronRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
