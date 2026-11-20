import { test, expect } from "@playwright/test";
import source from "../src/data/posts-source.json" with { type: "json" };

test("post identifiers and publication states are consistent", () => {
  expect(new Set(source.posts.map((p) => p.slug)).size).toBe(
    source.posts.length,
  );
  for (const post of source.posts) {
    expect(post.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(post.group).toBeTruthy();
    expect(post.sections.length).toBeGreaterThan(0);
    expect(["draft", "planned", "record"]).toContain(post.status);
    if (post.status === "record") {
      expect(
        post.sections.every((section) =>
          section.p.some((text) => text.trim().length > 0),
        ),
      ).toBe(true);
    }
  }
});

test("home assets, banner controls and theme persist", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "WONHO makes it real.",
  );
  await expect(page.locator(".rover-renderer")).toHaveAttribute(
    "data-renderer",
    "three.js",
    { timeout: 30000 },
  );
  await expect(page.locator(".world-discovery-card")).toBeVisible();
  await page.getByRole("button", { name: "움직임 멈춤", exact: true }).click();
  await expect(page.locator(".rover-renderer")).toHaveAttribute(
    "data-motion",
    "paused",
  );
  await page.getByRole("button", { name: "움직임 재생", exact: true }).click();
  await expect(page.locator(".rover-renderer")).toHaveAttribute(
    "data-motion",
    "playing",
  );
  const old = await page.locator("html").getAttribute("data-theme");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.getByRole("button", { name: /모드로 전환/ }).click();
  const next = old === "dark" ? "light" : "dark";
  await expect(page.locator("html")).toHaveAttribute("data-theme", next);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", next);
  await page.getByRole("link", { name: "Explore my work ↗" }).click();
  await expect(page.locator("h1")).toHaveText("Main Work.");
  await page.goto("./#/about");
  await expect(page.getByAltText("최원호 프로필")).toBeVisible();
  await page.locator("#main-work").scrollIntoViewIfNeeded();
  await expect(page.locator("#main-work")).toBeInViewport();
  for (const picture of await page.locator("img").all()) {
    await picture.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        picture.evaluate((image) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true);
  }
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  const assets = await page.locator("img").evaluateAll((images) =>
    images
      .filter((i) => !i.closest("[hidden]"))
      .map((i) => ({
        src: i.getAttribute("src"),
        ok: i.complete && i.naturalWidth > 0,
      })),
  );
  expect(assets.filter((i) => !i.ok)).toEqual([]);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "artifacts/about-desktop.png" });
  await page.goto("./");
  await expect(page.locator(".rover-renderer")).toHaveAttribute(
    "data-renderer",
    "three.js",
  );
  await page.screenshot({ path: "artifacts/home-desktop.png" });
  expect(errors).toEqual([]);
});

test("navigation, topic tabs, article, refresh and history work", async ({
  page,
}) => {
  await page.goto("./#/blog");
  await page.getByRole("tab", { name: /^Navigation/ }).click();
  await expect(
    page.getByRole("heading", { name: "DWB 대신 MPPI를 선택한 이유" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: /^Navigation/ }).press("ArrowRight");
  await expect(page.getByRole("tab", { name: /^React/ })).toBeFocused();
  await page
    .getByRole("heading", { name: "2D의 편집 결과를 3D에 반영하는 방법" })
    .getByRole("link")
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "2D의 편집 결과를 3D에 반영하는 방법",
  );
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "2D의 편집 결과를 3D에 반영하는 방법",
  );
  await expect(
    page.getByRole("navigation", { name: "이 글의 목차" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "다음 화면 →", exact: true }).click();
  await expect(page.locator(".article-body > section > h2")).toHaveText(
    "02 / 배치와 편집 상태를 연결하기",
  );
  await expect(page.locator(".lesson-navigation .meta")).toHaveText("2 / 3");
  await page.getByRole("link", { name: "← Tech Blog 목록" }).click();
  await expect(page.getByRole("tab", { name: /^React/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page
    .getByRole("navigation", { name: "주 메뉴", exact: true })
    .getByRole("link", { name: "Life & Thoughts" })
    .click();
  await page.getByRole("tab", { name: /^독서/ }).click();
  await expect(
    page.getByRole("heading", { name: "책으로 읽는 세상" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "가짜감정", exact: true }),
  ).toBeVisible();
  for (const [route, heading] of [
    ["about", "About Me."],
    ["work", "Main Work."],
    ["side-work", "Side Work."],
    ["utilities", "Utilities."],
  ]) {
    await page.goto(`./#/${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }
  await page.getByRole("link", { name: "WONHO 홈" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "WONHO makes it real.",
  );
});

for (const width of [320, 375, 768, 1200, 1440]) {
  test(`all pages fit ${width}px without cut titles`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "",
      "about",
      "work",
      "work/product",
      "work/arms",
      "work/education",
      "side-work/shopee",
      "side-work/asan-hero",
      "side-work",
      "utilities",
      "blog",
      "blog?topic=robotics-concept-blocks",
      "life?topic=reading",
      "blog/ros2-interfaces",
      "blog/moveit-concept-block",
      "blog/moveit-concept-block?screen=2",
      "blog/moveit-concept-block?screen=3",
      "blog/moveit-concept-block?screen=4",
      "blog/moveit-concept-block?screen=5",
      "blog/moveit-concept-block?screen=6",
      "blog/moveit-concept-block?screen=7",
      "blog/moveit-concept-block?screen=8",
      "life/choir-accompanist",
    ]) {
      await page.goto(`./#/${route}`);
      await page.locator("h1").waitFor();
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        cutTitles: [...document.querySelectorAll("h1,h2,h3,h4")]
          .filter(
            (n) =>
              n.scrollWidth > n.clientWidth + 2 ||
              n.scrollHeight > n.clientHeight + 2,
          )
          .map((n) => n.textContent),
      }));
      expect(layout, `${route || "home"} at ${width}`).toEqual({
        overflow: false,
        width,
        scrollWidth: width,
        cutTitles: [],
      });
    }
  });
}

test("mobile menu restores focus and supports page navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto("./");
  const menu = page.getByRole("button", { name: "메뉴", exact: true });
  await menu.click();
  await expect(
    page
      .getByRole("navigation", { name: "접힌 주 메뉴" })
      .getByRole("link")
      .first(),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page
    .getByRole("navigation", { name: "접힌 주 메뉴" })
    .getByRole("link", { name: "Tech Blog" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Tech Blog.",
  );
  await expect(page.locator("#compact-menu")).toBeHidden();
  await page.goto("./");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
});

test("reduced motion starts with a paused surface", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(
    page.getByRole("button", { name: /움직임 재생|모션 줄이기 적용/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".rover-renderer")).toHaveAttribute(
    "data-motion",
    "paused",
    { timeout: 30000 },
  );
});
