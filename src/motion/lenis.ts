import type Lenis from "lenis";

/** Module-level handle so overlays and anchors can reach the instance. */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

export function stopScroll() {
  instance?.stop();
  document.documentElement.classList.add("scroll-locked");
}

export function startScroll() {
  instance?.start();
  document.documentElement.classList.remove("scroll-locked");
}
