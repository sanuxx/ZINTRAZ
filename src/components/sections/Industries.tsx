import { Hotel, ShoppingBag, GraduationCap, Building2, HeartPulse, Truck } from "lucide-react";

const industries = [
  {
    name: "Hospitality", icon: Hotel,
    problems: ["Booking fragmentation across channels", "Housekeeping & maintenance chaos", "Restaurant operations disconnected from the front desk", "No live view of revenue"],
    fit: "ZynRest today, the ZynStay ecosystem coming soon",
  },
  {
    name: "Retail & E-Commerce", icon: ShoppingBag,
    problems: ["Inventory out of sync across branches", "Orders re-typed between systems", "No single view of sales", "Leads and customers going cold"],
    fit: "Custom retail systems (ZynCRM coming soon)",
  },
  {
    name: "Education & EdTech", icon: GraduationCap,
    problems: ["Enrolment and fees handled on paper", "Attendance tracked by hand", "Parents with no visibility into progress", "Timetabling done manually every term"],
    fit: "Custom LMS & student systems",
  },
  {
    name: "Real Estate", icon: Building2,
    problems: ["Leads lost between agents", "Property data scattered across spreadsheets", "No visibility into deal pipeline", "Manual, error-prone reporting"],
    fit: "Custom property systems (ZynCRM coming soon)",
  },
  {
    name: "Healthcare", icon: HeartPulse,
    problems: ["Patient records fragmented across paper and tools", "No-shows with no reminder system", "Pharmacy stock tracked manually", "Billing disconnected from insurance"],
    fit: "Custom patient & clinic systems",
  },
  {
    name: "Logistics", icon: Truck,
    problems: ["No live tracking for customers", "Manual dispatch and routing", "Stock and fleet data in separate tools", "Proof of delivery lost on paper"],
    fit: "Custom fleet & tracking systems",
  },
];

export default function Industries() {
  return (
    <section className="section alt" id="industries">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow" data-reveal>Industries</span>
          <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".1s" }}>Built for the way your industry works.</h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".2s" }}>
            Every industry has its own problems. Here&apos;s what we typically see — and the systems that fix it.
          </p>
        </div>
        <div className="ind-grid">
          {industries.map(({ name, icon: Icon, problems, fit }, i) => (
            <article key={name} className="glass spot ind" data-reveal style={{ ["--d" as string]: `${(i % 3) * 0.08}s` }}>
              <div className="ind-head">
                <span className="ind-ico"><Icon size={22} /></span>
                <h3>{name}</h3>
              </div>
              <ul>{problems.map((s) => <li key={s}>{s}</li>)}</ul>
              <p className="ind-fit"><b>Fit:</b> {fit}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
