"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Mail, MessageCircle, Phone, Send } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP } from "@/lib/contact";

const needs = [
  "Business analysis & strategy", "Website or e-commerce", "Custom software / business system", "AI agents & automation",
  "Data, BI & analytics", "IoT & connected systems", "Support & continuous improvement", "ZynRest",
  "ZynStay (early access)", "ZynEvents (early access)",
  "ZynCRM (early access)", "ZynIQ (early access)", "AI products (early access)", "Not sure yet",
];

const industryOptions = [
  "Hospitality", "Healthcare", "Education", "Retail & E-Commerce",
  "Corporate & Professional Services", "Real Estate", "Logistics", "Other",
];

const timelineOptions = ["As soon as possible", "Within 1–3 months", "Within 3–6 months", "6+ months", "Just exploring"];

const budgetOptions = ["Under $5k", "$5k – $15k", "$15k – $50k", "$50k+", "Need guidance on budget"];

type Blueprint = { business: string; industry: string; modules: string };

export default function Contact() {
  const [picked, setPicked] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  // Arriving from the home page's "Send us this blueprint": pre-fill the form with what they designed.
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const business = p.get("blueprint"), modules = p.get("modules");
    if (!business || !modules) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the query string only exists on the client
    setBlueprint({ business, industry: industryOptions.includes(p.get("industry") ?? "") ? p.get("industry")! : "", modules });
    setPicked((x) => (x.includes("Custom software / business system") ? x : [...x, "Custom software / business system"]));
  }, []);

  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name")}`,
      `Company: ${f.get("company") || "-"}`,
      `Email: ${f.get("email")}`,
      `Phone: ${f.get("phone") || "-"}`,
      `Industry: ${f.get("industry") || "-"}`,
      `Interested in: ${picked.join(", ") || "-"}`,
      `Estimated timeline: ${f.get("timeline") || "-"}`,
      `Budget range: ${f.get("budget") || "-"}`,
      "",
      String(f.get("message")),
    ].join("\n");
    const subject = `Transformation assessment request — ${f.get("company") || f.get("name")}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="section final" id="contact">
      <div className="final-glow" aria-hidden="true" />
      <div className="container">
        <h2 className="final-title" data-reveal>
          Ready to build your<br /><span className="grad-text">next digital system?</span>
        </h2>
        <p className="lede final-sub" data-reveal style={{ ["--d" as string]: ".1s" }}>
          No commitment. We&apos;ll map your current operations, show you where time and money leak out, and outline
          exactly what&apos;s possible.
        </p>
        <div className="final-ctas" data-reveal style={{ ["--d" as string]: ".2s" }}>
          <MagneticButton>
            <a href="#contact-form" className="btn btn-primary btn-lg">Start a transformation assessment <ArrowRight size={17} /></a>
          </MagneticButton>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
            <MessageCircle size={17} /> Chat on WhatsApp
          </a>
        </div>

        <div className="glass contact-card" data-reveal>
          <div>
            <span className="eyebrow">Your transformation assessment</span>
            <h3 className="h-md" style={{ marginTop: 18, fontSize: "clamp(26px, 2.6vw, 36px)" }}>What you get — before you pay anything.</h3>
            <ul className="audit-list">
              <li><Check size={18} /> A walkthrough of your current operations and where time and money leak out</li>
              <li><Check size={18} /> Honest advice on what to automate — and where AI agents will pay off first</li>
              <li><Check size={18} /> A clear roadmap, timeline and estimate for your system</li>
              <li><Check size={18} /> After that: a reply within 24 hours, then we stay with you through build, launch and beyond — we don&apos;t disappear</li>
            </ul>
            <div className="contact-list">
              <a className="contact-link" href={`mailto:${EMAIL}`}>
                <span className="ci"><Mail size={18} /></span>
                <div><small>Email</small><span>{EMAIL}</span></div>
              </a>
              <a className="contact-link" href={`tel:${PHONE_TEL}`}>
                <span className="ci"><Phone size={18} /></span>
                <div><small>Call</small><span>{PHONE_DISPLAY}</span></div>
              </a>
              <a className="contact-link" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                <span className="ci" style={{ color: "#25d366", background: "rgba(37,211,102,.12)" }}><MessageCircle size={18} /></span>
                <div><small>WhatsApp</small><span>{PHONE_DISPLAY}</span></div>
              </a>
            </div>
          </div>

          <div id="contact-form" style={{ scrollMarginTop: 100 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "60px 0", display: "grid", gap: 14, justifyItems: "center" }}>
                <svg className="success-check" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" /><path d="M20 33 l8 8 l16 -18" /></svg>
                <h3 className="h-md">Your email is ready to send.</h3>
                <p className="lede" style={{ fontSize: 15 }}>
                  We opened your email app with everything filled in — just hit send. If nothing opened, email us at{" "}
                  <a href={`mailto:${EMAIL}`} style={{ color: "var(--cyan)" }}>{EMAIL}</a>.
                </p>
                <button className="btn btn-ghost" onClick={() => setSent(false)}>Edit message</button>
              </div>
            ) : (
              <form key={blueprint ? "blueprint" : "blank"} className="form" onSubmit={onSubmit}>
                {blueprint && (
                  <p className="form-blueprint"><Check size={16} /> Your {blueprint.business.toLowerCase()} blueprint is attached: {blueprint.modules}.</p>
                )}
                <div className="form-row">
                  <label>Full name<input name="name" required autoComplete="name" placeholder="Your name" /></label>
                  <label>Company<input name="company" autoComplete="organization" placeholder="Business name" /></label>
                </div>
                <div className="form-row">
                  <label>Email address<input name="email" type="email" required autoComplete="email" placeholder="you@company.com" /></label>
                  <label>Phone<input name="phone" type="tel" autoComplete="tel" placeholder="+94 ..." /></label>
                </div>
                <label>Industry
                  <select name="industry" defaultValue={blueprint?.industry ?? ""}>
                    <option value="">Select your industry</option>
                    {industryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
                <div style={{ display: "grid", gap: 10 }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>What are you interested in?</span>
                  <div className="chips">
                    {needs.map((n) => (
                      <button type="button" key={n} className="chip" aria-pressed={picked.includes(n)} onClick={() => toggle(n)}>{n}</button>
                    ))}
                  </div>
                </div>
                <label>Tell us about your challenge
                  <textarea name="message" required rows={4} defaultValue={blueprint ? `I'd like a system for my ${blueprint.business.toLowerCase()} covering: ${blueprint.modules}.

Right now we…` : undefined} placeholder="e.g. We manage stock in spreadsheets and orders over WhatsApp…" />
                </label>
                <div className="form-row">
                  <label>Estimated timeline
                    <select name="timeline" defaultValue="">
                      <option value="">No fixed timeline</option>
                      {timelineOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </label>
                  <label>Budget range
                    <select name="budget" defaultValue="">
                      <option value="">Not decided yet</option>
                      {budgetOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </label>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">Request my transformation assessment <Send size={16} /></button>
                <p className="form-note">No spam, no obligation.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
