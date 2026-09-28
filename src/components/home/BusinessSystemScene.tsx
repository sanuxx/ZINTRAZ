"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, BellRing, BookOpen, CalendarPlus, ChevronRight, ClipboardCheck, ConciergeBell, CreditCard, Gift, LineChart, MapPin,
  Navigation, Package, PackageCheck, PenLine, Pill, Receipt, Send, ShoppingBag, Soup, Sparkles, Star, Stethoscope, Truck, UserCheck,
  Users, Wallet, Warehouse, type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import MotionPathPlugin from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

type Stage = [label: string, sub: string, Icon: LucideIcon];

// One system shaped around how each business actually flows — six stages, in order.
// `ai` marks the stages where a Zyntraz agent takes over part of the work once AI is switched on.
const domains: { name: string; flow: Stage[]; ai: [stage: number, action: string][] }[] = [
  { name: "Restaurant", flow: [["Order taken", "WhatsApp, POS & online", ShoppingBag], ["Kitchen", "Tickets out in 4 min", Soup], ["Stock", "Reorders at minimum", Package], ["Tables & staff", "12 on shift tonight", Users], ["Payment", "Card, cash or QR", CreditCard], ["Insights", "Daily report at 9 am", LineChart]],
    ai: [[0, "Takes WhatsApp orders"], [2, "Forecasts & reorders stock"], [5, "Writes the daily report"]] },
  { name: "Clinic", flow: [["Booking", "Online or by phone", CalendarPlus], ["Check-in", "No paper forms", UserCheck], ["Consultation", "Full patient history", Stethoscope], ["Pharmacy", "Stock updates itself", Pill], ["Billing", "Insurance & cash", Receipt], ["Follow-up", "Automatic reminders", BellRing]],
    ai: [[0, "Books & reschedules patients"], [3, "Flags medicines running low"], [5, "Sends reminders & recalls"]] },
  { name: "School", flow: [["Enrolment", "Forms to fees, online", ClipboardCheck], ["Classes", "Timetables built for you", BookOpen], ["Attendance", "Marked in seconds", UserCheck], ["Exams", "Marks & results", PenLine], ["Fees", "Reminders sent for you", Wallet], ["Parents", "Progress shared live", Users]],
    ai: [[0, "Answers enrolment questions"], [3, "Spots students falling behind"], [5, "Drafts parent updates"]] },
  { name: "Shop", flow: [["Sale", "In store & online", ShoppingBag], ["Inventory", "Every branch, live", Package], ["Suppliers", "Orders when low", Truck], ["Delivery", "Tracked to the door", MapPin], ["Payment", "Every method", CreditCard], ["Loyalty", "Customers come back", Gift]],
    ai: [[1, "Predicts what sells next"], [2, "Drafts purchase orders"], [5, "Personalises offers"]] },
  { name: "Hotel", flow: [["Booking", "Every channel, one calendar", CalendarPlus], ["Check-in", "Under a minute", ConciergeBell], ["Housekeeping", "Rooms ready, tracked", Sparkles], ["Guest requests", "Handled in real time", BellRing], ["Checkout", "Bill ready instantly", Receipt], ["Reviews", "Asked for automatically", Star]],
    ai: [[0, "Answers guests 24/7"], [3, "Routes requests to staff"], [5, "Replies to reviews"]] },
  { name: "Logistics", flow: [["Order", "From any channel", PackageCheck], ["Warehouse", "Picked & packed", Warehouse], ["Dispatch", "Best route chosen", Send], ["Tracking", "Live for customers", Navigation], ["Proof of delivery", "Photo & signature", BadgeCheck], ["Invoice", "Sent on delivery", Receipt]],
    ai: [[2, "Plans the best routes"], [3, "Updates customers live"], [5, "Matches payments"]] },
];

// Isometric "operating floor", drawn in a 1000×660 box: six stages on a ring around the hub.
const BOX = { w: 1000, h: 660 }, CX = 500, CY = 352, R = 300, TILE = 118, TH = 22, HUB = 196, HH = 62;
type Pt = readonly [number, number];
const iso = (u: number, v: number, h = 0): Pt => [CX + 0.866 * (u - v), CY + 0.5 * (u + v) - h];
const poly = (pts: Pt[]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
const prism = (u: number, v: number, s: number, h: number) => {
  const a = s / 2;
  return {
    top: poly([iso(u - a, v - a, h), iso(u + a, v - a, h), iso(u + a, v + a, h), iso(u - a, v + a, h)]),
    left: poly([iso(u - a, v + a, h), iso(u + a, v + a, h), iso(u + a, v + a, 0), iso(u - a, v + a, 0)]),
    right: poly([iso(u + a, v - a, h), iso(u + a, v + a, h), iso(u + a, v + a, 0), iso(u + a, v - a, 0)]),
    shadow: poly([iso(u - a + 14, v - a + 14), iso(u + a + 26, v - a + 14), iso(u + a + 26, v + a + 26), iso(u - a + 14, v + a + 26)]),
  };
};
// Stage i sits at 180° + 60°·i on the ring, so the rail (which starts at the left) meets them in order.
const stages = Array.from({ length: 6 }, (_, i) => {
  const phi = ((180 + i * 60) * Math.PI) / 180, k = R / Math.SQRT2;
  const u = k * (Math.cos(phi) + Math.sin(phi)), v = k * (Math.sin(phi) - Math.cos(phi));
  const [x, y] = iso(u, v, TH);
  return { i, x, y, depth: u + v, cos: Math.cos(phi), sin: Math.sin(phi), shape: prism(u, v, TILE, TH) };
});
const hub = { ...prism(0, 0, HUB, HH), at: iso(0, 0, HH) };
const RA = 1.2247 * R, RB = 0.7071 * R, RY = CY - TH;
const RAIL = `M${CX - RA} ${RY} A${RA} ${RB} 0 1 1 ${CX + RA} ${RY} A${RA} ${RB} 0 1 1 ${CX - RA} ${RY}`;
const grid = Array.from({ length: 17 }, (_, j) => -440 + j * 55);
const pct = (x: number, y: number) => ({ left: `${(x / BOX.w) * 100}%`, top: `${(y / BOX.h) * 100}%` });
const LOOP = 7;

export default function BusinessSystemScene() {
  const ref = useRef<HTMLElement>(null);
  // n bumps on every change, so the words always animate back in — even if a quick re-pick lands on the same view.
  const [{ d, ai, n }, setView] = useState({ d: 0, ai: false, n: 0 });
  const first = useRef(true);
  const swap = useRef<(i: number, byUser?: boolean) => void>(() => {});
  const toggleAI = useRef<() => void>(() => {});

  // Morph the stage words in after each switch.
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = gsap.utils.selector(ref.current);
    gsap.fromTo(q(".bs-mod-flip"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.025, ease: "expo.out" });
    gsap.fromTo(q(".bs-win-name"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" });
  }, [n]);

  useEffect(() => {
    const root = ref.current!;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];
    let current = 0, hold = 0, cycle: gsap.core.Tween | null = null, visible = false;

    const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const out = (then: () => void) => {
      if (reduce()) { then(); return; }
      gsap.to(q(".bs-mod-flip, .bs-win-name"), { yPercent: -100, opacity: 0, duration: 0.25, stagger: 0.015, ease: "power2.in", overwrite: true, onComplete: then });
    };
    swap.current = (i, byUser) => {
      if (byUser) hold = performance.now() + 9000;
      if (i === current) return;
      current = i;
      out(() => setView((v) => ({ ...v, d: i, n: v.n + 1 })));
    };
    toggleAI.current = () => {
      hold = performance.now() + 12000;
      out(() => setView((v) => ({ ...v, ai: !v.ai, n: v.n + 1 })));
    };
    let engaged = false;
    const next = () => {
      if (!visible) return;
      if (!engaged && performance.now() > hold) swap.current((current + 1) % domains.length);
      cycle = gsap.delayedCall(3.2, next);
    };
    const auto = ScrollTrigger.create({
      trigger: q(".bs-floor")[0], start: "top 85%", end: "bottom 10%",
      onToggle: (st) => { visible = st.isActive && !reduce(); cycle?.kill(); if (visible) cycle = gsap.delayedCall(2.4, next); },
    });
    const zones = q(".bs-floor, .bs-controls") as HTMLElement[];
    const engage = () => { engaged = true; }, release = () => { engaged = false; hold = Math.max(hold, performance.now() + 2500); };
    zones.forEach((z) => { z.addEventListener("pointerenter", engage); z.addEventListener("pointerleave", release); z.addEventListener("focusin", engage); z.addEventListener("focusout", release); });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const stage = q(".bs-stage")[0] as HTMLElement;
      const split = SplitText.create(q(".bs-title")[0], { type: "words", mask: "words" });
      splits.push(split);
      gsap.from(split.words, { yPercent: 115, rotation: 4, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%", once: true } });
      gsap.from(q(".bs-head .tile-eyebrow, .bs-head .tile-sub, .bs-controls"), { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });

      // The operating floor assembles as it scrolls in: platform, hub, stages, then the loop that joins them.
      gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: stage, start: "top 85%", end: "center 60%", scrub: 1 },
      })
        .fromTo(q(".bs-plane"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
        .fromTo(q(".bs-hub"), { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.2)
        .fromTo(q(".bs-tile"), { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 0.35)
        .fromTo(q(".bs-hub-label"), { opacity: 0, xPercent: -50, yPercent: -50, y: 20 }, { opacity: 1, xPercent: -50, yPercent: -50, y: 0, duration: 0.5 }, 0.8)
        .fromTo(q(".bs-node"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.1, ease: "back.out(2.4)" }, 0.9)
        .fromTo(q(".bs-tag"), { opacity: 0, xPercent: -50, yPercent: -50, y: 12 }, { opacity: 1, xPercent: -50, yPercent: -50, y: 0, duration: 0.35, stagger: 0.1 }, 1)
        .fromTo(q(".bs-legend li"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.08 }, 1.05)
        .fromTo(q(".bs-rail"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" }, 1.4)
        .fromTo(q(".bs-packet"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2)
        .to({}, { duration: 0.4 });

      // Live: work flows round the loop; each stage lights as a packet passes through it.
      const rail = q(".bs-rail")[0] as unknown as SVGPathElement, glows = q(".bs-top-glow"), pings = q(".bs-ping");
      const live = gsap.timeline({ paused: true, repeat: -1 });
      const offsets = [0, 0.5];
      q(".bs-packet").forEach((p, k) => {
        const off = offsets[k];
        live.to(p, { motionPath: { path: rail, align: rail, alignOrigin: [0.5, 0.5], start: off, end: off + 1 }, duration: LOOP, ease: "none" }, 0);
        stages.forEach((s) => {
          const t = (((s.i / 6 - off) % 1) + 1) % 1 * LOOP;
          live.fromTo(glows[s.i], { opacity: 0.55 }, { opacity: 0, duration: 1.1, ease: "power2.out", immediateRender: false }, t)
            .fromTo(pings[s.i], { scale: 0.6, opacity: 0.7 }, { scale: 1.9, opacity: 0, duration: 1, ease: "power2.out", immediateRender: false }, t);
        });
      });
      live.set({}, {}, LOOP);
      ScrollTrigger.create({ trigger: stage, start: "top 60%", end: "bottom top", onToggle: (st) => (st.isActive ? live.play() : live.pause()) });

      gsap.from(q(".bs-steps li"), { y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: q(".bs-steps")[0], start: "top 88%", once: true } });
    });

    return () => {
      cycle?.kill(); auto.kill(); splits.forEach((s) => s.revert()); mm.revert();
      zones.forEach((z) => { z.removeEventListener("pointerenter", engage); z.removeEventListener("pointerleave", release); z.removeEventListener("focusin", engage); z.removeEventListener("focusout", release); });
    };
  }, []);

  const dom = domains[d];
  const aiAt = (i: number) => (ai ? dom.ai.find(([s]) => s === i)?.[1] : undefined);

  return (
    <article ref={ref} className={`tile tile-full alt bs${ai ? " is-ai" : ""}`}>
      <div className="bs-head">
        <p className="tile-eyebrow">Watch a business transform</p>
        <h2 className="bs-title">Pick your business. <span className="grad-text">See it run as one system.</span></h2>
        <p className="tile-sub">Every business flows differently. Choose yours, watch its operation come together — then switch on Zyntraz AI.</p>
      </div>

      <div className="bs-controls">
        <div className="bs-switch" role="group" aria-label="See the system for a business like yours">
          {domains.map((x, i) => (
            <button key={x.name} type="button" aria-pressed={i === d} className={i === d ? "is-active" : undefined} onClick={() => swap.current(i, true)}>{x.name}</button>
          ))}
        </div>
        <button type="button" className="bs-ai-toggle" aria-pressed={ai} onClick={() => toggleAI.current()}>
          <Sparkles size={16} /> {ai ? "Zyntraz AI is on" : "Add Zyntraz AI"}
        </button>
      </div>

      <div className="bs-stage">
        <div className="bs-floor">
          <svg className="bs-floor-svg" viewBox={`0 0 ${BOX.w} ${BOX.h}`} aria-hidden="true">
            <defs>
              <radialGradient id="bs-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#0b5cff" stopOpacity=".22" /><stop offset="1" stopColor="#0b5cff" stopOpacity="0" /></radialGradient>
              <linearGradient id="bs-hub-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4d8dff" /><stop offset=".55" stopColor="#0b5cff" /><stop offset="1" stopColor="#4f46e5" /></linearGradient>
              <linearGradient id="bs-hub-top-ai" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a78bff" /><stop offset=".55" stopColor="#7c3aed" /><stop offset="1" stopColor="#4f46e5" /></linearGradient>
              <linearGradient id="bs-tile-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#eef3fc" /></linearGradient>
              <linearGradient id="bs-rail-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0b5cff" /><stop offset=".5" stopColor="#7c3aed" /><stop offset="1" stopColor="#0891b2" /></linearGradient>
            </defs>
            <g className="bs-plane">
              <ellipse cx={CX} cy={CY} rx={RA + 120} ry={RB + 80} fill="url(#bs-glow)" />
              {grid.map((g) => <line key={`u${g}`} x1={iso(g, -440)[0]} y1={iso(g, -440)[1]} x2={iso(g, 440)[0]} y2={iso(g, 440)[1]} />)}
              {grid.map((g) => <line key={`v${g}`} x1={iso(-440, g)[0]} y1={iso(-440, g)[1]} x2={iso(440, g)[0]} y2={iso(440, g)[1]} />)}
            </g>
            {[...stages.filter((s) => s.depth < 0), null, ...stages.filter((s) => s.depth >= 0)].map((s) => s ? (
              <g key={s.i} className="bs-tile">
                <polygon className="bs-shadow" points={s.shape.shadow} />
                <polygon className="bs-side-l" points={s.shape.left} />
                <polygon className="bs-side-r" points={s.shape.right} />
                <polygon className="bs-top" points={s.shape.top} />
                <polygon className="bs-top-glow" points={s.shape.top} />
              </g>
            ) : (
              <g key="hub" className="bs-hub">
                <polygon className="bs-shadow" points={hub.shadow} />
                <polygon className="bs-hub-l" points={hub.left} />
                <polygon className="bs-hub-r" points={hub.right} />
                <polygon points={hub.top} fill={ai ? "url(#bs-hub-top-ai)" : "url(#bs-hub-top)"} />
              </g>
            ))}
            <path className="bs-rail-base" d={RAIL} />
            <path className="bs-rail" d={RAIL} pathLength={1} />
            <circle className="bs-packet" r="7" />
            <circle className="bs-packet" r="5" />
          </svg>

          {stages.map((s) => {
            const [label, sub, Icon] = dom.flow[s.i];
            const act = aiAt(s.i);
            // Wide: labels sit outward from the ring (the two side stages carry theirs on top). Narrow: close above, or below for the front stages.
            const side = Math.abs(s.cos) > 0.9;
            const wide = side ? pct(s.x, s.y - 78) : pct(s.x + s.cos * 92, s.y + s.sin * 64 - (s.sin > 0.1 ? -30 : 34)), narrow = pct(s.x - s.cos * 60, s.y);
            const tag = { ["--tx" as string]: wide.left, ["--ty" as string]: wide.top, ["--mx" as string]: narrow.left, ["--my" as string]: narrow.top, ["--dy" as string]: s.sin > 0.1 ? "30px" : "-44px" };
            return (
              <div key={s.i}>
                <span className={`bs-node${act ? " is-ai" : ""}`} data-n={s.i + 1} style={pct(s.x, s.y)}><i className="bs-ping" /><span className="bs-mod-flip">{act ? <Sparkles size={18} /> : <Icon size={18} />}</span></span>
                <span className={`bs-tag${act ? " is-ai" : ""}`} style={tag}>
                  <em>{String(s.i + 1).padStart(2, "0")}</em>
                  <span className="bs-clip"><b className="bs-mod-flip">{label}</b></span>
                  <span className="bs-clip"><small className="bs-mod-flip">{act ?? sub}</small></span>
                </span>
              </div>
            );
          })}
          <span className="bs-hub-dot" style={pct(hub.at[0], hub.at[1])} />
          <span className="bs-hub-label" style={pct(hub.at[0], hub.at[1])}>
            <Sparkles size={16} />
            <span className="bs-clip"><b className="bs-win-name">Your {dom.name}</b></span>
            <small>{ai ? "one system · AI on" : "one connected system"}</small>
          </span>
        </div>

        <ol className="bs-legend">
          {dom.flow.map(([label, sub], i) => {
            const act = aiAt(i);
            return (
              <li key={i} className={act ? "is-ai" : undefined}><em>{i + 1}</em><span className="bs-clip"><b className="bs-mod-flip">{label}</b></span><span className="bs-clip"><small className="bs-mod-flip">{act ?? sub}</small></span></li>
            );
          })}
        </ol>

        <p className="bs-caption">
          {ai
            ? "Three agents now work inside it — your team still approves what matters."
            : "Six stages, one system, everything in sync."}
        </p>
      </div>

      <ol className="bs-steps">
        <li><span>01</span><b>We learn how you work</b><p>We sit with your team and map how things really get done today.</p></li>
        <li><span>02</span><b>We build it around you</b><p>Your steps, your words, your reports — not a one-size-fits-all app.</p></li>
        <li><span>03</span><b>It grows with you</b><p>New branch, new service, new idea? The system grows with you.</p></li>
      </ol>

      <div className="tile-links">
        <Link href="/contact" className="btn btn-primary">See how we&apos;d build yours</Link>
        <Link href="/solutions" className="link-chev">Explore industry use cases <ChevronRight size={18} /></Link>
      </div>
    </article>
  );
}
