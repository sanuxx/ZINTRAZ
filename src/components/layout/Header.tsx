"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { BASE_PATH } from "@/lib/site";
import { CTA, navTree, type NavItem } from "@/lib/nav";

/**
 * Each mega panel leads with an "Overview" link to the section's own hub page. The top-level label
 * is a button rather than a link (it has to toggle the panel for keyboard and touch users), so
 * without this the hub page would be unreachable from the nav.
 */
function panelGroups(item: NavItem) {
  const [first, ...rest] = item.groups ?? [];
  return [
    { title: first?.title ?? item.label, links: [{ label: `${item.label} overview`, href: item.href, desc: undefined }, ...(first?.links ?? [])] },
    ...rest,
  ];
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<number | null>(null);
  const [acc, setAcc] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  // Every link closes what it was opened from, so navigating never leaves a panel hanging open.
  const close = () => {
    setOpen(false);
    setAcc(null);
    setMega(null);
  };

  const cancelClose = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  // A short grace period so the panel survives the pointer crossing the gap below the trigger.
  const scheduleClose = () => {
    cancelClose();
    timer.current = window.setTimeout(() => setMega(null), 180);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setAcc(null);
      if (mega !== null) {
        triggers.current[mega]?.focus();
        setMega(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return base !== "/" && pathname.startsWith(base);
  };

  return (
    <>
      <header className={`gnav${open ? " is-open" : ""}`} onMouseLeave={scheduleClose}>
        <div className="gnav-row">
          <Link href="/" className="gnav-logo" aria-label="Zyntraz home" onClick={close}>
            <Image src={`${BASE_PATH}/zyntraz-logo.png`} alt="Zyntraz" width={894} height={174} loading="eager" fetchPriority="high" />
          </Link>
          <nav className="gnav-links" aria-label="Primary">
            {navTree.map((item, i) =>
              item.groups ? (
                <div
                  key={item.href}
                  className={`gnav-item${mega === i ? " is-open" : ""}${isActive(item.href) ? " is-active" : ""}`}
                  onMouseEnter={() => {
                    cancelClose();
                    setMega(i);
                  }}
                  // Closing on focus leaving the item keeps keyboard users inside the panel while it
                  // is open, without a focus trap they could not Tab out of.
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMega((m) => (m === i ? null : m));
                  }}
                >
                  <button
                    ref={(el) => {
                      triggers.current[i] = el;
                    }}
                    className="gnav-trigger"
                    aria-expanded={mega === i}
                    aria-controls={`mega-${i}`}
                    onClick={() => setMega((m) => (m === i ? null : i))}
                    onFocus={() => {
                      cancelClose();
                      setMega(i);
                    }}
                  >
                    {item.label} <ChevronDown size={13} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div key={item.href} className={`gnav-item${isActive(item.href) ? " is-active" : ""}`}>
                  <Link href={item.href} onFocus={scheduleClose} onMouseEnter={scheduleClose} onClick={close}>
                    {item.label}
                  </Link>
                </div>
              ),
            )}
          </nav>
          <Link href={CTA.href} className="gnav-cta" onClick={close}>{CTA.label} →</Link>
          <button className="gnav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span /><span />
          </button>
        </div>

        {navTree.map((item, i) =>
          item.groups ? (
            <div
              key={item.href}
              id={`mega-${i}`}
              className={`mega${mega === i ? " is-open" : ""}`}
              aria-hidden={mega !== i}
              inert={mega !== i}
              onMouseEnter={cancelClose}
            >
              <div className="mega-inner">
                {panelGroups(item).map((g) => (
                  <div key={g.title} className="mega-col">
                    <p className="mega-title">{g.title}</p>
                    {g.links.map((l) => (
                      <Link key={l.href + l.label} href={l.href} className="mega-link" onClick={close}>
                        <b>{l.label}</b>
                        {l.desc && <span>{l.desc}</span>}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </header>

      <div className={`gmenu${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile">
          <Link href="/" style={{ ["--i" as string]: 0 }} onClick={close}>Home</Link>
          {navTree.map((item, i) => {
            const n = i + 1;
            if (!item.groups) {
              return (
                <Link key={item.href} href={item.href} style={{ ["--i" as string]: n }} onClick={close}>
                  {item.label}
                </Link>
              );
            }
            return (
              <div key={item.href} className={`gmenu-group${acc === i ? " is-open" : ""}`}>
                <div className="gmenu-top">
                  <Link href={item.href} style={{ ["--i" as string]: n }} onClick={close}>{item.label}</Link>
                  <button
                    className="gmenu-exp"
                    style={{ ["--i" as string]: n }}
                    aria-label={`${acc === i ? "Collapse" : "Expand"} ${item.label}`}
                    aria-expanded={acc === i}
                    onClick={() => setAcc((a) => (a === i ? null : i))}
                  >
                    <ChevronDown size={20} aria-hidden="true" />
                  </button>
                </div>
                {acc === i && (
                  <div className="gmenu-sub">
                    {item.groups.map((g) => (
                      <div key={g.title} style={{ display: "contents" }}>
                        <p className="gmenu-subtitle">{g.title}</p>
                        {g.links.map((l) => (
                          <Link key={l.href + l.label} href={l.href} onClick={close}>{l.label}</Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <Link href={CTA.href} className="btn btn-primary btn-lg" style={{ ["--i" as string]: navTree.length + 1 }} onClick={close}>
          Start a transformation assessment
        </Link>
      </div>
    </>
  );
}
