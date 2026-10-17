"use client";

import { useState } from "react";
import { Bot, FileSpreadsheet, Unplug, EyeOff, Repeat, UserX, TrendingDown } from "lucide-react";

const pains = [
  {
    icon: FileSpreadsheet,
    title: "Your business runs on spreadsheets, WhatsApp and memory.",
    desc: "Orders in one place, stock in another, customer notes in someone's phone. Nobody has one version of the truth — so mistakes are guaranteed.",
    quote: "“Who updated the stock sheet… and which one is the latest?”",
    wide: true,
  },
  {
    icon: Repeat,
    title: "Your team does robot work.",
    desc: "Hours every week lost to copy-paste, re-typing invoices and chasing approvals — work a system should do in seconds.",
    quote: "“I spend half my day on data entry.”",
  },
  {
    icon: Unplug,
    title: "Your tools don't talk to each other.",
    desc: "POS, accounts, bookings and CRM all live in silos. Every hand-off is manual, and every manual hand-off is a chance to get it wrong.",
    quote: "“We enter the same order three times.”",
  },
  {
    icon: EyeOff,
    title: "You're making decisions blind.",
    desc: "Reports take days to put together and are outdated when they arrive. You can't fix what you can't see.",
    quote: "“I only find out we lost money at month-end.”",
  },
  {
    icon: UserX,
    title: "Leads and customers slip through the cracks.",
    desc: "No follow-up system means enquiries go cold and loyal customers quietly leave. That's revenue you already paid to win.",
    quote: "“We forgot to call them back.”",
  },
  {
    icon: TrendingDown,
    title: "Off-the-shelf software fits nobody.",
    desc: "You bend your business around a template, pay for features you never use — and it still can't do the one thing you actually need.",
    quote: "“The software decides how we work, not us.”",
  },
  {
    icon: Bot,
    title: "Everyone's talking about AI. You don't know where to start.",
    desc: "Competitors are putting AI to work while you're stuck with chatbots that don't know your business and don't connect to anything. The gap grows every month.",
    quote: "“We tried ChatGPT, but it can't actually do anything in our systems.”",
    wide: true,
  },
];

function Calculator() {
  const [team, setTeam] = useState(8);
  const [hours, setHours] = useState(6);
  const yearly = team * hours * 48;
  const fte = yearly / 1920;
  const reclaim = Math.round(yearly * 0.5);

  const fill = (v: number, min: number, max: number) => ({ ["--fill" as string]: `${((v - min) / (max - min)) * 100}%` });

  return (
    <div className="calc">
      <label>
        <span className="calc-row">People on your team <output>{team}</output></span>
        <input type="range" min={1} max={100} value={team} style={fill(team, 1, 100)} onChange={(e) => setTeam(+e.target.value)} />
      </label>
      <label>
        <span className="calc-row">Hours per person, per week, on repetitive tasks <output>{hours}h</output></span>
        <input type="range" min={1} max={30} value={hours} style={fill(hours, 1, 30)} onChange={(e) => setHours(+e.target.value)} />
      </label>
      <div className="calc-result">
        <div>
          <strong style={{ color: "var(--pain)" }}>{yearly.toLocaleString()}</strong>
          <span>hours lost every year</span>
        </div>
        <div>
          <strong>{fte.toFixed(1)}</strong>
          <span>full-time employees&apos; worth of effort</span>
        </div>
      </div>
      <p className="calc-note">
        Automate even half of it and you win back <b style={{ color: "var(--ok)" }}>{reclaim.toLocaleString()} hours</b> a year.
        Estimate based on 48 working weeks and a 40-hour week.
      </p>
    </div>
  );
}

export default function PainPoints() {
  return (
    <section className="section pain" id="problems">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow pain" data-reveal>Sound familiar?</span>
          <h2 className="h-lg" data-reveal style={{ ["--d" as string]: ".1s" }}>
            Your business is growing.<br />
            <span style={{ color: "var(--dim)" }}>Your systems aren&apos;t.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--d" as string]: ".2s" }}>
            Most growing businesses don&apos;t have a people problem or a demand problem. They have an operations problem —
            and it gets more expensive every month it&apos;s ignored.
          </p>
        </div>

        <div className="pain-grid">
          {pains.map(({ icon: Icon, title, desc, quote, wide }, i) => (
            <article key={title} className={`glass spot pain-card${wide ? " wide" : ""}`} data-reveal style={{ ["--d" as string]: `${(i % 3) * 0.08}s` }}>
              <span className="pain-ico"><Icon size={20} /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <p className="pain-quote">{quote}</p>
            </article>
          ))}
        </div>

        <div className="glass pain-cost" id="calculator" data-reveal>
          <div style={{ display: "grid", gap: 18 }}>
            <span className="eyebrow pain">The hidden cost</span>
            <h3>What is manual work really costing you?</h3>
            <p className="lede" style={{ fontSize: 16 }}>
              Every hour your team spends on work a system could do is an hour not spent serving customers or growing
              the business. Move the sliders and see it for yourself.
            </p>
          </div>
          <Calculator />
        </div>
      </div>
    </section>
  );
}
