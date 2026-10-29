import { expect, test } from "@playwright/test";
import { skipGate } from "./helpers";

test.beforeEach(async ({ page }) => {
  await skipGate(page);
});

test("motion runtime boots without console errors and Lenis drives ScrollTrigger", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await expect(page.locator("html")).toHaveClass(/lenis/);

  // Scroll with the wheel (Lenis path) to the experience section.
  const heading = page.locator("#experience-title");
  for (let i = 0; i < 40 && !(await heading.isVisible().catch(() => false)); i++) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(60);
  }
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  // Heading keeps its accessible name after SplitText.
  await expect(heading).toHaveAccessibleName("Where I’ve put it to work.");
  // Its masked lines finished rising.
  const offset = await heading.evaluate((el) => {
    const line = el.querySelector<HTMLElement>("[class*='line']") ?? el;
    return new DOMMatrix(getComputedStyle(line).transform).m42;
  });
  expect(Math.abs(offset)).toBeLessThan(1);
  expect(errors).toEqual([]);
});

test("reduced motion: native scroll, no Lenis, content still revealed", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await page.locator("#education").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(page.locator("#education [data-batch-item]").first()).toHaveCSS(
    "opacity",
    "1",
  );
});
