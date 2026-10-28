import type { Metadata } from "next";
import SystemBuilder from "@/components/builder/SystemBuilder";

export const metadata: Metadata = {
  title: "Build your system — design your own business system",
  description:
    "Drag and drop the modules your business needs, connect them, design your workflows, experience the system you designed and send the blueprint to ZINTRAZ for review.",
};

export default function SystemBuilderPage() {
  return (
    <div className="page sb-page">
      <section className="sb-hero">
        <div className="sb-hero-in">
          <p className="eyebrow">System builder</p>
          <h1 className="h-xl">Design the system <span className="grad-text">your business runs on.</span></h1>
          <p className="lede">
            Drag in the modules you need, connect them, automate the work between them, then step inside the system you
            designed. When it looks right, send the blueprint to us. We review it and come back with a plan.
          </p>
        </div>
      </section>
      <section className="sb-wrap" aria-label="System builder" data-keep>
        <SystemBuilder />
      </section>
    </div>
  );
}
