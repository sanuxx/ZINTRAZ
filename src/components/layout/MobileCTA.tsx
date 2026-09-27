"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/lib/contact";

// Phone-only bar that keeps the primary action in reach once the hero is scrolled past.
export default function MobileCTA() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/contact")) return null;

  return (
    <div className={`mcta${shown ? " is-shown" : ""}`} aria-hidden={!shown} inert={!shown}>
      <Link href="/contact" className="btn btn-primary mcta-main">Start a transformation assessment</Link>
      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="mcta-wa" aria-label="Chat on WhatsApp">
        <MessageCircle size={22} />
      </a>
    </div>
  );
}
