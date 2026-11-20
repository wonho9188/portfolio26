import { lessonSlides } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

const total = lessonSlides("moveit-concept-block").length;

for (const width of [320, 1440]) {
  test(`lesson controls stay in place across pages at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./#/blog/moveit-concept-block");
    await page.evaluate(() => document.fonts.ready);
    const nav = page.getByRole("navigation", {
      name: "학습 화면",
      exact: true,
    });
    const next = nav.getByRole("link", { name: "다음 화면 →", exact: true });
    await expect(
      nav.getByRole("button", { name: "← 이전 화면", exact: true }),
    ).toBeDisabled();
    const box = await next.boundingBox();
    expect(box).not.toBeNull();
    const x = box!.x + box!.width / 2;
    const y = box!.y + box!.height / 2;
    expect(y).toBeLessThan(900);
    await page.evaluate(() =>
      window.scrollTo({ top: 1000, behavior: "instant" }),
    );
    const afterScroll = await next.boundingBox();
    expect(afterScroll!.y).toBeCloseTo(box!.y, 1);
    // Repeatedly click the same viewport point without locating or scrolling to a link again.
    for (const screen of [2, 3, 4]) {
      await page.mouse.click(x, y);
      await expect(nav.locator(".meta")).toHaveText(`${screen} / ${total}`);
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      await expect(page.locator("h1")).toHaveText("MoveIt이란?");
      await expect(next).toBeFocused();
      expect((await next.boundingBox())!.y).toBeCloseTo(box!.y, 1);
    }
    await page.keyboard.press("Enter");
    await expect(nav.locator(".meta")).toHaveText(`5 / ${total}`);
    await page.goto(`./#/blog/moveit-concept-block?screen=${total}`);
    await expect(
      nav.getByRole("button", { name: "다음 화면 →", exact: true }),
    ).toBeDisabled();
    const previous = nav.getByRole("link", {
      name: "← 이전 화면",
      exact: true,
    });
    await previous.click();
    await expect(nav.locator(".meta")).toHaveText(`${total - 1} / ${total}`);
    await expect(previous).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(nav.locator(".meta")).toHaveText(`${total - 2} / ${total}`);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto("./#/blog/ros2-concept-block");
    await expect(nav.locator(".meta")).toHaveText(
      `1 / ${lessonSlides("ros2-concept-block").length}`,
    );
  });
}
