import { gsap } from "./gsap";

const MAX = 6;
const settle = {
  x: 0,
  y: 0,
  duration: 0.9,
  ease: "elastic.out(1, 0.45)",
  overwrite: "auto" as const,
};

/** Primary buttons drift up to 6 px toward the pointer. Transform only. */
export function magneticButtons(root: ParentNode = document) {
  const offs: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const toX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const toY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    let rect: DOMRect | null = null;
    const enter = () => {
      rect = el.getBoundingClientRect(); // read once, never in move
    };
    const move = (e: PointerEvent) => {
      if (!rect) return;
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      toX(gsap.utils.clamp(-MAX, MAX, dx * 0.2));
      toY(gsap.utils.clamp(-MAX, MAX, dy * 0.3));
    };
    const leave = () => {
      rect = null;
      gsap.to(el, settle);
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    offs.push(() => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });
  return () => offs.forEach((off) => off());
}

/** Hero characters lean toward the pointer, strongest nearby. */
export function magneticChars(hero: HTMLElement | null, chars: HTMLElement[]) {
  if (!hero || !chars.length) return () => {};
  const RADIUS = 260;
  const movers = chars.map((c) => ({
    x: gsap.quickTo(c, "x", { duration: 0.6, ease: "power3.out" }),
    y: gsap.quickTo(c, "y", { duration: 0.6, ease: "power3.out" }),
    cx: 0,
    cy: 0,
  }));
  let active = false;

  const enter = () => {
    // Cache centres in page coordinates once per entry.
    const sx = window.scrollX;
    const sy = window.scrollY;
    chars.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      movers[i]!.cx = r.left + r.width / 2 + sx;
      movers[i]!.cy = r.top + r.height / 2 + sy;
    });
    active = true;
  };
  const move = (e: PointerEvent) => {
    if (!active) return;
    for (const m of movers) {
      const dx = e.pageX - m.cx;
      const dy = e.pageY - m.cy;
      const d = Math.hypot(dx, dy);
      const f = d < RADIUS ? (1 - d / RADIUS) * MAX : 0;
      m.x(d ? (dx / d) * f : 0);
      m.y(d ? (dy / d) * f : 0);
    }
  };
  const leave = () => {
    active = false;
    gsap.to(chars, { ...settle, stagger: 0.01 });
  };
  hero.addEventListener("pointerenter", enter);
  hero.addEventListener("pointermove", move);
  hero.addEventListener("pointerleave", leave);
  return () => {
    hero.removeEventListener("pointerenter", enter);
    hero.removeEventListener("pointermove", move);
    hero.removeEventListener("pointerleave", leave);
  };
}
