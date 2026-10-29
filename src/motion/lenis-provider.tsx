"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { media } from "./tokens";
import { setLenis } from "./lenis";

const HEADER_OFFSET = -72;

/**
 * Smooth scroll on GSAP's ticker: exactly one animation clock. Off under
 * reduced motion (native scrolling is used instead).
 */
export function LenisProvider() {
  useEffect(() => {
    const reduce = window.matchMedia(media.reduce);
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    function start() {
      lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: false });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    function stop() {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      tick = null;
      setLenis(null);
    }

    if (!reduce.matches) start();
    const onChange = () => (reduce.matches ? stop() : start());
    reduce.addEventListener("change", onChange);

    // In-page anchors: smooth via Lenis, then move focus for keyboard / AT users.
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey)
        return;
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      const top = id === "top";
      if (lenis) lenis.scrollTo(top ? 0 : target, { offset: top ? 0 : HEADER_OFFSET });
      else target.scrollIntoView({ behavior: "auto" });
      history.replaceState(
        history.state,
        "",
        top ? location.pathname + location.search : `#${id}`,
      );
      const focusEl = top ? document.getElementById("main") : target;
      if (focusEl && !focusEl.hasAttribute("tabindex"))
        focusEl.setAttribute("tabindex", "-1");
      focusEl?.focus({ preventScroll: true });
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      reduce.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return null;
}
