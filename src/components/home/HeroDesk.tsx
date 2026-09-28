"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  BarChart3, CalendarCheck, ChevronRight, ClipboardList, Contact, CreditCard, Landmark, Mail, Package, PhoneMissed,
  Receipt, ShoppingBag, Sparkles, Truck, Users, type LucideIcon,
} from "lucide-react";
import { whenReady } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

// The desk is a 1100×720 plane; everything on it is placed in plane pixels from its centre.
type Pt = readonly [number, number];
type Item = { front: React.ReactNode; Icon: LucideIcon; module: string; status: string; ai?: string; at: readonly [number, number, number] };

const items: Item[] = [
  { module: "Orders", Icon: ShoppingBag, status: "Live · 14 today", ai: "Replies on WhatsApp", at: [-380, -190, -12],
    front: <div className="f f-chat"><b>WhatsApp</b><p>Is order #4821 ready?</p><p className="me">Checking…</p></div> },
  { module: "Inventory", Icon: Package, status: "Live · every branch", ai: "Forecasts demand", at: [-90, -230, 6],
    front: <div className="f f-sheet"><b>stock_final_v3.xlsx</b><i /><i /><i className="bad" /><i /></div> },
  { module: "Suppliers", Icon: Truck, status: "Orders when low", at: [230, -210, -8],
    front: <div className="f f-sticky"><p>Call supplier re: milk!!</p><p>(again)</p></div> },
  { module: "Payments", Icon: CreditCard, status: "Card, cash & QR", at: [430, -120, 14],
    front: <div className="f f-receipt"><b>TILL 2</b><p>2 × Latte … 7.00</p><p>1 × Bagel … 4.50</p><p className="tot">TOTAL 11.50</p></div> },
  { module: "Invoicing", Icon: Receipt, status: "Sent on delivery", ai: "Matches payments", at: [-420, 40, 8],
    front: <div className="f f-invoice"><b>INVOICE 0412</b><p>LKR 48,500</p><em>OVERDUE</em></div> },
  { module: "Bookings", Icon: CalendarCheck, status: "One calendar", at: [-150, -20, -5],
    front: <div className="f f-cal"><b>Friday</b><p>7:00 Table for 8</p><p>7:00 Private event</p><em>Clash</em></div> },
  { module: "Staff", Icon: Users, status: "Rota filled", at: [150, 30, 10],
    front: <div className="f f-roster"><b>Rota · week 32</b><i /><i className="gap" /><i /><i className="gap" /></div> },
  { module: "Customer inbox", Icon: Mail, status: "Every message routed", at: [400, 110, -6],
    front: <div className="f f-mail"><b>Inbox · 42 unread</b><p className="u">Re: Re: delivery</p><p className="u">Complaint #1042</p><p>Price list 2025</p></div> },
  { module: "Reports", Icon: BarChart3, status: "Live dashboard", ai: "Writes the summary", at: [-300, 230, -9],
    front: <div className="f f-report"><b>Report v4 FINAL (2)</b><span><i /><i /><i /><i /></span><em>Numbers don&apos;t match</em></div> },
  { module: "CRM", Icon: Contact, status: "No lead forgotten", at: [-20, 210, 4],
    front: <div className="f f-call"><PhoneMissed size={18} /><b>Missed call</b><p>Supplier · 3 times</p></div> },
  { module: "Order forms", Icon: ClipboardList, status: "Captured online", at: [230, 250, -11],
    front: <div className="f f-form"><b>Order form</b><p>Name: <u>K. Perera</u></p><p>Qty: <u>40?</u></p></div> },
  { module: "Accounts", Icon: Landmark, status: "Reconciled daily", at: [460, 290, 7],
    front: <div className="f f-bank"><b>Bank feed</b><p><strong>12</strong> not matched</p></div> },
];

// Where each item lands once the desk becomes one system: 4×3 on wide screens, 3×4 on phones.
const WIDE: Pt[] = items.map((_, i) => [-360 + (i % 4) * 240, -140 + Math.floor(i / 4) * 160]);
const PHONE: Pt[] = items.map((_, i) => [-240 + (i % 3) * 240, -210 + Math.floor(i / 3) * 160]);

export default function HeroDesk() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const stage = root.querySelector<HTMLElement>(".hx-stage")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = () => stage.clientWidth < 700;
    // Scale the 1100px desk to the viewport; phones get a taller 3-column layout.
    const S = () => (phone() ? stage.clientWidth / 800 : Math.min(1.1, stage.clientWidth / 1240));
    const H = () => stage.clientHeight;
    const slot = (i: number) => (phone() ? PHONE[i] : WIDE[i]);
    let stopWaiting = () => {};

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".hc-item", root);
      gsap.set(".hc-plane", { xPercent: -50, yPercent: -50 });
      gsap.set(cards, { xPercent: -50, yPercent: -50 });

      const intro = gsap.timeline({ paused: true, delay: 0.05 });
      stopWaiting = whenReady(() => intro.play());
      intro
        .fromTo(".hx-title .w", { opacity: 0, y: 60, filter: "blur(20px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, stagger: 0.18, ease: "expo.out" }, 0.3)
        .fromTo(".hx-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" }, 0.9);

      if (reduce) {
        // Still frame: the finished system, facing the viewer, below the headline.
        gsap.set(".hc-plane", { rotationX: 0, rotationZ: 0, scale: () => S() * 0.55, y: () => H() * 0.3, visibility: "visible" });
        gsap.set(cards, { x: (i) => slot(i)[0], y: (i) => slot(i)[1], rotationY: 180 });
        gsap.set(".hc-desk", { opacity: 0 });
        gsap.set(".hc-window", { opacity: 1 });
        return;
      }

      // The papers drop onto the desk as the page opens.
      gsap.set(cards, { opacity: 0 });
      intro.fromTo(cards, { z: 420, opacity: 0 }, { z: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: "power3.out" }, 0.8);

      gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      })
        // Opening frame: looking down at the desk, low in the shot, under the headline.
        .fromTo(".hc-plane", { rotationX: 60, rotationZ: -12, scale: () => S(), y: () => H() * (phone() ? 0.34 : 0.31), visibility: "visible" },
          { rotationX: 50, rotationZ: -6, scale: () => S() * 1.25, y: () => H() * 0.12, duration: 1.4 }, 0)
        .fromTo(cards, { x: (i) => items[i].at[0], y: (i) => items[i].at[1], rotationZ: (i) => items[i].at[2], rotationY: 0 },
          { x: (i) => items[i].at[0] * 1.04, y: (i) => items[i].at[1] * 1.04, duration: 1.4 }, 0)
        .to(".hx-intro", { opacity: 0, y: -70, duration: 0.9 }, 0)
        .fromTo(".hc-b1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9)
        .to(".hc-b1", { opacity: 0, y: -40, duration: 0.5 }, 2.7)

        // Every paper lifts, turns over and lands in its slot; the desk tilts up into one window.
        .to(cards, { z: 90, duration: 0.5, stagger: 0.03, ease: "power2.out" }, 3)
        .to(".hc-plane", { rotationX: 0, rotationZ: 0, scale: () => S() * 0.84, y: () => H() * 0.17, duration: 1.5 }, 3.1)
        .to(cards, {
          x: (i) => slot(i)[0], y: (i) => slot(i)[1], rotationZ: 0, rotationY: 180, z: 0,
          duration: 1.3, stagger: 0.05, ease: "power3.inOut",
        }, 3.4)
        .to(".hc-desk", { opacity: 0, duration: 0.8 }, 3.4)
        .fromTo(".hc-window", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 4.3)
        .fromTo(".hc-b2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 3.3)
        .to(".hc-b2", { opacity: 0, y: -40, duration: 0.5 }, 5.8)

        // It starts to think: a pass of light, then agents take over part of the work.
        .fromTo(".hc-sweep", { xPercent: -120, opacity: 0 }, { xPercent: 120, opacity: 1, duration: 1.2, ease: "power1.inOut" }, 6)
        .to(".hc-sweep", { opacity: 0, duration: 0.3 }, 7)
        .fromTo(".hc-ai", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.15, ease: "back.out(2)" }, 6.3)
        .to(".hc-item.has-ai .hc-st", { opacity: 0, duration: 0.25, stagger: 0.15 }, 6.3)
        .to(".hc-st-ai", { opacity: 1, duration: 0.25, stagger: 0.15 }, 6.4)
        .to(".hc-title-a", { opacity: 0, duration: 0.3 }, 6.3)
        .to(".hc-title-b", { opacity: 1, duration: 0.3 }, 6.4)
        .fromTo(".hc-b3", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 6)
        .to(".hc-b3", { opacity: 0, y: -40, duration: 0.5 }, 7.7)

        // Pull back to the finished system.
        .to(".hc-plane", { scale: () => S() * 0.74, y: () => H() * 0.19, duration: 1 }, 7.8)
        .fromTo(".hc-final", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7 }, 8)
        .to({}, { duration: 0.6 });
    }, root);

    // The camera leans gently toward the pointer.
    const cam = root.querySelector<HTMLElement>(".hc-cam")!;
    const rx = gsap.quickTo(cam, "rotationX", { duration: 1.2, ease: "power3" });
    const ry = gsap.quickTo(cam, "rotationY", { duration: 1.2, ease: "power3" });
    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      ry((e.clientX / window.innerWidth - 0.5) * 6);
      rx(-(e.clientY / window.innerHeight - 0.5) * 4);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => { stopWaiting(); ctx.revert(); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <section ref={ref} className="hx hc" aria-label="Zyntraz — your business, designed as one system">
      <div className="hx-stage">
        <div className="hc-light" aria-hidden="true" />

        <div className="hc-cam" aria-hidden="true">
          <div className="hc-plane">
            <div className="hc-desk" />
            <div className="hc-window">
              <div className="hc-bar">
                <span className="hc-dots"><i /><i /><i /></span>
                <span className="hc-title"><b className="hc-title-a">Your business · one system</b><b className="hc-title-b">Your business · AI on</b></span>
                <span className="hc-pill"><i />In sync</span>
              </div>
              <span className="hc-sweep" />
            </div>
            {items.map(({ front, Icon, module, status, ai }) => (
              <div key={module} className={`hc-item${ai ? " has-ai" : ""}`}>
                <div className="hc-face hc-front">{front}</div>
                <div className="hc-face hc-back">
                  <span className="hc-ico"><Icon size={22} /></span>
                  <b>{module}</b>
                  <span className="hc-status"><span className="hc-st"><i />{status}</span>{ai && <span className="hc-st-ai"><Sparkles size={13} />{ai}</span>}</span>
                  {ai && <span className="hc-ai"><Sparkles size={12} /> AI</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hx-intro">
          <h1 className="hx-title">
            <span className="w">Your business is already a system.</span>
            <span className="w grad-text">It just wasn&apos;t designed as one.</span>
          </h1>
          <p className="hx-sub hx-fade">
            Zyntraz understands how your business works, then engineers the software, AI, data and automation to run it as one.
          </p>
          <div className="hx-ctas hx-fade">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment</Link>
            <Link href="/services" className="link-chev">See how we work <ChevronRight size={18} /></Link>
          </div>
        </div>

        <div className="hx-beat hc-beat hc-b1">
          <h2>This is how most businesses run.</h2>
          <p>Chats, spreadsheets, paper and memory — each one holding a piece of the truth.</p>
        </div>
        <div className="hx-beat hc-beat hc-b2">
          <h2>Zyntraz turns it into <span className="grad-text">one system.</span></h2>
          <p>Every piece turned over, cleaned up and connected — designed around how you already work.</p>
        </div>
        <div className="hx-beat hc-beat hc-b3">
          <h2>Then it starts <span className="grad-text">to think.</span></h2>
          <p>AI agents work inside the system — answering, forecasting, matching — with your team in control.</p>
        </div>
        <div className="hx-final hc-beat hc-final">
          <h2>One intelligent <span className="grad-text">business system.</span></h2>
          <div className="hx-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a transformation assessment</Link>
            <Link href="/services" className="link-chev">See how we work <ChevronRight size={18} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
