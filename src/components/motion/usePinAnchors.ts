"use client";

import { useCallback, useEffect, type RefObject } from "react";
import { DESKTOP } from "./useScene";
import { scroll, whenReady } from "@/lib/scroll";

/**
 * Makes `#id` links work for content that lives inside a pinned scroll scene.
 *
 * In a pinned scene every item shares one sticky stage, so the browser's native anchor jump —
 * which scrolls to the item's own box — lands at the same place for all of them, and you get the
 * first item whatever you asked for. This translates "item i" into the scroll position where that
 * item is actually on screen, and scrolls there.
 *
 * Below 901px and under reduced motion the scene is a plain stacked list, so the native anchor is
 * already correct and this stays out of the way. Returns `jump(i)` for in-page controls (a rail, tabs).
 *
 * `ids` and `at` must be stable references (module-level), as the effect depends on them.
 */
export function usePinAnchors(
  ref: RefObject<HTMLElement | null>,
  { pin, ids, at }: { pin: string; ids: readonly string[]; at: (i: number, n: number) => number },
) {
  /** Scroll position that shows item `i`, or null if the pin is not mounted. */
  const target = useCallback(
    (i: number) => {
      const el = ref.current?.querySelector<HTMLElement>(pin);
      if (!el) return null;
      const top = el.getBoundingClientRect().top + window.scrollY;
      return top + (el.offsetHeight - window.innerHeight) * at(i, ids.length);
    },
    [ref, pin, ids, at],
  );

  const jump = useCallback(
    (i: number) => {
      const y = target(i);
      if (y === null) return;
      if (scroll.lenis) scroll.lenis.scrollTo(y, { duration: 1.4 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    },
    [target],
  );

  useEffect(() => {
    const timers: number[] = [];
    let attempts = 0;

    const go = () => {
      const i = ids.indexOf(window.location.hash.slice(1));
      if (i < 0 || !window.matchMedia(DESKTOP).matches) return;
      // The logo intro stops Lenis and only restarts it after its exit fade, which is later than the
      // `ready` signal; Lenis drops scrollTo calls while stopped. Retry until it is running again.
      if (scroll.lenis?.isStopped && attempts++ < 40) {
        timers.push(window.setTimeout(go, 150));
        return;
      }
      const y = target(i);
      if (y === null) return;
      if (scroll.lenis) scroll.lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    };

    // Three things have to be over before scrolling sticks: the intro (above), the browser's own
    // fragment jump at `load`, and the pin being measured. Each is followed by a short settle delay.
    const later = () => timers.push(window.setTimeout(go, 350));
    const stopWaiting = whenReady(later);
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    window.addEventListener("hashchange", go);

    return () => {
      stopWaiting();
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", later);
      window.removeEventListener("hashchange", go);
    };
  }, [ids, target]);

  return jump;
}
