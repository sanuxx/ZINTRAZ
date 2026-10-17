"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronsLeftRight, FileText, LayoutGrid, Settings, Users } from "lucide-react";
import type { Industry } from "@/lib/industries";
import { BASE_PATH } from "@/lib/site";
import { SCENES } from "./OperationScenes";

/**
 * "Flip the operation" as a before/after slider over one realistic scene per industry (OperationScenes).
 * Left of the handle: that industry's desk today, one artifact per problem. Right of the handle: the same
 * four spots inside its ZYNTRAZ screen, each carrying its outcome. Drag anywhere, use the arrow keys on
 * the handle, or the Today / With ZYNTRAZ switch. The first time it is in view it sweeps once as a hint.
 */
export default function OperationSlider({ ind }: { ind: Industry }) {
  const [pos, setPos] = useState(64);
  const [anim, setAnim] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const timers = useRef<number[]>([]);
  const scene = SCENES[ind.slug] ?? SCENES.other;
  const { Before, After } = scene;

  const glide = (to: number) => { setAnim(true); setPos(to); };
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  // First time in view: sweep right-to-left and settle in the middle, so the handle explains itself.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      timers.current.push(window.setTimeout(() => glide(14), 500), window.setTimeout(() => glide(50), 1700));
    }, { threshold: 0.55 });
    io.observe(el);
    return () => { io.disconnect(); clear(); };
  }, []);

  const at = (x: number) => {
    const b = stage.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((x - b.left) / b.width) * 100)));
  };
  const down = (e: React.PointerEvent) => {
    clear(); setAnim(false); drag.current = true;
    stage.current!.setPointerCapture(e.pointerId);
    at(e.clientX);
  };
  const key = (e: React.KeyboardEvent) => {
    const step = { ArrowLeft: -5, ArrowRight: 5 }[e.key];
    if (step) { e.preventDefault(); clear(); glide(Math.min(100, Math.max(0, pos + step))); }
    if (e.key === "Home") { e.preventDefault(); glide(0); }
    if (e.key === "End") { e.preventDefault(); glide(100); }
  };

  return (
    <div className="ixp-board">
      <div className="ixp-board-head">
        <div className="ixp-board-title">
          <b>Flip the operation</b>
          <span>Drag the handle to compare today with the system we engineer.</span>
        </div>
        <div className="ixp-switch" role="group" aria-label="Show">
          <button type="button" aria-pressed={pos > 50} className={pos > 50 ? "is-on" : undefined} onClick={() => { clear(); glide(100); }}>Today</button>
          <button type="button" aria-pressed={pos <= 50} className={pos <= 50 ? "is-on" : undefined} onClick={() => { clear(); glide(0); }}>With ZYNTRAZ</button>
        </div>
      </div>

      <div ref={stage} className={`ops${anim ? " is-anim" : ""}`} data-scene={ind.slug} style={{ ["--pos" as string]: `${pos}%`, ["--pn" as string]: pos }}
        onPointerDown={down} onPointerMove={(e) => drag.current && at(e.clientX)} onPointerUp={() => { drag.current = false; }} onPointerCancel={() => { drag.current = false; }}>

        <div className="ops-today" aria-label={`${ind.short} today`}>
          <Before t={ind.problems} />
        </div>

        <div className="ops-with" aria-label={`${ind.short} with ZYNTRAZ`}>
          <div className="ops-app">
            <div className="ops-app-bar"><i /><i /><i /><span>{scene.url}</span></div>
            <div className="ops-app-body">
              <nav className="ops-side" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BASE_PATH}/zyntraz-mark.png`} alt="" width={22} height={22} />
                <LayoutGrid size={16} className="on" /><Users size={16} /><FileText size={16} /><Bell size={16} /><Settings size={16} />
              </nav>
              <div className="ops-main">
                <div className="ops-main-head"><b>{scene.app}</b><span>All systems synced</span></div>
                <div className="ops-grid"><After t={ind.outcomes} /></div>
              </div>
            </div>
          </div>
        </div>

        <span className="ops-label l">Today</span>
        <span className="ops-label r">With ZYNTRAZ</span>
        <div className="ops-handle" role="slider" tabIndex={0} aria-label="Compare today with ZYNTRAZ" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} aria-valuetext={`${Math.round(100 - pos)}% with ZYNTRAZ`} onKeyDown={key}>
          <span><ChevronsLeftRight size={18} /></span>
        </div>
      </div>
    </div>
  );
}
