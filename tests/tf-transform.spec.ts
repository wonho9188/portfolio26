import { openLessonPart } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

for (const [width, theme] of [
  [1440, "dark"],
  [375, "light"],
] as const) {
  test(`TF rotates the camera-relative vector before adding the fixed camera offset at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(
      (theme) => localStorage.setItem("wonho-theme", theme),
      theme,
    );
    await page.goto("./#/blog/moveit-concept-block?screen=29");
    await page.getByRole("link", { name: "다음 화면 →", exact: true }).click();
    await expect(page).toHaveURL(/moveit-concept-block\?screen=30$/);
    await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "30 / 방향과 기준점을 바꾸어 보기",
    );
    await page.evaluate(() => document.fonts.ready);
    const cameraOrigin = () =>
      page.getByTestId("tf-transform-camera").evaluate((node) => {
        const matrix = (node as SVGGElement).transform.baseVal.consolidate()!
          .matrix;
        return { x: matrix.e, y: matrix.f };
      });
    const originalCameraOrigin = await cameraOrigin();
    const robot = await page
      .getByTestId("tf-transform-robot")
      .getAttribute("transform");
    await expect(page.locator(".tf-transform-result strong")).toHaveText(
      "앞으로 50cm",
    );
    await expect(page.locator(".tf-transform-equation")).toHaveText(
      "앞 20 + 30 = 50cm",
    );
    await page
      .locator(".tf-transform-drawing")
      .screenshot({ path: `artifacts/tf-transform-straight-${width}.png` });
    const turned = page.getByRole("button", {
      name: "카메라가 왼쪽으로 90°",
      exact: true,
    });
    await turned.focus();
    await page.keyboard.press("Space");
    await expect(turned).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".tf-transform-result strong")).toHaveText(
      "앞으로 20cm, 왼쪽으로 30cm",
    );
    await expect(page.locator(".tf-transform-calculation")).toContainText(
      "왼쪽으로 30cm",
    );
    await expect(page.locator(".tf-transform-equation")).toHaveText(
      "앞 20 + 0 = 20cm\n왼쪽 0 + 30 = 30cm",
    );
    expect(await cameraOrigin()).toEqual(originalCameraOrigin);
    await expect(page.getByTestId("tf-transform-robot")).toHaveAttribute(
      "transform",
      robot!,
    );
    const rotation = await page
      .getByTestId("tf-transform-camera")
      .evaluate((node) => {
        const matrix = (node as SVGGElement).transform.baseVal.consolidate()!
          .matrix;
        return { a: matrix.a, b: matrix.b };
      });
    expect(rotation.a).toBeCloseTo(0, 6);
    expect(rotation.b).toBeCloseTo(-1, 6);
    await page
      .locator(".tf-transform-drawing")
      .screenshot({ path: `artifacts/tf-transform-turned-${width}.png` });
    await expect(page.locator(".tf-transform-scenario-note")).toContainText(
      "서로 다른 배치",
    );
    await openLessonPart(page, "moveit-concept-block", "tf-transform", 1);
    await expect(
      page.getByRole("link", { name: "tf2 공식 설명 읽기" }),
    ).toHaveAttribute("href", "https://index.ros.org/p/tf2/");
    await openLessonPart(page, "moveit-concept-block", "tf-transform", 0);
    await page.getByRole("button", { name: "같은 방향", exact: true }).click();
    await expect(page.locator(".tf-transform-result strong")).toHaveText(
      "앞으로 50cm",
    );
    await page.reload();
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "30 / 방향과 기준점을 바꾸어 보기",
    );
    await page.getByRole("link", { name: "← 이전 화면", exact: true }).click();
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "29 / TF는 좌표를 어떻게 바꿀까?",
    );
    expect(errors).toEqual([]);
  });
}
