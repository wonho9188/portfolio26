import { test, expect } from "@playwright/test";
import source from "../src/data/posts-source.json" with { type: "json" };
import type { Post } from "../src/data/content";
import { getLessonSlides, lessonParts } from "../src/data/lesson-slides";

for (const width of [320, 1440]) {
  test(`all technology posts preserve content in small slides at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const post of source.posts.filter((p) => p.kind === "tech")) {
      const slides = getLessonSlides(post as Post);
      expect(slides.flatMap((s) => s.p)).toEqual([
        ...post.sections.flatMap((s) => [
          ...s.p,
          ...("steps" in s ? s.steps.map((step) => step.body) : []),
        ]),
      ]);
      if (slides.length === 0) {
        const parentSlug = "parentSlug" in post ? post.parentSlug : undefined;
        const indexUrl = parentSlug
          ? `./#/blog/${parentSlug}`
          : `./#/blog?topic=${post.group}`;
        await page.goto(indexUrl);
        await page.getByRole("link", { name: post.title, exact: true }).click();
        await expect(page.locator("h1")).toHaveText(post.title);
        const hasChildren = source.posts.some(
          (child) => "parentSlug" in child && child.parentSlug === post.slug,
        );
        if (hasChildren) {
          await expect(
            page.getByRole("navigation", { name: `${post.title} 글 목록` }),
          ).toBeVisible();
        } else {
          await expect(page.locator(".draft-notice")).toContainText("작성 예정");
        }
        await page.goto(`./#/blog/${post.slug}?screen=2`);
        await expect(page.locator("h1")).toHaveText(post.title);
        await expect(page.locator(".article-body > section")).toHaveCount(0);
        await expect(page.locator(".lesson-navigation")).toHaveCount(0);
        continue;
      }
      for (const [index, slide] of slides.entries()) {
        await page.goto(`./#/blog/${post.slug}?screen=${index + 1}`);
        await expect(page.locator(".article-body > section")).toHaveCount(1);
        await expect(page.locator("h1")).toHaveText(post.title);
        await expect(page.locator(".article-body > section > h2")).toHaveText(
          `${String(index + 1).padStart(2, "0")} / ${slide.title}`,
        );
        await expect(page.locator(".lesson-navigation .meta")).toHaveText(
          `${index + 1} / ${slides.length}`,
        );
        for (const paragraph of slide.p)
          await expect(page.locator(".article-body")).toContainText(paragraph);
        const widget = slide.interactive ?? slide.supplement;
        if (widget && slide.componentPart !== undefined) {
          const count =
            lessonParts[widget][slide.componentPart].children.length;
          await expect(
            page
              .locator(".article-body > section > div")
              .first()
              .locator(":scope > *"),
          ).toHaveCount(count);
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${post.slug} / ${index + 1}`,
        ).toBe(true);
      }
      await expect(
        page.getByRole("button", { name: "다음 화면 →", exact: true }),
      ).toBeDisabled();
      await expect(page.locator(".article-pagination")).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("design examples advance through selected panels and preserve deep links", async ({
  page,
}) => {
  await page.goto("./#/blog/style-guide-components?screen=2");
  await expect(page.locator(".guide-swatch")).toHaveCount(6);
  await page.getByRole("link", { name: "다음 화면 →", exact: true }).click();
  await expect(page.locator(".guide-layout-current")).toBeVisible();
  await page.reload();
  await expect(page.locator(".guide-layout-current")).toBeVisible();
  await page.getByRole("link", { name: "다음 화면 →", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "동작 확인", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "동작 확인", exact: true }).click();
  await expect(page.locator(".guide-demo-status")).toContainText("1회 동작");
  await page.goBack();
  await expect(page.locator(".guide-layout-current")).toBeVisible();
});
