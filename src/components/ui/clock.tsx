"use client";

import { useSyncExternalStore } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

// One shared ticker for every clock on the page; paused while the tab is hidden.
let now = "";
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function tick() {
  now = fmt.format(Date.now());
  listeners.forEach((l) => l());
  timer = setTimeout(tick, 1000 - (Date.now() % 1000));
}

function onVisibility() {
  clearTimeout(timer);
  if (!document.hidden) tick();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    tick();
    document.addEventListener("visibilitychange", onVisibility);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    }
  };
}

export function Clock({ className = "" }: { className?: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => now,
    () => "",
  );
  const [h = "--", m = "--", s = "--"] = time ? time.split(":") : [];
  return (
    <span className={`tabular inline-flex items-baseline gap-2 ${className}`}>
      <time dateTime={time ? `${h}:${m}` : undefined} aria-hidden="true">
        {h}:{m}
        <span className="font-light">:{s}</span>
      </time>
      <span className="sr-only">{time ? `Local time ${h}:${m}` : "Local time"}</span>
      <span>London</span>
    </span>
  );
}
