"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import ServiceStory from "@/components/services/ServiceStory";
import { services } from "@/lib/services";

/**
 * The portfolio as a cinematic scroll scene. A dark stage pins under the header while the seven services
 * play through it like scenes: the light on the stage shifts to each service's colour, a huge outlined
 * chapter number drifts behind the copy (parallax within the scene), the copy rises out of a soft blur in
 * a staggered order, and the service's before / we build / after story slides in on a glowing glass screen. A film slate
 * ("Scene 02 / 07"), a timeline of all seven along the bottom (clickable), grain and letterbox shading
 * complete the frame.
 *
 * Mechanics: the track is one viewport tall per scene; the active scene and the in-scene progress (--sp)
 * come from the scroll position (state changes only when the scene changes). Anchors (#<slug>, used by the
 * nav, footer and hero tiles) sit at the start of each scene's stretch of the track. Below 900px there is
 * no pinning: the scenes stack as dark cards.
 */
const N = services.length;

export default function ServiceExplorer() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current, st = stage.current;
    if (!el || !st) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const offset = -el.getBoundingClientRect().top;
      const pos = Math.min(Math.max(offset / vh, 0), N - 0.001);
      const idx = Math.min(N - 1, Math.max(0, Math.floor(pos + 0.5)));
      st.style.setProperty("--sp", (pos - Math.floor(pos)).toFixed(3));
      st.style.setProperty("--tp", (pos / (N - 1)).toFixed(3));
      setActive((a) => (a === idx ? a : idx));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    queueMicrotask(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const cur = services[active];

  return (
    <section className="sx3" id="portfolio">
      <div className="container sx3-intro" data-keep>
        <p className="eyebrow" data-reveal>The portfolio</p>
        <h2 className="sx3-h" data-reveal style={{ ["--d" as string]: ".06s" }}>
          Seven services. <span>One engineering team.</span>
        </h2>
        <p className="sx3-lede" data-reveal style={{ ["--d" as string]: ".12s" }}>
          You don&apos;t have to buy the whole stack. Most engagements start with one service and grow as the results do.
        </p>
      </div>

      <div className="sx3-track" ref={track} style={{ ["--n" as string]: N }}>
        {services.map((s, i) => <span key={s.slug} id={s.slug} className="sx3-anchor" style={{ top: `${i * 100}vh` }} aria-hidden="true" />)}

        <div className="sx3-stage" ref={stage} style={{ ["--acc" as string]: cur.accent }}>
          {/* Light: one glow per service, crossfading to the active one. */}
          {services.map((s, i) => <span key={s.slug} className={`sx3-light${i === active ? " is-on" : ""}`} style={{ ["--acc" as string]: s.accent }} aria-hidden="true" />)}
          <span className="sx3-grain" aria-hidden="true" />
          <span className="sx3-letterbox" aria-hidden="true" />

          <div className="container sx3-frame">
            <div className="sx3-slate" aria-hidden="true">
              <span>Scene</span><b>{String(active + 1).padStart(2, "0")}</b><span>/ {String(N).padStart(2, "0")}</span>
              <i />
              <em>{cur.name}</em>
            </div>

            <div className="sx3-scenes">
              {services.map((s, i) => {
                const Icon = s.icon;
                const state = i === active ? "is-on" : i < active ? "is-past" : "is-next";
                return (
                  <article key={s.slug} className={`sx3-scene ${state}`} style={{ ["--acc" as string]: s.accent }} aria-hidden={i !== active} data-keep>
                    <span className="sx3-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <div className="sx3-copy">
                      <p className="sx3-kicker"><Icon size={16} /> {s.name}</p>
                      <h3>{s.heading}</h3>
                      <p className="sx3-text">{s.lede}</p>
                      <ul className="sx3-out">{s.outcomes.map((o) => <li key={o}><Check size={15} />{o}</li>)}</ul>
                      <ul className="sx3-caps">{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
                      <Link href="/contact" className="sx3-cta" tabIndex={i === active ? 0 : -1}>Talk to us about {s.name.toLowerCase()} <ChevronRight size={17} /></Link>
                    </div>
                    <div className="sx3-screen">
                      <span className="sx3-screen-glow" aria-hidden="true" />
                      <ServiceStory service={s} />
                    </div>
                  </article>
                );
              })}
            </div>

            <nav className="sx3-timeline" aria-label="Services">
              <span className="sx3-timeline-bar" aria-hidden="true"><i /></span>
              {services.map((s, i) => (
                <Link key={s.slug} href={`#${s.slug}`} className={i === active ? "is-on" : i < active ? "is-past" : undefined} style={{ ["--acc" as string]: s.accent }}>
                  <em>{String(i + 1).padStart(2, "0")}</em><span>{s.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
