import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("natural language lesson compares equivalent requests and missing context", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=robotics-concept-blocks");
  await page.getByRole("link", { name: "자연어란?", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("자연어란?");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(
    page,
    "natural-language-concept-block",
    "natural-language-overview",
    0,
  );
  await expect(page.locator(".natural-language-result dd")).toHaveText([
    "이동하기",
    "안내 데스크",
  ]);
  await page
    .getByRole("button", { name: "안내 데스크까지 이동해 줄래?", exact: true })
    .click();
  await expect(page.locator(".natural-language-result dd")).toHaveText([
    "이동하기",
    "안내 데스크",
  ]);
  await expect(page.locator(".natural-language-response")).toContainText(
    "같은 이동 요청",
  );
  const ambiguous = page.getByRole("button", {
    name: "저기로 가 줘.",
    exact: true,
  });
  await ambiguous.focus();
  await page.keyboard.press("Enter");
  await expect(ambiguous).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".natural-language-result dd").last()).toHaveText(
    "확인이 필요해요",
  );
  await expect(page.locator(".natural-language-response")).toContainText(
    "‘저기’가 어디인가요?",
  );
  await page
    .getByRole("button", { name: "안내 데스크로 가 줘.", exact: true })
    .click();
  await expect(page.locator(".natural-language-result dd").last()).toHaveText(
    "안내 데스크",
  );
  await openLessonPart(
    page,
    "natural-language-concept-block",
    "natural-language-overview",
    2,
  );
  await expect(page.locator(".article-body")).toContainText(
    "자연어와 자연어 처리는 달라요.",
  );
  await page.reload();
  await expect(page.locator("h1")).toHaveText("자연어란?");
  await openLessonEnd(page, "natural-language-concept-block");
  await page.getByRole("link", { name: "Nav2란? 읽기", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Nav2란?");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /자연어란/ })
    .click();
  await expect(page.locator("h1")).toHaveText("자연어란?");
  expect(errors).toEqual([]);
});

test("natural language examples fit mobile and tablet in both themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(
      page,
      "natural-language-concept-block",
      "natural-language-overview",
      0,
    );
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      await page
        .getByRole("button", { name: "저기로 가 줘.", exact: true })
        .click();
      await expect(page.locator(".natural-language-response")).toContainText(
        "다시 물어봐야 해요.",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});
