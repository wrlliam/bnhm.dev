import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { skipGate } from "./helpers";

test.describe("gate", () => {
  test("first visit: real steps, eased counter, enters by itself @cross", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const gate = page.locator("[data-gate]");
    await expect(gate).toBeVisible();
    await expect(page.locator("#main")).toHaveJSProperty("inert", true);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);

    // No click needed.
    await expect(page.locator("html")).toHaveClass(/gs-done/, { timeout: 5000 });
    for (const step of ["fonts", "page", "motion", "sound"])
      await expect(page.locator("html")).toHaveClass(new RegExp(`gs-${step}`));
    await expect(gate).toBeHidden({ timeout: 4000 });
    await expect(page.locator("html")).toHaveClass(/entered/);
    await expect(page.locator("#main")).toHaveJSProperty("inert", false);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "William Banham",
    );
    expect(await page.evaluate(() => sessionStorage.getItem("bnhm:entered"))).toBe("1");
    expect(errors).toEqual([]);

    // Same session: no gate.
    await page.reload();
    await expect(gate).toBeHidden();
  });

  test("counter eases (slow start, slow finish) rather than stepping", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/", { waitUntil: "commit" });
    await page.waitForSelector("[data-gate]", { state: "attached" });
    // Sample inside the page so test-runner latency can't thin out the data.
    const samples = await page.evaluate(
      () =>
        new Promise<number[]>((resolve) => {
          const el = document.querySelector(".gate-count-num")!;
          const out: number[] = [];
          const id = setInterval(() => {
            out.push(Number(getComputedStyle(el).getPropertyValue("--gate-p")));
            if (out.length >= 30) {
              clearInterval(id);
              resolve(out);
            }
          }, 50);
        }),
    );
    // Monotonic, many distinct values (not four 25 % jumps).
    expect(samples).toEqual([...samples].sort((a, b) => a - b));
    expect(new Set(samples).size).toBeGreaterThan(6);
  });

  test("reduced motion: enters as soon as loading is done", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("[data-gate]")).toBeHidden({ timeout: 4000 });
    await expect(page.locator("html")).toHaveClass(/entered/);
  });
});

test.describe("work detail", () => {
  test.beforeEach(async ({ page }) => skipGate(page));

  for (const rm of ["no-preference", "reduce"] as const) {
    test(`opens, traps focus, closes with Esc and back (${rm}) @cross`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: rm });
      await page.goto("/");
      await expect(page.locator("html")).toHaveClass(/motion-ready/);
      // The detail view is its own lazy chunk; before it mounts, rows are plain links.
      await expect(page.locator("[data-work-list].work-enhanced")).toHaveCount(1);
      const link = page.locator('[data-work-link="api"]');
      await link.scrollIntoViewIfNeeded();
      await link.click();
      const dialog = page.getByRole("dialog", { name: "api.bnhm.dev" });
      await expect(dialog).toBeVisible();
      await expect(page).toHaveURL(/\?p=api/);
      await expect(page.getByRole("button", { name: "Close project" })).toBeFocused();
      await page.waitForTimeout(900);
      const axe = await new AxeBuilder({ page }).include(".detail-panel").analyze();
      expect(axe.violations.map((v) => v.id)).toEqual([]);

      // Focus stays inside.
      for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
      expect(
        await page.evaluate(() => !!document.activeElement?.closest(".detail-panel")),
      ).toBe(true);

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(page).not.toHaveURL(/\?p=/);
      await expect(link).toBeFocused();

      // Open again, close with the browser back button.
      await link.click();
      await expect(dialog).toBeVisible();
      await page.goBack();
      await expect(dialog).toBeHidden();
    });
  }

  test("deep link ?p=slug opens the detail view", async ({ page }) => {
    await page.goto("/?p=gohop");
    await expect(page.getByRole("dialog", { name: "goHop" })).toBeVisible();
  });
});

test("dark theme with detail open is axe-clean", async ({ page }) => {
  await skipGate(page);
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/?p=jupiter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.waitForTimeout(500);
  const axe = await new AxeBuilder({ page }).analyze();
  expect(
    axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(",")}`),
  ).toEqual([]);
});

test("rack LEDs only run on screen; timeline line scrubs", async ({ page }) => {
  await skipGate(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await expect(page.locator("[data-rack]")).toHaveAttribute("data-playing", "false");
  await page.locator("[data-rack]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-rack]")).toHaveAttribute("data-playing", "true");
  const scale = () =>
    page
      .locator("[data-timeline-progress]")
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).d);
  await page.locator("#experience-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const a = await scale();
  await page.locator("#education").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const b = await scale();
  expect(b).toBeGreaterThan(a);
});
