"use client";

import { useSyncExternalStore } from "react";
import { playSound } from "@/audio/state";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "dark" || set === "light") return set;
  return media().matches ? "dark" : "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const mq = media();
  mq.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    mq.removeEventListener("change", listener);
  };
}

function apply(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("bnhm:theme", next);
  } catch {}
  listeners.forEach((l) => l());
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, current, () => null);
  const dark = theme === "dark";

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = current() === "dark" ? "light" : "dark";
    playSound(next === "dark" ? "toggleOff" : "toggleOn");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) return apply(next);

    // Circular reveal from the button.
    const { clientX: x, clientY: y } = event;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => apply(next));
    vt.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`],
          },
          {
            duration: 600,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  }

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-pressed={theme === null ? undefined : dark}
      aria-label="Dark theme"
      data-cursor="link"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
      </svg>
    </button>
  );
}
