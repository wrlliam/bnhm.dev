"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { animate, press, scroll } from "motion";
import { m } from "motion/react";
import { playHoverSound, playSound } from "@/audio/state";
import { pixelPop, pixelPopFrom } from "./pixel-pop";
import { media, spring } from "./tokens";

const SECTIONS = ["work", "about", "experience", "contact"] as const;

/** Scroll progress line: hardware-accelerated scroll-linked animation. */
function useScrollProgress() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-scroll-progress]");
    if (!el) return;
    return scroll(animate(el, { scaleX: [0, 1] }, { ease: "linear" }));
  }, []);
}

/** Spring press feedback on icon buttons and chips (elements GSAP never moves). */
function usePress() {
  useEffect(() => {
    if (window.matchMedia(media.reduce).matches) return;
    return press(".icon-btn, [data-press]", (el) => {
      animate(el, { scale: 0.9 }, spring.button);
      return () => animate(el, { scale: 1 }, spring.button);
    });
  }, []);
}

/** Interface sounds, delegated: ticks on hover, pops on button presses. */
function useUiSounds() {
  useEffect(() => {
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest("a, [data-press]");
      if (!t || t.contains(e.relatedTarget as Node)) return;
      if (t.closest("[data-work-list]")) return; // work rows play their own pitched tick
      playHoverSound("tick");
    };
    const click = (e: MouseEvent) => {
      const t = (e.target as Element).closest("button, [data-press]");
      if (!t) return;
      if (
        t.matches(
          "[data-sound-toggle], [data-copy], [data-gate-enter], [aria-label='Dark theme']",
        )
      )
        return;
      playSound("pop");
    };
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("click", click);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("click", click);
    };
  }, []);
}

/** LEDs only blink while the rack is on screen; hovering a unit plays a note. */
function useRack() {
  useEffect(() => {
    const rack = document.querySelector<HTMLElement>("[data-rack]");
    if (!rack) return;
    const io = new IntersectionObserver(([e]) => {
      rack.dataset.playing = String(Boolean(e?.isIntersecting));
    });
    io.observe(rack);
    let active: HTMLElement | null = null;
    const over = (e: PointerEvent) => {
      const unit = (e.target as Element).closest<HTMLElement>("[data-rack-unit]");
      if (unit === active) return;
      if (active) active.dataset.active = "false";
      active = unit;
      if (!unit) return;
      unit.dataset.active = "true";
      playHoverSound("tick", { index: Number(unit.dataset.rackUnit) + 2 });
    };
    const leave = () => {
      if (active) active.dataset.active = "false";
      active = null;
    };
    rack.addEventListener("pointerover", over);
    rack.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      rack.removeEventListener("pointerover", over);
      rack.removeEventListener("pointerleave", leave);
    };
  }, []);
}

/** Type "ping" or click the wordmark five times. */
function useEasterEgg() {
  useEffect(() => {
    const wordmark = document.querySelector<HTMLElement>("[data-wordmark]");
    let buffer = "";
    let clicks = 0;
    let clickTimer: ReturnType<typeof setTimeout> | undefined;

    const celebrate = (from?: Element | null) => {
      playSound("arpeggio");
      if (from) pixelPopFrom(from, 12);
      else pixelPop(innerWidth / 2, innerHeight / 2, 12);
    };
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) ||
        e.key.length !== 1
      )
        return;
      buffer = (buffer + e.key.toLowerCase()).slice(-4);
      if (buffer === "ping") {
        buffer = "";
        celebrate();
      }
    };
    const click = () => {
      clicks++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => (clicks = 0), 1600);
      if (clicks >= 5) {
        clicks = 0;
        celebrate(wordmark);
      }
    };
    window.addEventListener("keydown", key);
    wordmark?.addEventListener("click", click);
    return () => {
      clearTimeout(clickTimer);
      window.removeEventListener("keydown", key);
      wordmark?.removeEventListener("click", click);
    };
  }, []);
}

/** Active-section indicator under the nav, shared layoutId. */
function NavIndicator() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(
      (e): e is HTMLElement => Boolean(e),
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-nav-link]").forEach((a) => {
      if (a.dataset.navLink === active) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }, [active]);

  const host = active
    ? document.querySelector<HTMLElement>(`[data-nav-link="${active}"]`)
    : null;
  if (!host) return null;
  return createPortal(
    <m.span
      layoutId="nav-indicator"
      className="nav-indicator"
      aria-hidden="true"
      transition={spring.button}
    />,
    host,
  );
}

export function PageEffects() {
  useScrollProgress();
  usePress();
  useUiSounds();
  useRack();
  useEasterEgg();
  return <NavIndicator />;
}
