"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  isSoundEnabled,
  playSound,
  setSoundEnabled,
  subscribeSound,
} from "@/audio/state";

export function SoundToggle({ className = "" }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, isSoundEnabled, getServerSnapshot);

  async function toggle() {
    if (on) {
      playSound("toggleOff");
      // Let the falling notes finish before suspending.
      setTimeout(() => setSoundEnabled(false), 120);
    } else {
      await setSoundEnabled(true);
      playSound("toggleOn");
    }
  }

  return (
    <button
      type="button"
      className={`icon-btn ${className}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Sound on" : "Sound off"}
      data-cursor="link"
      data-sound-toggle
    >
      <span className="eq" data-on={on} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
