import Link from "next/link";
import { ChevronRight, Code2, Brain, Boxes } from "lucide-react";
import { SectionHead } from "@/components/sections/Blocks";
import WhatPipeline from "@/components/home/WhatPipeline";

// The two framing sections between the problem and the proof: what ZINTRAZ does, and the three
// engineering capabilities it does it with.

const capabilities = [
  {
    icon: Code2,
    title: "Software & Digital Systems",
    desc: "Custom applications, business platforms, web systems, portals, workflows and digital infrastructure.",
    href: "/solutions#software",
    cta: "Explore software solutions",
  },
  {
    icon: Brain,
    title: "AI & Intelligence",
    desc: "AI integration, intelligent automation, AI agents, document intelligence, analytics and decision-support systems.",
    href: "/solutions/ai-intelligence",
    cta: "Explore AI solutions",
  },
  {
    icon: Boxes,
    title: "IoT & AIoT",
    desc: "Connected devices, monitoring, automation and intelligent physical-world systems.",
    href: "/solutions#iot",
    cta: "Explore IoT solutions",
  },
];

export default function HomeOverview() {
  return (
    <>
      <section className="section" id="what-we-do">
        <div className="container">
          <SectionHead
            eyebrow="What ZINTRAZ does"
            heading={<>We don&apos;t just build software. <span className="grad-text">We engineer transformation.</span></>}
            lede="Business analysis, strategy, software, AI, data and connected technology — one team, from the first conversation to long-term optimisation."
            center
          />
          <WhatPipeline />
        </div>
      </section>

      <section className="section alt spot" id="capabilities">
        <div className="container">
          <SectionHead
            eyebrow="Our capabilities"
            heading={<>One transformation partner. <span className="grad-text">Multiple engineering capabilities.</span></>}
            center
          />
          <div className="promise-grid cols-3">
            {capabilities.map(({ icon: Icon, title, desc, href, cta }, i) => (
              <div key={title} className="glass spot promise" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <Icon className="promise-ico" size={26} />
                <h3>{title}</h3>
                <p>{desc}</p>
                <Link href={href} className="link-chev" style={{ fontSize: 14 }}>{cta} <ChevronRight size={16} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
