import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP } from "@/lib/contact";
import { BASE_PATH } from "@/lib/site";
import MotionToggle from "@/components/ui/MotionToggle";

const cols = [
  { title: "Transformation", links: [["Problems we solve", "/solutions#problems"], ["Cost calculator", "/solutions#calculator"], ["Industries", "/solutions#industries"]] },
  { title: "Engineering", links: [["What we engineer", "/services#services"], ["How we work", "/services#process"], ["Engineering capabilities", "/services#tech"]] },
  { title: "AI", links: [["Zyntraz AI", "/ai"], ["Agent demo", "/ai#demo"], ["Capabilities", "/ai#capabilities"], ["Trust & safety", "/ai#trust"]] },
  { title: "Platforms", links: [["ZynRest", "/products#zynrest"], ["ZynStay", "/products#zynstay"], ["ZynDesk (coming soon)", "/products#zyndesk"], ["ZynCRM (coming soon)", "/products#zyncrm"]] },
  { title: "Company", links: [["About Zyntraz", "/company"], ["Start a transformation", "/contact"], ["FAQ", "/contact#faq"]] },
];

export default function Footer() {
  return (
    <>
      <footer className="gfoot">
        <div className="container">
          <p className="gfoot-note">
            No commitment. <Link href="/contact">Start a transformation assessment</Link> or chat with us on{" "}
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
          </p>
          <div className="gfoot-cols">
            {cols.map((c) => (
              <div key={c.title}>
                <h4>{c.title}</h4>
                <ul>{c.links.map(([l, h]) => <li key={l}><Link href={h}>{l}</Link></li>)}</ul>
              </div>
            ))}
            <div>
              <h4>Contact</h4>
              <ul>
                <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
                <li><a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></li>
                <li><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="gfoot-bottom">
            <Image src={`${BASE_PATH}/zyntraz-logo.png`} alt="Zyntraz" width={894} height={174} className="gfoot-logo" />
            <span>Copyright © {new Date().getFullYear()} Zyntraz. All rights reserved.</span>
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
