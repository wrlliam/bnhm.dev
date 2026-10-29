import type Lenis from "lenis";

/** Module-level handle so overlays and anchors can reach the instance. */
let instance: Lenis | null = null;
let locks = 0;

export function setLenis(l: Lenis | null) {
  instance = l;
  // A lock taken before Lenis existed (e.g. the gate) still applies.
  if (instance && locks > 0) instance.stop();
}

export const getLenis = () => instance;

export function stopScroll() {
  locks++;
  instance?.stop();
  document.documentElement.classList.add("scroll-locked");
}

export function startScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  instance?.start();
  document.documentElement.classList.remove("scroll-locked");
}
