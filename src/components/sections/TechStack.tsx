const row1 = ["React", "Next.js", "Tailwind CSS", "Node.js", "Python", "PHP", "TypeScript", "PostgreSQL", "REST & GraphQL APIs"];
const row2 = ["AI Agents", "LLMs", "RAG Pipelines", "Vector Databases", "TensorFlow", "PyTorch", "AWS", "Docker", "Kubernetes"];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="marquee static big" aria-hidden="true" style={{ borderTop: 0, padding: "6px 0" }}>
      <div className={`marquee-track${reverse ? " rev" : ""}`}>
        {[...items, ...items].map((t, i) => <span key={i} className="marquee-item">{t}</span>)}
      </div>
    </div>
  );
}

export default function TechStack() {
  return (
    <section className="tech" id="tech">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow" data-reveal>Engineering capabilities</span>
          <p className="lede" data-reveal>The toolkit underneath every system we build — not the pitch, just what it&apos;s built on.</p>
        </div>
      </div>
      <Row items={row1} />
      <Row items={row2} reverse />
      <p className="sr-only">Frontend: React, Next.js, Tailwind CSS. Backend: Node.js, Python, PHP. AI: AI agents, LLMs, RAG pipelines, vector databases, TensorFlow, PyTorch. Cloud: AWS, Docker, Kubernetes.</p>
    </section>
  );
}
