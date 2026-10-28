"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CalendarCheck, ChevronRight, Headphones, MessageCircle, Package, Receipt } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import TextPlugin from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, TextPlugin);

// The AI workforce as staff: each agent gets an ID badge, hung from the ceiling rail. Shared with /ai.
export const crew = [
  { name: "Nova", role: "Sales agent", Icon: MessageCircle, c: "#0b5cff", id: "ZX-0147", len: 70, stat: ["Leads / day", "38"],
    tasks: ["Qualifying a WhatsApp lead", "Quote sent to Hilltop Resort", "Follow-up booked for Friday"] },
  { name: "Echo", role: "Support agent", Icon: Headphones, c: "#0891b2", id: "ZX-0212", len: 150, stat: ["Avg reply", "1.2s"],
    tasks: ["Resolved ticket #4812", "Refund approved within policy", "Answering 12 chats at once"] },
  { name: "Atlas", role: "Operations agent", Icon: Package, c: "#4f46e5", id: "ZX-0388", len: 30, stat: ["Stock-outs", "0"],
    tasks: ["Reorder drafted: Arabica beans", "Delivery rerouted around delay", "Stock synced across 3 outlets"] },
  { name: "Ledger", role: "Finance agent", Icon: Receipt, c: "#7c3aed", id: "ZX-0451", len: 120, stat: ["Collected", "$18.4k"],
    tasks: ["Invoice #2231 sent", "Payment matched to order", "Overdue reminder scheduled"] },
  { name: "Vega", role: "Booking agent", Icon: CalendarCheck, c: "#0284c7", id: "ZX-0529", len: 60, stat: ["Occupancy", "92%"],
    tasks: ["Table for 6 booked, 8:00 pm", "Room upgraded for VIP guest", "Waitlist filled a cancellation"] },
];

export default function WorkforceScene() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const desktop = window.matchMedia("(min-width: 901px) and (hover: hover)").matches;
      const hangs = q(".wf-hang"), slots = q(".wf-slot"), stamps = q(".wf-stamp");
      const split = SplitText.create(q(".wf-title")[0], { type: "words", mask: "words" });
      splits.push(split);

      // Physical swing: an impulse, then a damped spring back to rest.
      const kick = (i: number, deg: number) => {
        gsap.timeline({ defaults: { overwrite: "auto" } })
          .to(hangs[i], { rotation: gsap.utils.clamp(-16, 16, deg), duration: 0.22, ease: "power2.out" })
          .to(hangs[i], { rotation: 0, duration: 2.2, ease: "elastic.out(1, 0.2)" });
      };

      // The giant word drifts against the scroll.
      gsap.fromTo(q(".wf-bigword"), { xPercent: 12 }, { xPercent: -12, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });

      // Opening, played once: lights flicker on, the crew drops in on lanyards, each gets stamped.
      // Wide: badges fall from the ceiling rail. Narrow (wrapped rows): a short, gentle drop so they never cross the text.
      const wrapped = !window.matchMedia("(min-width: 901px)").matches;
      gsap.set(hangs, wrapped ? { y: -90, opacity: 0 } : { y: (i) => -(crew[i].len + 560) });
      gsap.set(stamps, { opacity: 0 });
      const intro = gsap.timeline({ paused: true })
        .fromTo(q(".wf-beams i"), { opacity: 0 }, { keyframes: { opacity: [0, 1, 0.15, 0.9, 0.3, 1] }, duration: 0.9, stagger: 0.18, ease: "none" }, 0)
        .fromTo(q(".tile-eyebrow"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.1)
        .fromTo(split.words, { yPercent: 115, rotation: 5 }, { yPercent: 0, rotation: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.2)
        .fromTo(q(".tile-sub, .tile-links"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.55)
        .fromTo(q(".wf-rail"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.inOut" }, 0.5)
        .to(hangs, { y: 0, opacity: 1, duration: 1.5, stagger: { each: 0.14, from: wrapped ? "start" : "center" }, ease: "elastic.out(0.9, 0.42)" }, 0.9)
        .fromTo(hangs, { rotation: (i) => (i % 2 ? 9 : -9) }, { rotation: 0, duration: 2.4, stagger: { each: 0.14, from: "center" }, ease: "elastic.out(1, 0.22)" }, 0.9)
        .fromTo(stamps, { opacity: 0, scale: 2.6, rotation: -30 }, { opacity: 1, scale: 1, rotation: -14, duration: 0.35, stagger: 0.16, ease: "power4.in" }, 2.3)
        .add(() => stamps.forEach((_, i) => gsap.delayedCall(i * 0.16 + 0.35, () => kick(i, i % 2 ? 4 : -4))), 2.3)
        .fromTo(q(".wf-ledger"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 2.9);
      const st = ScrollTrigger.create({ trigger: root, start: "top 62%", once: true, onEnter: () => intro.play() });

      // Idle: each badge sways on its own rhythm; the spotlights sweep.
      slots.forEach((s, i) => gsap.fromTo(s, { rotation: -1.2 }, { rotation: 1.2, duration: 2.6 + i * 0.45, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.3 }));
      gsap.to(q(".wf-beams i"), { rotation: (i) => [14, -10, 18][i], duration: (i) => 7 + i * 2, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // Fast scrolling jostles the whole crew.
      let lastKick = 0;
      const vel = ScrollTrigger.create({
        trigger: root, start: "top bottom", end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity(), t = performance.now();
          if (Math.abs(v) > 900 && t - lastKick > 700 && intro.progress() === 1) {
            lastKick = t;
            hangs.forEach((_, i) => kick(i, (v / 260) * (i % 2 ? 1 : -0.8)));
          }
        },
      });

      // Desktop: badges the cursor brushes past swing; the holographic foil follows the pointer.
      const offs: (() => void)[] = [];
      if (desktop) {
        let px = 0;
        const onMove = (e: PointerEvent) => {
          const vx = e.clientX - px; px = e.clientX;
          if (intro.progress() < 1 || Math.abs(vx) < 6) return;
          hangs.forEach((h, i) => {
            const r = h.getBoundingClientRect();
            if (e.clientX > r.left - 20 && e.clientX < r.right + 20 && e.clientY > r.top && e.clientY < r.bottom) kick(i, vx * 0.35);
          });
        };
        root.addEventListener("pointermove", onMove);
        offs.push(() => root.removeEventListener("pointermove", onMove));
        (q(".wf-badge") as HTMLElement[]).forEach((b) => {
          const foil = (e: PointerEvent) => {
            const r = b.getBoundingClientRect();
            b.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
            b.style.setProperty("--py", `${((e.clientY - r.top) / r.height) * 100}%`);
          };
          b.addEventListener("pointermove", foil);
          offs.push(() => b.removeEventListener("pointermove", foil));
        });
      }

      // On shift: one agent at a time picks up a new task; the ledger counts it.
      const now = q(".wf-now"), leds = q(".wf-led"), count = q(".wf-count")[0];
      const step = crew.map(() => 0);
      let tasks = 1284, running = false, call: gsap.core.Tween | null = null, last = -1;
      const tick = () => {
        if (!running) return;
        let i = Math.floor(Math.random() * crew.length);
        if (i === last) i = (i + 1) % crew.length;
        last = i;
        step[i] = (step[i] + 1) % crew[i].tasks.length;
        gsap.timeline()
          .fromTo(leds[i], { scale: 2.4 }, { scale: 1, duration: 0.6, ease: "power2.out" }, 0)
          .set(now[i], { text: "" }, 0)
          .to(now[i], { text: { value: crew[i].tasks[step[i]] }, duration: 0.9, ease: "none" }, 0.1)
          .add(() => { tasks += 1 + Math.floor(Math.random() * 3); count.textContent = tasks.toLocaleString("en-US"); }, 0.1);
        call = gsap.delayedCall(1.5, tick);
      };
      const loop = ScrollTrigger.create({
        trigger: root, start: "top 60%", end: "bottom top",
        onToggle: (s) => { running = s.isActive; call?.kill(); if (running) call = gsap.delayedCall(3.4, tick); },
      });

      return () => { running = false; call?.kill(); st.kill(); vel.kill(); loop.kill(); offs.forEach((f) => f()); };
    });

    return () => { splits.forEach((s) => s.revert()); mm.revert(); };
  }, []);

  return (
    <article ref={ref} className="tile tile-full dark wf">
      <div className="wf-beams" aria-hidden="true"><i /><i /><i /></div>
      <p className="wf-bigword" aria-hidden="true">HIRED.</p>

      <p className="tile-eyebrow grad-text">Zintraz AI</p>
      <h2 className="wf-title">Meet the <span className="grad-text">Zintraz AI</span> agents.</h2>
      <p className="tile-sub">Always on, working inside your systems from day one. <em>Illustrative example — not client data.</em></p>
      <div className="tile-links">
        <Link href="/ai" className="btn btn-primary">Explore Zintraz AI</Link>
        <Link href="/contact" className="link-chev">Start an AI assessment <ChevronRight size={18} /></Link>
      </div>

      <div className="wf-stage">
        <div className="wf-rail" aria-hidden="true" />
        <ul className="wf-crew">
          {crew.map(({ name, role, Icon, c, id, len, stat, tasks }) => (
            <li key={name} className="wf-slot" style={{ ["--c" as string]: c, ["--len" as string]: `${len}px` }}>
              <div className="wf-hang">
                <span className="wf-strap" aria-hidden="true"><span>ZINTRAZ · ZINTRAZ · ZINTRAZ · ZINTRAZ ·</span></span>
                <span className="wf-clip" aria-hidden="true" />
                <div className="wf-badge">
                  <span className="wf-foil" aria-hidden="true" />
                  <div className="wf-badge-top"><b>ZINTRAZ</b><span>AI staff</span></div>
                  <div className="wf-avatar" aria-hidden="true"><Icon size={26} /></div>
                  <h3>{name}</h3>
                  <p className="wf-role">{role}</p>
                  <dl className="wf-fields">
                    <div><dt>Shift</dt><dd>24/7</dd></div>
                    <div><dt>Breaks</dt><dd>0</dd></div>
                    <div><dt>Speaks</dt><dd>EN · SI · TA</dd></div>
                    <div><dt>{stat[0]}</dt><dd>{stat[1]}</dd></div>
                  </dl>
                  <p className="wf-task"><i className="wf-led" aria-hidden="true" /><span>Now:</span> <span className="wf-now">{tasks[0]}</span></p>
                  <div className="wf-code" aria-hidden="true"><span className="wf-bars" /><span>{id}</span></div>
                  <span className="wf-stamp" aria-hidden="true">Hired</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="wf-ledger">
        <span>Overtime paid <b>$0</b></span>
        <span>Sick days <b>0</b></span>
        <span>Tasks done today <b className="wf-count">1,284</b></span>
        <span>Sample data, for illustration</span>
      </p>
    </article>
  );
}
