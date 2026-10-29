import { expect, test } from "@playwright/test";
import { skipGate } from "./helpers";

/**
 * Scroll trace under 4x CPU throttling: no long tasks (>50 ms) and frame
 * pacing close to 60 fps while scrolling with the wheel (Lenis path).
 */
test("scroll performance under 4x CPU throttle @perf", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "CDP throttling is Chromium-only");
  await skipGate(page);
  await page.setViewportSize({ width: 412, height: 915 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await page.waitForTimeout(1500); // idle after load

  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await page.evaluate(() => {
    const w = window as unknown as { __long: number[]; __frames: number[] };
    w.__long = [];
    w.__frames = [];
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => w.__long.push(e.duration)),
    ).observe({
      type: "longtask",
      buffered: false,
    });
    let last = performance.now();
    const loop = (t: number) => {
      w.__frames.push(t - last);
      last = t;
      if (w.__frames.length < 100000) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });

  for (let i = 0; i < 60; i++) {
    await page.mouse.wheel(0, 180);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(800);

  const { long, frames } = await page.evaluate(() => {
    const w = window as unknown as { __long: number[]; __frames: number[] };
    return { long: w.__long, frames: w.__frames.slice(5) };
  });
  const sorted = [...frames].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0;
  const avg = frames.reduce((a, b) => a + b, 0) / frames.length;
  console.log(
    `frames=${frames.length} avg=${avg.toFixed(1)}ms (~${(1000 / avg).toFixed(0)} fps) p95=${p95.toFixed(1)}ms longTasks=${JSON.stringify(long.map(Math.round))}`,
  );
  expect(long.filter((d) => d > 50)).toEqual([]);
  expect(avg).toBeLessThan(18);
});
