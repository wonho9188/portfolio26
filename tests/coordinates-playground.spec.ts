import { openLessonPart } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

for (const [width, theme] of [
  [1440, "dark"],
  [375, "light"],
] as const) {
  test(`playground coordinates use forward/left order and unit changes preserve position at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(
      (theme) => localStorage.setItem("wonho-theme", theme),
      theme,
    );
    await page.goto("./#/blog/moveit-concept-block?screen=26");
    await page.getByRole("link", { name: "다음 화면 →", exact: true }).click();
    await expect(page).toHaveURL(/moveit-concept-block\?screen=27$/);
    await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "27 / 공을 움직여 좌표 읽기",
    );
    await page.evaluate(() => document.fonts.ready);
    const pair = page.getByTestId("coordinate-pair");
    await expect(pair).toHaveText("(3, 2)");
    await expect(page.locator(".coordinates-answer")).toContainText(
      "앞으로 3m, 왼쪽으로 2m",
    );
    await page.getByLabel("앞·뒤 위치", { exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await page.getByLabel("왼쪽·오른쪽 위치", { exact: true }).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(pair).toHaveText("(4, 1)");
    const physicalPosition = await page
      .getByTestId("coordinate-ball")
      .getAttribute("transform");
    const centimeters = page.getByRole("button", {
      name: "센티미터 (cm)",
      exact: true,
    });
    await centimeters.click();
    await expect(centimeters).toHaveAttribute("aria-pressed", "true");
    await expect(pair).toHaveText("(400, 100)");
    await expect(page.getByTestId("coordinate-ball")).toHaveAttribute(
      "transform",
      physicalPosition!,
    );
    await expect(page.locator(".coordinates-field figcaption")).toContainText(
      "한 칸 = 100cm",
    );
    await page.getByLabel("앞·뒤 위치", { exact: true }).focus();
    await page.keyboard.press("Home");
    await expect(pair).toHaveText("(-400, 100)");
    await expect(page.locator(".coordinates-answer")).toContainText(
      "뒤로 400cm, 왼쪽으로 100cm",
    );
    await page
      .getByRole("button", { name: "예시로 돌아가기", exact: true })
      .click();
    await expect(pair).toHaveText("(3, 2)");
    await expect(
      page.getByRole("button", { name: "미터 (m)", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.locator(".coordinates-lab").screenshot({
      path: `artifacts/coordinates-playground-${width}-${theme}.png`,
    });
    await openLessonPart(
      page,
      "moveit-concept-block",
      "coordinates-playground",
      0,
    );
    await expect(page.locator(".coordinates-agreement dt")).toHaveText([
      "원점",
      "방향 축",
      "단위",
      "좌표",
    ]);
    await openLessonPart(
      page,
      "moveit-concept-block",
      "coordinates-playground",
      2,
    );
    await expect(page.locator(".coordinates-word-note")).toContainText(
      "‘계’가 방향이라는 뜻은 아니에요.",
    );
    await openLessonPart(
      page,
      "moveit-concept-block",
      "coordinates-playground",
      1,
    );
    await page.reload();
    await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "27 / 공을 움직여 좌표 읽기",
    );
    await page.getByRole("link", { name: "← 이전 화면", exact: true }).click();
    await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "26 / 원점·방향·단위의 약속",
    );
    expect(errors).toEqual([]);
  });
}

test("dragging the ball maps screen-up to forward and screen-left to left", async ({
  page,
}) => {
  await page.goto("./#/blog/moveit-concept-block?screen=27");
  await page.evaluate(() => document.fonts.ready);
  const field = page.locator(".coordinates-field svg");
  await field.scrollIntoViewIfNeeded();
  const bounds = (await field.boundingBox())!;
  const point = (x: number, y: number) => ({
    x: bounds.x + (x / 600) * bounds.width,
    y: bounds.y + (y / 540) * bounds.height,
  });
  const start = point(200, 120),
    end = point(150, 220);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 5 });
  await page.mouse.up();
  await expect(page.getByTestId("coordinate-pair")).toHaveText("(1, 3)");
  await expect(page.locator(".coordinates-answer")).toContainText(
    "앞으로 1m, 왼쪽으로 3m",
  );
  const outside = point(590, 525);
  await page.mouse.click(outside.x, outside.y);
  await expect(page.getByTestId("coordinate-pair")).toHaveText("(-4, -4)");
  await expect(page.locator(".coordinates-answer")).toContainText(
    "뒤로 4m, 오른쪽으로 4m",
  );
});
