"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BASE_PATH } from "@/lib/site";
import { CTA, navTree } from "@/lib/nav";

// The header is a flat row of section links: each one goes to its hub page, which links onward.
// Contact is left out because the CTA button already goes there.
const links = navTree.filter((item) => item.href !== CTA.href);

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return base !== "/" && pathname.startsWith(base);
  };

  return (
    <>
      <header className={`gnav${open ? " is-open" : ""}`}>
        <div className="gnav-row">
          <Link href="/" className="gnav-logo" aria-label="Zintraz home" onClick={close}>
            <Image src={`${BASE_PATH}/zintraz-logo.png`} alt="Zintraz" width={894} height={158} loading="eager" fetchPriority="high" />
          </Link>
          <nav className="gnav-links" aria-label="Primary">
            {links.map((item) => (
              <div key={item.href} className={`gnav-item${isActive(item.href) ? " is-active" : ""}`}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={close}>
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
          <Link href={CTA.href} className="gnav-cta" onClick={close}>{CTA.label} →</Link>
          <button className="gnav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span /><span />
          </button>
        </div>
      </header>

      <div className={`gmenu${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile">
          <Link href="/" style={{ ["--i" as string]: 0 }} onClick={close}>Home</Link>
          {links.map((item, i) => (
            <Link key={item.href} href={item.href} style={{ ["--i" as string]: i + 1 }} onClick={close}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={CTA.href} className="btn btn-primary btn-lg" style={{ ["--i" as string]: links.length + 1 }} onClick={close}>
          Start a transformation assessment
        </Link>
      </div>
    </>
  );
}
