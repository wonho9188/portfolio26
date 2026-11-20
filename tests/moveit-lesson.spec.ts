import { test, expect } from "@playwright/test";
import { lessonSlides } from "./lesson-helpers";

for (const width of [1440, 375]) {
  test(`MoveIt introduces usage and planning in small consecutive slides at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const slides = lessonSlides("moveit-concept-block");
    await page.goto("./#/blog/moveit-concept-block");
    await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    await expect(page.locator(".article-header .meta")).not.toContainText(
      "최원호",
    );
    await expect(page.locator(".article-illustration img")).toHaveCount(1);
    await expect(page.locator(".moveit-usage")).toHaveCount(0);
    const next = page.getByRole("link", { name: "다음 화면 →", exact: true });
    await next.click();
    await expect(page.locator(".moveit-usage-intro")).toContainText(
      "설치해서 쓰는 소프트웨어",
    );
    await expect(page.locator(".moveit-usage-method")).toHaveCount(0);
    await next.click();
    await expect(page.locator(".moveit-usage-method h4")).toHaveText(
      "화면에서 사용하기",
    );
    await expect(page.locator(".moveit-usage-steps li")).toHaveCount(4);
    await expect(page.locator(".moveit-code-flow")).toHaveCount(0);
    await next.click();
    await expect(page.locator(".moveit-usage-method h4")).toHaveText(
      "코드에서 사용하기",
    );
    await expect(page.locator(".moveit-code-flow span")).toHaveCount(3);
    await expect(page.locator(".moveit-usage-steps")).toHaveCount(0);
    await next.click();
    await expect(page.locator(".moveit-usage-analogy")).toBeVisible();
    await next.click();
    await expect(page.locator(".article-body")).toContainText("ROS 1용");
    await expect(page.locator(".moveit-version-table")).toHaveCount(0);
    await next.click();
    await expect(page.locator(".moveit-version-table tbody tr")).toHaveCount(4);
    await expect(page.locator(".moveit-version-choice")).toHaveCount(0);
    await next.click();
    await expect(page.locator(".moveit-version-choice")).toContainText(
      "ROS 2 Jazzy",
    );
    await next.click();
    await expect(page.locator(".article-body")).toContainText(
      "무브잇이 하는 움직임 계산을 모션 플래닝이라고 해요.",
    );
    await next.click();
    await expect(page.locator(".article-illustration img")).toHaveCount(1);
    await expect(page.locator(".article-body")).toContainText(
      "각 관절의 실제 움직임 계획",
    );
    await expect(page.locator(".lesson-steps")).toHaveCount(0);
    for (let screen = 11; screen <= 14; screen++) {
      await next.click();
      await expect(page.locator(".article-body > section > h2")).toHaveText(
        `${screen} / ${slides[screen - 1].title}`,
      );
      await expect(page.locator(".article-body > section > p")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    }
    await page.reload();
    await expect(page.locator(".lesson-navigation .meta")).toHaveText(
      `14 / ${slides.length}`,
    );
    await page.getByRole("link", { name: "← 이전 화면", exact: true }).click();
    await expect(page.locator(".lesson-navigation .meta")).toHaveText(
      `13 / ${slides.length}`,
    );
    await page.goBack();
    await expect(page.locator(".lesson-navigation .meta")).toHaveText(
      `14 / ${slides.length}`,
    );
    await page.goto("./#/blog/moveit-concept-block?screen=invalid");
    await expect(page.locator(".lesson-navigation .meta")).toHaveText(
      `1 / ${slides.length}`,
    );
    await page.goto("./#/blog/moveit-concept-block?screen=999");
    await expect(page.locator(".lesson-navigation .meta")).toHaveText(
      `${slides.length} / ${slides.length}`,
    );
    await expect(page).toHaveTitle("MoveIt이란? — WONHO");
  });
}
