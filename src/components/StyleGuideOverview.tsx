import { getLessonSelection } from "../data/lesson-slides";
import LessonParts from "./LessonParts";
import { useEffect, useId, useState } from "react";
import { PostCard, PostRow } from "./Cards";
import { TextLink } from "./primitives";
import { useTheme } from "./ThemeProvider";
import { posts } from "../data/content";

const panels = ["색상과 폰트", "여백과 레이아웃", "컴포넌트", "글 목록"];
const colors = [
  ["background", "화면 배경"],
  ["surface", "콘텐츠 표면"],
  ["ink", "주요 글자"],
  ["muted", "보조 글자"],
  ["accent", "강조와 조작"],
  ["line", "구분선"],
];
const fonts = [
  {
    name: "Noto Sans KR",
    role: "한글 제목과 본문",
    token: "body",
    size: 18,
    weight: 400,
    text: "작은 코드에도 배려와 체계를 담습니다.",
  },
  {
    name: "Manrope",
    role: "영문 대제목",
    token: "display",
    size: 32,
    weight: 800,
    text: "Systems, made real.",
  },
  {
    name: "Space Grotesk",
    role: "브랜드와 영문 링크",
    token: "brand",
    size: 25,
    weight: 700,
    text: "WONHO",
  },
  {
    name: "Inter",
    role: "배너의 질문 문구",
    token: "question",
    size: 24,
    weight: 700,
    text: "WANNA CREATE?",
  },
  {
    name: "IBM Plex Mono",
    role: "분류·숫자·기술 표기",
    token: "mono",
    size: 16,
    weight: 400,
    text: "01 / UNDERSTAND",
  },
  {
    name: "Instrument Serif",
    role: "강조하는 영문 문구",
    token: "accent",
    size: 36,
    weight: 400,
    text: "it real.",
    italic: true,
  },
];
const spaces = [8, 12, 16, 24, 32, 48, 64, 96];

function useCurrentTokens() {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const root = document.documentElement;
    const read = () => {
      const style = getComputedStyle(root);
      const names = [
        ...colors.map(([key]) => `--color-${key}`),
        "--page-gutter",
        "--content-max",
      ];
      const next = Object.fromEntries(
        names.map((name) => [name, style.getPropertyValue(name).trim()]),
      );
      const pixels = (value: string) =>
        `${parseFloat(value) * (value.endsWith("rem") ? parseFloat(style.fontSize) : 1)}px`;
      next.gutter = pixels(next["--page-gutter"]);
      next.content = pixels(next["--content-max"]);
      setValues(next);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window.addEventListener("resize", read);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", read);
    };
  }, []);
  return values;
}

export default function StyleGuideOverview({ part }: { part?: number }) {
  const [panel, setPanel] = useState(() =>
    getLessonSelection("style-guide-overview", part),
  );
  const [selected, setSelected] = useState(false);
  const [clicks, setClicks] = useState(0);
  const id = useId();
  const { theme, toggle } = useTheme();
  const tokens = useCurrentTokens();
  const examplePost = posts.find((post) => post.slug === "design-trends");
  return (
    <div className="style-guide-overview">
      <LessonParts name="style-guide-overview" part={part}>
        <div
          className="guide-panel-options"
          role="group"
          aria-label="스타일 가이드 항목 선택"
        >
          {panels.map((label, index) => (
            <button
              type="button"
              key={label}
              aria-pressed={panel === index}
              aria-controls={`${id}-panel`}
              onClick={() => setPanel(index)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="guide-panel" id={`${id}-panel`}>
          {panel === 0 && (
            <>
              <div className="guide-section-heading">
                <div>
                  <p className="eyebrow">FOUNDATIONS / COLOR</p>
                  <h3>역할에 따라 색을 정해요.</h3>
                </div>
                <button
                  type="button"
                  className="guide-secondary"
                  onClick={toggle}
                  aria-label="가이드에서 사이트 테마 전환"
                >
                  {theme === "dark" ? "라이트로 보기" : "다크로 보기"}
                </button>
              </div>
              <p className="guide-copy">
                현재 {theme === "dark" ? "다크" : "라이트"} 모드의 실제
                색상입니다. 같은 역할을 유지하면서 테마에 맞게 값이 바뀝니다.
              </p>
              <div className="guide-swatches">
                {colors.map(([key, label]) => (
                  <div className="guide-swatch" key={key}>
                    <span
                      className="guide-swatch-color"
                      style={{ background: `var(--color-${key})` }}
                      aria-hidden="true"
                    />
                    <h4>{label}</h4>
                    <span className="guide-color-value" data-color-token={key}>
                      {tokens[`--color-${key}`]?.toUpperCase() ?? "—"}
                    </span>
                    <code>--color-{key}</code>
                  </div>
                ))}
              </div>
              <div className="guide-subsection">
                <p className="eyebrow">FOUNDATIONS / TYPE</p>
                <h3>글자의 역할을 구분해요.</h3>
                <p className="guide-copy">
                  크기는 아래 샘플 기준입니다. 실제 제목과 본문은 화면 크기와
                  페이지 역할에 따라 달라집니다.
                </p>
                <div className="guide-font-list">
                  {fonts.map((font) => (
                    <div className="guide-font" key={font.name}>
                      <div className="guide-font-meta">
                        <h4>{font.name}</h4>
                        <span>
                          {font.role} · {font.size}px / {font.weight}
                        </span>
                      </div>
                      <p
                        className="guide-font-sample"
                        style={{
                          fontFamily: `var(--font-${font.token})`,
                          fontSize: font.size,
                          fontWeight: font.weight,
                          fontStyle: font.italic ? "italic" : "normal",
                        }}
                      >
                        {font.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {panel === 1 && (
            <>
              <p className="eyebrow">FOUNDATIONS / SPACE</p>
              <h3>가까운 정보는 묶고, 주제 사이는 넓혀요.</h3>
              <p className="guide-copy">
                간격 토큰 일부를 비교한 예시입니다. 제목·설명·조작 사이보다 서로
                다른 정보 묶음 사이를 넓게 둡니다.
              </p>
              <div className="guide-spaces">
                {spaces.map((space) => (
                  <div key={space}>
                    <span>{space}px</span>
                    <span className="guide-space-track">
                      <span
                        style={{
                          width: `min(100%, calc(var(--space-${space}) * 2))`,
                        }}
                      />
                    </span>
                  </div>
                ))}
              </div>
              <div className="guide-subsection">
                <p className="eyebrow">FOUNDATIONS / LAYOUT</p>
                <h3>화면이 좁아지면 배치도 바꿔요.</h3>
                <div className="guide-layout-current">
                  <span>
                    공통 콘텐츠 최대 폭 <strong>{tokens.content ?? "—"}</strong>
                  </span>
                  <span>
                    현재 공통 최소 좌우 여백{" "}
                    <strong>{tokens.gutter ?? "—"}</strong>
                  </span>
                </div>
                <div className="guide-breakpoints">
                  {[
                    ["1200px 이상", "최소 여백 64px", "설계 기준 12열"],
                    ["768–1199px", "최소 여백 32px", "설계 기준 8열"],
                    ["767px 이하", "최소 여백 20px", "설계 기준 4열"],
                  ].map(([range, gutter, grid]) => (
                    <div key={range}>
                      <h4>{range}</h4>
                      <p>{gutter}</p>
                      <span>{grid}</span>
                    </div>
                  ))}
                </div>
                <p className="guide-copy">
                  열 수는 설계를 위한 기준입니다. 실제 카드는 내용에 따라
                  배치하고, 긴 글은 이 페이지처럼 최대 880px의 읽기 열로
                  좁힙니다.
                </p>
                <p className="guide-copy">
                  일반 페이지의 섹션 사이는 데스크톱 120px, 태블릿 96px, 모바일
                  80px을 기준으로 구분합니다.
                </p>
              </div>
              <div className="guide-subsection">
                <h3>모서리도 역할을 가져요.</h3>
                <div className="guide-radii">
                  {[
                    ["0", "0px"],
                    ["8", "8px"],
                    ["16", "16px"],
                    ["pill", "Pill"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <span
                        style={{ borderRadius: `var(--radius-${key})` }}
                        aria-hidden="true"
                      />
                      <p>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {panel === 2 && (
            <>
              <p className="eyebrow">COMPONENTS / STATES</p>
              <h3>같은 역할은 같은 모습으로 만들어요.</h3>
              <p className="guide-copy">
                버튼은 기본·선택·사용 불가 상태를 구분합니다. 키보드 Tab으로
                이동하면 초점 테두리를 확인할 수 있습니다.
              </p>
              <div className="guide-demo-surface">
                <div className="guide-button-row">
                  <button
                    type="button"
                    className="guide-primary"
                    onClick={() => setClicks((count) => count + 1)}
                  >
                    동작 확인
                  </button>
                  <button
                    type="button"
                    className="guide-secondary"
                    onClick={() => {
                      setClicks(0);
                      setSelected(false);
                    }}
                  >
                    초기화
                  </button>
                  <button type="button" className="guide-secondary" disabled>
                    사용 불가
                  </button>
                </div>
                <div className="guide-button-row">
                  <button
                    type="button"
                    className="guide-secondary"
                    aria-pressed={selected}
                    onClick={() => setSelected((value) => !value)}
                  >
                    선택 옵션
                  </button>
                  <span className="award-chip">기술 기록</span>
                  <TextLink href="/blog/design-trends">
                    디자인 트렌드 읽기
                  </TextLink>
                </div>
                <p
                  className="guide-demo-status"
                  role="status"
                  aria-live="polite"
                >
                  {clicks}회 동작 · 옵션 {selected ? "선택됨" : "선택 안 됨"}
                </p>
              </div>
              <div className="guide-subsection">
                <h3>카드는 제목과 다음 행동을 보여줘요.</h3>
                <p className="guide-copy">
                  아래는 사이트에서 사용하는 공통 글 카드입니다. 제목을 누르면
                  실제 글로 이동합니다.
                </p>
                {examplePost && (
                  <div className="guide-card-example">
                    <PostCard post={examplePost} />
                  </div>
                )}
              </div>
              <div className="guide-subsection">
                <h3>조작할 때도 읽는 흐름을 유지해요.</h3>
                <ul className="guide-checks">
                  <li>색상뿐 아니라 문구와 테두리로 상태를 함께 표시합니다.</li>
                  <li>
                    조작 영역은 최소 44px, 이 페이지의 버튼 예시는 48px 높이를
                    확보합니다.
                  </li>
                  <li>
                    사용자의 움직임 줄이기 설정에서도 내용과 상태가 전달되게
                    합니다.
                  </li>
                </ul>
              </div>
            </>
          )}
          {panel === 3 && (
            <>
              <p className="eyebrow">COMPONENTS / POST LIST</p>
              <h3>목록은 내용을 훑어보는 입구예요.</h3>
              <p className="guide-copy">
                분류 → 제목 → 요약 → 메타 정보 순서로 읽힙니다. 실제 블로그와
                같은 공통 목록 컴포넌트를 사용합니다.
              </p>
              {examplePost && (
                <div className="posts-page guide-post-list">
                  <div className="post-list">
                    <PostRow post={examplePost} number={1} />
                  </div>
                </div>
              )}
              <dl className="guide-post-anatomy">
                {[
                  ["분류", "글의 주제를 짧게 알려줍니다."],
                  ["제목", "글로 들어가는 링크이자 첫 번째 읽기 정보입니다."],
                  ["요약", "어떤 내용을 다루는지 미리 보여줍니다."],
                  ["메타", "자료 확인일·연재 회차 등 실제 기록을 표시합니다."],
                ].map(([name, description]) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd>{description}</dd>
                  </div>
                ))}
              </dl>
              <p className="guide-copy">
                초안과 작성 예정 글은 상태를 밝혀 완성한 글과 구분합니다.
                모바일에서는 번호와 정보 묶음을 재배치해 읽기 폭을 확보합니다.
              </p>
            </>
          )}
        </div>
        <details className="guide-code-note">
          <summary>웹 구현에 연결하는 기준</summary>
          <p>
            색상은 역할별 CSS 변수로, 간격은 공통 토큰으로 연결합니다. 이
            페이지의 색상표는 실행 중인 사이트 값을 읽습니다.
          </p>
          <p>
            링크·칩·글 카드·글 목록은 공통 요소를 사용합니다. 버튼 예시는 이
            페이지에서 상태를 비교하기 위한 표현입니다. 콘텐츠 높이는 자동으로
            두고, 좁은 화면에서는 열을 줄입니다.
          </p>
        </details>
      </LessonParts>
    </div>
  );
}
