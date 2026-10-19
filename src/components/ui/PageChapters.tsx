"use client";

import { useEffect, useState } from "react";

/**
 * A slim sticky bar of the page's chapters under the header: it shows where the reader is (the chapter
 * in the middle of the screen is lit) and jumps to any chapter. Rides up to the top edge while the
 * header is hidden on scroll. Styles: "Page chapters" in globals.css.
 */
export default function PageChapters({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter((e): e is HTMLElement => !!e);
    // The current chapter is the last one whose top has passed the middle of the screen (the first one
    // while still above it), worked out from the scroll position so jumps land on the right chapter too.
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let cur = els[0];
      for (const el of els) if (el.getBoundingClientRect().top <= mid) cur = el;
      if (cur) setActive(cur.id);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [items]);

  return (
    <nav className="pch" aria-label="On this page">
      <div className="container pch-in">
        {items.map((it, i) => (
          <a key={it.id} href={`#${it.id}`} className={it.id === active ? "is-on" : undefined} aria-current={it.id === active ? "true" : undefined}>
            <em>{String(i + 1).padStart(2, "0")}</em>{it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
