import { test, expect } from "@playwright/test";
import { advanceOnLoop } from "../src/components/world-motion";

test("rover takes the shorter direction around the loop and stops at its destination", () => {
  expect(advanceOnLoop(0.98, 0.02, 0.01).progress).toBeCloseTo(0.99);
  expect(advanceOnLoop(0.98, 0.02, 0.01).direction).toBe(1);
  expect(advanceOnLoop(0.02, 0.98, 0.01).progress).toBeCloseTo(0.01);
  expect(advanceOnLoop(0.02, 0.98, 0.01).direction).toBe(-1);
  expect(advanceOnLoop(0.998, 0.001, 0.01)).toMatchObject({
    progress: 0.001,
    arrived: true,
  });
  expect(advanceOnLoop(0.25, 0.25, 0)).toMatchObject({
    progress: 0.25,
    arrived: true,
  });
});

for (const width of [1440, 375]) {
  test(`About Me contains the former home sections and is reachable from the header at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("./");
    await expect(page.locator("#about")).toHaveCount(0);
    if (width < 1200)
      await page.getByRole("button", { name: "메뉴", exact: true }).click();
    await page
      .locator(width < 1200 ? ".compact-nav" : ".desktop-nav")
      .getByRole("link", { name: "About Me", exact: true })
      .click();
    await expect(page.locator("h1")).toHaveText("About Me.");
    await expect(page.getByAltText("최원호 프로필")).toBeVisible();
    await expect(page.locator(".about-page > section")).toHaveCount(7);
    await expect(page.locator(".home-experience")).toContainText(
      "KDT 단기심화 최우수상",
    );
    await expect(page.locator(".home-experience")).toContainText(
      "KDT 훈련과정 최우수상",
    );
    await page.getByRole("link", { name: "WONHO 홈" }).click();
    await expect(page.locator("h1")).toHaveText("WONHO makes it real.");
    await expect(page.locator(".world-places button")).toHaveCount(8);
  });
}

test("the 3D rover reaches a project, shows its card and opens that project's page", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  const renderer = page.locator(".rover-renderer");
  await expect(renderer).toHaveAttribute("data-renderer", "three.js", {
    timeout: 30000,
  });
  await expect(page.locator(".world-discovery-card")).toHaveAttribute(
    "href",
    "#/work/product",
    { timeout: 10000 },
  );
  await page
    .locator(".world-places")
    .getByRole("button", { name: /리더·팔로워 암/ })
    .click();
  await expect(renderer).toHaveAttribute("data-phase", "driving");
  await expect(page.locator(".world-discovery-card")).toHaveAttribute(
    "href",
    "#/work/arms",
    { timeout: 10000 },
  );
  await expect(renderer).toHaveAttribute("data-phase", "arrived");
  await page.locator(".world-stage").screenshot({
    path: "artifacts/rover-world-desktop.png",
    style: ".site-header, .skip-link { visibility: hidden !important; }",
  });
  await page.locator(".world-discovery-card").click();
  await expect(page).toHaveURL(/#\/work\/arms$/);
  await expect(page.locator("h1")).toHaveText("리더 암과 로봇팔 개발");
  await expect(page.locator(".project-page-scope")).toContainText("7DoF");
  await page.reload();
  await expect(page.locator("h1")).toHaveText("리더 암과 로봇팔 개발");
  expect(errors).toEqual([]);
});

test("autonomous exploration continues to the next place", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".world-discovery-card")).toHaveAttribute(
    "href",
    "#/work/product",
    { timeout: 10000 },
  );
  await expect(page.locator(".world-discovery-card")).toHaveAttribute(
    "href",
    "#/work/arms",
    { timeout: 14000 },
  );
});

test("mobile pause freezes travel and place selection still works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 950 });
  await page.goto("./");
  const renderer = page.locator(".rover-renderer");
  await expect(renderer).toHaveAttribute("data-renderer", "three.js", {
    timeout: 30000,
  });
  await page
    .locator(".world-places")
    .getByRole("button", { name: /주행과 교육/ })
    .click();
  await page.getByRole("button", { name: "움직임 멈춤", exact: true }).click();
  await expect(renderer).toHaveAttribute("data-motion", "paused");
  const position = await renderer.getAttribute("data-progress");
  await page.waitForTimeout(300);
  await expect(renderer).toHaveAttribute("data-progress", position!);
  await page
    .locator(".world-places")
    .getByRole("button", { name: "Shopee", exact: true })
    .click();
  await expect(page.locator(".world-discovery-card")).toHaveAttribute(
    "href",
    "#/side-work/shopee",
  );
  await page.locator(".exploration-hero").screenshot({
    path: "artifacts/rover-world-mobile.png",
    style: ".site-header, .skip-link { visibility: hidden !important; }",
  });
  await page.locator(".world-discovery-card").click();
  await expect(page.locator("h1")).toHaveText("Shopee · 원격 쇼핑 로봇 서비스");
});

test("reduced motion preserves exploration and WebGL failure has a usable map", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (type: string, ...args: unknown[]) => unknown;
    };
    const original = proto.getContext;
    proto.getContext = function (type, ...args) {
      return type === "webgl" || type === "webgl2"
        ? null
        : original.call(this, type, ...args);
    };
  });
  await page.goto("./");
  await expect(
    page.getByRole("button", { name: "모션 줄이기 적용" }),
  ).toBeDisabled();
  await expect(page.locator(".world-map-fallback")).toBeVisible();
  await page
    .locator(".world-places")
    .getByRole("button", { name: /Asan Hero/ })
    .click();
  await expect(page.locator(".world-discovery-card")).toHaveAttribute(
    "href",
    "#/side-work/asan-hero",
  );
  await page.locator(".world-discovery-card").click();
  await expect(page.locator("h1")).toHaveText("Asan Hero · 대형병원 안내 로봇");
});
