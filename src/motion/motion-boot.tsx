"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/** The motion runtime: a separate chunk, never part of first load. */
const MotionRoot = dynamic(() => import("./motion-root"), { ssr: false });

/**
 * Waits for the load event, a painted frame and an idle slot before fetching
 * the runtime, so it never competes with first paint or hydration.
 */
export function MotionBoot() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => setReady(true);
    const schedule = () => {
      requestAnimationFrame(() => {
        timer = setTimeout(() => {
          if ("requestIdleCallback" in window)
            idle = requestIdleCallback(go, { timeout: 1200 });
          else go();
        }, 0);
      });
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      clearTimeout(timer);
      if (idle) cancelIdleCallback(idle);
    };
  }, []);
  return ready ? <MotionRoot /> : null;
}
