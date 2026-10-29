/**
 * Tiny, always-loaded sound state. The Web Audio engine itself is only
 * imported after an explicit user choice (see enableSound), so nothing about
 * audio costs anything before consent.
 */
export type SoundName =
  | "tick"
  | "pop"
  | "blip"
  | "toggleOn"
  | "toggleOff"
  | "sweep"
  | "sweepClose"
  | "counter"
  | "arpeggio";

export type PlayOptions = {
  /** Scale degree for pitched sounds (e.g. a row index). */
  index?: number;
  /** Gain multiplier. */
  gain?: number;
  /** Attack in seconds. */
  attack?: number;
  /** Release multiplier on the sound's length. */
  release?: number;
  /** Pitch shift in semitones. */
  pitch?: number;
};

type Engine = typeof import("./engine");

const KEY = "bnhm:sound";
let enabled = false;
let engine: Engine | null = null;
let loading: Promise<Engine> | null = null;
let context: AudioContext | null = null;
let watching = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

function persist(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {}
}

function storedPreference(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function load(): Promise<Engine> {
  loading ??= import("./engine").then((m) => (engine = m));
  return loading;
}

/**
 * Must be called from a user gesture (click / keydown). The AudioContext is
 * created synchronously inside that gesture; the engine module loads after.
 */
export async function enableSound(): Promise<void> {
  if (typeof AudioContext === "undefined") return;
  context ??= new AudioContext({ latencyHint: "interactive" });
  void context.resume();
  const mod = engine ?? (await load());
  await mod.unlock(context);
  enabled = true;
  persist(true);
  watchVisibility();
  emit();
}

/** Hidden tab: suspend, so nothing plays and nothing queues. */
function watchVisibility() {
  if (watching) return;
  watching = true;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) engine?.suspend();
    else if (enabled) engine?.resume();
  });
}

export function disableSound(): void {
  enabled = false;
  persist(false);
  engine?.suspend();
  emit();
}

export function setSoundEnabled(on: boolean) {
  return on ? enableSound() : disableSound();
}

export const isSoundEnabled = () => enabled;
export const getServerSnapshot = () => false;

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** No-op unless the user has opted in and the engine is loaded. */
export function playSound(name: SoundName, opts?: PlayOptions) {
  if (!enabled || !engine) return;
  engine.play(name, opts);
}

/** Hover sounds only make sense for fine pointers. */
export function playHoverSound(name: SoundName, opts?: PlayOptions) {
  if (!enabled || !engine) return;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  engine.play(name, opts);
}

/**
 * Returning visitor (same session, gate skipped) who previously chose sound:
 * stay silent until their first real gesture, then resume.
 */
export function resumeOnFirstGesture() {
  if (enabled || !storedPreference()) return;
  const resume = (e: Event) => {
    if (!e.isTrusted) return;
    window.removeEventListener("pointerdown", resume, true);
    window.removeEventListener("keydown", resume, true);
    void enableSound();
  };
  window.addEventListener("pointerdown", resume, true);
  window.addEventListener("keydown", resume, true);
}
