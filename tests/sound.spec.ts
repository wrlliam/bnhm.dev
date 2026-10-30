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

test("nothing is created or played before the first gesture", async ({ page }) => {
  await instrument(page);
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/entered/, { timeout: 6000 });
  await page.mouse.move(200, 200);
  await page.mouse.move(600, 400);
  expect(await stats(page)).toMatchObject({ contexts: 0, started: 0 });
  // Toggle shows "on" (the default), waiting for a gesture.
  await expect(page.locator("header [data-sound-toggle]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("sound is on by default: first click starts it; toggle mutes and persists", async ({
  page,
}) => {
  await instrument(page);
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/entered/, { timeout: 6000 });
  await page.mouse.click(5, 400);
  await expect.poll(async () => (await stats(page)).contexts).toBe(1);
  await page.locator("[data-work-link]").nth(1).hover();
  await page.mouse.move(5, 5);
  await page.locator("[data-work-link]").nth(2).hover();
  await expect.poll(async () => (await stats(page)).started).toBeGreaterThan(0);
  const toggle = page.locator("header [data-sound-toggle]");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await page.waitForTimeout(300);
  const before = (await stats(page)).started;
  await page.locator("[data-work-link]").nth(3).hover();
  await page.keyboard.type("ping");
  expect((await stats(page)).started).toBe(before);
  expect(await page.evaluate(() => localStorage.getItem("bnhm:sound"))).toBe("0");
});

test("muting before the first gesture: the toggle press is not treated as consent", async ({
  page,
}) => {
  await instrument(page);
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/entered/, { timeout: 6000 });
  const toggle = page.locator("header [data-sound-toggle]");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await page.mouse.click(5, 400);
  await page.waitForTimeout(300);
  expect((await stats(page)).contexts).toBe(0);
});

test("a muted visitor stays muted next session", async ({ page }) => {
  await instrument(page);
  await page.addInitScript(() => localStorage.setItem("bnhm:sound", "0"));
  await page.goto("/");
  await expect(page.getByText("Sound is off.")).toBeAttached({ timeout: 4000 });
  await expect(page.locator("html")).toHaveClass(/entered/, { timeout: 6000 });
  await page.mouse.click(5, 400);
  await page.waitForTimeout(300);
  expect((await stats(page)).contexts).toBe(0);
  await expect(page.locator("header [data-sound-toggle]")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
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
