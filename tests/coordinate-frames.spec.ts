import { openLessonPart } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

for (const [width, theme] of [
  [1440, "dark"],
  [375, "light"],
] as const) {
  test(`TF changes coordinates without moving the objects at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(
      (theme) => localStorage.setItem("wonho-theme", theme),
      theme,
    );
    await page.goto("./#/blog/moveit-concept-block?screen=19");
    await page.getByRole("link", { name: "다음 화면 →", exact: true }).click();
    await expect(page).toHaveURL(/moveit-concept-block\?screen=20$/);
    await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "20 / 기준을 바꾸어 거리 재기",
    );
    await expect(page.locator(".article-body section")).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".tf-answer")).toContainText(
      "상자는 앞으로 50cm",
    );
    const coordinates = page.locator(".tf-number");
    await expect(coordinates).toHaveText(["0cm", "20cm", "50cm"]);
    const positions = () =>
      page.locator(".tf-object svg").evaluateAll((nodes) =>
        nodes.map((node) => {
          const box = node.getBoundingClientRect();
          return {
            x: box.x + scrollX,
            y: box.y + scrollY,
            width: box.width,
            height: box.height,
          };
        }),
      );
    const before = await positions();
    const cameraButton = page.getByRole("button", {
      name: "카메라 기준",
      exact: true,
    });
    await cameraButton.focus();
    await page.keyboard.press("Enter");
    await expect(cameraButton).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: "로봇 기준", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
    await expect(coordinates).toHaveText(["−20cm", "0cm", "30cm"]);
    await expect(page.locator(".tf-answer")).toHaveText(
      "카메라 기준상자는 앞으로 30cm",
    );
    await expect(page.locator(".tf-negative-note")).toContainText("카메라 뒤");
    expect(await positions()).toEqual(before);
    await expect(page.locator(".tf-scene")).toHaveAttribute(
      "aria-label",
      /상자 30cm.*실제 위치는 그대로/,
    );
    await expect
      .poll(() =>
        page
          .locator(".tf-distance")
          .evaluate(
            (node) =>
              Number.parseFloat(getComputedStyle(node).width) /
              node.parentElement!.clientWidth,
          ),
      )
      .toBeCloseTo(0.432, 2);
    await page
      .locator(".tf-lab")
      .screenshot({ path: `artifacts/tf-${width}-${theme}.png` });
    await page.getByRole("button", { name: "로봇 기준", exact: true }).click();
    await expect(coordinates).toHaveText(["0cm", "20cm", "50cm"]);
    await expect(page.locator(".tf-answer")).toContainText(
      "상자는 앞으로 50cm",
    );
    expect(await positions()).toEqual(before);
    await openLessonPart(page, "moveit-concept-block", "coordinate-frames", 2);
    await expect(page.locator(".tf-model-note")).toContainText(
      "얼마나 돌아가 있는지",
    );
    await openLessonPart(page, "moveit-concept-block", "coordinate-frames", 4);
    await expect(page.locator(".tf-to-moveit ol > li")).toHaveCount(3);
    await openLessonPart(page, "moveit-concept-block", "coordinate-frames", 1);
    await expect(page.locator(".tf-viewpoints dd")).toHaveText([
      "“상자는 내 앞 50cm에 있어.”",
      "“상자는 내 앞 30cm에 있어.”",
    ]);
    await openLessonPart(page, "moveit-concept-block", "coordinate-frames", 3);
    await expect(page.locator(".tf-question-comparison tbody th")).toHaveText([
      "좌표계",
      "TF",
    ]);
    await expect(page.locator(".tf-question-comparison table")).toContainText(
      "다른 기준으로 바꾸면 얼마일까?",
    );
    await openLessonPart(page, "moveit-concept-block", "coordinate-frames", 0);
    await page.reload();
    await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "20 / 기준을 바꾸어 거리 재기",
    );
    await page.getByRole("link", { name: "← 이전 화면", exact: true }).click();
    await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "19 / 좌표계와 TF",
    );
    expect(errors).toEqual([]);
  });
}
