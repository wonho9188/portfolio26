import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("style guide uses current tokens, real shared components and design navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=design");
  await page
    .getByRole("link", { name: "스타일 가이드와 컴포넌트", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("스타일 가이드와 컴포넌트");
  await openLessonPart(
    page,
    "style-guide-components",
    "style-guide-overview",
    0,
  );
  await expect(page.locator(".guide-swatch")).toHaveCount(6);
  await expect(page.locator(".guide-font")).toHaveCount(6);
  const color = page.locator('[data-color-token="background"]');
  const original = await color.textContent();
  await page
    .getByRole("button", { name: "가이드에서 사이트 테마 전환", exact: true })
    .click();
  await expect(color).not.toHaveText(original!);
  const actual = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-background")
      .trim()
      .toUpperCase(),
  );
  await expect(color).toHaveText(actual);
  await page
    .getByRole("button", { name: "여백과 레이아웃", exact: true })
    .click();
  await expect(page.locator(".guide-layout-current")).toContainText("1312px");
  await page.setViewportSize({ width: 375, height: 900 });
  await expect(page.locator(".guide-layout-current")).toContainText("20px");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".guide-layout-current")).toContainText("64px");
  const components = page.getByRole("button", {
    name: "컴포넌트",
    exact: true,
  });
  await components.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "사용 불가", exact: true }),
  ).toBeDisabled();
  const action = page.getByRole("button", { name: "동작 확인", exact: true });
  await action.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".guide-demo-status")).toContainText("1회 동작");
  await page.getByRole("button", { name: "선택 옵션", exact: true }).click();
  await expect(page.locator(".guide-demo-status")).toContainText("옵션 선택됨");
  await expect(page.locator(".guide-card-example .post-card")).toHaveCount(1);
  await page.getByRole("button", { name: "초기화", exact: true }).click();
  await expect(page.locator(".guide-demo-status")).toHaveText(
    "0회 동작 · 옵션 선택 안 됨",
  );
  await page.getByRole("button", { name: "글 목록", exact: true }).click();
  await page
    .locator(".guide-post-list")
    .getByRole("link", { name: "디자인 트렌드", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("디자인 트렌드");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /스타일 가이드와 컴포넌트/ })
    .click();
  await expect(page.locator("h1")).toHaveText("스타일 가이드와 컴포넌트");
  await page.reload();
  await expect(page.locator("h1")).toHaveText("스타일 가이드와 컴포넌트");
  await page.locator(".article-header .breadcrumbs a").click();
  await expect(page.locator('[role="tab"][id$="-tab-design"]')).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(errors).toEqual([]);
});

test("style guide panels fit narrow screens in both themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(
      page,
      "style-guide-components",
      "style-guide-overview",
      0,
    );
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      for (const name of [
        "색상과 폰트",
        "여백과 레이아웃",
        "컴포넌트",
        "글 목록",
      ]) {
        await page.getByRole("button", { name, exact: true }).click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  }
});
