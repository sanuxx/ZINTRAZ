const row1 = ["React", "Next.js", "Tailwind CSS", "Node.js", "Python", "PHP", "Laravel", "TypeScript", "Flutter", "React Native", "REST & GraphQL APIs"];
const row2 = ["AI Agents", "LLMs", "Claude & OpenAI APIs", "RAG Pipelines", "Vector Databases", "TensorFlow", "PyTorch", "OpenCV", "Computer Vision", "Power BI", "Pandas"];
const row3 = ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase", "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "GitHub Actions", "MQTT", "ESP32", "Raspberry Pi", "Shopify", "WooCommerce"];

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
      <Row items={row3} />
      <p className="sr-only">
        Web and mobile: React, Next.js, Tailwind CSS, TypeScript, Flutter, React Native. Backend: Node.js, Python, PHP, Laravel, REST and GraphQL APIs.
        AI and data: AI agents, LLMs, Claude and OpenAI APIs, RAG pipelines, vector databases, TensorFlow, PyTorch, OpenCV, computer vision, Power BI, Pandas.
        Databases: PostgreSQL, MySQL, MongoDB, Redis, Firebase. Cloud: AWS, Azure, Google Cloud, Docker, Kubernetes, GitHub Actions.
        IoT: MQTT, ESP32, Raspberry Pi. E-commerce: Shopify, WooCommerce.
      </p>
    </section>
  );
}
