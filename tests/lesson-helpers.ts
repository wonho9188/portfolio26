import type { Page } from "@playwright/test";
import source from "../src/data/posts-source.json" with { type: "json" };
import type { Post } from "../src/data/content";
import { getLessonSlides } from "../src/data/lesson-slides";

export function lessonSlides(slug: string) {
  const post = source.posts.find((item) => item.slug === slug);
  if (!post) throw new Error(`Unknown lesson: ${slug}`);
  return getLessonSlides(post as Post);
}

export function lessonUrl(slug: string, widget?: string, part = 0) {
  const slides = lessonSlides(slug);
  const index = widget
    ? slides.findIndex(
        (s) =>
          (s.interactive ?? s.supplement) === widget &&
          s.componentPart === part,
      )
    : 0;
  if (index < 0)
    throw new Error(`Missing lesson part: ${slug}/${widget}/${part}`);
  return `./#/blog/${slug}${index ? `?screen=${index + 1}` : ""}`;
}

export async function openLessonPart(
  page: Page,
  slug: string,
  widget: string,
  part = 0,
) {
  await page.goto(lessonUrl(slug, widget, part));
}

export async function openLessonEnd(page: Page, slug: string) {
  await page.goto(`./#/blog/${slug}?screen=${lessonSlides(slug).length}`);
}
