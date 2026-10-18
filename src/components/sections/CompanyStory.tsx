import { Bot, BrainCircuit, CalendarDays, Hotel, MapPin, Sparkles, UtensilsCrossed } from "lucide-react";

const facts = [
  { icon: CalendarDays, title: "Founded January 2026", desc: "A new company, built from day one around business transformation — not a web shop that added AI later." },
  { icon: MapPin, title: "Based in Sri Lanka", desc: "Working with businesses in Sri Lanka and beyond, in person and remotely." },
  { icon: Sparkles, title: "Innovate • Dominate • Elevate", desc: "Innovate how you operate, dominate your market with better systems, and elevate the way your team works." },
];

const building = [
  { icon: Hotel, title: "Royal Hotel", tag: "In progress", desc: "A connected hospitality ecosystem — reservations, events, restaurant, inventory and support working as one system." },
  { icon: UtensilsCrossed, title: "ZynRest", tag: "Live", desc: "Our restaurant platform: POS, kitchen display, inventory and menus in one place." },
  { icon: BrainCircuit, title: "Decision Intelligence", tag: "In development", desc: "Ask questions, compare options and run simulations, grounded in a company's own documents and data." },
  { icon: Bot, title: "Our own AI agent team", tag: "How we build", desc: "Business analysis, engineering, QA and security agents work alongside our people, with every output reviewed by a human." },
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

      <section className="section alt" id="now-building">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow" data-reveal>What we&apos;re building now</span>
            <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
              Early days. <span className="grad-text">Real work.</span>
            </h2>
            <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>
              We&apos;d rather show you what we&apos;re actually building than a wall of logos.
            </p>
          </div>
          <div className="promise-grid">
            {building.map(({ icon: Icon, title, tag, desc }, i) => (
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
