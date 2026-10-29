"use client";

import { useEffect } from "react";
import { domMax, LazyMotion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { LenisProvider } from "./lenis-provider";
import { revealFull, revealReduced } from "./reveal";
import { runIntro } from "./intro";
import { magneticButtons, magneticChars } from "./magnetic";
import dynamic from "next/dynamic";
import { media } from "./tokens";

// Secondary islands: separate chunks, so no single script evaluation is long.
const PageEffects = dynamic(() => import("./page-effects").then((m) => m.PageEffects), {
  ssr: false,
});
const WorkDetail = dynamic(() => import("./work-detail").then((m) => m.WorkDetail), {
  ssr: false,
});
const Cursor = dynamic(() => import("./cursor").then((m) => m.Cursor), { ssr: false });

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
      // Yield before the rest so no single task runs long.
      const later = setTimeout(() => {
        ctx.add(() => {
          if (reduce) revealReduced(main);
          else offs.push(revealFull(main, ctx));
          if (!reduce && fine) {
            offs.push(magneticButtons());
            offs.push(magneticChars(document.querySelector("[data-hero]"), intro.chars));
          }
        });
      }, 0);
      return () => {
        clearTimeout(later);
        offs.forEach((off) => off());
      };
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
