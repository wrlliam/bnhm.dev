import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const out = (f: string) => readFileSync(resolve(__dirname, "../out", f), "utf8");

test("head: language, canonical, social cards, format-detection, JSON-LD", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");
  await expect(page).toHaveTitle(
    "William Banham · Full-stack developer, infrastructure & network engineer",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://bnhm.dev",
  );
  await expect(page.locator('meta[name="format-detection"]')).toHaveAttribute(
    "content",
    /email=no/,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  const desc = await page.locator('meta[name="description"]').getAttribute("content");
  expect(desc!.length).toBeGreaterThan(120);
  expect(desc!.length).toBeLessThanOrEqual(160);
  const ld = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent())!,
  );
  expect(ld["@type"]).toBe("Person");
  expect(ld.sameAs).toEqual([
    "https://github.com/wrlliam",
    "https://www.linkedin.com/in/william-banham/",
  ]);
  expect(Object.keys(ld)).not.toContain("email");
  expect(Object.keys(ld)).not.toContain("telephone");
  expect(await page.locator('a[href^="mailto:"], a[href^="tel:"]').count()).toBe(0);
});

test("sitemap and robots: /lab unlisted and disallowed", () => {
  expect(out("sitemap.xml")).toContain("<loc>https://bnhm.dev</loc>");
  expect(out("sitemap.xml")).not.toContain("/lab");
  expect(out("robots.txt")).toContain("Disallow: /lab");
});

test("/lab is noindex and axe-clean", async ({ page }) => {
  await page.goto("/lab");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
});

test("404 page renders and is axe-clean @cross", async ({ page }) => {
  const res = await page.goto("/definitely-not-here");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Nothing on this port.",
  );
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
});

test("privacy: no phone, street address or precise coordinates in the page", () => {
  const html = out("index.html");
  expect(html).not.toMatch(/\+44|\b07\d{3}\s?\d{6}\b/);
  expect(html).not.toMatch(/\b\d{1,2}\.\d{2,}°/); // coordinates rounded to 1 d.p.
  expect(html).not.toMatch(/References/i);
});
