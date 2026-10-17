import { solutions } from "@/lib/solutions";

// How the capabilities work together, with Software and AI as the core: IoT is a narrow, quieter
// column that feeds the system; Software and AI are the wide, highlighted ones. General statements
// (not tied to an industry), and one outcome line beneath.
const roles = [
  { id: "iot", verb: "Feeds the system", core: false, text: "Sensors, devices and everyday transactions capture what's happening." },
  { id: "software", verb: "Runs", core: true, text: "Orders, operations and workflows run in one connected system." },
  { id: "ai", verb: "Thinks", core: true, text: "Forecasts demand, flags risks and acts within your rules." },
] as const;

export default function BetterTogether() {
  return (
    <section className="section bt" id="together">
      <div className="container">
        {/* data-keep: TextFold must not collapse the lede here. */}
        <div className="bt-head" data-keep>
          <div className="section-head">
            <h2 className="h-xl" data-reveal>
              Software that <span className="grad-text">runs</span> your business. AI that <span className="grad-text">makes it smarter.</span>
            </h2>
            <p className="lede" data-reveal style={{ ["--d" as string]: ".1s" }}>
              Connected devices capture what&apos;s happening; our software and AI turn it into decisions and results.
            </p>
          </div>
        </div>

        <div data-reveal style={{ ["--d" as string]: ".2s" }}>
          <div className="bt-panel" data-keep>
            <ol className="bt-flow">
              {roles.map((r, i) => {
                const s = solutions.find((x) => x.id === r.id)!;
                return (
                  <li key={r.id} className={`bt-step${r.core ? " is-core" : ""}`}>
                    <div className="bt-step-top">
                      <span className="bt-verb">{r.verb}</span>
                      {r.core && <span className="bt-core">Core</span>}
                    </div>
                    <p className="bt-cap"><s.icon size={16} /> {s.name}</p>
                    <p className="bt-example">{r.text}</p>
                    {i < roles.length - 1 && <span className="bt-link" aria-hidden="true"><i /></span>}
                  </li>
                );
              })}
            </ol>
            <p className="bt-outcome">
              <span>Result</span> Less manual work, faster decisions and operations that keep improving.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
