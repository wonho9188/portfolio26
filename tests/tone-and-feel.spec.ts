import { openLessonPart, openLessonEnd } from "./lesson-helpers";
import { test, expect } from "@playwright/test";

test("tone and visual appearance can be compared independently without changing the site theme", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/blog?topic=design");
  await page
    .getByRole("link", { name: "톤 앤 매너와 룩앤필", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("톤 앤 매너와 룩앤필");
  await expect(page.locator(".draft-notice")).toHaveCount(0);
  await openLessonPart(page, "tone-and-feel", "tone-and-feel", 1);
  const originalTheme = await page.locator("html").getAttribute("data-theme");
  const preview = page.locator(".tone-feel-preview");
  const initialCopy = await page
    .locator(".tone-feel-preview-copy")
    .textContent();
  const friendly = page
    .getByRole("group", { name: "말투 비교", exact: true })
    .getByRole("button", { name: "친근·부드러움", exact: true });
  await friendly.focus();
  await page.keyboard.press("Enter");
  await expect(friendly).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".tone-feel-preview-copy")).not.toHaveText(
    initialCopy!,
  );
  await expect(preview).toHaveAttribute("data-look", "calm");
  const friendlyCopy = await page
    .locator(".tone-feel-preview-copy")
    .textContent();
  await page
    .getByRole("group", { name: "화면 표현 비교", exact: true })
    .getByRole("button", { name: "부드러운 면", exact: true })
    .click();
  await expect(preview).toHaveAttribute("data-look", "soft");
  await expect(page.locator(".tone-feel-preview-copy")).toHaveText(
    friendlyCopy!,
  );
  await page.getByRole("button", { name: "따뜻한 대비", exact: true }).click();
  await expect(preview).toHaveAttribute("data-look", "bold");
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    originalTheme!,
  );
  await page.locator(".tone-feel-preview-link").click();
  await expect(page).toHaveURL(/#\/work$/);
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("톤 앤 매너와 룩앤필");
  await page.getByRole("button", { name: "대담·명료", exact: true }).click();
  await page.getByRole("button", { name: "따뜻한 대비", exact: true }).click();
  await page.getByRole("button", { name: "조합 초기화", exact: true }).click();
  await expect(preview).toHaveAttribute("data-look", "calm");
  await expect(page.locator(".tone-feel-preview-copy")).toHaveText(
    initialCopy!,
  );
  await page.reload();
  await expect(page.locator("h1")).toHaveText("톤 앤 매너와 룩앤필");
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /컴포넌트의 종류/ })
    .click();
  await page
    .locator(".article-pagination")
    .getByRole("link", { name: /톤 앤 매너와 룩앤필/ })
    .click();
  await page.locator(".article-header .breadcrumbs a").click();
  await expect(page.locator('[role="tab"][id$="-tab-design"]')).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(errors).toEqual([]);
});

test("tone and look combinations fit mobile and tablet in both themes", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await openLessonPart(page, "tone-and-feel", "tone-and-feel", 1);
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      for (const tone of ["차분·정확", "친근·부드러움", "대담·명료"]) {
        await page.getByRole("button", { name: tone, exact: true }).click();
        for (const look of ["정돈된 선", "부드러운 면", "따뜻한 대비"]) {
          await page.getByRole("button", { name: look, exact: true }).click();
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
          await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            theme,
          );
        }
      }
    }
  }
});
