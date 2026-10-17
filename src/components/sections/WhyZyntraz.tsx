import { Compass, Layers, TrendingUp, BrainCircuit, RefreshCw } from "lucide-react";
import { SectionHead, PillarGrid } from "@/components/sections/Blocks";

const pillars = [
  { icon: Compass, title: "Business first", desc: "Technology decisions begin with business requirements and measurable objectives." },
  { icon: Layers, title: "Engineering depth", desc: "Software, AI, data and connected technologies under one engineering capability." },
  { icon: TrendingUp, title: "Built for scale", desc: "Systems are designed to evolve as your business grows." },
  { icon: BrainCircuit, title: "Intelligent by design", desc: "Where AI and automation create meaningful value, we integrate them into the solution." },
  { icon: RefreshCw, title: "Long-term thinking", desc: "We don't disappear after deployment. Transformation is an ongoing process." },
];

export default function WhyZyntraz() {
  return (
    <section className="section" id="why-zyntraz">
      <div className="container">
        <SectionHead
          eyebrow="Why ZYNTRAZ"
          heading={<>Built around your business. <span className="grad-text">Not around a template.</span></>}
          lede="Not a SaaS subscription you bend your business around. Not a freelancer. Not another AI agency bolting a chatbot onto your website. One team that understands your operation and engineers everything it needs — software, AI, data and automation, working together."
          center
        />
        <PillarGrid items={pillars} cols={3} />
      </div>
    </section>
  );
}
