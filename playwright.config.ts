import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npx serve out -l ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, grepInvert: /@perf/ },
    // Timing-sensitive: run alone (npm run test:perf) so other workers don't skew it.
    { name: "perf", use: { ...devices["Desktop Chrome"] }, grep: /@perf/ },
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, grep: /@cross/, grepInvert: /@perf/ },
    { name: "webkit", use: { ...devices["Desktop Safari"] }, grep: /@cross/, grepInvert: /@perf/ },
  ],
});
