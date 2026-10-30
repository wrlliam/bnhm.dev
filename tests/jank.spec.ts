import { expect, test } from "@playwright/test";
import { skipGate } from "./helpers";

/**
 * Real-feel scroll check: mobile viewport, 6x CPU, whole page via the wheel
 * (Lenis path). Long Animation Frames (LoAF) include style, layout and paint,
 * which rAF timing alone misses.
 */
test("no janky frames while scrolling the whole page @perf", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "LoAF + CDP throttling are Chromium-only");
  await skipGate(page);
  await page.setViewportSize({ width: 412, height: 915 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await page.waitForTimeout(2500);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
  await page.evaluate(() => {
    const w = window as unknown as { __loaf: { d: number; r: number; s: string }[] };
    w.__loaf = [];
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => {
        const f = e as PerformanceEntry & {
          renderStart: number;
          styleAndLayoutStart: number;
          scripts: { sourceURL: string; invoker: string; duration: number }[];
        };
        w.__loaf.push({
          d: Math.round(f.duration),
          r: Math.round(
            f.startTime + f.duration - (f.renderStart || f.startTime + f.duration),
          ),
          s: (f.scripts || [])
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 2)
            .map((x) => `${x.invoker}:${Math.round(x.duration)}`)
            .join(" "),
        });
      }),
    ).observe({ type: "long-animation-frame", buffered: false });
  });
  for (let i = 0; i < 110; i++) {
    await page.mouse.wheel(0, 170);
    await page.waitForTimeout(35);
  }
  await page.waitForTimeout(1200);
  const loaf = await page.evaluate(
    () => (window as unknown as { __loaf: { d: number; r: number; s: string }[] }).__loaf,
  );
  const total = loaf.reduce((a, b) => a + b.d, 0);
  console.log(
    `LoAF count=${loaf.length} total=${total}ms max=${Math.max(0, ...loaf.map((l) => l.d))}ms`,
    JSON.stringify(loaf.sort((a, b) => b.d - a.d).slice(0, 8)),
  );
  expect(loaf.filter((l) => l.d > 100)).toEqual([]);
});
