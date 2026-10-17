"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, BellRing, BookOpen, CalendarDays, CalendarPlus, ChevronRight, ClipboardCheck, ClipboardList, ConciergeBell, CreditCard,
  FileSpreadsheet, FileText, Folder, Gift, Landmark, LineChart, Mail, MapPin, MessageSquare, Navigation, Package, PackageCheck, PenLine,
  Pill, Receipt, Send, ShoppingBag, Soup, Sparkles, Star, Stethoscope, Truck, UserCheck, Users, Wallet, Warehouse,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import MotionPathPlugin from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

type Stage = [label: string, sub: string, Icon: LucideIcon];

// One system shaped around how each business actually flows — six stages, in order.
const domains: { name: string; flow: Stage[] }[] = [
  { name: "Restaurant", flow: [["Order taken", "WhatsApp, POS & online", ShoppingBag], ["Kitchen", "Tickets out in 4 min", Soup], ["Stock", "Reorders at minimum", Package], ["Tables & staff", "12 on shift tonight", Users], ["Payment", "Card, cash or QR", CreditCard], ["Insights", "Daily report at 9 am", LineChart]] },
  { name: "Clinic", flow: [["Booking", "Online or by phone", CalendarPlus], ["Check-in", "No paper forms", UserCheck], ["Consultation", "Full patient history", Stethoscope], ["Pharmacy", "Stock updates itself", Pill], ["Billing", "Insurance & cash", Receipt], ["Follow-up", "Automatic reminders", BellRing]] },
  { name: "School", flow: [["Enrolment", "Forms to fees, online", ClipboardCheck], ["Classes", "Timetables built for you", BookOpen], ["Attendance", "Marked in seconds", UserCheck], ["Exams", "Marks & results", PenLine], ["Fees", "Reminders sent for you", Wallet], ["Parents", "Progress shared live", Users]] },
  { name: "Shop", flow: [["Sale", "In store & online", ShoppingBag], ["Inventory", "Every branch, live", Package], ["Suppliers", "Orders when low", Truck], ["Delivery", "Tracked to the door", MapPin], ["Payment", "Every method", CreditCard], ["Loyalty", "Customers come back", Gift]] },
  { name: "Hotel", flow: [["Booking", "Every channel, one calendar", CalendarPlus], ["Check-in", "Under a minute", ConciergeBell], ["Housekeeping", "Rooms ready, tracked", Sparkles], ["Guest requests", "Handled in real time", BellRing], ["Checkout", "Bill ready instantly", Receipt], ["Reviews", "Asked for automatically", Star]] },
  { name: "Logistics", flow: [["Order", "From any channel", PackageCheck], ["Warehouse", "Picked & packed", Warehouse], ["Dispatch", "Best route chosen", Send], ["Tracking", "Live for customers", Navigation], ["Proof of delivery", "Photo & signature", BadgeCheck], ["Invoice", "Sent on delivery", Receipt]] },
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

// A window chrome for each disconnected tool.
function Frag({ Icon, app, meta, tone, children }: { Icon: LucideIcon; app: string; meta: string; tone: string; children: React.ReactNode }) {
  return (
    <>
      <div className="bs-frag-head"><span className="bs-app" style={{ background: tone }}><Icon size={11} /></span><b>{app}</b><time>{meta}</time></div>
      <div className="bs-frag-body">{children}</div>
    </>
  );
}

// The tools every business ends up juggling. Positions are % of the stage; ry/rx give each window depth.
const scraps = [
  { k: "sheet", x: 5, y: 4, r: -3, ry: 14, body: (
    <Frag Icon={FileSpreadsheet} app="stock_final_v3.xlsx" meta="Edited 3d ago" tone="#107c41">
      <table className="bs-grid"><thead><tr><th /><th>A</th><th>B</th><th>C</th></tr></thead>
        <tbody>
          <tr><th>1</th><td>Item</td><td>Qty</td><td>Min</td></tr>
          <tr><th>2</th><td>Arabica</td><td className="bs-bad">4</td><td>20</td></tr>
          <tr><th>3</th><td>Milk 1L</td><td>26</td><td>30</td></tr>
          <tr><th>4</th><td>Cups</td><td>140</td><td>100</td></tr>
        </tbody>
      </table>
    </Frag>) },
  { k: "msg", x: 68, y: 2, r: 3, ry: -14, body: (
    <Frag Icon={MessageSquare} app="Messages" meta="now" tone="#0a8f63">
      <div className="bs-msg"><span className="bs-av">KP</span><div><b>Kavindu P. <em>3</em></b><p>Is order #4821 ready for pickup?</p></div></div>
    </Frag>) },
  { k: "mail", x: 36, y: 22, r: -2, ry: 8, body: (
    <Frag Icon={Mail} app="Inbox" meta="42 unread" tone="#0b5cff">
      <ul className="bs-rows"><li><i />Monthly report v4 (final)</li><li><i />Re: Re: delivery schedule</li><li>Supplier price list 2025</li></ul>
    </Frag>) },
  { k: "inv", x: 80, y: 36, r: 2, ry: -18, body: (
    <Frag Icon={FileText} app="INV-0412.pdf" meta="PDF" tone="#e0413a">
      <div className="bs-inv"><small>Amount due</small><b>LKR 48,500</b><span className="bs-pill bs-pill-bad">Overdue · 12 days</span><i /><i /></div>
    </Frag>) },
  { k: "cal", x: 7, y: 50, r: 2, ry: 16, body: (
    <Frag Icon={CalendarDays} app="Calendar" meta="Fri" tone="#7c3aed">
      <div className="bs-cal"><span>7:00 PM · Table for 8 — Perera</span><span>7:00 PM · Private booking</span><em>Conflict</em></div>
    </Frag>) },
  { k: "drive", x: 57, y: 58, r: -3, ry: -10, body: (
    <Frag Icon={Folder} app="Drive / Customers" meta="3 files" tone="#f59e0b">
      <ul className="bs-rows bs-files"><li>customers_2023.xlsx</li><li>customers_NEW.xlsx</li><li>customers_new (1).xlsx</li></ul>
    </Frag>) },
  { k: "bank", x: 25, y: 76, r: 2, ry: 12, body: (
    <Frag Icon={Landmark} app="Bank feed" meta="Today" tone="#0891b2">
      <div className="bs-bank"><b>12</b><span>transactions not matched to invoices</span></div>
    </Frag>) },
  { k: "roster", x: 76, y: 78, r: -2, ry: -12, body: (
    <Frag Icon={ClipboardList} app="roster_week32.docx" meta="Draft" tone="#2b579a">
      <div className="bs-roster"><span>Mon</span><i /><i className="bs-gap" /><span>Tue</span><i className="bs-gap" /><i /><small>3 shifts unassigned</small></div>
    </Frag>) },
];

export default function BusinessSystemScene() {
  const ref = useRef<HTMLElement>(null);
  // n bumps on every swap, so the words always animate back in — even if a quick re-pick lands on the same business.
  const [{ d, n }, setView] = useState({ d: 0, n: 0 });
  const show = (i: number) => setView((v) => ({ d: i, n: v.n + 1 }));
  const first = useRef(true);
  const swap = useRef<(i: number, byUser?: boolean) => void>(() => {});

  // Morph the module words in after each switch.
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
    swap.current = (i, byUser) => {
      if (byUser) hold = performance.now() + 9000;
      if (i === current) return;
      current = i;
      if (reduce()) { show(i); return; }
      gsap.to(q(".bs-mod-flip, .bs-win-name"), { yPercent: -100, opacity: 0, duration: 0.25, stagger: 0.015, ease: "power2.in", overwrite: true, onComplete: () => show(i) });
    };
    let engaged = false;
    const next = () => {
      if (!visible) return;
      if (!engaged && performance.now() > hold) swap.current((current + 1) % domains.length);
      cycle = gsap.delayedCall(2.8, next);
    };
    const auto = ScrollTrigger.create({
      trigger: q(".bs-shape")[0], start: "top 85%", end: "bottom 10%",
      onToggle: (st) => { visible = st.isActive && !reduce(); cycle?.kill(); if (visible) cycle = gsap.delayedCall(2.2, next); },
    });
    const zones = q(".bs-floor, .bs-switch") as HTMLElement[];
    const engage = () => { engaged = true; }, release = () => { engaged = false; hold = performance.now() + 2500; };
    zones.forEach((z) => { z.addEventListener("pointerenter", engage); z.addEventListener("pointerleave", release); z.addEventListener("focusin", engage); z.addEventListener("focusout", release); });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const stage = q(".bs-stage")[0] as HTMLElement;
      const split = SplitText.create(q(".bs-title")[0], { type: "words", mask: "words" });
      splits.push(split);
      gsap.from(split.words, { yPercent: 115, rotation: 4, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%", once: true } });
      gsap.from(q(".bs-head .tile-eyebrow, .bs-head .tile-sub, .bs-head .tile-links"), { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });

      // Idle: the mess jitters and drifts until the system pulls it in.
      // Each window floats at its own depth, turned slightly toward the centre.
      gsap.set(q(".bs-scrap-in"), { transformPerspective: 900, rotationY: (i) => scraps[i].ry, rotationX: 6 });
      q(".bs-scrap-in").forEach((el, i) => gsap.to(el, { y: i % 2 ? 8 : -8, rotationY: scraps[i].ry * 0.6, duration: 3 + (i % 3) * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1 }));

      // Layout offset relative to the stage (ignores transforms, so refreshes stay stable).
      const pos = (el: HTMLElement) => {
        let x = el.offsetWidth / 2, y = el.offsetHeight / 2, n: HTMLElement | null = el;
        while (n && n !== stage) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
        return { x, y };
      };
      const targets = [...q(".bs-node"), q(".bs-hub-dot")[0], q(".bs-hub-dot")[0]] as HTMLElement[];
      const pieces = q(".bs-scrap") as HTMLElement[];
      const dx = (i: number) => pos(targets[i]).x - pos(pieces[i]).x;
      const dy = (i: number) => pos(targets[i]).y - pos(pieces[i]).y;

      // Chaos → one system, scrubbed across the approach: the floor rises, the tools become its stages.
      gsap.set(pieces, { rotation: (i) => scraps[i].r });
      gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: stage, start: "top 72%", end: "center 58%", scrub: 1, invalidateOnRefresh: true },
      })
        .fromTo(q(".bs-scrap-in"), { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power3.out" }, 0)
        .fromTo(q(".bs-plane"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.4)
        .fromTo(q(".bs-hub"), { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.6)
        .fromTo(q(".bs-tile"), { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 0.75)
        .fromTo(q(".bs-hub-label"), { opacity: 0, xPercent: -50, yPercent: -50, y: 20 }, { opacity: 1, xPercent: -50, yPercent: -50, y: 0, duration: 0.5 }, 1.2)
        .to(pieces, { x: (i) => dx(i), y: (i) => dy(i), rotation: 0, scale: 0.22, duration: 1, stagger: 0.1, ease: "power3.inOut" }, 1)
        .to(pieces, { opacity: 0, duration: 0.25, stagger: 0.1 }, 1.75)
        .fromTo(q(".bs-node"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.1, ease: "back.out(2.4)" }, 1.85)
        .fromTo(q(".bs-legend li"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.08 }, 2)
        .fromTo(q(".bs-tag"), { opacity: 0, xPercent: -50, yPercent: -50, y: 12 }, { opacity: 1, xPercent: -50, yPercent: -50, y: 0, duration: 0.35, stagger: 0.1 }, 1.95)
        .fromTo(q(".bs-rail"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" }, 2.4)
        .fromTo(q(".bs-packet"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 3)
        .to(q(".bs-before"), { yPercent: -100, opacity: 0, duration: 0.4 }, 2.8)
        .fromTo(q(".bs-after"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 }, 2.9)
        .to({}, { duration: 0.4 });

      // Live: work flows round the loop; each stage lights as a packet passes through it.
      const rail = q(".bs-rail")[0] as unknown as SVGPathElement, glows = q(".bs-top-glow"), pings = q(".bs-ping");
      const live = gsap.timeline({ paused: true, repeat: -1 });
      const offsets = [0, 0.5];
      q(".bs-packet").forEach((p, n) => {
        const off = offsets[n];
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

  return (
    <article ref={ref} className="tile tile-full alt bs">
      <div className="bs-head">
        <p className="tile-eyebrow">Custom Business Systems</p>
        <h2 className="bs-title">All your work. <span className="grad-text">One system.</span></h2>
        <p className="tile-sub">Orders on WhatsApp, stock in a spreadsheet, bills on paper, schedules in someone&apos;s head. We bring it all into one simple system — built around the way your business already works.</p>
        <div className="tile-links">
          <Link href="/services" className="btn btn-primary">Learn more</Link>
          <Link href="/contact" className="link-chev">Start a transformation assessment <ChevronRight size={18} /></Link>
        </div>
      </div>

      <div className="bs-stage">
        {scraps.map((s) => (
          <div key={s.k} className={`bs-scrap bs-${s.k}`} style={{ ["--x" as string]: s.x, top: `${s.y}%` }} aria-hidden="true">
            <div className="bs-scrap-in">{s.body}</div>
          </div>
        ))}

        <div className="bs-floor">
          <svg className="bs-floor-svg" viewBox={`0 0 ${BOX.w} ${BOX.h}`} aria-hidden="true">
            <defs>
              <radialGradient id="bs-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#0b5cff" stopOpacity=".22" /><stop offset="1" stopColor="#0b5cff" stopOpacity="0" /></radialGradient>
              <linearGradient id="bs-hub-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4d8dff" /><stop offset=".55" stopColor="#0b5cff" /><stop offset="1" stopColor="#4f46e5" /></linearGradient>
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
                <polygon points={hub.top} fill="url(#bs-hub-top)" />
              </g>
            ))}
            <path className="bs-rail-base" d={RAIL} />
            <path className="bs-rail" d={RAIL} pathLength={1} />
            <circle className="bs-packet" r="7" />
            <circle className="bs-packet" r="5" />
          </svg>

          {stages.map((s) => {
            const [label, sub, Icon] = dom.flow[s.i];
            // Wide: labels sit outward from the ring (the two side stages carry theirs on top). Narrow: close above, or below for the front stages.
            const side = Math.abs(s.cos) > 0.9;
            const wide = side ? pct(s.x, s.y - 78) : pct(s.x + s.cos * 92, s.y + s.sin * 64 - (s.sin > 0.1 ? -30 : 34)), narrow = pct(s.x - s.cos * 60, s.y);
            const tag = { ["--tx" as string]: wide.left, ["--ty" as string]: wide.top, ["--mx" as string]: narrow.left, ["--my" as string]: narrow.top, ["--dy" as string]: s.sin > 0.1 ? "30px" : "-44px" };
            return (
              <div key={s.i}>
                <span className="bs-node" data-n={s.i + 1} style={pct(s.x, s.y)}><i className="bs-ping" /><span className="bs-mod-flip"><Icon size={18} /></span></span>
                <span className="bs-tag" style={tag}>
                  <em>{String(s.i + 1).padStart(2, "0")}</em>
                  <span className="bs-clip"><b className="bs-mod-flip">{label}</b></span>
                  <span className="bs-clip"><small className="bs-mod-flip">{sub}</small></span>
                </span>
              </div>
            );
          })}
          <span className="bs-hub-dot" style={pct(hub.at[0], hub.at[1])} />
          <span className="bs-hub-label" style={pct(hub.at[0], hub.at[1])}>
            <Sparkles size={16} />
            <span className="bs-clip"><b className="bs-win-name">Your {dom.name}</b></span>
            <small>one connected system</small>
          </span>
        </div>

        <ol className="bs-legend">
          {dom.flow.map(([label, sub], i) => (
            <li key={i}><em>{i + 1}</em><span className="bs-clip"><b className="bs-mod-flip">{label}</b></span><span className="bs-clip"><small className="bs-mod-flip">{sub}</small></span></li>
          ))}
        </ol>

        <p className="bs-caption">
          <span className="bs-before">Before: 8 tools, no clear picture.</span>
          <span className="bs-after">After: 1 system, everything in sync.</span>
        </p>
      </div>

      <div className="bs-shape">
        <p>Whatever you run, it&apos;s shaped to fit:</p>
        <div className="bs-switch" role="group" aria-label="See the system for a business like yours">
          {domains.map((x, i) => (
            <button key={x.name} type="button" aria-pressed={i === d} className={i === d ? "is-active" : undefined} onClick={() => swap.current(i, true)}>{x.name}</button>
          ))}
        </div>
      </div>

      <ol className="bs-steps">
        <li><span>01</span><b>We learn how you work</b><p>We sit with your team and map how things really get done today.</p></li>
        <li><span>02</span><b>We build it around you</b><p>Your steps, your words, your reports — not a one-size-fits-all app.</p></li>
        <li><span>03</span><b>It grows with you</b><p>New branch, new service, new idea? The system grows with you.</p></li>
      </ol>
    </article>
  );
}
