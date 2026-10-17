import { Activity, Eye, GitBranch, Wrench } from "lucide-react";

/**
 * "One engineering mindset": the four steps ZYNTRAZ follows in any industry, as a connected row.
 */
const steps = [
  { icon: Eye, title: "Observe the floor", desc: "We spend time where the work happens: the front desk, the kitchen, the ward, the warehouse." },
  { icon: GitBranch, title: "Map the flow", desc: "Who requests, who approves, who delivers, and where information gets lost between them." },
  { icon: Wrench, title: "Engineer the system", desc: "Software, AI and devices built around that flow, connected to what you already run." },
  { icon: Activity, title: "Measure and evolve", desc: "We track the numbers that changed and keep improving the system as the business grows." },
];

export default function IndustryMindset() {
  return (
    <section className="section imd">
      <div className="container">
        <div className="section-head center" data-keep>
          <p className="eyebrow" data-reveal>One engineering mindset</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".06s" }}>
            Every industry starts <span className="grad-text">the same way.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".12s" }}>
            The sector changes. The discipline doesn&apos;t: understand the operation first, then build the system around it.
          </p>
        </div>
        <ol className="imd-row" data-reveal data-keep style={{ ["--d" as string]: ".16s" }}>
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} style={{ ["--i" as string]: i }}>
              <span className="imd-no">{String(i + 1).padStart(2, "0")}</span>
              <span className="imd-ico"><Icon size={20} /></span>
              <b>{title}</b>
              <p>{desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
