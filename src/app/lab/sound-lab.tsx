"use client";

import { useState, useSyncExternalStore } from "react";
import {
  enableSound,
  getServerSnapshot,
  isSoundEnabled,
  subscribeSound,
  type SoundName,
} from "@/audio/state";

const SOUNDS: { name: SoundName; use: string }[] = [
  { name: "tick", use: "Hover on links and rows" },
  { name: "pop", use: "Button and chip clicks" },
  { name: "blip", use: "Primary actions, copy confirm, enter" },
  { name: "toggleOn", use: "Sound / theme toggle on" },
  { name: "toggleOff", use: "Sound / theme toggle off" },
  { name: "sweep", use: "Nav click, project open" },
  { name: "sweepClose", use: "Project close" },
  { name: "counter", use: "Gate counter, every 10" },
  { name: "arpeggio", use: "Easter egg" },
];

type Tuning = { gain: number; attack: number; release: number; pitch: number };
const DEFAULTS: Tuning = { gain: 1, attack: 0.002, release: 1, pitch: 0 };

const SLIDERS: {
  key: keyof Tuning;
  label: string;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
}[] = [
  {
    key: "gain",
    label: "Gain",
    min: 0,
    max: 2,
    step: 0.05,
    fmt: (v) => `${v.toFixed(2)}×`,
  },
  {
    key: "attack",
    label: "Attack",
    min: 0.001,
    max: 0.05,
    step: 0.001,
    fmt: (v) => `${(v * 1000).toFixed(0)} ms`,
  },
  {
    key: "release",
    label: "Release",
    min: 0.3,
    max: 3,
    step: 0.05,
    fmt: (v) => `${v.toFixed(2)}×`,
  },
  {
    key: "pitch",
    label: "Pitch",
    min: -12,
    max: 12,
    step: 1,
    fmt: (v) => `${v > 0 ? "+" : ""}${v} st`,
  },
];

export function SoundLab() {
  const on = useSyncExternalStore(subscribeSound, isSoundEnabled, getServerSnapshot);
  const [tuning, setTuning] = useState<Tuning>(DEFAULTS);
  const [voices, setVoices] = useState(0);

  async function engine() {
    if (!isSoundEnabled()) await enableSound();
    return import("@/audio/engine");
  }

  async function update(key: keyof Tuning, value: number) {
    const next = { ...tuning, [key]: value };
    setTuning(next);
    (await engine()).setTuning(next);
  }

  async function play(name: SoundName, index?: number) {
    const e = await engine();
    e.play(name, { index });
    setVoices(e.activeVoices());
  }

  async function stress() {
    const e = await engine();
    // Every sound at once: the 6-voice cap and 35 ms per-type gap must hold.
    for (const s of SOUNDS) e.play(s.name);
    for (let i = 0; i < 12; i++) e.play("tick", { index: i });
    setVoices(e.activeVoices());
  }

  return (
    <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_360px]">
      <div>
        {!on ? (
          <button
            type="button"
            className="btn btn-ghost mb-8"
            onClick={() => void enableSound()}
          >
            Start audio
          </button>
        ) : null}
        <ul className="grid gap-3 sm:grid-cols-2">
          {SOUNDS.map((s) => (
            <li key={s.name}>
              <button
                type="button"
                onClick={() => void play(s.name)}
                className="border-rule hover:bg-surface flex min-h-16 w-full flex-col items-start justify-center rounded-2xl border px-5 py-3 text-left transition-colors"
              >
                <span className="font-semibold">{s.name}</span>
                <span className="text-ink-2 text-[14px]">{s.use}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="label text-ink-2">Scale</span>
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              type="button"
              className="icon-btn border-rule tabular border text-[14px]"
              onClick={() => void play("tick", i)}
              aria-label={`Tick, scale degree ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-4">
          <button type="button" className="btn btn-ghost" onClick={() => void stress()}>
            Fire everything at once
          </button>
          <p className="tabular text-ink-2" aria-live="polite">
            Voices scheduled: {voices} (cap 6)
          </p>
        </div>
      </div>

      <form
        className="border-rule space-y-7 rounded-2xl border p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <p className="label text-ink-2">Palette tuning</p>
        {SLIDERS.map((s) => (
          <label key={s.key} className="block">
            <span className="flex justify-between text-[15px]">
              <span className="font-medium">{s.label}</span>
              <span className="tabular text-ink-2">{s.fmt(tuning[s.key])}</span>
            </span>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={tuning[s.key]}
              onChange={(e) => void update(s.key, Number(e.target.value))}
              className="mt-3 w-full accent-[var(--accent)]"
            />
          </label>
        ))}
        <button
          type="button"
          className="btn btn-ghost w-full"
          onClick={async () => {
            setTuning(DEFAULTS);
            (await engine()).setTuning(DEFAULTS);
          }}
        >
          Reset
        </button>
      </form>
    </div>
  );
}
