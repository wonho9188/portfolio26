import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("MuJoCo lesson compares gravity and contact and preserves series navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=robotics-concept-blocks");
  await page.getByRole("link", { name: "MuJoCo란?", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("MuJoCo란?");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(page, "mujoco-concept-block", "mujoco-overview", 0);
  await expect(page.locator(".mujoco-height")).toHaveText(
    "공 아래쪽 높이 1.50m",
  );
  const time = page.getByRole("slider", { name: "시간 흘려보기", exact: true });
  await time.fill("0.4");
  await expect(page.locator(".mujoco-height")).toHaveText(
    "공 아래쪽 높이 0.72m",
  );
  await time.focus();
  await page.keyboard.press("End");
  await expect(page.locator(".mujoco-height")).toHaveText(
    "공 아래쪽 높이 0.00m",
  );
  await expect(page.locator(".mujoco-result")).toContainText(
    "공이 바닥에 닿아 멈췄어요.",
  );
  await page.getByRole("button", { name: "중력 없음", exact: true }).click();
  await expect(page.locator(".mujoco-height")).toHaveText(
    "공 아래쪽 높이 1.50m",
  );
  await expect(page.locator(".mujoco-result")).toContainText("중력이 없어서");
  await page.getByRole("button", { name: "처음으로", exact: true }).click();
  await expect(time).toHaveValue("0");
  await expect(
    page.getByRole("button", { name: "중력 있음", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".mujoco-caption")).toContainText(
    "실제 MuJoCo 실행 결과는 아니에요.",
  );
  await expect(
    page.getByRole("link", { name: "MuJoCo 공식 문서 보기", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://mujoco.readthedocs.io/en/stable/overview.html",
  );
  await page.reload();
  await expect(page.locator("h1")).toHaveText("MuJoCo란?");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /LLM이란/ })
    .click();
  await expect(page.locator("h1")).toHaveText("LLM이란?");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /MuJoCo란/ })
    .click();
  await openLessonEnd(page, "mujoco-concept-block");
  await page
    .getByRole("link", { name: "MoveIt이란? 읽기", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("MoveIt이란?");
  expect(errors).toEqual([]);
});

test("MuJoCo teaching diagram fits mobile and tablet in both themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(page, "mujoco-concept-block", "mujoco-overview", 0);
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      for (const time of ["0", "0.8"]) {
        await page
          .getByRole("slider", { name: "시간 흘려보기", exact: true })
          .fill(time);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  }
});
