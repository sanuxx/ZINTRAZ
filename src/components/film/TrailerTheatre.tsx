"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, X } from "lucide-react";
import gsap from "gsap";
import WorkflowFilm, { FILM_LEN, buildFilm, chapterAt } from "@/components/film/WorkflowFilm";
import { statusLabel, type Product } from "@/components/sections/Products";
import { scroll } from "@/lib/scroll";

const TRAILER_SECONDS = 22;
const CHAPTERS = [
  { label: "Without", at: "without", from: -2 },
  { label: "Switch on", at: "on", from: -1 },
  { label: "Step 1", at: "s0", from: 0 },
  { label: "Step 2", at: "s1", from: 1 },
  { label: "Step 3", at: "s2", from: 2 },
  { label: "Step 4", at: "s3", from: 3 },
  { label: "Result", at: "result", from: 4 },
];

/**
 * A full-screen theatre that plays one product's film as a trailer (~22s), with chapters, play/pause, replay
 * and previous/next across the lineup.
 *
 * It is a modal dialog: page scroll is stopped while it is open, focus is held inside it, Escape closes it and
 * focus goes back to whatever opened it. The arrow keys step between products. Under reduced motion (or on a
 * narrow screen) nothing plays: the film shows its storyboard layout instead.
 */
export default function TrailerTheatre({
  list,
  index,
  onClose,
  onNav,
}: {
  list: Product[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  const product = list[index];
  const dialog = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [playing, setPlaying] = useState(true);
  const [chapter, setChapter] = useState(-2);
  const [live, setLive] = useState(false);

  // Open/close, once: stop the page, take focus, and give it back to the opener on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    scroll.lenis?.stop();
    root.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLElement>(".tt-close")?.focus();
    return () => {
      root.style.overflow = "";
      scroll.lenis?.start();
      opener?.focus?.();
    };
  }, []);

  // Keyboard: Escape closes, arrows step through the lineup, Tab stays inside the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowRight") onNav(index + 1);
      else if (e.key === "ArrowLeft") onNav(index - 1);
      else if (e.key === "Tab" && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>("button, a[href]")).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onNav]);

  // Build and play this product's film; rebuilt whenever the product changes.
  useEffect(() => {
    const film = dialog.current?.querySelector<HTMLElement>(".fl");
    if (!film) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("rm") || window.innerWidth < 760;
    setLive(!still);
    setChapter(-2);
    if (still) return;

    film.classList.add("fl-live");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
        onUpdate() {
          bar.current?.style.setProperty("--p", String(this.progress()));
          setChapter(chapterAt(this.time()));
        },
        onComplete: () => setPlaying(false),
      });
      buildFilm(tl, film);
      tl.timeScale(FILM_LEN / TRAILER_SECONDS);
      tlRef.current = tl;
      setPlaying(true);
      gsap.delayedCall(0.35, () => tl.play(0));
    }, film);

    return () => { tlRef.current = null; ctx.revert(); film.classList.remove("fl-live"); };
  }, [product.id]);

  const toggle = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (tl.progress() >= 1) { tl.restart(); setPlaying(true); return; }
    tl.paused(!tl.paused());
    setPlaying(!tl.paused());
  };
  const replay = () => { tlRef.current?.restart(); setPlaying(true); };
  const seek = (label: string) => { tlRef.current?.play(label); setPlaying(true); };

  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];

  return createPortal(
    <div ref={dialog} className="tt" role="dialog" aria-modal="true" aria-label={`${product.name}: how it works`} style={{ ["--c" as string]: product.accent }}>
      <header className="tt-top">
        <div className="tt-title">
          <span className="tt-cat">{product.category}</span>
          <strong>{product.name}</strong>
          <span className={`pstatus pstatus-${product.status}`}>{statusLabel[product.status]}</span>
        </div>
        <button type="button" className="tt-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
      </header>

      <div className={`tt-screen${live ? " is-live" : ""}`}>
        <WorkflowFilm key={product.id} product={product} tone="dark" />
      </div>

      <footer className="tt-bar">
        <button type="button" className="tt-nav" onClick={() => onNav(index - 1)} aria-label={`Previous: ${prev.name}`}>
          <ChevronLeft size={18} /><span>{prev.name}</span>
        </button>

        {live && (
          <div className="tt-controls">
            <button type="button" className="tt-btn" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button type="button" className="tt-btn" onClick={replay} aria-label="Replay"><RotateCcw size={17} /></button>
            <div className="tt-chapters">
              <span ref={bar} className="tt-progress" aria-hidden="true" />
              {CHAPTERS.map((c) => (
                <button key={c.at} type="button" className={c.from === chapter ? "is-on" : undefined} onClick={() => seek(c.at)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="button" className="tt-nav tt-next" onClick={() => onNav(index + 1)} aria-label={`Next: ${next.name}`}>
          <span>{next.name}</span><ChevronRight size={18} />
        </button>
      </footer>
    </div>,
    document.body,
  );
}
