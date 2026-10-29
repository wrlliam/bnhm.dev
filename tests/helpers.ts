import type { Page } from "@playwright/test";

/** Skip the gate the same way a returning visitor in the same session would. */
export async function skipGate(page: Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("bnhm:entered", "1");
    } catch {}
  });
}
