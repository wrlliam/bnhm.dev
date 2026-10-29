"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { LenisProvider } from "./lenis-provider";
import { revealFull, revealReduced } from "./reveal";
import { media } from "./tokens";

/**
 * Lazily loaded enhancement layer. Everything here attaches to the
 * server-rendered DOM; removing it leaves a complete static page.
 */
export default function MotionRoot() {
  useGSAP(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const mm = gsap.matchMedia();
    mm.add({ motion: media.motion, reduce: media.reduce }, (ctx) => {
      if (ctx.conditions?.reduce) revealReduced(main);
      else revealFull(main);
    });
    document.documentElement.classList.add("motion-ready");
    return () => mm.revert();
  });

  useEffect(() => {
    // Positions shift once fonts land and content-visibility sections render.
    let raf = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    void document.fonts.ready.then(refresh);
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);

    const onVisibility = () => {
      document.documentElement.classList.toggle("tab-hidden", document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <LenisProvider />;
}
