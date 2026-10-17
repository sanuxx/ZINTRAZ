"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { solutions } from "./data";

/**
 * The "neural orb": a slowly turning sphere of connected points with signals travelling its edges,
 * drawn on a canvas. It assembles from a scattered cloud on first view, leans toward the pointer and
 * only animates while on screen. With `chips`, the six solutions orbit it on a tilted ring, passing behind and in front.
 * Under reduced motion it renders one still frame.
 */
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

export default function Orb({ tone = "light", chips = false, className = "" }: { tone?: "light" | "dark"; chips?: boolean; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current!, cv = canvas.current!;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 700;
    const N = small ? 220 : 380;
    const dot = tone === "light" ? "11,92,255" : "190,215,255";
    const glow = tone === "light" ? "#2f80ff" : "#ffffff";

    // Points on a Fibonacci sphere, plus a scattered start position for the assembly.
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), p = i * GOLDEN;
      const s = 1.6 + Math.random() * 1.6, a = Math.random() * Math.PI * 2, b = Math.acos(Math.random() * 2 - 1);
      return { x: Math.cos(p) * r, y, z: Math.sin(p) * r, sx: Math.sin(b) * Math.cos(a) * s, sy: Math.cos(b) * s, sz: Math.sin(b) * Math.sin(a) * s };
    });
    // Each point links to its three nearest neighbours.
    const edges: [number, number][] = [];
    const adj: number[][] = pts.map(() => []);
    const seen = new Set<string>();
    pts.forEach((a, i) => {
      pts.map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 }))
        .sort((m, n) => m.d - n.d).slice(1, 4)
        .forEach(({ j }) => {
          const k = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(k)) return;
          seen.add(k); edges.push([i, j]); adj[i].push(j); adj[j].push(i);
        });
    });
    // Signals hop from point to point along the edges.
    const signals = Array.from({ length: small ? 8 : 14 }, () => {
      const from = Math.floor(Math.random() * N);
      return { from, to: adj[from][0], t: Math.random() };
    });

    const chipEls = Array.from(host.querySelectorAll<HTMLElement>(".ail-orb-chip"));
    const state = { form: still ? 1 : 0, mx: 0, my: 0, tx: 0, ty: 0, time: 0 };
    let w = 0, h = 0, R = 0;
    const proj = new Float32Array(N * 3);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth; h = host.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cv.style.width = `${w}px`; cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w, h) * 0.36;
      draw();
    };

    const draw = () => {
      const { form, mx, my, time } = state;
      const e = 1 - Math.pow(1 - form, 3);
      const ay = time * 0.14 + mx * 0.6, ax = 0.32 + my * 0.35;
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      const ox = w / 2, oy = h / 2;
      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const x0 = p.sx + (p.x - p.sx) * e, y0 = p.sy + (p.y - p.sy) * e, z0 = p.sz + (p.z - p.sz) * e;
        const x1 = x0 * cy + z0 * sy, z1 = -x0 * sy + z0 * cy;
        const y2 = y0 * cx - z1 * sx, z2 = y0 * sx + z1 * cx;
        const k = 2.8 / Math.max(0.6, 2.8 - z2);
        proj[i * 3] = ox + x1 * R * k; proj[i * 3 + 1] = oy + y2 * R * k; proj[i * 3 + 2] = Math.min(1, Math.max(0, (z2 + 1) / 2));
      }
      ctx.clearRect(0, 0, w, h);

      // Two tilted orbit rings.
      ctx.lineWidth = 1;
      for (const [rx, ry, rot, al] of [[1.42, 0.36, -0.2, 0.22], [1.2, 0.5, 0.5, 0.14]]) {
        ctx.beginPath();
        ctx.ellipse(ox, oy, R * rx, R * ry, rot + mx * 0.1, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${dot},${al * e})`;
        ctx.setLineDash([2, 6]); ctx.stroke(); ctx.setLineDash([]);
      }

      ctx.lineWidth = 0.8;
      for (const [a, b] of edges) {
        const d = (proj[a * 3 + 2] + proj[b * 3 + 2]) / 2;
        ctx.strokeStyle = `rgba(${dot},${(0.03 + d * 0.24) * e})`;
        ctx.beginPath(); ctx.moveTo(proj[a * 3], proj[a * 3 + 1]); ctx.lineTo(proj[b * 3], proj[b * 3 + 1]); ctx.stroke();
      }
      for (let i = 0; i < N; i++) {
        const d = proj[i * 3 + 2];
        ctx.fillStyle = `rgba(${dot},${0.18 + d * 0.78})`;
        ctx.beginPath(); ctx.arc(proj[i * 3], proj[i * 3 + 1], 0.6 + d * 1.7, 0, Math.PI * 2); ctx.fill();
      }
      if (e > 0.9) {
        ctx.shadowColor = glow; ctx.shadowBlur = 12; ctx.fillStyle = glow;
        for (const s of signals) {
          const x = proj[s.from * 3] + (proj[s.to * 3] - proj[s.from * 3]) * s.t;
          const y = proj[s.from * 3 + 1] + (proj[s.to * 3 + 1] - proj[s.from * 3 + 1]) * s.t;
          const d = proj[s.from * 3 + 2];
          ctx.globalAlpha = 0.35 + d * 0.65;
          ctx.beginPath(); ctx.arc(x, y, 1.6 + d * 1.4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }

      // Chips ride a tilted ellipse; depth sets scale, opacity and whether they pass in front.
      chipEls.forEach((c, i) => {
        const th = time * 0.16 + (i / chipEls.length) * Math.PI * 2;
        const d = (Math.sin(th) + 1) / 2;
        const x = Math.cos(th) * R * 1.42, y = Math.sin(th) * R * 0.36;
        const rot = -0.2 + mx * 0.1;
        const px = x * Math.cos(rot) - y * Math.sin(rot), py = x * Math.sin(rot) + y * Math.cos(rot);
        c.style.transform = `translate(-50%, -50%) translate(${ox + px}px, ${oy + py}px) scale(${(0.72 + d * 0.28) * (0.6 + 0.4 * e)})`;
        c.style.opacity = String((0.35 + d * 0.65) * e);
        c.style.zIndex = d > 0.5 ? "3" : "1";
      });
    };

    const tick = (_t: number, dt: number) => {
      state.time += dt / 1000;
      state.mx += (state.tx - state.mx) * 0.05; state.my += (state.ty - state.my) * 0.05;
      for (const s of signals) {
        s.t += dt / 700;
        if (s.t >= 1) { s.t = 0; s.from = s.to; const n = adj[s.to]; s.to = n[Math.floor(Math.random() * n.length)]; }
      }
      draw();
    };
    const onMove = (ev: PointerEvent) => {
      const r = host.getBoundingClientRect();
      state.tx = gsap.utils.clamp(-1, 1, (ev.clientX - r.left - r.width / 2) / r.width);
      state.ty = gsap.utils.clamp(-1, 1, (ev.clientY - r.top - r.height / 2) / r.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    if (still) return () => ro.disconnect();

    let running = false, formed = false;
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !running) {
        running = true; gsap.ticker.add(tick);
        if (!formed) { formed = true; gsap.to(state, { form: 1, duration: 2.4, ease: "power2.out", delay: 0.2 }); }
      } else if (!en.isIntersecting && running) { running = false; gsap.ticker.remove(tick); }
    });
    io.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect(); io.disconnect(); gsap.ticker.remove(tick); gsap.killTweensOf(state);
      window.removeEventListener("pointermove", onMove);
    };
  }, [tone]);

  return (
    <div ref={wrap} className={`ail-orb ${tone} ${className}`} aria-hidden="true">
      <span className="ail-orb-core" />
      <canvas ref={canvas} />
      {chips && solutions.map(({ short, Icon }) => <span key={short} className="ail-orb-chip"><Icon size={15} /><em>{short}</em></span>)}
    </div>
  );
}
