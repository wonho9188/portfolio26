import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

const title = "디자인 감각 늘리는 법 : 레퍼런스 자주 보기";

test("reference practice compares the same content through three visual principles", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=design");
  await page.getByRole("link", { name: title, exact: true }).click();
  await expect(page.locator("h1")).toHaveText(title);
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(
    page,
    "design-reference-practice",
    "reference-practice",
    0,
  );
  const before = page.locator(".reference-demo.before");
  const after = page.locator(".reference-demo.after");
  expect(await before.textContent()).toBe(await after.textContent());
  const beforeSize = await before
    .locator("h4")
    .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  const afterSize = await after
    .locator("h4")
    .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  expect(afterSize).toBeGreaterThan(beforeSize);
  await page.getByRole("button", { name: "여백", exact: true }).click();
  await expect(page.locator(".reference-observation h4")).toHaveText(
    "어떤 정보가 한 묶음으로 보이나요?",
  );
  expect(
    await after.evaluate((element) =>
      parseFloat(getComputedStyle(element).paddingLeft),
    ),
  ).toBeGreaterThan(
    await before.evaluate((element) =>
      parseFloat(getComputedStyle(element).paddingLeft),
    ),
  );
  const alignment = page.getByRole("button", { name: "정렬", exact: true });
  await alignment.focus();
  await page.keyboard.press("Enter");
  await expect(alignment).toHaveAttribute("aria-pressed", "true");
  expect(
    await before
      .locator("h4")
      .evaluate((element) => getComputedStyle(element).textAlign),
  ).toBe("center");
  expect(
    await after
      .locator("h4")
      .evaluate((element) => getComputedStyle(element).textAlign),
  ).toBe("left");
  await openLessonPart(
    page,
    "design-reference-practice",
    "reference-practice",
    3,
  );
  await expect(page.locator(".reference-routine li")).toHaveCount(4);
  await page.reload();
  await expect(page.locator("h1")).toHaveText(title);
  await openLessonEnd(page, "design-reference-practice");
  await page
    .getByRole("link", { name: "스타일 가이드와 컴포넌트", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("스타일 가이드와 컴포넌트");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /레퍼런스 자주 보기/ })
    .click();
  await expect(page.locator("h1")).toHaveText(title);
  await page.locator(".article-header .breadcrumbs a").click();
  await expect(page.locator('[role="tab"][id$="-tab-design"]')).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(errors).toEqual([]);
});

test("reference comparisons fit mobile and tablet in both themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(
      page,
      "design-reference-practice",
      "reference-practice",
      0,
    );
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      for (const name of ["크기·위계", "여백", "정렬"]) {
        await page.getByRole("button", { name, exact: true }).click();
        await expect(page.locator(".reference-comparison figure")).toHaveCount(
          2,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  }
});
