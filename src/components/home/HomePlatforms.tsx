import Link from "next/link";
import { Boxes, ChevronRight, Hotel, Users } from "lucide-react";
import { products, statusLabel } from "@/components/sections/Products";

const groups = [
  { name: "Hospitality", icon: Hotel, ids: ["zynstay", "zynrest"] },
  { name: "Customer operations", icon: Users, ids: ["zyncrm", "zyndesk"] },
];

export default function HomePlatforms() {
  return (
    <section className="section alt hplat" id="platforms">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow" data-reveal>Zyntraz platforms</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
            Ready-made systems. <span className="grad-text">Custom where needed.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".16s" }}>
            Start on a Zyntraz platform, customise it where your business needs it — or build from scratch.
          </p>
        </div>

        <div className="ind-grid">
          {groups.map(({ name, icon: Icon, ids }, i) => (
            <article key={name} className="glass spot ind" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <div className="ind-head">
                <span className="ind-ico"><Icon size={22} /></span>
                <h3>{name}</h3>
              </div>
              <ul>
                {ids.map((id) => {
                  const p = products.find((x) => x.id === id)!;
                  return (
                    <li key={id}>
                      <Link href={`/products#${p.id}`}><b>{p.name}</b><small>{p.category}</small></Link>
                      <em className={`pstatus pstatus-${p.status}`}>{statusLabel[p.status]}</em>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
          <article className="glass spot ind" data-reveal style={{ ["--d" as string]: ".16s" }}>
            <div className="ind-head">
              <span className="ind-ico"><Boxes size={22} /></span>
              <h3>Custom platforms</h3>
            </div>
            <ul>
              <li>Business systems &amp; portals</li>
              <li>E-commerce &amp; dashboards</li>
              <li>Workflow &amp; analytics platforms</li>
            </ul>
            <p className="ind-fit"><b>Fit:</b> when no ready-made product matches your operation</p>
          </article>
        </div>

        <div className="cta-row center" data-reveal>
          <Link href="/products" className="link-chev">Explore the platforms <ChevronRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
