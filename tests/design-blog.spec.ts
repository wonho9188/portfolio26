import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("design tab opens a sourced trend article and stays within its category", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog");
  const design = page.locator('[role="tab"][id$="-tab-design"]');
  await design.click();
  await expect(page).toHaveURL(/blog\?topic=design$/);
  await expect(design).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".post-list h3")).toHaveText([
    "디자인 트렌드",
    "스타일 가이드와 컴포넌트",
    "디자인 감각 늘리는 법 : 레퍼런스 자주 보기",
    "시각적 우선순위(레이아웃, 여백, 크기, 색상)",
    "컴포넌트의 종류",
    "톤 앤 매너와 룩앤필",
    "데이터 그래프 시각화 습관",
  ]);
  await page.reload();
  await expect(design).toHaveAttribute("aria-selected", "true");
  await design.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab").last()).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("ArrowRight");
  await expect(design).toHaveAttribute("aria-selected", "true");
  await page.getByRole("link", { name: "디자인 트렌드", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("디자인 트렌드");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(page, "design-trends", "design-trends", 0);
  await expect(page.locator(".article-topic")).toHaveCount(0);
  await expect(page.locator(".trend-type-layout")).toBeVisible();
  await page
    .getByRole("button", { name: "정돈된 인덱스", exact: true })
    .click();
  await expect(page.locator(".trend-index-row")).toHaveCount(3);
  await page
    .getByRole("button", { name: "반투명 레이어", exact: true })
    .click();
  await expect(page.locator(".trend-glass-panel")).toBeVisible();
  const motion = page.getByRole("button", {
    name: "의미 있는 모션",
    exact: true,
  });
  await motion.focus();
  await page.keyboard.press("Enter");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "상태 바꾸기", exact: true }).click();
  await expect(page.locator(".trend-motion-layout [role=status]")).toHaveText(
    "연결 완료",
  );
  const reducedDuration = await page
    .locator(".trend-motion-track span")
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  // The shared accessibility rule uses an effectively instant duration with !important.
  expect(parseFloat(reducedDuration)).toBeLessThanOrEqual(0.001);
  await expect(page.locator(".design-trend-source")).toHaveAttribute(
    "href",
    "https://webflow.com/blog/web-design-trends-2026",
  );
  await page.reload();
  await expect(page.locator("h1")).toHaveText("디자인 트렌드");
  await expect(page.locator(".article-pagination a")).toHaveCount(2);
  await expect(page.locator(".article-pagination")).toContainText(
    "스타일 가이드와 컴포넌트",
  );
  await expect(page.locator(".article-pagination")).toContainText(
    "디자인 목록",
  );
  await page.locator(".article-header .breadcrumbs a").click();
  await expect(design).toHaveAttribute("aria-selected", "true");
  expect(errors).toEqual([]);
});

test("all trend previews fit mobile and tablet in both themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(page, "design-trends", "design-trends", 0);
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      for (const trend of [
        "타이포그래피",
        "정돈된 인덱스",
        "반투명 레이어",
        "의미 있는 모션",
      ]) {
        await page.getByRole("button", { name: trend, exact: true }).click();
        await expect(page.locator(".design-trend-preview")).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  }
});
