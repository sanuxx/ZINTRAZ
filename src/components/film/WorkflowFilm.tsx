"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import type { Product } from "@/components/sections/Products";
import ProductLogo from "@/components/products/ProductLogo";

/**
 * A product film: one unit of real work (an order, a reservation, a lead) followed through the product's own
 * four workflow steps. It shows what the product does without pretending to show its screens.
 *
 * Four acts, on a fixed unit grid so a scroll scrub and an autoplaying trailer can share one timeline:
 *   0–1  Without it — the product's pain line over a scatter of loose paper.
 *   1–2  Switch on — the product's icon arrives and the paper snaps into four stations on a floor.
 *   2–6  Follow the work — the token rides the rail station to station, the camera dollying with it.
 *   6–7  The result — the camera pulls back over the whole flow, the tagline and features land.
 *
 * The markup is also the static fallback: without `.fl-live` (phones, reduced motion, the motion switch) the
 * same elements lay out as a readable storyboard — the pain, four numbered steps, the result.
 *
 * The 3D scene is designed on a fixed 1500×760 canvas and scaled to fit its container (`--fit`), so the camera
 * moves read the same in a page section and in a full-screen theatre.
 */
export const FILM_LEN = 7.2;
const SX = [-900, -300, 300, 900]; // station x positions
const ST_Y = -40; // station centre
const RAIL_Y = 128;
const TOKEN_Y = 92;
const FRAGS = 14;

// Deterministic scatter, so the server markup and every replay match.
const rand = (i: number, k: number) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

/** Chapter shown by the HUD at a given film time. */
export function chapterAt(t: number) {
  if (t < 1) return -2; // without
  if (t < 2) return -1; // switch on
  if (t < 6) return Math.min(3, Math.floor(t - 2)); // step 0–3
  return 4; // result
}

/**
 * Lays the scene out and appends the four acts to `tl`. Labels: `without`, `on`, `s0`–`s3`, `result`.
 * Call inside a gsap.context (or matchMedia) scoped to `root`, so reverting it restores the storyboard.
 */
export function buildFilm(tl: gsap.core.Timeline, root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const world = q(".fl-world")[0];
  const stations = q(".fl-st");
  const glows = q(".fl-st-glow");
  const frags = q(".fl-frag");
  const token = q(".fl-token")[0];
  const core = q(".fl-core")[0];
  const fill = q(".fl-fill")[0];

  // Static placement in the world.
  gsap.set(q(".fl-floor"), { xPercent: -50, yPercent: -50, y: 236, rotationX: 90 });
  gsap.set(q(".fl-rail"), { xPercent: -50, yPercent: -50, y: RAIL_Y });
  gsap.set(fill, { scaleX: 0, transformOrigin: "0 50%" });
  stations.forEach((s, i) => gsap.set(s, { xPercent: -50, yPercent: -50, x: SX[i], y: ST_Y }));
  gsap.set([core, token], { xPercent: -50, yPercent: -50 });

  tl.addLabel("without", 0).addLabel("on", 1);
  for (let i = 0; i < 4; i++) tl.addLabel(`s${i}`, 2 + i);
  tl.addLabel("result", 6);

  // ── Camera ──
  tl.fromTo(world, { x: 0, z: -260, rotationX: -12, rotationY: 12 }, { rotationY: -6, duration: 1 }, 0)
    .to(world, { z: -900, rotationX: -8, rotationY: 0, duration: 0.9, ease: "power2.inOut" }, 1);
  for (let i = 0; i < 4; i++) {
    tl.to(world, { x: -SX[i], z: 270, rotationY: i % 2 ? -7 : 7, rotationX: -4, duration: 0.55, ease: "power2.inOut" }, 1.9 + i);
  }
  tl.to(world, { x: 0, z: -1000, rotationX: -10, rotationY: 0, duration: 0.9, ease: "power2.inOut" }, 6);

  // ── Act 1: without it ──
  tl.fromTo(q(".fl-cap-pain .fl-eyebrow"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0)
    .fromTo(q(".fl-cap-pain .fl-in"), { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "power3.out" }, 0.05)
    .to(q(".fl-cap-pain"), { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, 0.85);

  frags.forEach((f, i) => {
    const from = {
      x: (rand(i, 1) - 0.5) * 1500, y: (rand(i, 2) - 0.5) * 520 + 40, z: (rand(i, 3) - 0.5) * 800,
      rotationX: (rand(i, 4) - 0.5) * 120, rotationY: (rand(i, 5) - 0.5) * 140, rotationZ: (rand(i, 6) - 0.5) * 90,
    };
    gsap.set(f, { xPercent: -50, yPercent: -50 });
    tl.fromTo(f, { ...from, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, i * 0.025)
      .to(f, { y: from.y + 50, rotationZ: from.rotationZ + 30, rotationY: from.rotationY + 40, duration: 0.6 }, 0.35)
      // Act 2: every loose sheet is pulled into the station it belongs to. autoAlpha, not opacity: once gone,
      // a sheet is hidden outright, so no browser keeps painting an invisible 3D layer over the stations.
      .to(f, { x: SX[i % 4], y: ST_Y, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, scale: 0.35, autoAlpha: 0, duration: 0.55, ease: "power3.in" }, 1 + i * 0.02);
  });

  // ── Act 2: switch on ──
  tl.fromTo(core, { y: ST_Y, z: 160, scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(1.7)" }, 1.02)
    .to(core, { x: SX[0], y: TOKEN_Y, z: 40, scale: 0.35, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 1.72);
  stations.forEach((s, i) => {
    tl.fromTo(s, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)" }, 1.38 + i * 0.07);
  });
  tl.fromTo(q(".fl-rail"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.5)
    .fromTo(token, { x: SX[0], y: TOKEN_Y, z: 40, scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2)" }, 1.95);

  // ── Act 3: follow the work ──
  glows.forEach((g, i) => {
    tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 2.3 + i);
    if (i > 0) {
      tl.to(token, { x: SX[i], duration: 0.55, ease: "power2.inOut" }, 1.9 + i)
        .to(fill, { scaleX: i / 3, duration: 0.55, ease: "power2.inOut" }, 1.9 + i)
        .to(glows[i - 1], { opacity: 0.35, duration: 0.25 }, 1.95 + i);
    }
  });

  // ── Act 4: the result ──
  tl.to(glows, { opacity: 1, duration: 0.3 }, 6.3)
    .fromTo(q(".fl-cap-end .fl-eyebrow"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 6.35)
    .fromTo(q(".fl-cap-end .fl-in"), { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "power3.out" }, 6.4)
    .fromTo(q(".fl-chips li"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.04 }, 6.55)
    .fromTo(q(".fl-links > *"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.06 }, 6.75);

  // Pin the timeline's length to the grid.
  tl.to({}, { duration: 0.01 }, FILM_LEN - 0.01);
}

export default function WorkflowFilm({ product, tone = "light", cta = true }: { product: Product; tone?: "light" | "dark"; cta?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { id, name, pain, workflow, features, tagline, token, accent, status } = product;

  // Fit the fixed 1500×760 canvas to whatever box the film is given.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => el.style.setProperty("--fit", String(Math.min(el.clientWidth / 1500, el.clientHeight / 760)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fl wf-${tone}`} style={{ ["--c" as string]: accent }}>
      <div className="fl-fit">
        <div className="fl-cap fl-cap-pain">
          <p className="fl-eyebrow">Without {name}</p>
          <p className="fl-big"><span className="fl-mask"><span className="fl-in">{pain}</span></span></p>
        </div>

        <div className="fl-cam">
          <div className="fl-world">
            <span className="fl-floor" aria-hidden="true" />
            {Array.from({ length: FRAGS }, (_, i) => (
              <span key={i} className="fl-frag" aria-hidden="true"><i /><i /><i /></span>
            ))}
            <span className="fl-rail" aria-hidden="true"><span className="fl-fill" /></span>
            <ol className="fl-stations" aria-label={`How ${name} works`}>
              {workflow.map((step, i) => (
                <li key={step} className="fl-st">
                  <span className="fl-st-glow" aria-hidden="true" />
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
            <ProductLogo id={id} size={256} className="fl-core" />
            <span className="fl-token" aria-hidden="true"><ProductLogo id={id} size={64} className="fl-token-logo" />{token}</span>
          </div>
        </div>

        <div className="fl-cap fl-cap-end">
          <p className="fl-eyebrow">With {name}</p>
          <p className="fl-big"><span className="fl-mask"><span className="fl-in">{tagline}</span></span></p>
        </div>

        <div className="fl-end">
          <ul className="fl-chips">
            {features.slice(0, 6).map((f) => <li key={f}>{f}</li>)}
          </ul>
          {cta && (
            <div className="fl-links">
              <Link href={`/products/${id}`} className="btn btn-primary">Explore {name}</Link>
              <Link href="/contact" className="link-chev">
                {status === "available" ? "Book a demo" : "Register interest"} <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
