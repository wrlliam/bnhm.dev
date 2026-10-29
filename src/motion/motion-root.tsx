"use client";

import { useEffect } from "react";
import { domMax, LazyMotion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { LenisProvider } from "./lenis-provider";
import { revealFull, revealReduced } from "./reveal";
import { runIntro } from "./intro";
import { magneticButtons, magneticChars } from "./magnetic";
import { Cursor } from "./cursor";
import { WorkDetail } from "./work-detail";
import { PageEffects } from "./page-effects";
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
    mm.add({ motion: media.motion, reduce: media.reduce, fine: media.fine }, (ctx) => {
      const { reduce, fine } = ctx.conditions as { reduce: boolean; fine: boolean };
      const intro = runIntro({ reduce });
      const offs: Array<() => void> = [intro.cleanup];
      if (reduce) revealReduced(main);
      else revealFull(main);
      if (!reduce && fine) {
        offs.push(magneticButtons());
        offs.push(magneticChars(document.querySelector("[data-hero]"), intro.chars));
      }
      return () => offs.forEach((off) => off());
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

  return (
    <LazyMotion features={domMax} strict>
      <LenisProvider />
      <PageEffects />
      <WorkDetail />
      <Cursor />
    </LazyMotion>
  );
}
