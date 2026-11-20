import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("LiDAR concept is listed and explains one-way versus round-trip distance", async ({
  page,
}) => {
  await page.goto("./#/blog?topic=robotics-concept-blocks");
  await page.getByRole("link", { name: "LiDAR란?", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("LiDAR란?");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(page, "lidar-concept-block", "lidar-overview", 0);
  await expect(page.locator(".lidar-distance")).toHaveText("3m");
  await expect(page.locator(".lidar-roundtrip")).toContainText(
    "왕복한 거리 6m",
  );
  const slider = page.getByRole("slider", { name: "벽까지의 거리" });
  await slider.fill("1");
  await expect(page.locator(".lidar-roundtrip")).toContainText(
    "÷ 2 = 벽까지 1m",
  );
  await expect(
    page.getByRole("img", { name: "LiDAR에서 벽까지 1m" }),
  ).toBeVisible();
  await slider.focus();
  await page.keyboard.press("End");
  await expect(page.locator(".lidar-distance")).toHaveText("5m");
  await expect(page.locator(".lidar-roundtrip")).toContainText(
    "왕복한 거리 10m",
  );
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".lidar-distance")).toHaveText("4.5m");
  await expect(page.locator(".lidar-roundtrip")).toContainText(
    "왕복한 거리 9m",
  );
  await page.reload();
  await expect(page.locator("h1")).toHaveText("LiDAR란?");
  await openLessonEnd(page, "lidar-concept-block");
  await page.getByRole("link", { name: "ROS 2란? 읽기", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("ROS 2란?");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /LiDAR란/ })
    .click();
  await expect(page.locator("h1")).toHaveText("LiDAR란?");
});

test("LiDAR lesson fits mobile and tablet in both themes", async ({ page }) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(page, "lidar-concept-block", "lidar-overview", 0);
    await page.locator(".lidar-lab").scrollIntoViewIfNeeded();
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      const slider = page.getByRole("slider", { name: "벽까지의 거리" });
      for (const distance of ["1", "5"]) {
        await slider.fill(distance);
        await expect(page.locator(".lidar-distance")).toHaveText(
          `${distance}m`,
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
