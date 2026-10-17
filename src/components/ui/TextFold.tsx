"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * Site-wide "read on demand": long paragraphs are folded away so pages lead with headings, pictures and actions.
 *
 * Only long prose is folded: paragraphs of 220+ characters in the page body (outside the page's hero, forms, FAQ
 * answers, CTA bands and anything marked `data-keep`). Short ledes and card descriptions always stay visible, so
 * cards never collapse to a bare title. Within each section (or card) the first folded paragraph becomes a small
 * "Read more" control; the rest are hidden. Clicking that control — or anywhere in the section that isn't itself
 * interactive — opens all of the section's text in place. Clicking the section's heading folds it again.
 *
 * It works on the rendered page, so it covers every section without each one opting in, and it only ever adds
 * attributes (never moves or inserts nodes) so it can't disturb React. A mutation observer picks up text that
 * renders later (client navigation, scenes that swap content). The text stays in the page for search engines and
 * screen readers either way.
 */
const MIN_CHARS = 220;
const SKIP = "form, [data-keep], .tt, a, button, label, details, .faq-list, .ctaband";

/**
 * The repeated item a paragraph belongs to — a card in a row of cards, an item in a list — or null. Found by walking
 * up from the paragraph to the section and taking the first ancestor that has same-class siblings.
 */
function itemOf(p: Element): Element | null {
  const stop = p.closest("section");
  for (let el = p.parentElement; el && el !== stop && el !== document.body; el = el.parentElement) {
    if (el.tagName === "ARTICLE") return el;
    const parent = el.parentElement;
    if (!parent || !el.className || typeof el.className !== "string") continue;
    const twins = Array.from(parent.children).filter((c) => c !== el && c.tagName === el.tagName && c.className === el.className);
    if (twins.length) return el;
  }
  return null;
}

// A card is its own fold group, so each card keeps its own "Read more"; anything else folds with its section.
function hostOf(p: Element) {
  return itemOf(p) ?? p.closest("section") ?? p.parentElement;
}

function fold(p: HTMLParagraphElement, host: Element) {
  host.setAttribute("data-fold-host", "");
  const open = host.hasAttribute("data-fold-open");
  const lead = host.querySelector('p[data-fold="lead"]');
  if (!lead || !lead.isConnected) {
    p.setAttribute("data-fold", "lead");
    p.setAttribute("role", "button");
    p.setAttribute("tabindex", "0");
    p.setAttribute("aria-expanded", String(open));
  } else {
    p.setAttribute("data-fold", "rest");
  }
  if (open) p.setAttribute("data-open", "");
}

function scan(main: HTMLElement) {
  // The page's hero is the first block inside its `.page` wrapper (which may itself sit inside a layout wrapper).
  // Pages without that wrapper (the home page) use their first section as the hero.
  const hero = main.querySelector(".page")?.firstElementChild ?? main.querySelector("section");
  const skip = (p: Element) => (hero && hero.contains(p)) || !!p.closest(SKIP);
  main.querySelectorAll<HTMLParagraphElement>("p:not([data-fold-seen])").forEach((p) => {
    p.setAttribute("data-fold-seen", "");
    if (skip(p) || (p.textContent ?? "").trim().length < MIN_CHARS) return;
    const host = hostOf(p);
    if (host) fold(p, host);
  });
}

function setOpen(host: Element, open: boolean) {
  if (open) host.setAttribute("data-fold-open", "");
  else host.removeAttribute("data-fold-open");
  host.querySelectorAll("p[data-fold]").forEach((p) => {
    if (open) p.setAttribute("data-open", ""); else p.removeAttribute("data-open");
    if (p.getAttribute("data-fold") === "lead") p.setAttribute("aria-expanded", String(open));
  });
  // Opening text changes heights, which moves every pinned scene below it.
  window.setTimeout(() => ScrollTrigger.refresh(), 60);
}

export default function TextFold() {
  const path = usePathname();

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    scan(main);

    let timer = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => scan(main), 250);
    });
    mo.observe(main, { childList: true, subtree: true });

    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t) return;
      const host = t.closest("[data-fold-host]");
      if (!host) return;
      const open = host.hasAttribute("data-fold-open");
      // The section heading folds an open section back up.
      if (open && t.closest("h2, h3") && host.contains(t.closest("h2, h3"))) { setOpen(host, false); return; }
      if (open) return;
      if (t.closest('p[data-fold="lead"]')) { setOpen(host, true); return; }
      // Anywhere else in the section opens it too, unless the click was meant for something interactive.
      if (t.closest("a, button, input, select, textarea, label, [role=slider], [role=button], [role=tab], svg, canvas")) return;
      setOpen(host, true);
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as Element | null;
      if (!t || (e.key !== "Enter" && e.key !== " ")) return;
      const lead = t.closest('p[data-fold="lead"]');
      if (!lead) return;
      e.preventDefault();
      const host = lead.closest("[data-fold-host]");
      if (host) setOpen(host, !host.hasAttribute("data-fold-open"));
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      mo.disconnect();
      window.clearTimeout(timer);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [path]);

  return null;
}
