/**
 * Web Audio engine. Imported lazily, only after the user opts in. Every sound
 * is synthesised at runtime: no files, no third-party audio.
 *
 * Chain: voice → master gain (0.3) → compressor → destination.
 */
import type { PlayOptions, SoundName } from "./state";

const MAX_VOICES = 6;
const MIN_GAP = 0.035; // seconds, per sound type
const FLOOR = 0.0001;

// C major pentatonic around C5, with octave neighbours. Overlaps never clash.
const SCALE = [
  392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51,
];
const NOTE = {
  E5: 659.25,
  G5: 783.99,
  A5: 880.0,
  C5: 523.25,
  C6: 1046.5,
  D6: 1174.66,
} as const;

export type Tuning = { gain: number; attack: number; release: number; pitch: number };
const tuning: Tuning = { gain: 1, attack: 0.002, release: 1, pitch: 0 };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let pulse: PeriodicWave | null = null;
let noise: AudioBuffer | null = null;
let cursor = 0;
const voices = new Set<AudioScheduledSourceNode>();
const last = new Map<SoundName, number>();

export async function unlock(context: AudioContext) {
  if (!ctx) {
    ctx = context;
    master = ctx.createGain();
    master.gain.value = 0.3;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    pulse = buildPulse(ctx, 0.25);
    noise = buildNoise(ctx);
  }
  if (ctx.state !== "running") await ctx.resume();
}

export function suspend() {
  if (ctx?.state === "running") void ctx.suspend();
}

export function resume() {
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

export function setTuning(next: Partial<Tuning>) {
  Object.assign(tuning, next);
}

export const getTuning = (): Tuning => ({ ...tuning });
export const activeVoices = () => voices.size;

export function play(name: SoundName, opts: PlayOptions = {}): boolean {
  // Never queue: a suspended or hidden context simply skips.
  if (!ctx || !master || ctx.state !== "running" || document.hidden) return false;
  const now = ctx.currentTime;
  const prev = last.get(name);
  if (prev !== undefined && now - prev < MIN_GAP) return false;
  const need = VOICE_COUNT[name];
  if (voices.size + need > MAX_VOICES) return false;
  last.set(name, now);
  RECIPES[name](now + 0.005, opts);
  return true;
}

// ---------- recipes ----------

const VOICE_COUNT: Record<SoundName, number> = {
  tick: 1,
  pop: 1,
  blip: 2,
  toggleOn: 2,
  toggleOff: 2,
  sweep: 1,
  sweepClose: 1,
  counter: 1,
  arpeggio: 4,
};

const RECIPES: Record<SoundName, (t: number, o: PlayOptions) => void> = {
  tick: (t, o) =>
    tone({ wave: "triangle", freq: scaleNote(o.index), t, dur: 0.035, gain: 0.05, o }),
  pop: (t, o) =>
    tone({ wave: "sine", freq: 700, freqEnd: 220, t, dur: 0.07, gain: 0.18, o }),
  blip: (t, o) => {
    tone({ wave: "pulse", freq: NOTE.G5, t, dur: 0.06, gain: 0.1, o });
    tone({ wave: "pulse", freq: NOTE.D6, t: t + 0.06, dur: 0.22, gain: 0.1, o });
  },
  toggleOn: (t, o) => {
    tone({ wave: "triangle", freq: NOTE.E5, t, dur: 0.04, gain: 0.08, o });
    tone({ wave: "triangle", freq: NOTE.A5, t: t + 0.045, dur: 0.04, gain: 0.08, o });
  },
  toggleOff: (t, o) => {
    tone({ wave: "triangle", freq: NOTE.A5, t, dur: 0.04, gain: 0.08, o });
    tone({ wave: "triangle", freq: NOTE.E5, t: t + 0.045, dur: 0.04, gain: 0.08, o });
  },
  sweep: (t, o) => noiseSweep(t, 400, 2400, o),
  sweepClose: (t, o) => noiseSweep(t, 2400, 400, o),
  counter: (t, o) => tone({ wave: "sine", freq: NOTE.C6, t, dur: 0.015, gain: 0.03, o }),
  arpeggio: (t, o) => {
    [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((f, i) =>
      tone({ wave: "pulse", freq: f, t: t + i * 0.05, dur: 0.05, gain: 0.09, o }),
    );
  },
};

function scaleNote(index?: number) {
  const i = index ?? cursor++;
  return SCALE[((i % SCALE.length) + SCALE.length) % SCALE.length]!;
}

const cents = () => (Math.random() * 2 - 1) * 6;
const shift = (freq: number, o: PlayOptions) =>
  freq * 2 ** (((o.pitch ?? 0) + tuning.pitch) / 12);

type Tone = {
  wave: OscillatorType | "pulse";
  freq: number;
  freqEnd?: number;
  t: number;
  dur: number;
  gain: number;
  o: PlayOptions;
};

function tone({ wave, freq, freqEnd, t, dur, gain, o }: Tone) {
  const c = ctx!;
  const osc = c.createOscillator();
  if (wave === "pulse") {
    if (pulse) osc.setPeriodicWave(pulse);
    else osc.type = "square";
  } else osc.type = wave;
  osc.frequency.setValueAtTime(shift(freq, o), t);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(shift(freqEnd, o), t + dur);
  osc.detune.value = cents();
  envelope(osc, t, dur, gain, o);
}

function noiseSweep(t: number, from: number, to: number, o: PlayOptions) {
  const c = ctx!;
  const src = c.createBufferSource();
  src.buffer = noise;
  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 1.4;
  const dur = 0.18;
  band.frequency.setValueAtTime(shift(from, o), t);
  band.frequency.exponentialRampToValueAtTime(shift(to, o), t + dur);
  src.connect(band);
  envelope(src, t, dur, 0.04, o, band);
}

/** ≈2 ms attack, exponential release to 0.0001, stop, then disconnect. */
function envelope(
  src: AudioScheduledSourceNode,
  t: number,
  dur: number,
  gain: number,
  o: PlayOptions,
  via?: AudioNode,
) {
  const c = ctx!;
  const g = c.createGain();
  const peak = Math.max(FLOOR * 2, gain * (o.gain ?? 1) * tuning.gain);
  const attack = o.attack ?? tuning.attack;
  const end = t + Math.max(attack + 0.005, dur * (o.release ?? tuning.release));
  g.gain.setValueAtTime(FLOOR, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(FLOOR, end);
  (via ?? src).connect(g).connect(master!);
  voices.add(src);
  src.onended = () => {
    voices.delete(src);
    src.disconnect();
    via?.disconnect();
    g.disconnect();
  };
  src.start(t);
  src.stop(end + 0.02);
}

/** 25 % pulse wave from its Fourier series (cosine terms). */
function buildPulse(c: AudioContext, duty: number): PeriodicWave | null {
  try {
    const n = 32;
    const real = new Float32Array(n);
    const imag = new Float32Array(n);
    for (let k = 1; k < n; k++)
      real[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
    return c.createPeriodicWave(real, imag);
  } catch {
    return null;
  }
}

function buildNoise(c: AudioContext): AudioBuffer {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * 0.25), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}
