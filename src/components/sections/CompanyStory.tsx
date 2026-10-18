import { CalendarDays, Code2, Compass, MapPin, Rocket, Search, Sparkles } from "lucide-react";

const facts = [
  { icon: CalendarDays, title: "Founded January 2026", desc: "A new company, built from day one around business transformation — not a web shop that added AI later." },
  { icon: MapPin, title: "Based in Sri Lanka", desc: "Working with businesses in Sri Lanka and beyond, in person and remotely." },
  { icon: Sparkles, title: "Innovate • Dominate • Elevate", desc: "Innovate how you operate, dominate your market with better systems, and elevate the way your team works." },
];

const steps = [
  { icon: Search, title: "Understand", tag: "Step 1", desc: "We start with a consultation and map how your business actually runs: the people, the processes, the systems and where time is lost." },
  { icon: Compass, title: "Design", tag: "Step 2", desc: "We turn that into a plan: what to build, what to connect and what to automate, in the order that pays back first." },
  { icon: Code2, title: "Engineer", tag: "Step 3", desc: "We build and integrate the software, AI and automation, showing you working pieces as we go, not only at the end." },
  { icon: Rocket, title: "Launch & improve", tag: "Step 4", desc: "We go live alongside your team, train the people using it, then keep measuring and improving after launch." },
];

export default function CompanyStory() {
  return (
    <>
      <section className="section" id="story">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow" data-reveal>Our story</span>
            <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
              A new company, <span className="grad-text">built for how businesses really work.</span>
            </h2>
            <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>
              Most businesses are sold software before anyone understands how they operate. Zyntraz was founded to do it the
              other way round: understand the business first, then design, build and keep improving the systems it needs.
            </p>
          </div>
          <div className="promise-grid cols-3">
            {facts.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="glass spot promise" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <Icon className="promise-ico" size={26} />
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" id="how-we-work-with-you">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow" data-reveal>How we work with you</span>
            <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
              One partner, <span className="grad-text">start to finish.</span>
            </h2>
            <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>
              Every engagement follows the same path, from understanding how your business runs to improving the system after it goes live.
            </p>
          </div>
          <div className="promise-grid">
            {steps.map(({ icon: Icon, title, tag, desc }, i) => (
              <div key={title} className="glass spot promise" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <Icon className="promise-ico" size={26} />
                <span className="eyebrow">{tag}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
