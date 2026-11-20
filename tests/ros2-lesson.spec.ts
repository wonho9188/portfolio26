import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("ROS 2 concept post is discoverable and explains cooperating nodes", async ({
  page,
}) => {
  await page.goto("./#/blog?topic=robotics-concept-blocks");
  await page.getByRole("link", { name: "ROS 2란?", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("ROS 2란?");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(page, "ros2-concept-block", "ros2-overview", 0);
  await expect(page.locator(".article-topic")).toHaveText(
    "차곡차곡, 로보틱스 개념 블록",
  );
  await expect(page.locator(".ros2-message")).toHaveText("앞쪽 거리: 50cm");
  await page.getByRole("button", { name: /어떻게 할지 정해요/ }).click();
  await expect(page.locator(".ros2-message")).toHaveText("목표 속도: 0m/s");
  await expect(
    page.getByRole("button", { name: /어떻게 할지 정해요/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /바퀴를 움직여요/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".ros2-message")).toHaveText("바퀴를 멈춰요");
  await expect(
    page.getByRole("link", { name: "ROS 2 공식 문서 보기" }),
  ).toHaveAttribute("href", "https://docs.ros.org/en/jazzy/index.html");
  await page.reload();
  await expect(page.locator("h1")).toHaveText("ROS 2란?");
  await openLessonEnd(page, "ros2-concept-block");
  await page.getByRole("link", { name: "MoveIt이란? 읽기" }).click();
  await expect(page.locator("h1")).toHaveText("MoveIt이란?");
});

test("ROS 2 diagram fits narrow screens in both themes", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openLessonPart(page, "ros2-concept-block", "ros2-overview", 0);
  await page.locator(".ros2-flow").scrollIntoViewIfNeeded();
  await expect(page.locator(".ros2-node")).toHaveCount(3);
  for (const theme of ["dark", "light"]) {
    await page.evaluate(
      (value) => document.documentElement.setAttribute("data-theme", value),
      theme,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".ros2-node").last()).toBeVisible();
  }
});
