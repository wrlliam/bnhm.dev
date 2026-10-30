import { gsap } from "./gsap";

const MAX = 6;
// No overwrite: "auto" here. It would strip x/y out of the quickTo tweens,
// and their next resetTo() fails ("x not eligible for reset").
const settle = {
  x: 0,
  y: 0,
  duration: 0.9,
  ease: "elastic.out(1, 0.45)",
};

/** quickTo x/y pair that can hand off to, and take back from, a settle tween. */
function follower(el: HTMLElement, duration: number) {
  const x = gsap.quickTo(el, "x", { duration, ease: "power3.out" });
  const y = gsap.quickTo(el, "y", { duration, ease: "power3.out" });
  return {
    to(dx: number, dy: number) {
      x(dx);
      y(dy);
    },
    /** Stop following so the settle tween owns x/y. */
    release() {
      x.tween.pause();
      y.tween.pause();
    },
    /** Resume from wherever the settle left the element. */
    sync() {
      const cx = gsap.getProperty(el, "x") as number;
      const cy = gsap.getProperty(el, "y") as number;
      x(cx, cx);
      y(cy, cy);
    },
  };
}

/** Primary buttons drift up to 6 px toward the pointer. Transform only. */
export function magneticButtons(root: ParentNode = document) {
  const offs: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const f = follower(el, 0.4);
    let settling: gsap.core.Tween | null = null;
    let rect: DOMRect | null = null;
    const enter = () => {
      settling?.kill();
      f.sync();
      rect = el.getBoundingClientRect(); // read once, never in move
    };
    const move = (e: PointerEvent) => {
      if (!rect) return;
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      f.to(
        gsap.utils.clamp(-MAX, MAX, dx * 0.2),
        gsap.utils.clamp(-MAX, MAX, dy * 0.3),
      );
    };
    const leave = () => {
      rect = null;
      f.release();
      settling = gsap.to(el, settle);
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    offs.push(() => {
      settling?.kill();
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
  const movers = chars.map((c) => ({ f: follower(c, 0.6), cx: 0, cy: 0 }));
  let settling: gsap.core.Tween | null = null;
  let active = false;

  const enter = () => {
    settling?.kill();
    // Cache centres in page coordinates once per entry.
    const sx = window.scrollX;
    const sy = window.scrollY;
    chars.forEach((c, i) => {
      const m = movers[i]!;
      m.f.sync();
      const r = c.getBoundingClientRect();
      m.cx = r.left + r.width / 2 + sx;
      m.cy = r.top + r.height / 2 + sy;
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
      m.f.to(d ? (dx / d) * f : 0, d ? (dy / d) * f : 0);
    }
  };
  const leave = () => {
    active = false;
    movers.forEach((m) => m.f.release());
    settling = gsap.to(chars, { ...settle, stagger: 0.01 });
  };
  hero.addEventListener("pointerenter", enter);
  hero.addEventListener("pointermove", move);
  hero.addEventListener("pointerleave", leave);
  return () => {
    settling?.kill();
    hero.removeEventListener("pointerenter", enter);
    hero.removeEventListener("pointermove", move);
    hero.removeEventListener("pointerleave", leave);
  };
}
