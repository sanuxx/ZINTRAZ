import Link from "next/link";
import { Bot, ChevronRight, ClipboardPaste, Copy, FileSpreadsheet, Keyboard, MessageCircle, Repeat, Send } from "lucide-react";

// Bento layout: the growth-gap chart carries the headline's idea, and each pain card shows its symptom in a small visual.
export default function HomePain() {
  return (
    <section className="section alt hpain">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow pain" data-reveal>Sound familiar?</p>
          <h2 className="h-xl" data-reveal style={{ ["--d" as string]: ".08s" }}>
            Your business is growing.<br /><span className="dim">Your systems aren&apos;t.</span>
          </h2>
        </div>

        <div className="hp-bento">
          <article className="hp-card hp-chart" data-reveal>
            <div className="hp-card-head">
              <span className="hp-tag">The growth gap</span>
              <h3>Every new customer adds load to systems that never scaled with you.</h3>
            </div>
            <svg className="hp-graph" viewBox="0 0 600 250" role="img" aria-label="Business growth curve rising steeply while systems capacity stays nearly flat, leaving a widening gap">
              <defs>
                <linearGradient id="hpGrow" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="var(--blue)" />
                  <stop offset="1" stopColor="var(--violet)" />
                </linearGradient>
                <pattern id="hpHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="var(--pain)" strokeWidth="2" strokeOpacity=".22" />
                </pattern>
              </defs>
              {[50, 100, 150, 200].map((y) => <line key={y} className="hp-grid" x1="0" x2="600" y1={y} y2={y} />)}
              <path className="hp-gap" d="M0,228 C150,218 260,170 360,112 S520,34 600,20 L600,200 L390,200 L390,212 L170,212 L170,230 L0,230 Z" fill="url(#hpHatch)" />
              <path className="hp-line hp-sys" pathLength={1} d="M0,230 L170,230 L170,212 L390,212 L390,200 L600,200" />
              <path className="hp-line hp-biz" pathLength={1} d="M0,228 C150,218 260,170 360,112 S520,34 600,20" stroke="url(#hpGrow)" />
              <circle className="hp-dot" cx="600" cy="20" r="6" />
            </svg>
            <div className="hp-legend">
              <span><i className="hp-key biz" />Your business</span>
              <span><i className="hp-key sys" />Your systems</span>
              <span className="hp-legend-gap"><i className="hp-key gap" />The gap you pay for</span>
            </div>
          </article>

          <article className="hp-card hp-sheets" data-reveal style={{ ["--d" as string]: ".1s" }}>
            <div className="hp-visual" aria-hidden="true">
              {[
                { name: "stock_final.xlsx", val: "412" },
                { name: "stock_final_v2.xlsx", val: "388" },
                { name: "stock_REAL_final.xlsx", val: "455" },
              ].map((f, i) => (
                <div key={f.name} className="hp-file" style={{ ["--i" as string]: i }}>
                  <FileSpreadsheet size={16} /><span>{f.name}</span><b>{f.val}</b>
                </div>
              ))}
              <div className="hp-wa"><MessageCircle size={14} /> &ldquo;Which one is right??&rdquo;</div>
            </div>
            <h3>Running on spreadsheets and WhatsApp.</h3>
            <p>Nobody has one version of the truth, so mistakes are guaranteed.</p>
          </article>

          <article className="hp-card hp-robot" data-reveal style={{ ["--d" as string]: ".05s" }}>
            <div className="hp-visual" aria-hidden="true">
              <div className="hp-loop">
                <span><Copy size={15} />Copy</span>
                <span><ClipboardPaste size={15} />Paste</span>
                <span><Keyboard size={15} />Re-type</span>
                <span><Send size={15} />Chase</span>
              </div>
              <div className="hp-repeat"><Repeat size={14} /> Repeat. Every day.</div>
            </div>
            <h3>Your team does robot work.</h3>
            <p>Hours every week lost to copy-paste, re-typing and chasing approvals.</p>
          </article>

          <article className="hp-card hp-ai" data-reveal style={{ ["--d" as string]: ".12s" }}>
            <div className="hp-visual" aria-hidden="true">
              <div className="hp-msg me">What&apos;s our overdue invoice total?</div>
              <div className="hp-msg bot"><Bot size={15} />Sorry, I don&apos;t have access to your systems.</div>
            </div>
            <h3>AI that never leaves the demo.</h3>
            <p>Chatbots that don&apos;t know your business and can&apos;t act in your systems.</p>
          </article>

          <article className="hp-card hp-cta" data-reveal style={{ ["--d" as string]: ".19s" }}>
            <h3>The gap gets wider every month you wait.</h3>
            <p>We engineer the systems your next stage of growth runs on.</p>
            <div className="hp-cta-links">
              <Link href="/transformation" className="link-chev">See how we fix it <ChevronRight size={18} /></Link>
              <Link href="/transformation#calculator" className="link-chev">Calculate your hidden cost <ChevronRight size={18} /></Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
