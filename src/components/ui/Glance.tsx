/**
 * "At a glance": a strip of three or four big facts under a page's hero, so a visitor who reads nothing
 * else still leaves with the essentials. Styles: "At a glance" in globals.css.
 */
export default function Glance({ items }: { items: { value: string; label: string }[] }) {
  return (
    <section className="glance" aria-label="At a glance">
      <dl className="container glance-row" style={{ ["--n" as string]: items.length }}>
        {items.map((g, i) => (
          <div key={g.label} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}><dt>{g.value}</dt><dd>{g.label}</dd></div>
        ))}
      </dl>
    </section>
  );
}
