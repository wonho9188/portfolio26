import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("component types demonstrate actions, input, navigation, cards and feedback", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=design");
  await page
    .getByRole("link", { name: "컴포넌트의 종류", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("컴포넌트의 종류");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(page, "component-kinds", "component-kinds", 0);
  await page.getByRole("button", { name: "예시 동작", exact: true }).click();
  await expect(page.locator(".component-kind-status")).toHaveText(
    "버튼을 1회 눌렀어요.",
  );
  await expect(
    page.getByRole("button", { name: "준비 중", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "입력과 선택", exact: true }).click();
  await page
    .getByRole("textbox", { name: "예시 제목", exact: true })
    .fill("관절 제어 화면");
  await page
    .getByRole("combobox", { name: "분류 선택", exact: true })
    .selectOption("로보틱스");
  await page
    .getByRole("checkbox", { name: "중요한 메모로 표시", exact: true })
    .check();
  await expect(page.locator(".component-input-preview h4")).toHaveText(
    "관절 제어 화면",
  );
  await expect(page.locator(".component-input-preview .award-chip")).toHaveText(
    ["로보틱스", "중요"],
  );
  await page.getByRole("button", { name: "탐색", exact: true }).click();
  const tab = page.getByRole("tab", { name: "개요", exact: true });
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "예시", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("tabpanel", { name: "예시", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("tabpanel", { name: "개요", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Home");
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "예시", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "피드백", exact: true }).click();
  const next = page.getByRole("button", { name: "다음 단계", exact: true });
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".component-inline-notice")).toContainText(
    "진행 중",
  );
  await page.keyboard.press("Enter");
  await expect(page.locator(".component-inline-notice")).toContainText("완료");
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "2");
  await expect(next).toBeDisabled();
  await page.getByRole("button", { name: "처음으로", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "0");
  await page.getByRole("button", { name: "정보 표시", exact: true }).click();
  await page
    .locator(".component-kind-card")
    .getByRole("link", { name: "디자인 트렌드", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("디자인 트렌드");
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("컴포넌트의 종류");
  await page.reload();
  await expect(page.locator("h1")).toHaveText("컴포넌트의 종류");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /시각적 우선순위/ })
    .click();
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /컴포넌트의 종류/ })
    .click();
  await page.locator(".article-header .breadcrumbs a").click();
  await expect(page.locator('[role="tab"][id$="-tab-design"]')).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(errors).toEqual([]);
});

test("component examples fit narrow screens in both themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(page, "component-kinds", "component-kinds", 0);
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      for (const name of [
        "행동",
        "입력과 선택",
        "탐색",
        "정보 표시",
        "피드백",
      ]) {
        await page.getByRole("button", { name, exact: true }).click();
        await expect(page.locator(".component-kind-demo")).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  }
});
