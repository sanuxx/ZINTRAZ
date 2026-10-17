"use client";

import { FlaskConical, Lock, Rocket, ScrollText, Search, ShieldCheck, Target, UserCheck } from "lucide-react";


const trust = [
  { icon: UserCheck, title: "Human-in-the-loop", desc: "Agents ask for approval before high-stakes actions. You set the rules." },
  { icon: Lock, title: "Access control built in", desc: "Agents only see and touch the systems and data you allow." },
  { icon: ScrollText, title: "Full audit trail", desc: "Every decision and action is logged, explainable and reviewable." },
  { icon: Target, title: "Measured by outcomes", desc: "We track hours saved, response times and revenue impact — not hype." },
];

export function AITrust() {
  return (
    <div className="ai-trust">
      {trust.map(({ icon: Icon, title, desc }, i) => (
        <div key={title} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
          <Icon size={26} />
          <h4>{title}</h4>
          <p>{desc}</p>
        </div>
      ))}
    </div>
  );
}

const deploy = [
  { icon: Search, title: "Find the use cases", desc: "We map your workflows and pinpoint where AI saves the most time and money first." },
  { icon: FlaskConical, title: "Prototype fast", desc: "A working agent on your real data, so you see value before you commit to scale." },
  { icon: ShieldCheck, title: "Deploy with guardrails", desc: "Approvals, access control and audit logs configured for how your business runs." },
  { icon: Rocket, title: "Measure & expand", desc: "Track the results, tune the agent, and roll AI out to the next team." },
];

export function AIDeploy() {
  return (
    <ol className="deploy">
      {deploy.map(({ icon: Icon, title, desc }, i) => (
        <li key={title} data-reveal style={{ ["--d" as string]: `${i * 0.1}s` }}>
          <span className="deploy-num">{String(i + 1).padStart(2, "0")}</span>
          <Icon size={24} className="deploy-ico" />
          <h3>{title}</h3>
          <p>{desc}</p>
        </li>
      ))}
    </ol>
  );
}
