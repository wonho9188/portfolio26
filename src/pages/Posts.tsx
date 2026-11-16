import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  getTopicPosts,
  lifeGroups,
  posts,
  roboticsTopic,
  techGroups,
} from "../data/content";
import {
  PageHeading,
  TextLink,
  Arrow,
  scrollTo,
} from "../components/primitives";
import { PostRow } from "../components/Cards";

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
      {kind === "tech" && (
        <p className="eyebrow writing-desk">
          WRITING DESK / 정리 중인 기술 노트
        </p>
      )}
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
            <span>
              {posts.filter((p) => p.kind === kind && p.group === key).length}
            </span>
          </button>
        ))}
      </div>
      <section
        role="tabpanel"
        id={`${uid}-panel-${current}`}
        aria-labelledby={`${uid}-tab-${current}`}
        tabIndex={0}
      >
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
        <div className="post-list">
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
        description={
          "실제 프로젝트에서 마주한 문제와 기술적 판단을 바탕으로,\n설계의 이유와 해결 과정을 정리합니다."
        }
      />
      <PostTabs kind="tech" />
      <aside className="posts-cross-link">
        <h2>코드 밖에서 남은 질문도 기록합니다.</h2>
        <p>
          영화와 독서, 철학과 인간관계에 관한 생각은 Life & Thoughts에서
          이어집니다.
        </p>
        <TextLink href="/life">
          취미와 생각으로 이동 <Arrow />
        </TextLink>
      </aside>
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
        description={
          "영화와 만화, 독서와 철학, 관계와 경험.\n보고 읽고 살아가며 생긴 질문들을 천천히 들여다봅니다."
        }
      />
      <PostTabs kind="life" />
    </div>
  );
}
export function Article() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  useEffect(() => {
    if (post) document.title = `${post.title} — WONHO`;
  }, [post]);
  if (!post) return <NotFound />;
  const base = post.kind === "tech" ? "/blog" : "/life";
  const isRoboticsTopic =
    post.kind === "tech" && post.group === roboticsTopic.id;
  const listUrl = `${base}?topic=${post.group}`;
  const siblings = isRoboticsTopic
      ? getTopicPosts(post.kind, post.group)
      : posts.filter((p) => p.kind === post.kind),
    index = siblings.indexOf(post);
  const next = siblings[index + 1],
    previous = siblings[index - 1];
  return (
    <article className="container article-page">
      <header className="article-header">
        <div className="breadcrumbs">
          <TextLink href={listUrl}>
            ←{" "}
            {isRoboticsTopic
              ? roboticsTopic.label
              : post.kind === "tech"
                ? "Tech Blog"
                : "Life & Thoughts"}{" "}
            목록
          </TextLink>
          <p className="eyebrow">{post.category}</p>
        </div>
        <h1>{post.title}</h1>
        <p className="lead">{post.excerpt}</p>
        <p className="meta">최원호 · {post.meta.replace(/^최원호 · /, "")}</p>
      </header>
      {isRoboticsTopic && (
        <p className="article-topic">{roboticsTopic.title}</p>
      )}
      {post.status === "planned" && (
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
      <div className="article-layout">
        <nav className="article-toc" aria-label="이 글의 목차">
          <p className="eyebrow">ON THIS PAGE</p>
          {post.sections.map((s, i) => (
            <button key={s.title} onClick={() => scrollTo(`section-${i}`)}>
              {String(i + 1).padStart(2, "0")} {s.title}
            </button>
          ))}
          {post.source && (
            <TextLink href={post.source}>
              기록의 바탕 보기 <Arrow />
            </TextLink>
          )}
        </nav>
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
          {post.sections.map((s, i) => (
            <section key={s.title} id={`section-${i}`} tabIndex={-1}>
              <h2>
                {String(i + 1).padStart(2, "0")} / {s.title}
              </h2>
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
      <nav className="article-pagination" aria-label="다른 글">
        <Link to={previous ? `${base}/${previous.slug}` : listUrl}>
          <span className="eyebrow">
            ← {previous ? "PREVIOUS POST" : "BACK TO POSTS"}
          </span>
          <span>
            {previous?.title ??
              (isRoboticsTopic
                ? `${roboticsTopic.label} 목록`
                : post.kind === "tech"
                  ? "Tech Blog 목록"
                  : "Life & Thoughts 목록")}
          </span>
        </Link>
        {next && (
          <Link to={`${base}/${next.slug}`}>
            <span className="eyebrow">NEXT POST →</span>
            <span>{next.title}</span>
          </Link>
        )}
      </nav>
      <TextLink href={listUrl}>
        목록으로 돌아가기 <Arrow />
      </TextLink>
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
