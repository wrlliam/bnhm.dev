import { disableSound, enableSound, playSound } from "@/audio/state";
import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { startScroll, stopScroll } from "./lenis";
import { duration, ease, stagger } from "./tokens";

const ENTERED_KEY = "bnhm:entered";
const MIN_MS = 900;
const CAP_MS = 2200;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const $ = <T extends Element = HTMLElement>(q: string, root: ParentNode = document) =>
  root.querySelector<T>(q);

export type IntroResult = { chars: HTMLElement[]; cleanup: () => void };

/**
 * Gate → hero. First visit of the session: counter, consent buttons, split
 * wipe and hero reveal. Returning visitors: no gate, a short chip pop only, so
 * the server-rendered hero (the LCP element) is never hidden.
 */
export function runIntro({ reduce }: { reduce: boolean }): IntroResult {
  const root = document.documentElement;
  const gate = $("[data-gate]");
  const hero = $("[data-hero]");
  const header = $("[data-header]");
  const chip = $("[data-hero-chip]");
  const fades = hero
    ? gsap.utils.toArray<HTMLElement>(hero.querySelectorAll("[data-hero-fade]"))
    : [];
  const firstVisit = Boolean(gate) && !root.classList.contains("entered");
  const listeners: Array<() => void> = [];

  const split =
    !reduce && hero
      ? SplitText.create(hero.querySelectorAll("[data-hero-line]"), {
          type: "lines,chars",
          mask: "lines",
          aria: "none", // the h1 carries the accessible name
        })
      : null;
  const chars = (split?.chars ?? []) as HTMLElement[];

  if (!firstVisit || !gate) {
    if (!reduce && chip) {
      gsap.from(chip, { scale: 0.85, duration: 0.6, ease: "back.out(2.2)", delay: 0.1 });
    }
    return { chars, cleanup: () => {} };
  }

  // ----- First visit -----
  const outside = ["[data-header]", "#main", "footer"]
    .map((q) => $(q))
    .filter((el): el is HTMLElement => Boolean(el));
  outside.forEach((el) => (el.inert = true));
  stopScroll();

  const inner = $("[data-gate-inner]", gate);
  const top = $('[data-gate-half="top"]', gate);
  const bottom = $('[data-gate-half="bottom"]', gate);
  const count = $("[data-gate-count]", gate);
  const bar = $("[data-gate-bar]", gate);
  const status = $("[data-gate-status]", gate);
  const actions = $("[data-gate-actions]", gate);
  const buttons = gsap.utils.toArray<HTMLButtonElement>(
    gate.querySelectorAll("[data-gate-enter]"),
  );

  const intro = gsap.timeline({ paused: true, onComplete: finish });
  if (reduce) {
    intro.to(gate, { autoAlpha: 0, duration: duration.fade, ease: "none" });
  } else {
    gsap.set(chars, { yPercent: 115 });
    gsap.set(fades, { autoAlpha: 0, y: 16 });
    gsap.set(header, { yPercent: -100 });
    gsap.set(chip, { scale: 0.6, autoAlpha: 0 });
    gsap.set([top, bottom], { clipPath: "inset(0% 0% 0% 0%)" });
    intro
      .to(inner, { autoAlpha: 0, y: -12, duration: 0.35, ease: "power2.in" })
      .to(
        top,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95, ease: ease.inOut },
        "<0.15",
      )
      .to(
        bottom,
        { clipPath: "inset(100% 0% 0% 0%)", duration: 0.95, ease: ease.inOut },
        "<",
      )
      .to(
        chars,
        { yPercent: 0, duration: duration.hero, stagger: stagger.chars, ease: ease.out },
        "<0.3",
      )
      .to(
        fades,
        { autoAlpha: 1, y: 0, duration: duration.reveal, stagger: stagger.blocks },
        "<0.35",
      )
      .to(header, { yPercent: 0, duration: 0.8, ease: ease.out }, "<")
      .to(
        chip,
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          ease: "back.out(2.2)",
          onStart: () => playSound("pop"),
        },
        "<0.2",
      );
  }

  // Counter: real progress (fonts + runtime loaded), 900 ms minimum, 2.2 s cap.
  const progress = { v: 0 };
  let lastTen = 0;
  const render = () => {
    const v = Math.round(progress.v);
    if (count) count.textContent = String(v).padStart(3, "0");
    gsap.set(bar, { scaleX: progress.v / 100 });
    const ten = Math.floor(v / 10);
    if (ten > lastTen) {
      lastTen = ten;
      playSound("counter");
    }
  };

  function showActions() {
    gate!.dataset.ready = "true";
    if (status) status.textContent = "Ready. Choose how to enter.";
    gsap.fromTo(
      actions,
      { autoAlpha: 0, y: reduce ? 0 : 10 },
      {
        autoAlpha: 1,
        y: 0,
        duration: reduce ? duration.fade : duration.ui,
        ease: ease.out,
      },
    );
    buttons[0]?.focus({ preventScroll: true });
  }

  if (reduce) {
    progress.v = 100;
    render();
    showActions();
  } else {
    const crawl = gsap.to(progress, {
      v: 90,
      duration: CAP_MS / 1000,
      ease: "power1.out",
      onUpdate: render,
    });
    const ready = Promise.all([document.fonts.ready, wait(MIN_MS)]);
    void Promise.race([ready, wait(CAP_MS)]).then(() => {
      crawl.kill();
      gsap.to(progress, {
        v: 100,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: render,
        onComplete: showActions,
      });
    });
  }

  let entering = false;
  async function onEnter(e: MouseEvent) {
    if (entering || !e.isTrusted) return;
    entering = true;
    const withSound = (e.currentTarget as HTMLElement).dataset.gateEnter === "sound";
    buttons.forEach((b) => (b.disabled = true));
    if (withSound) {
      await enableSound();
      playSound("blip");
    } else {
      disableSound(); // remember the explicit choice
    }
    try {
      sessionStorage.setItem(ENTERED_KEY, "1");
    } catch {}
    intro.play();
  }
  buttons.forEach((b) => {
    b.addEventListener("click", onEnter);
    listeners.push(() => b.removeEventListener("click", onEnter));
  });

  function finish() {
    root.classList.add("entered");
    outside.forEach((el) => (el.inert = false));
    startScroll();
    document.getElementById("main")?.focus({ preventScroll: true });
    window.dispatchEvent(new Event("bnhm:entered"));
    ScrollTrigger.refresh();
  }

  return {
    chars,
    cleanup: () => {
      listeners.forEach((off) => off());
      if (!root.classList.contains("entered")) {
        outside.forEach((el) => (el.inert = false));
        startScroll();
      }
    },
  };
}
