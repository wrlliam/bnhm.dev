#!/usr/bin/env node
// Reports gzip size of the JS each exported HTML page loads up front
// (Next 16 no longer prints "First Load JS" in the build output).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const out = resolve(import.meta.dirname, "../out");
const pages = ["index.html", "lab.html", "404.html"].filter((p) => {
  try {
    return statSync(join(out, p)).isFile();
  } catch {
    return false;
  }
});
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const budget = Number(process.env.JS_BUDGET_KB ?? 160) * 1024;
let failed = false;

for (const page of pages) {
  const html = readFileSync(join(out, page), "utf8");
  // Skip noModule polyfills: modern browsers never download them.
  const tags = [...html.matchAll(/<(?:script|link)\b[^>]*>/g)].map((m) => m[0]);
  const srcs = [
    ...new Set(
      tags
        .filter((t) => !/noModule/i.test(t))
        .map((t) => t.match(/(?:src|href)="(\/_next\/static\/[^"]+\.js)"/)?.[1])
        .filter(Boolean),
    ),
  ];
  let total = 0;
  const rows = srcs.map((s) => {
    const size = gzipSync(readFileSync(join(out, s))).length;
    total += size;
    return [s.replace("/_next/static/chunks/", ""), size];
  });
  rows.sort((a, b) => b[1] - a[1]);
  console.log(
    `\n${page}: ${kb(total)} gzip across ${rows.length} scripts (budget ${kb(budget)})`,
  );
  for (const [name, size] of rows.slice(0, 6))
    console.log(`  ${kb(size).padStart(9)}  ${name}`);
  if (page === "index.html" && total > budget) failed = true;
}

const all = readdirSync(join(out, "_next/static/chunks")).filter((f) =>
  f.endsWith(".js"),
);
const lazy = all.reduce(
  (n, f) => n + gzipSync(readFileSync(join(out, "_next/static/chunks", f))).length,
  0,
);
console.log(`\nAll chunks (incl. lazy): ${kb(lazy)} gzip across ${all.length} files`);
if (failed) {
  console.error("First-load JS over budget");
  process.exit(1);
}
