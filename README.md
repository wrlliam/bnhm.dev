# bnhm.dev

Personal site of William Banham. Next.js (App Router, static export), TypeScript, Tailwind CSS v4, GSAP + Lenis + Motion, and a Web Audio sound palette (on by default, starts on the first click or key press; mute from the header).

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

## Docker

The image is a static export served by [`serve`](https://github.com/vercel/serve) on `:5000` as a non-root user. Headers (caching, security) live in `deploy/serve.json`. There is no TLS in the container: put your own reverse proxy (e.g. Caddy) in front of it.

```sh
docker login
IMAGE=<dockerhub-user>/bnhm-dev npm run docker:publish     # multi-arch (amd64 + arm64), tags :latest and :<git sha>
IMAGE=<dockerhub-user>/bnhm-dev TAG=1.0.0 npm run docker:publish
```

The contact address does not need to be in the build (its encoded parts are committed). If you do pass `CONTACT_EMAIL`, the script sends it as a BuildKit secret, so it never ends up in a layer or the image history.

**Compose / Portainer:** `docker compose up -d --build` builds the image from the `Dockerfile` and runs it. In Portainer: Stacks → Add stack → Repository, pointing at this repo (optionally set `BNHM_PORT` under environment variables). The container runs read-only, with all capabilities dropped and `no-new-privileges`, and has a health check.

## Notes

- Content lives in `src/content/*.ts`. Search for `TODO(william)` for open items.
- More GitHub projects are listed, commented out, at the end of `src/content/projects.ts`: uncomment the ones you want.
- The contact address is never in HTML, JS, metadata or git. It is decoded only inside a trusted click handler. This stops static scrapers, not a bot that drives a real browser and clicks.
- Motion ownership rules: `src/motion/README.md`. Sound lab (unlisted, noindex): `/lab`.
- `deploy/serve.json` configures `serve` for `out/`, with immutable caching for hashed assets.
