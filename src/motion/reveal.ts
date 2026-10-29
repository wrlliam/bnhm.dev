import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { duration, ease, stagger } from "./tokens";

const START = "top 86%";

/** Elements already scrolled past (e.g. on reload) are shown without animating. */
const isAbove = (el: Element) => el.getBoundingClientRect().bottom < 0;

/**
 * Full-motion reveals. Call inside a gsap.matchMedia / useGSAP context so
 * everything (SplitText included) is reverted on cleanup.
 */
export function revealFull(root: Element) {
  // Section headings: lines rise out of masks.
  root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    if (isAbove(el)) return;
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
  });

  // Body copy: fade up by line.
  root.querySelectorAll<HTMLElement>("[data-reveal-lines]").forEach((el) => {
    if (isAbove(el)) return;
    SplitText.create(el.querySelectorAll("p"), {
      type: "lines",
      autoSplit: true,
      aria: "auto",
      onSplit: (self) =>
        gsap.from(self.lines, {
          autoAlpha: 0,
          y: 14,
          duration: duration.reveal,
          stagger: stagger.lines * 0.6,
          ease: ease.out,
          scrollTrigger: { trigger: el, start: START, once: true },
        }),
    });
  });

  batch(
    root,
    "[data-hairline]",
    { scaleX: 0 },
    { scaleX: 1, duration: 1.1, ease: ease.inOut },
  );
  batch(
    root,
    "[data-batch-item]",
    { autoAlpha: 0, y: 18 },
    {
      autoAlpha: 1,
      y: 0,
      duration: duration.reveal * 0.8,
      stagger: stagger.blocks,
      ease: ease.out,
    },
  );
}

/** Reduced motion: short opacity fades only. */
export function revealReduced(root: Element) {
  batch(
    root,
    "[data-split], [data-reveal-lines], [data-batch-item]",
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: duration.fade, ease: "none" },
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
    onEnter: (targets) => gsap.to(targets, { ...to, overwrite: true }),
  });
}
