import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/lib/contact";
import { BASE_PATH } from "@/lib/site";
import MotionToggle from "@/components/ui/MotionToggle";
import FooterColumns from "@/components/layout/FooterColumns";

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
          <FooterColumns />
          <div className="gfoot-bottom">
            <Image src={`${BASE_PATH}/zintraz-logo.png`} alt="Zintraz" width={894} height={158} className="gfoot-logo" />
            <span>Copyright © {new Date().getFullYear()} Zintraz · Sri Lanka. Innovate • Dominate • Elevate.</span>
            <span className="gfoot-tag"><MotionToggle /></span>
          </div>
        </div>
      </footer>
      <a className="wa-fab" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Chat with Zintraz on WhatsApp">
        <MessageCircle size={24} />
      </a>
    </>
  );
}
