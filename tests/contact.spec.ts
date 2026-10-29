import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { expect, test } from "@playwright/test";
import { skipGate } from "./helpers";

/** The address comes from the environment only; it is never written in tests. */
function contactAddress(): string | undefined {
  if (process.env.CONTACT_EMAIL) return process.env.CONTACT_EMAIL;
  const env = resolve(__dirname, "../.env.local");
  if (!existsSync(env)) return undefined;
  return readFileSync(env, "utf8")
    .match(/^CONTACT_EMAIL=(.+)$/m)?.[1]
    ?.trim();
}

const address = contactAddress();

function patterns(a: string): string[] {
  const domain = a.slice(a.indexOf("@"));
  return [
    a,
    domain, // domain-with-@
    Buffer.from(a).toString("base64"),
    Buffer.from(a).toString("base64").replace(/=+$/, ""),
    encodeURIComponent(a),
    a.replace("@", "&#64;"),
    a.replace("@", "\\u0040"),
  ].map((p) => p.toLowerCase());
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test.describe("email protection", () => {
  test.skip(!address, "CONTACT_EMAIL not available");

  test("(a) built HTML, JS and every other file in out/ contain no form of the address", () => {
    const out = resolve(__dirname, "../out");
    const files = walk(out).filter((f) =>
      /\.(html|js|txt|json|xml|css|map|webmanifest|svg)$/.test(f),
    );
    expect(files.some((f) => f.endsWith(".js"))).toBe(true);
    const pats = patterns(address!);
    const hits: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, "utf8").toLowerCase();
      for (const p of pats)
        if (text.includes(p))
          hits.push(`${f.replace(out, "out")} :: pattern #${pats.indexOf(p)}`);
    }
    expect(hits).toEqual([]);
    expect(files.filter((f) => f.endsWith(".map"))).toEqual([]);
  });

  test("(a2) no tracked file or commit contains the address", () => {
    const root = resolve(__dirname, "..");
    const pats = patterns(address!);
    const tracked = execSync("git ls-files -z", { cwd: root })
      .toString()
      .split("\0")
      .filter(Boolean);
    expect(tracked.filter((f) => f.startsWith(".ai/") || f.startsWith(".env"))).toEqual(
      [],
    );
    const history = execSync("git log -p --all --format=%B", {
      cwd: root,
      maxBuffer: 1 << 28,
    })
      .toString()
      .toLowerCase();
    const bad = pats.filter((p) => history.includes(p));
    expect(bad.length, "address pattern found in git history").toBe(0);
  });

  test("(b) a real click on Copy address puts the address on the clipboard @cross", async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "clipboard permissions are Chromium-only in Playwright",
    );
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await skipGate(page);
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Copy email address" });
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await expect(page.getByRole("status").filter({ hasText: "copied" })).toHaveText(
      "Email address copied to clipboard.",
    );
    await expect(btn).toContainText("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(address);
    // The decoded address never reaches the DOM.
    expect((await page.content()).toLowerCase()).not.toContain(address!.toLowerCase());
  });

  test("(b2) keyboard: Space and Enter trigger copy", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await skipGate(page);
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Copy email address" });
    await btn.focus();
    await page.keyboard.press("Space");
    await expect(btn).toContainText("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(address);
    await page.evaluate(() => navigator.clipboard.writeText("reset"));
    await page.keyboard.press("Enter");
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(address);
  });

  test("(b3) synthetic (untrusted) clicks decode nothing", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await skipGate(page);
    await page.goto("/");
    await page.evaluate(() => navigator.clipboard.writeText("unchanged"));
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) =>
        x.textContent?.includes("Copy address"),
      );
      b?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("unchanged");
  });

  test("(c) Email me navigates to the right mailto: (intercepted)", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "uses CDP navigation events");
    await skipGate(page);
    await page.goto("/");
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Page.enable");
    const requested = new Promise<string>((res) =>
      cdp.on("Page.frameRequestedNavigation", (e: { url: string }) => res(e.url)),
    );
    await page.getByRole("button", { name: "Email me" }).click();
    expect(await requested).toBe(`mailto:${address}`);
  });
});
