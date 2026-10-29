import { test } from "@playwright/test";
test("peek", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("bnhm:entered", "1"));
  await page.emulateMedia({
    reducedMotion: "reduce",
    colorScheme: (process.env.THEME as "light") ?? "light",
  });
  await page.setViewportSize({ width: Number(process.env.W ?? 1280), height: 900 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const id of (process.env.IDS ?? "rack").split(",")) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.evaluate((id) => document.getElementById(id)!.scrollIntoView(), id);
    await page.waitForTimeout(300);
    const box = await page.locator(`#${id}`).boundingBox();
    console.log(id, JSON.stringify(box));
    await page.screenshot({
      path: `${process.env.DIR}/${id}-${process.env.W ?? 1280}.png`,
    });
  }
});
