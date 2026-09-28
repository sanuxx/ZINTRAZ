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

        <div className="hplat-cols">
          {groups.map(({ name, icon: Icon, ids }, i) => (
            <div key={name} className="hplat-col" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <h3><Icon size={20} /> {name}</h3>
              <ul>
                {ids.map((id) => {
                  const p = products.find((x) => x.id === id)!;
                  return (
                    <li key={id} style={{ ["--c" as string]: p.accent }}>
                      <Link href={`/products#${p.id}`}><b>{p.name}</b><small>{p.category}</small></Link>
                      <em className={`pstatus pstatus-${p.status}`}>{statusLabel[p.status]}</em>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="hplat-col" data-reveal style={{ ["--d" as string]: ".16s" }}>
            <h3><Boxes size={20} /> Custom platforms</h3>
            <p className="hplat-custom">Business systems, portals, e-commerce, dashboards and workflow platforms — built from scratch when no ready-made product fits your operation.</p>
          </div>
        </div>

        <div className="cta-row center" data-reveal>
          <Link href="/products" className="link-chev">Explore the platforms <ChevronRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
