# Motion ownership

One rule: **never animate the same property of the same element with both libraries.**

| Concern                                                                                                                                                                            | Owner                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Gate and hero timelines, SplitText reveals, every ScrollTrigger (reveals, scrubbed timeline line, parallax), Flip project detail, `quickTo` cursor and magnetic                    | **GSAP** (`gsap.ts`)                                                                        |
| Hover / press springs, nav active indicator (`layoutId`), `AnimatePresence` (toasts, tooltips, detail overlay presence), header scroll-progress line (`scroll()`), pixel-pop burst | **Motion** (`motion/react`, `LazyMotion` + `m.*`)                                           |
| Smooth scroll                                                                                                                                                                      | **Lenis**, driven by `gsap.ticker` (one clock, `lagSmoothing(0)`); off under reduced motion |
| LEDs, marquee, equaliser bars                                                                                                                                                      | **CSS** keyframes (transform / opacity only), paused off-screen                             |

- Values live in `tokens.ts`.
- GSAP, plugins and Lenis are only imported from `motion-root.tsx`, which `motion-boot.tsx` loads with `next/dynamic` after hydration, so they are not in the first-load bundle.
- All GSAP work runs inside `useGSAP` / `gsap.matchMedia()` so it reverts on unmount and HMR.
- Reduced motion: no Lenis, scrub, parallax, magnetic, cursor, marquee or pixel-pop; reveals become 150 ms fades.
- Animate only `transform`, `opacity` and `clip-path`.
