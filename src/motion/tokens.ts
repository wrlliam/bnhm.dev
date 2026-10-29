/** Single source of motion values, shared by GSAP, Motion and CSS. */
export const ease = {
  out: "power4.out",
  inOut: "power3.inOut",
  /** CSS / Motion equivalent of the house curve. */
  soft: [0.16, 1, 0.3, 1] as [number, number, number, number],
  softCss: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const duration = {
  micro: 0.2,
  ui: 0.4,
  reveal: 0.95,
  hero: 1.2,
  /** Reduced-motion fades. */
  fade: 0.15,
} as const;

export const stagger = {
  chars: 0.025,
  words: 0.06,
  lines: 0.09,
  blocks: 0.1,
} as const;

export const spring = {
  button: { type: "spring", stiffness: 420, damping: 30 },
  cursor: { type: "spring", stiffness: 500, damping: 40, mass: 0.6 },
} as const;

export const media = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  fine: "(hover: hover) and (pointer: fine)",
} as const;
