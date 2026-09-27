import { BrainCircuit, Compass, Puzzle, RefreshCw } from "lucide-react";

const pillars = [
  { icon: Compass, title: "Business understanding", desc: "We understand the operation before recommending any technology." },
  { icon: Puzzle, title: "Built for your workflow", desc: "We don't force your business into a generic template — we engineer around how you already work." },
  { icon: BrainCircuit, title: "AI where it matters", desc: "We use AI where it creates measurable operational value — not because it's trendy." },
  { icon: RefreshCw, title: "Continuous evolution", desc: "The relationship doesn't end at deployment. We monitor, support and keep improving." },
];

export default function WhyZyntraz() {
  return (
    <section className="section" id="why-zyntraz">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow" data-reveal>Why Zyntraz</span>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
            One partner, <span className="grad-text">from problem to platform.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>
            Not a SaaS subscription you bend your business around. Not a freelancer. Not another AI agency
            bolting a chatbot onto your website. One team that understands your operation and engineers
            everything it needs — software, AI, data and automation, working together.
          </p>
        </div>

        <div className="promise-grid">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="glass spot promise" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <Icon className="promise-ico" size={26} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
