import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { skipGate } from "./helpers";

test.describe("gate", () => {
  test("first visit: counter, choices, enter silently reveals hero @cross", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const gate = page.locator("[data-gate]");
    await expect(gate).toBeVisible();
    await expect(page.locator("#main")).toHaveJSProperty("inert", true);
    const silent = page.getByRole("button", { name: "Enter silently" });
    await expect(silent).toBeVisible({ timeout: 4000 });
    await expect(page.locator("[data-gate-count]")).toHaveText("100");

    const results = await new AxeBuilder({ page }).include("[data-gate]").analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);

    await silent.click();
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

  test("reduced motion: instant enter screen", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Enter silently" });
    await expect(btn).toBeVisible({ timeout: 1000 });
    await btn.click();
    await expect(page.locator("[data-gate]")).toBeHidden({ timeout: 1000 });
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
