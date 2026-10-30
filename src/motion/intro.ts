import { playSound, resumeOnFirstGesture, soundPreferred } from "@/audio/state";
import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { startScroll, stopScroll } from "./lenis";
import { duration, ease, stagger } from "./tokens";

const ENTERED_KEY = "bnhm:entered";
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

  const top = $('[data-gate-half="top"]', gate);
  const bottom = $('[data-gate-half="bottom"]', gate);
  const pieces = gsap.utils.toArray<HTMLElement>(
    gate.querySelectorAll("[data-gate-piece]"),
  );
  const status = $("[data-gate-status]", gate);
  const note = $(".gate-note", gate);
  if (note && !soundPreferred())
    note.textContent = "Sound is off. Turn it on any time from the header.";

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
      .to(pieces, {
        autoAlpha: 0,
        y: -14,
        duration: 0.35,
        stagger: 0.05,
        ease: "power2.in",
      })
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

  // Real progress. The boot script marks "fonts" and "page" and runs the eased
  // counter; this runtime marks "motion" and, once the audio engine code is
  // fetched, "sound". The cap makes sure a slow step never strands the gate.
  const step = (k: string) =>
    (window as unknown as { bnhmStep?: (k: string) => void }).bnhmStep?.(k);
  step("motion");
  const sound = import("@/audio/engine").then(() => step("sound"));
  const fonts = document.fonts.load("400 1em Figtree").then(() => step("fonts"));
  void Promise.race([Promise.all([sound, fonts]), wait(CAP_MS)]).then(() =>
    ["fonts", "page", "motion", "sound"].forEach(step),
  );

  // Enter by itself once the counter has eased out to 100.
  let entered = false;
  const go = () => {
    if (entered) return;
    entered = true;
    if (status) status.textContent = "Loaded.";
    try {
      sessionStorage.setItem(ENTERED_KEY, "1");
    } catch {}
    intro.play();
  };
  if (root.classList.contains("gs-done")) go();
  else {
    window.addEventListener("bnhm:gate-done", go, { once: true });
    listeners.push(() => window.removeEventListener("bnhm:gate-done", go));
  }

  function finish() {
    root.classList.add("entered");
    // Sound is on by default, but browsers only start audio after a gesture.
    if (soundPreferred()) resumeOnFirstGesture();
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
