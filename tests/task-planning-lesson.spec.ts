import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("task planning lesson changes the plan with initial state and tracks action effects", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=robotics-concept-blocks");
  await page
    .getByRole("link", { name: "Task Planning이란?", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Task Planning이란?");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(
    page,
    "task-planning-concept-block",
    "task-planning-overview",
    0,
  );
  await expect(page.locator(".task-planning-plan h4")).toHaveText([
    "컵 집기",
    "선반 앞으로 이동",
    "선반에 컵 놓기",
  ]);
  const next = page.getByRole("button", {
    name: "다음 작업 확인",
    exact: true,
  });
  const state = page.locator(".task-planning-status dd");
  await expect(state).toHaveText(["탁자 앞", "탁자 위"]);
  await next.click();
  await expect(state).toHaveText(["탁자 앞", "로봇 손"]);
  await next.click();
  await expect(state).toHaveText(["선반 앞", "로봇 손"]);
  await next.click();
  await expect(state).toHaveText(["선반 앞", "선반 위"]);
  await expect(page.locator(".task-planning-status")).toContainText(
    "목표 달성!",
  );
  await expect(next).toBeDisabled();
  await page
    .getByRole("button", { name: "컵을 이미 들고 있어요", exact: true })
    .click();
  await expect(page.locator(".task-planning-plan h4")).toHaveText([
    "선반 앞으로 이동",
    "선반에 컵 놓기",
  ]);
  await expect(state).toHaveText(["탁자 앞", "로봇 손"]);
  await next.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(state).toHaveText(["선반 앞", "선반 위"]);
  await expect(next).toBeDisabled();
  await page.getByRole("button", { name: "처음 상태로", exact: true }).click();
  await expect(state).toHaveText(["탁자 앞", "로봇 손"]);
  await expect(next).toBeEnabled();
  await page.reload();
  await expect(page.locator("h1")).toHaveText("Task Planning이란?");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /MuJoCo란/ })
    .click();
  await expect(page.locator("h1")).toHaveText("MuJoCo란?");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /Task Planning이란/ })
    .click();
  await expect(page.locator("h1")).toHaveText("Task Planning이란?");
  expect(errors).toEqual([]);
});

test("task planning lesson fits mobile and tablet in both themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(
      page,
      "task-planning-concept-block",
      "task-planning-overview",
      0,
    );
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      for (const scenario of [
        "컵이 탁자 위에 있어요",
        "컵을 이미 들고 있어요",
      ]) {
        await page.getByRole("button", { name: scenario, exact: true }).click();
        await expect(page.locator(".task-planning-plan")).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  }
});
