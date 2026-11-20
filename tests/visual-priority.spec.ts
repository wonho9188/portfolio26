import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

const title = "시각적 우선순위(레이아웃, 여백, 크기, 색상)";

test("visual priority factors can be combined without changing the content", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=design");
  await page.getByRole("link", { name: title, exact: true }).click();
  await expect(page.locator("h1")).toHaveText(title);
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(page, "visual-priority", "visual-priority", 0);
  const preview = page.locator(".priority-demo");
  const content = await preview.textContent();
  const beforeSize = await preview
    .locator(".priority-primary h4")
    .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  const beforePadding = await preview.evaluate((element) =>
    parseFloat(getComputedStyle(element).paddingLeft),
  );
  const beforeColor = await page
    .locator(".priority-project-link")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  const layout = page.getByRole("button", { name: "레이아웃", exact: true });
  await layout.focus();
  await page.keyboard.press("Enter");
  await expect(layout).toHaveAttribute("aria-pressed", "true");
  for (const name of ["여백", "크기", "색상"])
    await page.getByRole("button", { name, exact: true }).click();
  await expect(
    page.locator(".priority-control-summary [role=status]"),
  ).toHaveText("4 / 4가지 기준 적용");
  expect(await preview.textContent()).toBe(content);
  expect(
    await preview
      .locator(".priority-primary h4")
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
  ).toBeGreaterThan(beforeSize);
  expect(
    await preview.evaluate((element) =>
      parseFloat(getComputedStyle(element).paddingLeft),
    ),
  ).toBeGreaterThan(beforePadding);
  expect(
    await page
      .locator(".priority-project-link")
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(beforeColor);
  await page.getByRole("button", { name: "기본 상태로", exact: true }).click();
  await expect(
    page.locator(".priority-control-summary [role=status]"),
  ).toHaveText("0 / 4가지 기준 적용");
  await page.getByRole("button", { name: "모두 적용", exact: true }).click();
  await expect(preview).toHaveAttribute("data-layout", "true");
  await expect(preview).toHaveAttribute("data-space", "true");
  await expect(preview).toHaveAttribute("data-size", "true");
  await expect(preview).toHaveAttribute("data-color", "true");
  await page.locator(".priority-project-link").click();
  await expect(page).toHaveURL(/work\/product$/);
  await page.goBack();
  await expect(page.locator("h1")).toHaveText(title);
  await page.reload();
  await expect(page.locator("h1")).toHaveText(title);
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /레퍼런스 자주 보기/ })
    .click();
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /시각적 우선순위/ })
    .click();
  await expect(page.locator("h1")).toHaveText(title);
  await page.locator(".article-header .breadcrumbs a").click();
  await expect(page.locator('[role="tab"][id$="-tab-design"]')).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(errors).toEqual([]);
});

test("all visual priority combinations fit mobile and tablet in both themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(page, "visual-priority", "visual-priority", 0);
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      await page
        .getByRole("button", { name: "기본 상태로", exact: true })
        .click();
      for (let mask = 0; mask < 16; mask++) {
        const labels = ["레이아웃", "여백", "크기", "색상"];
        for (let index = 0; index < labels.length; index++) {
          const control = page.getByRole("button", {
            name: labels[index],
            exact: true,
          });
          const pressed =
            (await control.getAttribute("aria-pressed")) === "true";
          if (pressed !== Boolean(mask & (1 << index))) await control.click();
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  }
});
