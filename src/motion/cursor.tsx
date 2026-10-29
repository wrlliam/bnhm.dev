"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { media } from "./tokens";

type Mode = "default" | "link" | "view";

/**
 * Dot + ring follower for fine pointers. The native cursor stays visible.
 * Hidden entirely under reduced motion.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${media.fine} and ${media.motion}`, () => {
      const d = dot.current!;
      const r = ring.current!;
      const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
      const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
      const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" });
      const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });
      let shown = false;
      let mode: Mode = "default";

      const setMode = (next: Mode) => {
        if (next === mode) return;
        mode = next;
        gsap.to(r, {
          scale: next === "view" ? 2.2 : next === "link" ? 1.5 : 1,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(label.current, { autoAlpha: next === "view" ? 1 : 0, duration: 0.2 });
        gsap.to(d, { autoAlpha: next === "default" ? 1 : 0, duration: 0.2 });
      };

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!shown) {
          shown = true;
          gsap.set([d, r], { x: e.clientX, y: e.clientY });
          gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
        }
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const t = (e.target as Element).closest<HTMLElement>("[data-cursor], a, button");
        const m = t?.dataset.cursor;
        setMode(m === "view" ? "view" : t ? "link" : "default");
      };
      const leaveWindow = () => {
        shown = false;
        gsap.to([d, r], { autoAlpha: 0, duration: 0.2 });
      };

      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      document.documentElement.addEventListener("pointerleave", leaveWindow);
      return () => {
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leaveWindow);
      };
    });
    return () => mm.revert();
  });

  return (
    <div className="cursor-layer" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label">
          View
        </span>
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
