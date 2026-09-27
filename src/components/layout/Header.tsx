"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BASE_PATH } from "@/lib/site";

export const navLinks = [
  { label: "AI", href: "/ai" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Use cases", href: "/solutions" },
  { label: "Company", href: "/company" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  return (
    <>
      <header className={`gnav${open ? " is-open" : ""}`}>
        <div className="gnav-row">
          <Link href="/" className="gnav-logo" aria-label="Zyntraz home" onClick={close}>
            <Image src={`${BASE_PATH}/zyntraz-logo-white.png`} alt="Zyntraz" width={894} height={174} priority />
          </Link>
          <nav className="gnav-links" aria-label="Primary">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={pathname.startsWith(l.href) ? "is-active" : undefined}>{l.label}</Link>
            ))}
          </nav>
          <Link href="/contact" className="gnav-cta">Book a demo</Link>
          <button className="gnav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span /><span />
          </button>
        </div>
      </header>

      <div className={`gmenu${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile">
          <Link href="/" style={{ ["--i" as string]: 0 }} onClick={close}>Home</Link>
          {navLinks.map((l, i) => (
            <Link key={l.href} href={l.href} style={{ ["--i" as string]: i + 1 }} onClick={close}>{l.label}</Link>
          ))}
        </nav>
        <Link href="/contact" className="btn btn-primary btn-lg" style={{ ["--i" as string]: navLinks.length + 1 }} onClick={close}>Start a transformation assessment</Link>
      </div>
    </>
  );
}
