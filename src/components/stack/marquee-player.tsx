"use client";

import { useEffect, useRef } from "react";

/** Runs the marquee only while it is on screen. */
export function MarqueePlayer() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("[data-marquee]");
    if (!host) return;
    const io = new IntersectionObserver(([e]) => {
      host.dataset.playing = String(Boolean(e?.isIntersecting));
    });
    io.observe(host);
    return () => io.disconnect();
  }, []);
  return <span ref={ref} hidden />;
}
