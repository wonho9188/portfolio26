import { test, expect } from "@playwright/test";
import source from "../src/data/posts-source.json" with { type: "json" };

const topic = "robotics-concept-blocks";
const topicUrl = `./#/blog?topic=${topic}`;
const topicTab = `[role="tab"][id$="-tab-${topic}"]`;

test("new robotics topic has a persistent URL and an honest empty state", async ({
  page,
}) => {
  await page.route("**/src/data/posts-source.json*", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `export default ${JSON.stringify({ ...source, posts: source.posts.filter((post) => post.group !== topic) })};`,
    }),
  );
  await page.goto(topicUrl);
  await expect(page.locator(topicTab)).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(topicTab)).toContainText("0");
  await expect(page.locator(".empty-state")).toBeVisible();
  await expect(page.locator(".post-row")).toHaveCount(0);
  await expect(page.locator(".topic-description")).toBeVisible();
  await page.reload();
  await expect(page.locator(topicTab)).toHaveAttribute("aria-selected", "true");
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test("multiple posts are ordered and stay inside the topic through detail navigation", async ({
  page,
}) => {
  const article = (order: number) => ({
    slug: `test-robotics-concept-${order}`,
    kind: "tech",
    group: topic,
    seriesOrder: order,
    title: `테스트용 개념 ${order}`,
    category: "ROBOTICS",
    excerpt: "연재 글 연결을 확인하기 위한 테스트 데이터입니다.",
    meta: `연재 · ${order}`,
    status: "record",
    sections: [
      { title: "하나의 개념", p: ["이 본문은 테스트 환경에서만 사용됩니다."] },
    ],
  });
  // Serve fixtures only to this isolated dev-browser test; never edit or publish source posts.
  await page.route("**/src/data/posts-source.json*", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `export default ${JSON.stringify({ ...source, posts: [...source.posts.filter((post) => post.group !== topic), article(2), article(1)] })};`,
    }),
  );
  await page.goto(topicUrl);
  await expect(page.locator(topicTab)).toContainText("2");
  await expect(page.locator(".post-list h3")).toHaveText([
    "테스트용 개념 1",
    "테스트용 개념 2",
  ]);
  await page.locator(".post-list h3 a").first().click();
  await expect(page.locator("h1")).toHaveText("테스트용 개념 1");
  await expect(page.locator(".article-topic")).toBeVisible();
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("h1")).toHaveText("테스트용 개념 1");
  await page.locator(".article-pagination a").last().click();
  await expect(page.locator("h1")).toHaveText("테스트용 개념 2");
  await expect(page.locator(".article-pagination a")).toHaveCount(1);
  await page.locator(".article-pagination a").first().click();
  await expect(page.locator("h1")).toHaveText("테스트용 개념 1");
  await page.locator(".article-header .breadcrumbs a").click();
  await expect(page.locator(topicTab)).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".post-list h3")).toHaveCount(2);
});
