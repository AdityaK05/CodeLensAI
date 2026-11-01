/** playwright.config.ts */
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/test/e2e",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["dot"], ["html", { output: "playwright-report" }]],
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    headless: true,
    viewport: { width: 1440, height: 800 },
    trace: "on-first-retry",
  },
});
