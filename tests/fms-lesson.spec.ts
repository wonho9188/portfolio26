import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("FMS lesson considers availability and charge, queues requests and completes assignments", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=robotics-concept-blocks");
  await page.getByRole("link", { name: "FMS란?", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("FMS란?");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(page, "fms-concept-block", "fms-overview", 0);
  await expect(page.locator(".fms-status")).toHaveText(
    "로봇 A에게 배정할 수 있어요.",
  );
  await page
    .getByRole("checkbox", { name: "A도 다른 작업 중", exact: true })
    .check();
  const assign = page.getByRole("button", { name: "작업 배정", exact: true });
  await expect(assign).toBeDisabled();
  await expect(page.locator(".fms-status")).toContainText("요청을 대기시켜요.");
  await page
    .getByRole("checkbox", { name: "B 충전 완료", exact: true })
    .check();
  await expect(page.locator(".fms-status")).toHaveText(
    "로봇 B에게 배정할 수 있어요.",
  );
  await assign.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".fms-status")).toHaveText(
    "로봇 B에게 작업을 배정했어요.",
  );
  await expect(assign).toBeDisabled();
  const finish = page.getByRole("button", { name: "완료 처리", exact: true });
  await finish.click();
  await expect(page.locator(".fms-status")).toHaveText(
    "로봇 B의 작업이 완료됐어요.",
  );
  await expect(finish).toBeDisabled();
  await page.getByRole("button", { name: "예시 초기화", exact: true }).click();
  await expect(page.locator(".fms-status")).toHaveText(
    "로봇 A에게 배정할 수 있어요.",
  );
  await page
    .getByRole("checkbox", { name: "B 충전 완료", exact: true })
    .check();
  await expect(page.locator(".fms-status")).toHaveText(
    "로봇 B에게 배정할 수 있어요.",
  );
  await expect(page.locator(".fms-caption")).toContainText(
    "실제 운영 기준은 아닙니다.",
  );
  await page.reload();
  await expect(page.locator("h1")).toHaveText("FMS란?");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /Task Planning이란/ })
    .click();
  await expect(page.locator("h1")).toHaveText("Task Planning이란?");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /FMS란/ })
    .click();
  await expect(page.locator("h1")).toHaveText("FMS란?");
  await openLessonEnd(page, "fms-concept-block");
  await page.getByRole("link", { name: "Nav2란?", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Nav2란?");
  expect(errors).toEqual([]);
});

test("FMS scenarios fit mobile and tablet in both themes", async ({ page }) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(page, "fms-concept-block", "fms-overview", 0);
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      for (const [busy, ready] of [
        [false, false],
        [true, false],
        [true, true],
        [false, true],
      ]) {
        await page
          .getByRole("checkbox", { name: "A도 다른 작업 중", exact: true })
          .setChecked(busy);
        await page
          .getByRole("checkbox", { name: "B 충전 완료", exact: true })
          .setChecked(ready);
        await expect(page.locator(".fms-robot-card")).toHaveCount(3);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  }
});
