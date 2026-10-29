import { animate } from "motion";
import { ease, media } from "./tokens";

const COLOURS = ["var(--navy)", "var(--sky)", "var(--petrol-soft)"];

/**
 * 8–12 small squares pop outward and fade (transform + opacity, 450 ms),
 * then leave the DOM. Skipped under reduced motion.
 */
export function pixelPop(x: number, y: number, count = 10) {
  if (window.matchMedia(media.reduce).matches) return;
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.className = "pixel-layer";
  document.body.appendChild(layer);
  const anims = Array.from({ length: count }, (_, i) => {
    const px = document.createElement("span");
    px.className = "pixel";
    const size = 5 + Math.round(Math.random() * 4);
    px.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${COLOURS[i % COLOURS.length]}`;
    layer.appendChild(px);
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 34 + Math.random() * 30;
    return animate(
      px,
      {
        x: [0, Math.cos(angle) * dist],
        y: [0, Math.sin(angle) * dist],
        opacity: [1, 0],
        scale: [1, 0.4],
        rotate: [0, (Math.random() - 0.5) * 180],
      },
      { duration: 0.45, ease: ease.soft },
    );
  });
  void Promise.all(anims.map((a) => a.finished)).finally(() => layer.remove());
}

/** Pop from the centre of an element. */
export function pixelPopFrom(el: Element, count?: number) {
  const r = el.getBoundingClientRect();
  pixelPop(r.left + r.width / 2, r.top + r.height / 2, count);
}
