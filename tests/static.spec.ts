import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { skipGate } from "./helpers";

const sections = [
  "top",
  "about",
  "work",
  "rack",
  "experience",
  "education",
  "stack",
  "contact",
];

test.describe("no-JS", () => {
  test.use({ javaScriptEnabled: false });

  test("all content is present and visible @cross", async ({ page }) => {
    await page.goto("/");
    for (const id of sections) await expect(page.locator(`#${id}`)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "William Banham",
    );
    await expect(page.locator("[data-gate]")).toBeHidden();
    // Every project's details are readable inline.
    await expect(page.locator("[data-work-inline]").first()).toBeVisible();
    // Nothing is hidden for animation.
    const hidden = await page
      .locator("main *")
      .evaluateAll(
        (els) => els.filter((e) => getComputedStyle(e).opacity === "0").length,
      );
    expect(hidden).toBe(0);
  });
});

for (const theme of ["light", "dark"] as const) {
  test(`axe: ${theme} theme`, async ({ page }) => {
    await skipGate(page);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}

test("screenshots", async ({ page }, info) => {
  test.skip(!process.env.SCREENSHOTS, "set SCREENSHOTS=1");
  await skipGate(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      // content-visibility skips off-screen rendering, which blanks full-page captures.
      await page.addStyleTag({
        content: ".below-fold{content-visibility:visible!important}",
      });
      await page.screenshot({
        path: `${process.env.SCREENSHOTS_DIR ?? info.outputDir}/${theme}-${width}.png`,
        fullPage: true,
      });
    }
  }
});
