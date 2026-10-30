import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { duration, ease, stagger } from "./tokens";

// Reveals use opacity, never autoAlpha/visibility: hidden content would drop
// out of the accessibility tree until scrolled to.
// Start a touch before the element enters, so nothing is still animating
// when you reach it.
const START = "top 94%";

/** Elements already scrolled past (e.g. on reload) are shown without animating. */
const isAbove = (el: Element) => el.getBoundingClientRect().bottom < 0;

const idle: (cb: () => void) => number =
  typeof requestIdleCallback === "function"
    ? (cb) => requestIdleCallback(cb, { timeout: 800 })
    : (cb) => window.setTimeout(cb, 40);
const cancelIdle: (id: number) => void =
  typeof cancelIdleCallback === "function" ? cancelIdleCallback : clearTimeout;

/**
 * Full-motion reveals. Call inside a gsap.matchMedia context and pass that
 * context, so splits created later are still reverted on cleanup. Returns a
 * disposer.
 *
 * Nothing heavy runs while scrolling: headings are split one per idle slot
 * right after load (never mid-scroll), body copy fades as whole blocks (no
 * line splitting), and repeated items reveal in short, capped staggers.
 */
export function revealFull(root: Element, ctx: gsap.Context): () => void {
  const queue = gsap.utils
    .toArray<HTMLElement>(root.querySelectorAll("[data-split]"))
    .filter((el) => !isAbove(el));
  let idleId = 0;
  const pump = () => {
    const el = queue.shift();
    if (!el) return;
    // Already on screen by now? Leave it be rather than hide-and-replay it.
    const r = el.getBoundingClientRect();
    if (r.top > innerHeight) ctx.add(() => splitHeading(el));
    if (queue.length) idleId = idle(pump);
  };
  idleId = idle(pump);
  const dispose = () => cancelIdle(idleId);

  // Experience line: scrubbed, scaleY only.
  root.querySelectorAll<HTMLElement>("[data-timeline]").forEach((tl) => {
    const line = tl.querySelector("[data-timeline-progress]");
    if (!line) return;
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: tl, start: "top 70%", end: "bottom 70%", scrub: 0.6 },
      },
    );
  });

  // Body copy fades as whole paragraphs: no line splitting, no layout reads.
  batch(
    root,
    "[data-reveal-lines] > p",
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: duration.reveal, ease: ease.out },
  );
  batch(
    root,
    "[data-hairline]",
    { scaleX: 0 },
    { scaleX: 1, duration: 0.9, ease: ease.inOut },
  );
  batch(
    root,
    "[data-batch-item]",
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: duration.batch, ease: ease.out },
  );
  return dispose;
}

/** Section headings: lines rise out of masks. */
function splitHeading(el: HTMLElement) {
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    aria: "auto",
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        duration: duration.reveal,
        stagger: stagger.lines,
        ease: ease.out,
        scrollTrigger: { trigger: el, start: START, once: true },
      }),
  });
}

/** Reduced motion: short opacity fades only. */
export function revealReduced(root: Element) {
  batch(
    root,
    "[data-split], [data-reveal-lines], [data-batch-item]",
    { opacity: 0 },
    { opacity: 1, duration: duration.fade, ease: "none" },
  );
}

function batch(
  root: Element,
  selector: string,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
) {
  const els = gsap.utils
    .toArray<HTMLElement>(root.querySelectorAll(selector))
    .filter((el) => !isAbove(el));
  if (!els.length) return;
  gsap.set(els, from);
  ScrollTrigger.batch(els, {
    start: START,
    once: true,
    interval: 0.05,
    // Long lists (e.g. skills) share one short, capped stagger instead of
    // 0.1 s per item, so a group never takes more than ~0.25 s to land.
    onEnter: (targets) =>
      gsap.to(targets, {
        ...to,
        stagger: targets.length > 4 ? { amount: 0.24 } : stagger.blocks,
        overwrite: true,
      }),
  });
}
