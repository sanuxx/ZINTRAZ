import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

/**
 * "How we engage": the three ways to work with ZINTRAZ, side by side (best for, how it runs, typical
 * shape). The middle model is highlighted as the most common starting point.
 */
const models = [
  {
    name: "Project",
    tag: "Defined scope",
    lead: "A clear outcome, delivered end to end.",
    best: "A new platform, website, integration or AI pilot with a known goal.",
    how: ["Discovery and a fixed proposal before any build", "Delivered in milestones you can see and test", "Handover with code, documentation and training"],
    shape: "4–16 weeks",
  },
  {
    name: "Dedicated team",
    tag: "Most common",
    lead: "Engineers who work as an extension of yours.",
    best: "Growing products, transformation programmes and multi-system work.",
    how: ["A stable team that learns your business deeply", "Priorities set with you every sprint", "Scale the team up or down as needs change"],
    shape: "3 months +",
    featured: true,
  },
  {
    name: "Ongoing partnership",
    tag: "After launch",
    lead: "Your systems, kept improving.",
    best: "Live platforms that need support, new features and optimisation.",
    how: ["Monitoring, maintenance and security updates", "A monthly allowance for new features", "One point of contact who knows your platform"],
    shape: "Monthly",
  },
];

export default function ServiceEngage() {
  return (
    <section className="section alt sve" id="engage">
      <div className="container">
        <div className="section-head center" data-keep>
          <p className="eyebrow" data-reveal>How we engage</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".06s" }}>
            Three ways to work <span className="grad-text">with one team.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".12s" }}>
            Pick the shape that fits. Switch as the work changes.
          </p>
        </div>
        <div className="sve-grid" data-reveal data-keep style={{ ["--d" as string]: ".16s" }}>
          {models.map((m) => (
            <article key={m.name} className={`sve-card${m.featured ? " is-featured" : ""}`}>
              <span className="sve-tag">{m.tag}</span>
              <h3>{m.name}</h3>
              <p className="sve-lead">{m.lead}</p>
              <div className="sve-best"><small>Best for</small><p>{m.best}</p></div>
              <ul>{m.how.map((h) => <li key={h}><Check size={15} />{h}</li>)}</ul>
              <div className="sve-foot"><small>Typical shape</small><b>{m.shape}</b></div>
            </article>
          ))}
        </div>
        <div className="cta-row center" data-reveal>
          <Link href="/contact" className="link-chev">Not sure which fits? We&apos;ll recommend one <ChevronRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
