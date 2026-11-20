import { test, expect } from "@playwright/test";

for (const width of [375, 768, 1120]) {
  test(`hamburger morphs to X and back at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./#/utilities");
    await page.evaluate(() => document.fonts.ready);
    const menu = page.locator(".menu-button");
    const top = menu.locator(".menu-icon-top");
    const middle = menu.locator(".menu-icon-middle");
    const bottom = menu.locator(".menu-icon-bottom");
    const angle = (line: typeof top) =>
      line.evaluate((node) => {
        const matrix = new DOMMatrix(getComputedStyle(node).transform);
        return Math.round((Math.atan2(matrix.b, matrix.a) * 180) / Math.PI);
      });
    await expect(menu).toHaveAccessibleName("메뉴");
    await expect(menu).toHaveText("");
    await expect(menu.locator("svg line")).toHaveCount(3);
    expect(
      await menu.evaluate((node) => ({
        width: node.getBoundingClientRect().width,
        height: node.getBoundingClientRect().height,
      })),
    ).toEqual({ width: 44, height: 44 });
    await expect(page.locator("#compact-menu")).toBeHidden();
    await page
      .locator(".site-header")
      .screenshot({ path: `artifacts/header-hamburger-${width}.png` });
    await menu.click();
    await expect(menu).toHaveAccessibleName("메뉴 닫기");
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#compact-menu")).toBeVisible();
    await expect(page.locator("#compact-menu a").first()).toBeFocused();
    await expect.poll(() => angle(top)).toBe(45);
    await expect.poll(() => angle(bottom)).toBe(-45);
    await expect
      .poll(() =>
        middle.evaluate((node) => Number(getComputedStyle(node).opacity)),
      )
      .toBe(0);
    expect(
      await top.evaluate((node) => getComputedStyle(node).transitionProperty),
    ).toContain("transform");
    expect(
      await top.evaluate((node) => getComputedStyle(node).transitionDuration),
    ).toContain("0.22s");
    await page
      .locator(".site-header")
      .screenshot({ path: `artifacts/header-menu-x-${width}.png` });
    await menu.click();
    await expect(menu).toHaveAccessibleName("메뉴");
    await expect(page.locator("#compact-menu")).toBeHidden();
    await expect.poll(() => angle(top)).toBe(0);
    await expect.poll(() => angle(bottom)).toBe(0);
    await expect
      .poll(() =>
        middle.evaluate((node) => Number(getComputedStyle(node).opacity)),
      )
      .toBe(1);
    await menu.click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(menu).toBeHidden();
    await expect(page.locator(".desktop-nav")).toBeVisible();
    await expect(page.locator("#compact-menu")).toBeHidden();
    await page.setViewportSize({ width, height: 900 });
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  });
}

test("hamburger respects reduced motion and closes with Escape", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("./#/utilities");
  const menu = page.locator(".menu-button");
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  const duration = await menu.locator(".menu-icon-top").evaluate((node) =>
    Math.max(
      ...getComputedStyle(node)
        .transitionDuration.split(",")
        .map((value) => Number.parseFloat(value)),
    ),
  );
  expect(duration).toBeLessThanOrEqual(0.001);
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

for (const [width, normalHeight, compactHeight] of [
  [1440, 72, 56],
  [375, 56, 48],
]) {
  test(`header follows scroll direction without shifting content at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    await expect(page.locator(".world-discovery-card")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
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
    await expect(page.locator(".article-toc")).toHaveCount(0);
    const controls = await page.locator(".lesson-navigation").boundingBox();
    expect(controls!.y).toBeGreaterThanOrEqual(compactHeight + 16);
    expect(controls!.y + controls!.height).toBeLessThanOrEqual(900);
  });
}

test("opened mobile menu stays visible while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto("./");
  await expect(page.locator(".world-discovery-card")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
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
  await expect(page.locator(".world-discovery-card")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await expect(page.locator(".site-header")).toHaveClass(/is-hidden/);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "WONHO 홈" })).toBeFocused();
  await expect(page.locator(".site-header")).not.toHaveClass(/is-hidden/);
  await expect(page.getByRole("link", { name: "WONHO 홈" })).toBeInViewport();
});
