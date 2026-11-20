import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("Nav2 lesson is discoverable, replans around an obstacle and reaches both goals", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=robotics-concept-blocks");
  await page.getByRole("link", { name: "Nav2란?", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Nav2란?");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(page, "nav2-concept-block", "nav2-overview", 0);
  await expect(page.locator(".nav2-status")).toContainText(
    "안내 데스크까지 길을 찾았어요.",
  );
  const originalPath = await page.locator(".nav2-route").getAttribute("points");
  const obstacle = page.getByRole("button", {
    name: "장애물 추가",
    exact: true,
  });
  await obstacle.click();
  await expect(page.locator(".nav2-status")).toContainText(
    "추가된 장애물을 피해",
  );
  expect(await page.locator(".nav2-route").getAttribute("points")).not.toBe(
    originalPath,
  );
  // Keep the drawn robot's footprint clear of the rendered obstacle rectangles.
  expect(
    await page.locator(".nav2-map").evaluate((svg) => {
      const points = (
        svg.querySelector("polyline")?.getAttribute("points") ?? ""
      )
        .split(" ")
        .map((point) => point.split(",").map(Number));
      const blocks = [
        ...svg.querySelectorAll('rect[width="40"][height="40"]'),
      ].map((rect) => ({
        x: Number(rect.getAttribute("x")),
        y: Number(rect.getAttribute("y")),
      }));
      return (
        points.length > 1 &&
        points.every(([x, y]) =>
          blocks.every(
            (block) =>
              x + 18 <= block.x ||
              x - 18 >= block.x + 40 ||
              y + 18 <= block.y ||
              y - 18 >= block.y + 40,
          ),
        )
      );
    }),
  ).toBe(true);
  const advance = page.getByRole("button", { name: "한 칸 이동", exact: true });
  for (const goal of ["안내 데스크", "충전소"]) {
    await page
      .getByRole("group", { name: "목적지 선택" })
      .getByRole("button", { name: new RegExp(goal) })
      .click();
    for (let step = 0; step < 50 && (await advance.isEnabled()); step++)
      await advance.click();
    await expect(advance).toBeDisabled();
    await expect(page.locator(".nav2-status")).toHaveText(
      `${goal}에 도착했어요.`,
    );
  }
  await page.getByRole("button", { name: "출발점으로" }).click();
  await expect(advance).toBeEnabled();
  await page.reload();
  await expect(page.locator("h1")).toHaveText("Nav2란?");
  await expect(
    page.getByRole("link", { name: "Nav2 공식 문서 보기" }),
  ).toHaveAttribute("href", "https://docs.nav2.org/");
  await openLessonEnd(page, "nav2-concept-block");
  await page.getByRole("link", { name: "LiDAR란?", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("LiDAR란?");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /Nav2란/ })
    .click();
  await expect(page.locator("h1")).toHaveText("Nav2란?");
  expect(errors).toEqual([]);
});

test("Nav2 controls work with a keyboard and fit mobile and tablet themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(page, "nav2-concept-block", "nav2-overview", 0);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      const goal = page.getByRole("button", { name: /B · 충전소/ });
      await goal.focus();
      await page.keyboard.press("Enter");
      await expect(goal).toHaveAttribute("aria-pressed", "true");
      const advance = page.getByRole("button", {
        name: "한 칸 이동",
        exact: true,
      });
      await advance.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator(".nav2-status")).toContainText(
        "이동 중이에요.",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});
