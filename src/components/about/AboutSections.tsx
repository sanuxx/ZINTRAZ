import Link from "next/link";
import { ArrowRight, Compass, Eye, Handshake, ShieldCheck } from "lucide-react";
import NightHero from "@/components/hero/NightHero";

/**
 * /about, told as an editorial film in chapters: deep-navy "night" chapters alternate with light ones,
 * oversized type with a colour accent on key words (<em>, in the site's own fonts), hairline rules
 * instead of card grids. Motion is deliberately quiet: the site's data-reveal fades, a slow light sweep in the
 * hero and hover states — no pinned scenes or scroll-scrubbed 3D. Styles under "About page" in
 * globals.css. Sections carry data-keep so TextFold leaves their short copy open.
 */

export function AboutHero() {
  return (
    <NightHero
      eyebrow="About ZINTRAZ"
      title={<>Engineering the next way <span className="grad-text">businesses operate.</span></>}
      lede="A business transformation engineering company, helping organizations turn operational challenges into technology-driven opportunities."
      primary={{ label: "Start a transformation assessment", href: "/contact" }}
      secondary={{ label: "Our story", href: "#story" }}
      meta={[
        { label: "Founded", value: "January 2026" },
        { label: "Based in", value: "Sri Lanka" },
        { label: "Practice", value: "Business transformation engineering" },
        { label: "Motto", value: "Innovate · Dominate · Elevate" },
      ]}
    />
  );
}

export function AboutManifesto() {
  return (
    <section className="ab-chapter ab-day" id="who-we-are" data-keep>
      <div className="container">
        <p className="ab-label" data-reveal><span>01</span>Who we are</p>
        <h2 className="ab-contrast">
          <span className="ab-dim" data-reveal>Technology companies often start with technology.</span>
          <span className="ab-dim" data-reveal style={{ ["--d" as string]: ".08s" }}>Consultants often stop at strategy.</span>
          <span data-reveal style={{ ["--d" as string]: ".16s" }}>ZINTRAZ connects <em>both.</em></span>
        </h2>
        <div className="ab-cols">
          <p data-reveal>
            We understand the business problem, define the transformation strategy and engineer the technology required
            to execute it, combining business analysis, software engineering, artificial intelligence, data and
            connected technologies.
          </p>
          <p data-reveal style={{ ["--d" as string]: ".1s" }}>
            Our role isn&apos;t simply to deliver a system. Our role is to help build{" "}
            <strong>a better way for the business to operate.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

const facts = [
  { label: "Founded", title: "January 2026", desc: "A new company, built from day one around business transformation — not a web shop that added AI later." },
  { label: "Based in", title: "Sri Lanka", desc: "Working with businesses in Sri Lanka and beyond, in person and remotely." },
  { label: "Motto", title: "Innovate · Dominate · Elevate", desc: "Innovate how you operate, dominate your market with better systems, and elevate the way your team works." },
];

export function AboutStory() {
  return (
    <section className="ab-chapter ab-night ab-story" id="story" data-keep>
      <span className="ab-year" aria-hidden="true">2026</span>
      <div className="container">
        <p className="ab-label" data-reveal><span>02</span>Our story</p>
        <div className="ab-story-grid">
          <h2 className="ab-h" data-reveal>A new company, built for how businesses <em>really work.</em></h2>
          <p className="ab-story-text" data-reveal style={{ ["--d" as string]: ".1s" }}>
            Most businesses are sold software before anyone understands how they operate. ZINTRAZ was founded to do it
            the other way round: understand the business first, then design, build and keep improving the systems it needs.
          </p>
        </div>
        <dl className="ab-facts">
          {facts.map((f, i) => (
            <div key={f.label} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <dt>{f.label}</dt>
              <dd><b>{f.title}</b><span>{f.desc}</span></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const steps = [
  { title: "Understand", desc: "We start with a consultation and map how your business actually runs: the people, the processes, the systems and where time is lost." },
  { title: "Design", desc: "We turn that into a plan: what to build, what to connect and what to automate, in the order that pays back first." },
  { title: "Engineer", desc: "We build and integrate the software, AI and automation, showing you working pieces as we go, not only at the end." },
  { title: "Launch & improve", desc: "We go live alongside your team, train the people using it, then keep measuring and improving after launch." },
];

export function AboutMethod() {
  return (
    <section className="ab-chapter ab-day" id="how-we-work-with-you" data-keep>
      <div className="container">
        <p className="ab-label" data-reveal><span>03</span>How we work with you</p>
        <div className="ab-head-row">
          <h2 className="ab-h" data-reveal>One partner, <em>start to finish.</em></h2>
          <p className="ab-aside" data-reveal style={{ ["--d" as string]: ".1s" }}>
            Every engagement follows the same path, from understanding how your business runs to improving the system
            after it goes live.
          </p>
        </div>
        <ol className="ab-path">
          {steps.map((s, i) => (
            <li key={s.title} data-reveal style={{ ["--d" as string]: `${i * 0.1}s` }}>
              <span className="ab-path-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>
        <Link href="/how-we-work" className="ab-link dark" data-reveal>See the full process <ArrowRight size={16} /></Link>
      </div>
    </section>
  );
}

const promises = [
  { icon: Eye, title: "No black-box development", desc: "Focused sprints with weekly demos. You see real progress continuously — no surprises." },
  { icon: Compass, title: "Aligned from day one", desc: "Architecture and UX designed in parallel, so technical decisions always serve your people and goals." },
  { icon: ShieldCheck, title: "Secure & reliable", desc: "CI/CD pipelines, monitoring and security hardening are standard — not an upsell." },
  { icon: Handshake, title: "Long-term partnership", desc: "Post-launch optimization, feature expansion and scaling as your business grows." },
];

export function AboutPhilosophy() {
  return (
    <section className="ab-chapter ab-night ab-philo" id="philosophy" data-keep>
      <div className="container">
        <p className="ab-label" data-reveal><span>04</span>Our philosophy</p>
        <blockquote className="ab-quote" data-reveal>
          <p><em>Not generic software.</em> We don&apos;t sell templates. We engineer systems around how your business actually works.</p>
        </blockquote>
        <p className="ab-quote-sub" data-reveal style={{ ["--d" as string]: ".1s" }}>
          Your workflows, your people, your goals. Every business operates differently — so every system we build does too.
        </p>
        <ul className="ab-promises">
          {promises.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <Icon size={20} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AboutVision() {
  return (
    <section className="ab-chapter ab-day ab-vision" id="vision-mission" data-keep>
      <div className="container">
        <p className="ab-label" data-reveal><span>05</span>Vision &amp; mission</p>
        <div className="ab-vm">
          <article data-reveal>
            <span>Vision</span>
            <h2>A world where every business can <em>operate intelligently.</em></h2>
            <p>
              We envision a future where businesses of every size can use software, AI, data and connected technologies
              to operate with the intelligence and agility traditionally available only to large enterprises.
            </p>
          </article>
          <article data-reveal style={{ ["--d" as string]: ".12s" }}>
            <span>Mission</span>
            <h2>Make transformation <em>achievable.</em></h2>
            <p>
              Our mission is to engineer practical technology that helps businesses eliminate inefficiency, unlock
              intelligence and create new opportunities for growth.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

const beliefs = [
  { title: "Business understanding before technology", desc: "The right technology starts with understanding the problem." },
  { title: "Simplicity beats unnecessary complexity", desc: "Powerful systems should still feel understandable and usable." },
  { title: "Data should drive better decisions", desc: "Information becomes valuable when it improves action." },
  { title: "AI should solve real problems", desc: "We use AI where it creates measurable operational value — not simply because it is available." },
  { title: "Transformation never really ends", desc: "A successful system should evolve with the organization." },
];
const ROMAN = ["I", "II", "III", "IV", "V"];

export function AboutBeliefs() {
  return (
    <section className="ab-chapter ab-day ab-beliefs" id="beliefs" data-keep>
      <div className="container">
        <p className="ab-label" data-reveal><span>06</span>What we believe</p>
        <div className="ab-head-row">
          <h2 className="ab-h" data-reveal>Technology should create capability, <em>not complexity.</em></h2>
          <p className="ab-aside" data-reveal style={{ ["--d" as string]: ".1s" }}>
            Every system we build should make something better. A process simpler. A decision clearer. A team more
            productive. Data more useful. Operations more connected.
          </p>
        </div>
        <ol className="ab-belief-list">
          {beliefs.map((b, i) => (
            <li key={b.title} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
              <span className="ab-roman">{ROMAN[i]}</span>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
