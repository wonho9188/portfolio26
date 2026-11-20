import { test, expect } from "@playwright/test";
import {
  forwardKinematics,
  inverseKinematics,
  wrapAngle,
} from "../src/components/kinematics";
import type { Angles, Pose } from "../src/components/kinematics";

function expectPose(actual: Pose, expected: Pose) {
  expect(actual.x).toBeCloseTo(expected.x, 8);
  expect(actual.y).toBeCloseTo(expected.y, 8);
  expect(wrapAngle(actual.direction - expected.direction)).toBeCloseTo(0, 8);
}

test("FK maps straight and bent arms to known positions and directions", () => {
  expectPose(forwardKinematics([0, 0, 0]), { x: 26, y: 0, direction: 0 });
  expectPose(forwardKinematics([90, 0, 0]), { x: 0, y: 26, direction: 90 });
  expectPose(forwardKinematics([0, 90, -90]), { x: 16, y: 10, direction: 0 });
});

test("both IK branches recover the requested hand position AND orientation", () => {
  const target = { x: 14, y: 12, direction: 0 };
  const solutions = inverseKinematics(target);
  expect(solutions).toHaveLength(2);
  expect(solutions[0][1] * solutions[1][1]).toBeLessThan(0);
  for (const solution of solutions)
    expectPose(forwardKinematics(solution), target);
  const configurations: Angles[] = [
    [30, 65, -35],
    [-90, -60, 120],
    [170, 50, 160],
    [0, -80, -30],
  ];
  for (const angles of configurations) {
    const pose = forwardKinematics(angles);
    const inverse = inverseKinematics(pose);
    expect(inverse).toHaveLength(2);
    for (const candidate of inverse)
      expectPose(forwardKinematics(candidate), pose);
  }
});

test("IK distinguishes boundary, unreachable position and unreachable orientation", () => {
  for (const target of [
    { x: 26, y: 0, direction: 0 },
    { x: 6, y: 0, direction: 0 },
  ]) {
    const solutions = inverseKinematics(target);
    expect(solutions).toHaveLength(1);
    expectPose(forwardKinematics(solutions[0]), target);
  }
  expect(inverseKinematics({ x: 30, y: 16, direction: 0 })).toEqual([]);
  expect(inverseKinematics({ x: 4, y: 0, direction: 0 })).toEqual([]);
  expect(inverseKinematics({ x: 24, y: 0, direction: 0 })).toHaveLength(2);
  expect(inverseKinematics({ x: 24, y: 0, direction: 180 })).toEqual([]);
  expect(inverseKinematics({ x: NaN, y: 0, direction: 0 })).toEqual([]);
});

for (const width of [1440, 375]) {
  test(`FK/IK experiment supports keyboard controls and alternate/unreachable poses at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("./#/blog/moveit-concept-block?screen=16");
    await page.getByRole("link", { name: "다음 화면 →", exact: true }).click();
    await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "17 / 직접 움직여 보는 FK와 IK",
    );
    await expect(page.locator(".article-body section")).toHaveCount(1);
    const position = page.getByTestId("hand-position");
    const before = await position.innerText();
    await page.getByLabel("어깨 각도", { exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(position).not.toHaveText(before);
    // Switching calculation direction preserves the same elbow branch.
    await page.getByLabel("팔꿈치 각도", { exact: true }).focus();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    const bent = await position.innerText();
    await page
      .getByRole("button", { name: "IK · 목표 옮기기", exact: true })
      .click();
    await expect(position).toHaveText(bent);
    await expect(page.locator(".kin-readout p").last()).toContainText(
      "-179.0°",
    );
    await page.getByRole("button", { name: "닿는 목표", exact: true }).click();
    await expect(position).toHaveText("x 14.0 / y 12.0 cm");
    await expect(page.locator(".kin-status")).toContainText("두 개");
    const direction = page.locator(".kin-readout p").nth(1).locator("strong");
    const angleReadout = page.locator(".kin-readout p").last();
    const angles = await angleReadout.innerText();
    await page
      .getByRole("button", { name: "다른 팔 자세 보기", exact: true })
      .click();
    await expect(angleReadout).not.toHaveText(angles);
    await expect(position).toHaveText("x 14.0 / y 12.0 cm");
    await expect(direction).toHaveText("0.0°");
    await page.getByLabel("손의 목표 방향", { exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(direction).toHaveText("1.0°");
    await expect(position).toHaveText("x 14.0 / y 12.0 cm");
    await page.getByRole("button", { name: "먼 목표", exact: true }).click();
    await expect(page.locator(".kin-status")).toContainText("손이 닿지 않아요");
    await expect(
      page.getByRole("button", { name: "다른 팔 자세 보기", exact: true }),
    ).toBeDisabled();
    await expect(position).toHaveText("x 14.0 / y 12.0 cm");
    await expect(direction).toHaveText("1.0°");
    await page.getByRole("button", { name: "처음으로", exact: true }).click();
    await expect(page.locator(".kin-status")).toContainText("두 개");
    await expect(direction).toHaveText("60.0°");
    await page.getByRole("button", { name: "닿는 목표", exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    if (width === 375) {
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.getByRole("button", { name: /모드로 전환/ }).click();
    }
    await page
      .locator(".kin-lab")
      .screenshot({ path: `artifacts/kinematics-${width}.png` });
    await page.goto("./#/blog/moveit-concept-block?screen=16");
    await expect(page.getByRole("table")).toContainText(
      "손의 목표 위치·방향 → 관절 각도",
    );
    await page.getByRole("link", { name: "← 이전 화면", exact: true }).click();
    await expect(page.locator("h1")).toHaveText("MoveIt이란?");
    await expect(page.locator(".article-body section > h2")).toHaveText(
      "15 / 기구학: FK와 IK",
    );
    expect(errors).toEqual([]);
  });
}

test("IK target can be dragged in the drawing and retains its chosen direction", async ({
  page,
}) => {
  await page.goto("./#/blog/moveit-concept-block?screen=17");
  await page
    .getByRole("button", { name: "IK · 목표 옮기기", exact: true })
    .click();
  await page.getByRole("button", { name: "닿는 목표", exact: true }).click();
  const drawing = page.locator(".kin-drawing svg");
  await drawing.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const box = (await drawing.boundingBox())!;
  const point = (x: number, y: number) => ({
    x: box.x + ((300 + x * 8) / 640) * box.width,
    y: box.y + ((310 - y * 8) / 600) * box.height,
  });
  const start = point(14, 12),
    end = point(12, 14);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 5 });
  await page.mouse.up();
  await expect(page.getByTestId("hand-position")).toHaveText(
    "x 12.0 / y 14.0 cm",
  );
  await expect(page.getByLabel("목표 x", { exact: true })).toHaveValue("12");
  await expect(page.getByLabel("목표 y", { exact: true })).toHaveValue("14");
  await expect(page.getByLabel("손의 목표 방향", { exact: true })).toHaveValue(
    "0",
  );
});
