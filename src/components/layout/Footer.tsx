import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP } from "@/lib/contact";
import { BASE_PATH } from "@/lib/site";
import MotionToggle from "@/components/ui/MotionToggle";

import { footerColumns } from "@/lib/nav";

export default function Footer() {
  return (
    <>
      <footer className="gfoot">
        <div className="container">
          <p className="gfoot-note">
            <strong>Business Transformation Engineering.</strong> We engineer software, intelligence and connected
            systems that help businesses operate better, move faster and grow with confidence.
          </p>
          <p className="gfoot-note">
            Free consultation, no commitment. <Link href="/contact">Start a transformation assessment</Link> or chat with us on{" "}
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
          </p>
          <div className="gfoot-cols">
            {footerColumns.map((c) => (
              <div key={c.title}>
                <h4>{c.title}</h4>
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
              </div>
            ))}
          </div>
          <div className="gfoot-bottom">
            <Image src={`${BASE_PATH}/zyntraz-logo.png`} alt="Zyntraz" width={894} height={174} className="gfoot-logo" />
            <span>Copyright © {new Date().getFullYear()} Zyntraz · Sri Lanka. Innovate • Dominate • Elevate.</span>
            <span className="gfoot-tag"><MotionToggle /></span>
          </div>
        </div>
      </footer>
      <a className="wa-fab" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Chat with Zyntraz on WhatsApp">
        <MessageCircle size={24} />
      </a>
    </>
  );
}
