import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";

const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "18727",
    "--strictPort",
  ],
  { stdio: "pipe" },
);
let browser;
const url = "http://127.0.0.1:18727/portfolio26/";
try {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(url)).ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [],
    failed = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failed.push({ url: response.url(), status: response.status() });
  });
  await fs.mkdir("artifacts", { recursive: true });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.ruled-surface[data-renderer="three.js"]').waitFor();
  await page.getByRole("button", { name: "움직임 멈춤", exact: true }).click();
  await page.screenshot({ path: "artifacts/production-hero-light.png" });
  await page
    .locator(".about")
    .screenshot({ path: "artifacts/production-about-light.png" });
  await page
    .locator("#main-work")
    .screenshot({ path: "artifacts/production-main-work-light.png" });
  await page.getByRole("button", { name: "다크 모드로 전환" }).click();
  await page.screenshot({ path: "artifacts/production-hero-dark.png" });
  for (const route of [
    "work",
    "side-work",
    "utilities",
    "blog",
    "life",
    "blog/ros2-interfaces",
  ]) {
    await page.goto(url + "#/" + route);
    await page.locator("h1").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `artifacts/production-${route.replaceAll("/", "-")}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto(url);
  await page.locator('.ruled-surface[data-renderer="three.js"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "artifacts/production-hero-mobile.png" });
  const result = {
    date: "2026-11-16",
    scope: "Production build at /portfolio26/ on local static preview",
    pageErrors: errors,
    failedRequests: failed,
    passed: errors.length === 0 && failed.length === 0,
  };
  await fs.writeFile(
    "artifacts/build-verification.json",
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result));
  if (!result.passed) process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill();
}
