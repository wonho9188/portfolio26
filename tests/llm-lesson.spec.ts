import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("LLM lesson explains incremental output, resets context and links to related lessons", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=robotics-concept-blocks");
  await page.getByRole("link", { name: "LLM이란?", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("LLM이란?");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(page, "llm-concept-block", "llm-overview", 0);
  const next = page.getByRole("button", {
    name: "다음 조각 붙이기",
    exact: true,
  });
  await expect(page.locator(".llm-count")).toHaveText("0 / 4");
  for (let step = 1; step <= 4; step++) {
    await next.click();
    await expect(page.locator(".llm-piece")).toHaveCount(step);
    await expect(page.locator(".llm-count")).toHaveText(`${step} / 4`);
  }
  await expect(next).toBeDisabled();
  await expect(page.locator(".llm-output")).toContainText("안내 데스크로");
  await page
    .getByRole("button", { name: "로봇의 배터리가 부족해.", exact: true })
    .click();
  await expect(page.locator(".llm-piece")).toHaveCount(0);
  await next.focus();
  for (let step = 0; step < 4; step++) await page.keyboard.press("Enter");
  await expect(page.locator(".llm-output")).toContainText("충전소로");
  await expect(next).toBeDisabled();
  await page
    .getByRole("button", { name: "처음부터 보기", exact: true })
    .click();
  await expect(page.locator(".llm-count")).toHaveText("0 / 4");
  await expect(next).toBeEnabled();
  await expect(page.locator(".llm-caption")).toContainText(
    "실제 LLM을 실행하거나 토큰을 분석한 결과는 아니에요.",
  );
  await page.reload();
  await expect(page.locator("h1")).toHaveText("LLM이란?");
  await expect(
    page.getByRole("link", { name: "IBM의 LLM 설명 보기" }),
  ).toHaveAttribute(
    "href",
    "https://www.ibm.com/think/topics/large-language-models",
  );
  await openLessonEnd(page, "llm-concept-block");
  await page.getByRole("link", { name: "자연어란?", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("자연어란?");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /LLM이란/ })
    .click();
  await expect(page.locator("h1")).toHaveText("LLM이란?");
  expect(errors).toEqual([]);
});

test("LLM examples fit narrow screens in light and dark themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(page, "llm-concept-block", "llm-overview", 0);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      await page
        .getByRole("button", { name: "처음부터 보기", exact: true })
        .click();
      for (let count = 0; count < 4; count++)
        await page
          .getByRole("button", { name: "다음 조각 붙이기", exact: true })
          .click();
      await expect(page.locator(".llm-piece")).toHaveCount(4);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});
