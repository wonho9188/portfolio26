import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import {
  aiMastersTopicId,
  articleIllustrations,
  designTopic,
  getTopicPosts,
  lifeGroups,
  posts,
  roboticsTopic,
  techGroups,
} from "../data/content";
import type { Post } from "../data/content";
import {
  PageHeading,
  TextLink,
  Arrow,
  scrollTo,
} from "../components/primitives";
import { PostRow } from "../components/Cards";
import KinematicsLab from "../components/KinematicsLab";
import CoordinateFramesTF from "../components/CoordinateFramesTF";
import CoordinatesPlayground from "../components/CoordinatesPlayground";
import LessonText from "../components/LessonText";
import TFTransformExamples from "../components/TFTransformExamples";
import MoveItUsage from "../components/MoveItUsage";
import MoveItVersions from "../components/MoveItVersions";
import ROS2Overview from "../components/ROS2Overview";
import LidarOverview from "../components/LidarOverview";
import Nav2Overview from "../components/Nav2Overview";
import NaturalLanguageOverview from "../components/NaturalLanguageOverview";
import LLMOverview from "../components/LLMOverview";
import MujocoOverview from "../components/MujocoOverview";
import TaskPlanningOverview from "../components/TaskPlanningOverview";
import DesignTrends from "../components/DesignTrends";
import StyleGuideOverview from "../components/StyleGuideOverview";
import ReferencePractice from "../components/ReferencePractice";
import VisualPriority from "../components/VisualPriority";
import ComponentKinds from "../components/ComponentKinds";
import ToneAndFeel from "../components/ToneAndFeel";
import FMSOverview from "../components/FMSOverview";
import { getLessonSlides } from "../data/lesson-slides";

function graduateArticleUrl(slug: string, screen?: string) {
  const params = new URLSearchParams({ topic: aiMastersTopicId, article: slug });
  if (screen) params.set("screen", screen);
  return `/blog?${params}`;
}

function GraduateReader({ courses }: { courses: Post[] }) {
  const [params] = useSearchParams();
  const requestedSlug = params.get("article");
  const entries = courses.map((course) => ({
    course,
    articles: getTopicPosts("tech", aiMastersTopicId, course.slug),
  }));
  const selected =
    entries.find(
      ({ course, articles }) =>
        course.slug === requestedSlug ||
        articles.some(({ slug }) => slug === requestedSlug),
    ) ?? entries[0];
  const article =
    selected.articles.find(({ slug }) => slug === requestedSlug) ??
    selected.articles[0] ??
    selected.course;

  return (
    <div className="graduate-reader">
      <nav className="graduate-sidebar" aria-label="대학원 과목">
        <ul>
          {entries.map((entry) => {
            const active = entry === selected;
            const { course, articles } = entry;
            return (
              <li key={course.slug}>
                <Link
                  to={graduateArticleUrl((articles[0] ?? course).slug)}
                  aria-current={active ? "true" : undefined}
                  className="graduate-course"
                >
                  {course.title}
                </Link>
                {active && articles.length > 0 && (
                  <ul className="graduate-article-links">
                    {articles.map((item) => (
                      <li key={item.slug}>
                        <Link
                          to={graduateArticleUrl(item.slug)}
                          aria-current={
                            item.slug === article.slug ? "page" : undefined
                          }
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <PostArticle post={article} embedded />
    </div>
  );
}

function PostTabs({ kind }: { kind: "tech" | "life" }) {
  const [params, setParams] = useSearchParams();
  const tabsRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const groups = kind === "tech" ? techGroups : lifeGroups;
  const current = groups.some((g) => g[0] === params.get("topic"))
    ? params.get("topic")!
    : groups[0][0];
  const index = groups.findIndex((g) => g[0] === current);
  const isRoboticsTopic = kind === "tech" && current === roboticsTopic.id;
  const isDesignTopic = kind === "tech" && current === designTopic.id;
  const filtered = getTopicPosts(kind, current);
  useEffect(() => {
    const list = tabsRef.current;
    const tab = list?.querySelector<HTMLButtonElement>(
      '[aria-selected="true"]',
    );
    if (!list || !tab) return;
    const item = tab.getBoundingClientRect();
    const bounds = list.getBoundingClientRect();
    if (item.left < bounds.left) list.scrollLeft += item.left - bounds.left;
    else if (item.right > bounds.right)
      list.scrollLeft += item.right - bounds.right;
  }, [current]);
  const select = (n: number, focus = false) => {
    setParams({ topic: groups[n][0] }, { replace: true });
    if (focus) {
      const tab =
        tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[n];
      tab?.focus();
      tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  };
  const keyboard = (event: KeyboardEvent) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % groups.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + groups.length) % groups.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = groups.length - 1;
    else return;
    event.preventDefault();
    select(next, true);
  };
  return (
    <div className="post-collection">
      <div
        className="post-tabs"
        role="tablist"
        aria-label={kind === "tech" ? "기술 글 주제" : "취미와 생각 분류"}
        ref={tabsRef}
        onKeyDown={keyboard}
      >
        {groups.map(([key, label], n) => (
          <button
            key={key}
            id={`${uid}-tab-${key}`}
            role="tab"
            aria-selected={key === current}
            aria-controls={`${uid}-panel-${key}`}
            tabIndex={key === current ? 0 : -1}
            onClick={() => select(n)}
          >
            {label}
            <span>{getTopicPosts(kind, key).length}</span>
          </button>
        ))}
      </div>
      <section
        role="tabpanel"
        id={`${uid}-panel-${current}`}
        aria-labelledby={`${uid}-tab-${current}`}
        tabIndex={0}
      >
        {current === aiMastersTopicId && filtered.length > 0 ? (
          <GraduateReader courses={filtered} />
        ) : (
          <>
            <div className="collection-heading">
              <h2>{groups[index][2]}</h2>
              <p className="eyebrow">
                {String(filtered.length).padStart(2, "0")}{" "}
                {filtered.length === 1 ? "POST" : "POSTS"}
              </p>
            </div>
            {isRoboticsTopic && (
              <p className="topic-description">{roboticsTopic.description}</p>
            )}
            {isDesignTopic && (
              <p className="topic-description">{designTopic.description}</p>
            )}
            <div className={`post-list${kind === "tech" ? " tech-post-grid" : ""}`}>
              {filtered.map((p, i) => (
                <PostRow key={p.slug} post={p} number={i + 1} />
              ))}
            </div>
            {!filtered.length && (
              <div className="empty-state">
                <h3>
                  {isRoboticsTopic
                    ? "아직 등록된 개념 블록이 없습니다."
                    : "아직 공개한 글이 없습니다."}
                </h3>
                <p>
                  {isRoboticsTopic
                    ? "첫 글이 등록되면 이곳에서 개념 블록을 하나씩 쌓아갈 수 있습니다."
                    : "다른 주제의 기록도 살펴보세요."}
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
export function TechBlog() {
  return (
    <div className="container inner-page posts-page">
      <PageHeading
        label="04 / ENGINEERING NOTES"
        title="Tech Blog"
        subtitle="작동한 코드 너머, 선택한 이유를 기록합니다."
      />
      <PostTabs kind="tech" />
    </div>
  );
}
export function Life() {
  return (
    <div className="container inner-page posts-page">
      <PageHeading
        label="06 / BEYOND ENGINEERING"
        title="Life & Thoughts"
        subtitle="로봇 밖에서, 사람과 세상을 이해하는 시간."
      />
      <PostTabs kind="life" />
    </div>
  );
}
export function Article() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return <NotFound />;
  if (post.kind === "tech" && post.group === aiMastersTopicId) {
    const article = getTopicPosts("tech", aiMastersTopicId, post.slug)[0] ?? post;
    return (
      <Navigate
        to={graduateArticleUrl(article.slug, params.get("screen") ?? undefined)}
        replace
      />
    );
  }
  return <PostArticle post={post} />;
}

function PostArticle({
  post,
  embedded = false,
}: {
  post: Post;
  embedded?: boolean;
}) {
  const [params] = useSearchParams();
  const { slug, title } = post;
  const ArticleTitle = embedded ? "h2" : "h1";
  const SectionTitle = embedded ? "h3" : "h2";
  const articleTitleId = useId();
  const lessonSections = getLessonSlides(post);
  const isScreenLesson =
    lessonSections.length > 0 &&
    (post.kind === "tech" || post.presentation === "screens");
  const requestedScreen = Number(params.get("screen") ?? 1);
  const screenIndex =
    isScreenLesson && Number.isInteger(requestedScreen) && requestedScreen >= 1
      ? Math.min(requestedScreen, lessonSections.length) - 1
      : 0;
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} — WONHO`;
    if (embedded) {
      return () => {
        document.title = previousTitle;
      };
    }
  }, [title, embedded]);
  const articleRef = useRef<HTMLElement>(null);
  const previousScreen = useRef({ slug, screenIndex });
  const lessonNavigation = useRef<HTMLElement>(null);
  const lessonDirection = useRef<"previous" | "next" | null>(null);
  useEffect(() => {
    const sameArticle = previousScreen.current.slug === slug;
    const changedScreen =
      isScreenLesson &&
      sameArticle &&
      previousScreen.current.screenIndex !== screenIndex;
    const selectedOnMobile =
      embedded && !sameArticle && matchMedia("(max-width: 767px)").matches;
    if (changedScreen || selectedOnMobile) {
      if (embedded) articleRef.current?.scrollIntoView({ behavior: "instant" });
      else window.scrollTo({ top: 0, behavior: "instant" });
      const direction = lessonDirection.current;
      const navigationLink = direction
        ? (lessonNavigation.current?.querySelector<HTMLAnchorElement>(
            direction === "next" ? "a.lesson-next" : "a.lesson-previous",
          ) ?? lessonNavigation.current?.querySelector<HTMLAnchorElement>("a"))
        : null;
      const fallbackFocus = embedded
        ? articleRef.current
        : document.getElementById("main");
      (navigationLink ?? fallbackFocus)?.focus({
        preventScroll: true,
      });
    }
    lessonDirection.current = null;
    previousScreen.current = { slug, screenIndex };
  }, [slug, screenIndex, isScreenLesson, embedded]);
  const base = post.kind === "tech" ? "/blog" : "/life";
  const topic =
    post.kind === "tech"
      ? techGroups.find(([id]) => id === post.group)
      : undefined;
  const isRoboticsTopic = topic?.[0] === roboticsTopic.id;
  const isDesignTopic = topic?.[0] === designTopic.id;
  const isConceptIntro =
    (isRoboticsTopic && (post.sections.length === 1 || isScreenLesson)) ||
    (isDesignTopic && (post.sections.length === 1 || isScreenLesson));
  const visibleSections = isScreenLesson
    ? [lessonSections[screenIndex]]
    : post.sections;
  const screenUrl = (index: number) => {
    const screen = index ? String(index + 1) : undefined;
    return embedded
      ? graduateArticleUrl(slug, screen)
      : `${base}/${slug}${screen ? `?screen=${screen}` : ""}`;
  };
  const parent = posts.find((candidate) => candidate.slug === post.parentSlug);
  const childPosts = getTopicPosts(post.kind, post.group, post.slug);
  const listUrl = parent
    ? `${base}/${parent.slug}`
    : `${base}?topic=${post.group}`;
  const topicLabel =
    topic?.[1] ?? (post.kind === "tech" ? "Tech Blog" : "Life & Thoughts");
  const listLabel = parent?.title ?? `${topicLabel} 목록`;
  const siblings =
    topic || parent || childPosts.length > 0
      ? getTopicPosts(post.kind, post.group, post.parentSlug)
      : posts.filter((p) => p.kind === post.kind && !p.parentSlug);
  const index = siblings.indexOf(post);
  const next = siblings[index + 1],
    previous = siblings[index - 1];
  return (
    <article
      ref={articleRef}
      tabIndex={embedded ? -1 : undefined}
      aria-labelledby={embedded ? articleTitleId : undefined}
      className={`article-page ${embedded ? "graduate-article" : "container"}${isConceptIntro ? " concept-intro" : ""}${isScreenLesson ? " screen-lesson" : ""}${isScreenLesson && screenIndex > 0 ? " lesson-continuation" : ""}`}
    >
      <header className="article-header">
        <div className="breadcrumbs">
          {!embedded && <TextLink href={listUrl}>← {listLabel}</TextLink>}
          <p className="eyebrow">{post.category}</p>
        </div>
        <ArticleTitle id={embedded ? articleTitleId : undefined}>
          {title}
        </ArticleTitle>
        {post.excerpt && (!isScreenLesson || screenIndex === 0) && (
          <p className="lead">{post.excerpt}</p>
        )}
        <p className="meta">{post.meta.replace(/^최원호 · /, "")}</p>
      </header>
      {isRoboticsTopic && (
        <p className="article-topic">{roboticsTopic.title}</p>
      )}
      {post.status === "planned" && childPosts.length === 0 && (
        <aside className="draft-notice">
          <span className="award-chip">작성 예정</span>
          <p>
            제목과 주제를 정리한 단계입니다. 본문은 차근차근 추가할 예정입니다.
          </p>
        </aside>
      )}
      {post.status === "draft" && (
        <p className="draft-notice">
          {isRoboticsTopic
            ? "기록 초안 · 로봇의 원리를 쉬운 말로 풀어가며 내용을 다듬고 있습니다."
            : "기록 초안 · 프로젝트 자료를 바탕으로 정리 중인 기술 노트입니다."}
        </p>
      )}
      {childPosts.length > 0 && (
        <nav className="post-list" aria-label={`${post.title} 글 목록`}>
          {childPosts.map((child, index) => (
            <PostRow key={child.slug} post={child} number={index + 1} />
          ))}
        </nav>
      )}
      <div className="article-layout">
        {visibleSections.length > 0 && !isConceptIntro && !isScreenLesson && (
          <nav className="article-toc" aria-label="이 글의 목차">
            <p className="eyebrow">ON THIS PAGE</p>
            {post.sections.map((s, i) => (
              <button key={s.title} onClick={() => scrollTo(`section-${i}`)}>
                {String(i + 1).padStart(2, "0")} {s.title}
              </button>
            ))}
            {post.kind === "tech" && post.source && (
              <TextLink href={post.source}>
                기록의 바탕 보기 <Arrow />
              </TextLink>
            )}
          </nav>
        )}
        <div className="article-body">
          {post.image && (
            <figure className="article-poster">
              <img
                src={post.image}
                alt={post.title.split(" — ")[0] + " 영화 포스터"}
                width={144}
                height={208}
              />
              <figcaption>{post.title.split(" — ")[0]}</figcaption>
            </figure>
          )}
          {visibleSections.map((s, i) => (
            <section
              key={`${s.title}-${screenIndex}`}
              id={`section-${i}`}
              tabIndex={-1}
            >
              <SectionTitle>
                {String((isScreenLesson ? screenIndex : i) + 1).padStart(
                  2,
                  "0",
                )}{" "}
                / {s.title}
              </SectionTitle>
              {s.illustration && articleIllustrations[s.illustration] && (
                <figure className="article-illustration">
                  <img
                    src={articleIllustrations[s.illustration]}
                    alt={s.illustrationAlt ?? ""}
                    decoding="async"
                  />
                  {s.illustrationCaption && (
                    <figcaption>{s.illustrationCaption}</figcaption>
                  )}
                </figure>
              )}
              {s.p.map((p, paragraphIndex) => (
                <p
                  key={p}
                  className={
                    s.steps
                      ? paragraphIndex === 0
                        ? "lesson-opening"
                        : "lesson-example"
                      : undefined
                  }
                >
                  <LessonText text={p} emphasis={s.emphasis} />
                </p>
              ))}
              {s.interactive === "kinematics" && (
                <KinematicsLab part={s.componentPart} />
              )}
              {s.interactive === "coordinate-frames" && (
                <CoordinateFramesTF part={s.componentPart} />
              )}
              {s.interactive === "coordinates-playground" && (
                <CoordinatesPlayground part={s.componentPart} />
              )}
              {s.interactive === "tf-transform" && (
                <TFTransformExamples part={s.componentPart} />
              )}
              {s.supplement === "moveit-usage" && (
                <MoveItUsage part={s.componentPart} />
              )}
              {s.supplement === "moveit-versions" && (
                <MoveItVersions part={s.componentPart} />
              )}
              {s.interactive === "ros2-overview" && (
                <ROS2Overview part={s.componentPart} />
              )}
              {s.interactive === "lidar-overview" && (
                <LidarOverview part={s.componentPart} />
              )}
              {s.interactive === "nav2-overview" && (
                <Nav2Overview part={s.componentPart} />
              )}
              {s.interactive === "llm-overview" && (
                <LLMOverview part={s.componentPart} />
              )}
              {s.interactive === "design-trends" && (
                <DesignTrends part={s.componentPart} />
              )}
              {s.interactive === "reference-practice" && (
                <ReferencePractice part={s.componentPart} />
              )}
              {s.interactive === "visual-priority" && (
                <VisualPriority part={s.componentPart} />
              )}
              {s.interactive === "component-kinds" && (
                <ComponentKinds part={s.componentPart} />
              )}
              {s.interactive === "tone-and-feel" && (
                <ToneAndFeel part={s.componentPart} />
              )}
              {s.interactive === "fms-overview" && (
                <FMSOverview part={s.componentPart} />
              )}
              {s.interactive === "style-guide-overview" && (
                <StyleGuideOverview part={s.componentPart} />
              )}
              {s.interactive === "mujoco-overview" && (
                <MujocoOverview part={s.componentPart} />
              )}
              {s.interactive === "task-planning-overview" && (
                <TaskPlanningOverview part={s.componentPart} />
              )}
              {s.interactive === "natural-language-overview" && (
                <NaturalLanguageOverview part={s.componentPart} />
              )}
              {s.steps && (
                <ol className="lesson-steps">
                  {s.steps.map((step, stepIndex) => (
                    <li key={step.title}>
                      <span className="lesson-step-number" aria-hidden="true">
                        {stepIndex + 1}
                      </span>
                      <div>
                        <h3>{step.title}</h3>
                        <p>
                          <LessonText text={step.body} emphasis={s.emphasis} />
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          {post.kind === "life" && post.source && (
            <TextLink
              className="article-source"
              href={post.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.sourceLabel ?? "참고 자료 보기"} <Arrow />
            </TextLink>
          )}
        </div>
      </div>
      {isScreenLesson && (
        <nav
          ref={lessonNavigation}
          className="lesson-navigation"
          aria-label="학습 화면"
        >
          {screenIndex > 0 ? (
            <Link
              className="lesson-control lesson-previous"
              to={screenUrl(screenIndex - 1)}
              onClick={() => {
                lessonDirection.current = "previous";
              }}
            >
              ← 이전 화면
            </Link>
          ) : (
            <button className="lesson-control lesson-previous" disabled>
              ← 이전 화면
            </button>
          )}
          <p className="meta" aria-live="polite">
            {screenIndex + 1} / {lessonSections.length}
          </p>
          {screenIndex < lessonSections.length - 1 ? (
            <Link
              className="lesson-control lesson-next"
              to={screenUrl(screenIndex + 1)}
              onClick={() => {
                lessonDirection.current = "next";
              }}
            >
              다음 화면 →
            </Link>
          ) : (
            <button className="lesson-control lesson-next" disabled>
              다음 화면 →
            </button>
          )}
        </nav>
      )}
      {(isConceptIntro || isScreenLesson) && post.source && (
        <TextLink className="concept-source" href={post.source}>
          {post.sourceLabel ??
            (post.slug === "moveit-concept-block"
              ? "MoveIt 공식 문서 보기"
              : isConceptIntro
                ? "공식 문서 보기"
                : "기록의 바탕 보기")}{" "}
          <Arrow />
        </TextLink>
      )}
      {!embedded &&
        (!post.presentation || screenIndex === lessonSections.length - 1) && (
          <nav className="article-pagination" aria-label="다른 글">
            <Link to={previous ? `${base}/${previous.slug}` : listUrl}>
              <span className="eyebrow">
                ← {previous ? "PREVIOUS POST" : "BACK TO POSTS"}
              </span>
              <span>{previous?.title ?? listLabel}</span>
            </Link>
            {next && (
              <Link to={`${base}/${next.slug}`}>
                <span className="eyebrow">NEXT POST →</span>
                <span>{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      {!embedded && (
        <TextLink href={listUrl}>
          목록으로 돌아가기 <Arrow />
        </TextLink>
      )}
    </article>
  );
}
export function NotFound() {
  return (
    <div className="container not-found">
      <p className="eyebrow">404 / NOT FOUND</p>
      <h1>찾는 페이지가 없습니다.</h1>
      <p>주소를 확인하거나 홈에서 다시 살펴보세요.</p>
      <TextLink href="/">
        홈으로 돌아가기 <Arrow />
      </TextLink>
    </div>
  );
}
