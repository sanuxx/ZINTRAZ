import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "How is this different from buying off-the-shelf software?",
    a: "Off-the-shelf tools make you change how you work to fit the software. We do the opposite — we engineer the system around your existing workflows, people and goals, and connect it to the tools you already rely on.",
  },
  {
    q: "What's the difference between a chatbot and an AI agent?",
    a: "A chatbot answers questions. An AI agent gets work done: it understands the request, plans the steps, and uses your systems — CRM, inventory, accounts, email, WhatsApp — to complete the task, asking a human for approval whenever the stakes are high.",
  },
  {
    q: "Is it safe to let AI act on our business data?",
    a: "We design every agent with guardrails: it only accesses the systems and data you allow, high-impact actions require human approval, and every decision is logged so you can review exactly what happened and why. We start with low-risk, high-value tasks and expand from there.",
  },
  {
    q: "Can you work with the tools and data we already have?",
    a: "Yes. We integrate with your existing POS, accounting, booking and communication tools through APIs, and migrate data out of spreadsheets so nothing gets lost in the move.",
  },
  {
    q: "How long does it take and what does it cost?",
    a: "It depends on scope. After a transformation assessment we give you a clear roadmap, timeline and estimate before any commitment. Restaurants can start on ZynRest and customise from there to go live faster; ZynStay and ZynCRM are coming soon.",
  },
  {
    q: "We're not technical. Will our team be able to use it?",
    a: "That's the point. We design friction-less interfaces for the people who use them every day, and we train your team during launch so adoption is smooth.",
  },
  {
    q: "Will we see progress along the way?",
    a: "Every week. We work in focused sprints with weekly demos — real progress, continuously, with no black-box development and no surprises at the end.",
  },
  {
    q: "What happens after launch?",
    a: "We don't disappear. We monitor, support, optimize and keep evolving your system as your business grows. Continuous operations are part of what we offer, not an afterthought.",
  },
];

export default function FAQ() {
  return (
    <section className="section" id="faq">
      <div className="container faq-wrap">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow" data-reveal>Questions</span>
          <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".1s" }}>Before you ask.</h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".2s" }}>
            Straight answers to what business owners ask us most. Something else on your mind? Just ask.
          </p>
          <div data-reveal style={{ ["--d" as string]: ".3s" }}>
            <a href="#contact" className="btn btn-ghost">Start a transformation assessment <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="faq-list" data-reveal>
          {faqs.map(({ q, a }, i) => (
            <details key={q} className="faq-item" open={i === 0}>
              <summary>{q}<span className="faq-plus" aria-hidden="true" /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
