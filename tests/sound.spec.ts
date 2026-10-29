import { expect, test, type Page } from "@playwright/test";
import { skipGate } from "./helpers";

/** Count AudioContexts and live scheduled sources (oscillators, noise). */
async function instrument(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as {
      __audio: { contexts: number; started: number; live: number; maxLive: number };
    };
    w.__audio = { contexts: 0, started: 0, live: 0, maxLive: 0 };
    const Native = window.AudioContext;
    window.AudioContext = class extends Native {
      constructor(opts?: AudioContextOptions) {
        super(opts);
        w.__audio.contexts++;
      }
    } as typeof AudioContext;
    const start = AudioScheduledSourceNode.prototype.start;
    AudioScheduledSourceNode.prototype.start = function (
      this: AudioScheduledSourceNode,
      ...args: [number?]
    ) {
      const a = w.__audio;
      a.started++;
      a.live++;
      a.maxLive = Math.max(a.maxLive, a.live);
      this.addEventListener("ended", () => a.live--, { once: true });
      return start.apply(this, args);
    };
  });
}

const stats = (page: Page) =>
  page.evaluate(() => (window as unknown as { __audio: Record<string, number> }).__audio);

test("nothing is created or played before consent", async ({ page }) => {
  await instrument(page);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Enter silently" })).toBeVisible({
    timeout: 4000,
  });
  await page.getByRole("button", { name: "Enter silently" }).click();
  await expect(page.locator("html")).toHaveClass(/entered/);
  // Interact a lot: hovers, clicks, toggles (theme), detail view.
  await page.locator("[data-work-link]").first().hover();
  await page.locator("[data-work-link]").nth(2).hover();
  await page.getByRole("button", { name: "Dark theme" }).click();
  await page.locator('[data-work-link="ims"]').click();
  await page.keyboard.press("Escape");
  await page.keyboard.type("ping");
  expect(await stats(page)).toMatchObject({ contexts: 0, started: 0 });
});

test("enter with sound: context created in the gesture, sounds play, toggle works", async ({
  page,
}) => {
  await instrument(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Enter with sound" }).click({ timeout: 4000 });
  await expect(page.locator("html")).toHaveClass(/entered/, { timeout: 4000 });
  const s1 = await stats(page);
  expect(s1.contexts).toBe(1);
  expect(s1.started).toBeGreaterThan(0); // blip (+ pop from the chip)
  const toggle = page.locator("header [data-sound-toggle]");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await page.waitForTimeout(300);
  const before = (await stats(page)).started;
  await page.locator("[data-work-link]").nth(1).hover();
  await page.keyboard.type("ping");
  expect((await stats(page)).started).toBe(before);
  expect(await page.evaluate(() => localStorage.getItem("bnhm:sound"))).toBe("0");
});

test("voice cap holds at 6 and the hidden tab is silent", async ({ page }) => {
  await instrument(page);
  await page.goto("/lab");
  await page.getByRole("button", { name: "Start audio" }).click();
  await page.getByRole("button", { name: "Fire everything at once" }).click();
  await page.waitForTimeout(100);
  const s = await stats(page);
  expect(s.maxLive).toBeGreaterThan(0);
  expect(s.maxLive).toBeLessThanOrEqual(6);

  // Simulate a hidden tab.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(100);
  const before = (await stats(page)).started;
  await page.getByRole("button", { name: /^pop/ }).click();
  await page.getByRole("button", { name: /^blip/ }).click();
  expect((await stats(page)).started).toBe(before);
});

test("returning visitor with sound on stays silent until first gesture", async ({
  page,
}) => {
  await instrument(page);
  await skipGate(page);
  await page.addInitScript(() => localStorage.setItem("bnhm:sound", "1"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await page.waitForTimeout(500);
  expect((await stats(page)).contexts).toBe(0);
  await page.mouse.click(5, 300);
  await expect(page.locator("header [data-sound-toggle]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect((await stats(page)).contexts).toBe(1);
});
