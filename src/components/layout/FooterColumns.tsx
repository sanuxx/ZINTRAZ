"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP } from "@/lib/contact";
import { footerColumns } from "@/lib/nav";

/**
 * The footer's link columns. Each column is a <details>: open on wider screens, where the summary is just
 * the column heading, and collapsed into tap-to-open sections on phones, where six open columns of links
 * would run for two screens. Columns render open so nothing is hidden before hydration or without JS.
 */
const PHONE = "(max-width: 560px)";

export default function FooterColumns() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const sync = () => root.current?.querySelectorAll("details").forEach((d) => { d.open = !mq.matches; });
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="gfoot-cols" ref={root}>
      {footerColumns.map((c) => (
        <details key={c.title} className="gfoot-col" open>
          <summary><h4>{c.title}</h4></summary>
          <ul>
            {c.links.map((l) => <li key={l.href + l.label}><Link href={l.href}>{l.label}</Link></li>)}
            {/* The direct lines belong with the Contact links rather than in a column of their own. */}
            {c.title === "Contact" && (
              <>
                <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
                <li><a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></li>
                <li><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              </>
            )}
          </ul>
        </details>
      ))}
    </div>
  );
}
