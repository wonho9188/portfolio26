import { test, expect } from "@playwright/test";

for (const [width, normalHeight, compactHeight] of [
  [1440, 72, 56],
  [375, 56, 48],
]) {
  test(`header follows scroll direction without shifting content at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    const header = page.locator(".site-header");
    const inner = page.locator(".header-inner");
    const height = () =>
      inner.evaluate((n) => n.getBoundingClientRect().height);
    const scroll = (top: number) =>
      page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        top,
      );
    const mainDocumentTop = () =>
      page
        .locator("main")
        .evaluate((n) => n.getBoundingClientRect().top + scrollY);
    await expect.poll(height).toBe(normalHeight);
    const initialMainTop = await mainDocumentTop();

    await scroll(480);
    await expect(header).toHaveClass(/is-hidden/);
    await expect
      .poll(() => header.evaluate((n) => n.getBoundingClientRect().bottom))
      .toBeLessThanOrEqual(1);
    await scroll(360);
    await expect(header).not.toHaveClass(/is-hidden/);
    await expect.poll(height).toBe(compactHeight);
    await expect
      .poll(() => header.evaluate((n) => n.getBoundingClientRect().top))
      .toBe(0);
    expect(await mainDocumentTop()).toBe(initialMainTop);
    await page.screenshot({ path: `artifacts/header-compact-${width}.png` });

    await scroll(359);
    await scroll(361);
    await expect(header).not.toHaveClass(/is-hidden/);
    await scroll(420);
    await expect(header).toHaveClass(/is-hidden/);
    await scroll(0);
    await expect(header).not.toHaveClass(/is-hidden|is-compact/);
    await expect.poll(height).toBe(normalHeight);

    await page.goto("./#/blog/ros2-interfaces");
    await expect(page.locator("h1")).toHaveText(
      "50개의 토픽·서비스를 어떻게 설계했을까",
    );
    await scroll(1000);
    await expect(header).toHaveClass(/is-hidden/);
    await scroll(780);
    await expect(header).not.toHaveClass(/is-hidden/);
    await expect.poll(height).toBe(compactHeight);
    if (width >= 768) {
      await expect
        .poll(() =>
          page
            .locator(".article-toc")
            .evaluate((n) => n.getBoundingClientRect().top),
        )
        .toBeGreaterThanOrEqual(compactHeight + 16);
    }
  });
}

test("opened mobile menu stays visible while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto("./");
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await expect(page.locator(".site-header")).toHaveClass(/is-hidden/);
  await page.evaluate(() => window.scrollTo({ top: 380, behavior: "instant" }));
  await expect(page.locator(".site-header")).not.toHaveClass(/is-hidden/);
  await page.getByRole("button", { name: "메뉴", exact: true }).click();
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
  await expect(page.locator(".site-header")).not.toHaveClass(/is-hidden/);
  await expect(
    page.getByRole("navigation", { name: "접힌 주 메뉴" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "메뉴", exact: true }),
  ).toBeFocused();
});

test("keyboard focus reveals a hidden header with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await expect(page.locator(".site-header")).toHaveClass(/is-hidden/);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "WONHO 홈" })).toBeFocused();
  await expect(page.locator(".site-header")).not.toHaveClass(/is-hidden/);
  await expect(page.getByRole("link", { name: "WONHO 홈" })).toBeInViewport();
});
