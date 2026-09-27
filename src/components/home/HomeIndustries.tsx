"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Building2, ChevronRight, GraduationCap, HeartPulse, Hotel, ShoppingBag, Truck } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { EASE, DUR } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  { icon: Hotel, name: "Hospitality", line: "Fragmented bookings & housekeeping → ZynStay + ZynRest" },
  { icon: ShoppingBag, name: "Retail & E-Commerce", line: "Stock out of sync across branches → one inventory & order system" },
  { icon: GraduationCap, name: "Education & EdTech", line: "Paper enrolment & attendance → custom student systems" },
  { icon: Building2, name: "Real Estate", line: "Leads lost between agents → custom property & pipeline systems" },
  { icon: HeartPulse, name: "Healthcare", line: "Scattered patient records & no-shows → custom clinic systems" },
  { icon: Truck, name: "Logistics", line: "Manual dispatch, no live tracking → fleet & tracking systems" },
];

export default function HomeIndustries() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".hd-ind-head", { y: 40, opacity: 0, duration: DUR.slow, ease: EASE.out, scrollTrigger: { trigger: ".hd-ind", start: "top 80%", once: true } });
      gsap.fromTo(".hd-ind-grid li",
        { clipPath: "inset(0% 0% 100% 0%)", y: 40 },
        { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: DUR.slow, stagger: 0.08, ease: EASE.out, scrollTrigger: { trigger: ".hd-ind-grid", start: "top 82%", once: true } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="hi" id="industries">
      <div className="container hd-ind">
        <div className="hd-ind-head">
          <p className="eyebrow">Industries we serve</p>
          <h3>Your industry&apos;s problems, and the systems that fix them.</h3>
          <Link href="/solutions#industries" className="link-chev">See industry use cases <ChevronRight size={18} /></Link>
        </div>
        <ul className="hd-ind-grid">
          {industries.map(({ icon: Icon, name, line }) => (
            <li key={name}>
              <Icon size={22} />
              <b>{name}</b>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
