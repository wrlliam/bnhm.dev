# bnhm.dev

Personal site of William Banham. Next.js (App Router, static export), TypeScript, Tailwind CSS v4, GSAP + Lenis + Motion, and an opt-in Web Audio sound palette.

## Setup

```sh
npm install
echo "CONTACT_EMAIL=<address>" > .env.local   # git-ignored; only the encoded form is committed
npm run build                                  # runs scripts/encode-email.mjs, then exports to out/
npm start                                      # serves out/ on :3000
```

## Scripts

| Script                                   | What it does                                                                                                |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm run dev`                            | Dev server                                                                                                  |
| `npm run build`                          | Encode contact parts, static export to `out/`                                                               |
| `npm run size`                           | First-load JS (gzip) per page, against the 160 KB budget                                                    |
| `npm test`                               | Playwright: no-JS, axe, motion, gate, detail view, sound, email protection, SEO (Chromium, Firefox, WebKit) |
| `npm run test:perf`                      | 4x CPU-throttled scroll trace (run alone)                                                                   |
| `npm run lhci` / `npm run lhci:devtools` | Lighthouse CI, simulated / applied throttling                                                               |
| `npm run analyze`                        | Webpack bundle analyser                                                                                     |

## Notes

- Content lives in `src/content/*.ts`. Search for `TODO(william)` for open items.
- The contact address is never in HTML, JS, metadata or git. It is decoded only inside a trusted click handler. This stops static scrapers, not a bot that drives a real browser and clicks.
- Motion ownership rules: `src/motion/README.md`. Sound lab (unlisted, noindex): `/lab`.
- `deploy/Caddyfile` serves `out/` with immutable caching for hashed assets.
