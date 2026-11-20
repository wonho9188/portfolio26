import { getLessonSelection } from "../data/lesson-slides";
import LessonParts from "./LessonParts";
import { useId, useState } from "react";

const trends = [
  {
    id: "type",
    label: "타이포그래피",
    title: "글자가 화면의 인상을 만들어요.",
    description:
      "큰 제목과 개성 있는 글꼴로 핵심 문구를 전면에 드러내는 흐름이에요.",
    note: "제목이 커질수록 주변 여백도 확보해요. 본문과의 크기 차이를 두고, 모바일 줄바꿈을 확인해요.",
    source: "Figma · Bold typography",
    url: "https://www.figma.com/resource-library/web-design-trends/",
  },
  {
    id: "index",
    label: "정돈된 인덱스",
    title: "많은 기록을 차분하게 펼쳐요.",
    description:
      "번호, 분류, 구분선을 사용해 기록을 도서관의 목록처럼 정리하는 표현이에요.",
    note: "프로젝트나 글 목록에 어울려요. 제목과 날짜의 우선순위를 나누고, 작은 라벨도 읽을 수 있게 만들어요.",
    source: "Squarespace · Archival Index",
    url: "https://pros.squarespace.com/blog/design-trends",
  },
  {
    id: "glass",
    label: "반투명 레이어",
    title: "겹침으로 깊이를 표현해요.",
    description:
      "반투명 표면과 배경 흐림으로 유리 같은 레이어를 만드는 글래스모피즘이에요.",
    note: "배경이 바뀌어도 글자가 선명한지 확인해요. 긴 본문보다는 짧은 카드나 도구 영역에 제한해서 시험해 봐요.",
    source: "Squarespace · Glassmorphism",
    url: "https://pros.squarespace.com/blog/design-trends",
  },
  {
    id: "motion",
    label: "의미 있는 모션",
    title: "변화를 움직임으로 알려줘요.",
    description:
      "움직임으로 중요한 내용에 시선을 이끌거나 화면의 변화와 흐름을 전달하는 방식이에요.",
    note: "버튼을 눌렀을 때 무엇이 달라졌는지 보여줘요. 움직임을 줄인 설정에서도 글과 상태 표시로 뜻이 전달되어야 해요.",
    source: "Webflow · Dynamic text treatments",
    url: "https://webflow.com/blog/web-design-trends-2026",
  },
];

export default function DesignTrends({ part }: { part?: number }) {
  const [selected, setSelected] = useState(() =>
    getLessonSelection("design-trends", part),
  );
  const [ready, setReady] = useState(false);
  const id = useId();
  const trend = trends[selected];
  return (
    <div className="design-trends">
      <LessonParts name="design-trends" part={part}>
        <p className="design-trends-instruction">
          표현을 골라 예시 화면을 비교해 보세요.
        </p>
        <div
          className="design-trend-options"
          role="group"
          aria-label="디자인 트렌드 선택"
        >
          {trends.map((item, index) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={selected === index}
              aria-controls={`${id}-example`}
              onClick={() => {
                setSelected(index);
                setReady(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <figure className="design-trend-example" id={`${id}-example`}>
          <div className={`design-trend-preview trend-${trend.id}`}>
            {trend.id === "type" && (
              <div className="trend-type-layout">
                <span>FORM / FEELING</span>
                <p>
                  작은 차이가
                  <br />
                  <em>인상을 만든다.</em>
                </p>
                <span>크기와 여백으로 만드는 시각적 리듬</span>
              </div>
            )}
            {trend.id === "index" && (
              <div className="trend-index-layout">
                <span>SELECTED NOTES / 2026</span>
                <p className="trend-index-heading">생각의 목록</p>
                {["구조를 읽는 시선", "움직임의 이유", "작은 인터랙션"].map(
                  (title, index) => (
                    <div className="trend-index-row" key={title}>
                      <span>0{index + 1}</span>
                      <span>{title}</span>
                      <span>기록</span>
                    </div>
                  ),
                )}
              </div>
            )}
            {trend.id === "glass" && (
              <div className="trend-glass-layout">
                <div className="trend-glass-orb" aria-hidden="true" />
                <div className="trend-glass-panel">
                  <span>LAYER / 01</span>
                  <p>차분한 깊이</p>
                  <span>
                    정보와 배경 사이에
                    <br />
                    거리를 만들어요.
                  </span>
                </div>
              </div>
            )}
            {trend.id === "motion" && (
              <div className="trend-motion-layout" data-ready={ready}>
                <span>INTERACTION / STATE</span>
                <p role="status" aria-live="polite">
                  {ready ? "연결 완료" : "연결 전"}
                </p>
                <div className="trend-motion-track" aria-hidden="true">
                  <span />
                </div>
                <button
                  type="button"
                  aria-pressed={ready}
                  onClick={() => setReady((value) => !value)}
                >
                  상태 바꾸기
                </button>
              </div>
            )}
          </div>
          <figcaption>
            트렌드의 특징을 설명하기 위해 직접 구성한 예시입니다.
          </figcaption>
        </figure>
        <div
          className="design-trend-detail"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="eyebrow">
            0{selected + 1} / {trend.label}
          </p>
          <h3>{trend.title}</h3>
          <p>{trend.description}</p>
          <div className="design-trend-note">
            <h4>적용 메모</h4>
            <p>{trend.note}</p>
          </div>
          <a
            className="design-trend-source"
            href={trend.url}
            target="_blank"
            rel="noreferrer"
          >
            참고: {trend.source}
          </a>
        </div>
        <aside className="design-trends-closing">
          <h3>모양을 고르기 전에, 역할을 생각해요.</h3>
          <p>
            트렌드는 선택지예요. 어떤 내용을 먼저 읽게 할지, 조작하기 쉬운지,
            작은 화면에서도 자연스러운지를 기준으로 필요한 표현을 골라요.
          </p>
        </aside>
        <p className="design-trends-date">
          자료 확인 · 2026년 11월 20일. 소개한 흐름은 시장 전체의 순위가 아니라
          참고 자료에서 고른 관찰입니다. 적용 메모는 이 글의 해석입니다.
        </p>
      </LessonParts>
    </div>
  );
}
