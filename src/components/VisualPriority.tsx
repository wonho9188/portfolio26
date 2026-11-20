import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

const factors = [
  {
    key: "layout",
    label: "레이아웃",
    question: "무엇을 어디에 놓을까요?",
    body: "중요한 내용의 위치와 영역을 먼저 정해요. 관련 정보의 정렬선과 읽는 순서도 함께 맞춰요.",
  },
  {
    key: "space",
    label: "여백",
    question: "무엇을 묶고, 무엇을 나눌까요?",
    body: "관련된 정보는 가까이 묶고, 다른 주제 사이에는 거리를 둬요. 빈 공간도 정보의 관계를 보여줘요.",
  },
  {
    key: "size",
    label: "크기",
    question: "어느 문장이 먼저 보이나요?",
    body: "핵심 제목과 보조 정보의 크기·무게를 달리해요. 모두 크게 만들기보다 중요도에 차이를 둬요.",
  },
  {
    key: "color",
    label: "색상",
    question: "어디에 시선을 모을까요?",
    body: "배경과의 대비, 강조색의 범위를 조절해요. 색상과 함께 문구·위치·크기로도 중요도를 전달해요.",
  },
] as const;
type Factor = (typeof factors)[number]["key"];
const none: Record<Factor, boolean> = {
  layout: false,
  space: false,
  size: false,
  color: false,
};
const all: Record<Factor, boolean> = {
  layout: true,
  space: true,
  size: true,
  color: true,
};

export default function VisualPriority({ part }: { part?: number }) {
  const [active, setActive] = useState(none);
  const id = useId();
  const count = Object.values(active).filter(Boolean).length;
  return (
    <div className="visual-priority">
      <LessonParts name="visual-priority" part={part}>
        <p className="eyebrow">VISUAL HIERARCHY / 네 가지 기준</p>
        <h3>같은 정보, 다른 읽기 순서</h3>
        <p className="priority-intro">
          기준을 하나씩 켜고 꺼 보세요. 어떤 내용이 먼저 보이는지 비교해 보세요.
        </p>
        <div
          className="priority-factor-controls"
          role="group"
          aria-label="시각적 우선순위 기준 선택"
        >
          {factors.map((factor) => (
            <button
              type="button"
              key={factor.key}
              aria-pressed={active[factor.key]}
              aria-controls={`${id}-preview`}
              onClick={() =>
                setActive((current) => ({
                  ...current,
                  [factor.key]: !current[factor.key],
                }))
              }
            >
              {factor.label}
            </button>
          ))}
        </div>
        <div className="priority-control-summary">
          <p role="status" aria-live="polite">
            {count} / 4가지 기준 적용
          </p>
          <div>
            <button type="button" onClick={() => setActive(all)}>
              모두 적용
            </button>
            <button type="button" onClick={() => setActive(none)}>
              기본 상태로
            </button>
          </div>
        </div>
        <figure className="priority-example">
          <div
            className="priority-demo"
            id={`${id}-preview`}
            data-layout={active.layout}
            data-space={active.space}
            data-size={active.size}
            data-color={active.color}
          >
            <div className="priority-demo-header">WONHO / WORK NOTES</div>
            <div className="priority-demo-grid">
              <div className="priority-primary">
                <span className="priority-category">PRODUCT / A TO Z</span>
                <h4>로봇 교육용 앱을 만들다</h4>
                <p>기획부터 운영까지, 제품의 전 과정을 연결합니다.</p>
                <Link className="priority-project-link" to="/work/product">
                  프로젝트 보기
                </Link>
              </div>
              <div className="priority-secondary">
                <h4>작업 기록</h4>
                <p>설계·개발·운영</p>
                <span>작업의 맥락을 정리합니다.</span>
              </div>
            </div>
          </div>
          <figcaption>
            직접 구성한 설명 예시입니다. 문구는 유지하고 배치·간격·글자
            크기·색상 표현을 바꿉니다.
          </figcaption>
        </figure>
        <div className="priority-principles">
          {factors.map((factor, index) => (
            <div key={factor.key}>
              <p className="eyebrow">
                0{index + 1} / {factor.label}
              </p>
              <h3>{factor.question}</h3>
              <p>{factor.body}</p>
            </div>
          ))}
        </div>
        <aside className="priority-workflow">
          <h3>보여줄 순서를 먼저 적어 봐요.</h3>
          <p>
            예를 들어 ‘무엇을 만들었는지 → 어떤 역할을 했는지 → 자세히 보기’처럼
            정해요. 그 순서가 배치·여백·크기·색상에서도 드러나는지 확인합니다.
          </p>
          <p>
            작은 화면으로 줄였을 때도 같은 우선순위가 유지되는지 살펴봐요.
            실제로 어디를 먼저 보는지는 사람에게 보여주며 확인할 수 있어요.
          </p>
          <div className="priority-related">
            <Link to="/blog/design-reference-practice">레퍼런스 관찰 연습</Link>
            <Link to="/blog/style-guide-components">
              스타일 가이드와 컴포넌트
            </Link>
          </div>
        </aside>
        <p className="priority-reference">
          원리 참고:{" "}
          <a
            href="https://www.figma.com/resource-library/what-is-visual-hierarchy/"
            target="_blank"
            rel="noreferrer"
          >
            Figma의 시각적 위계 설명
          </a>
          . 위 화면은 원리를 비교하는 예시이며 실제 시선 측정 결과는 아닙니다.
        </p>
      </LessonParts>
    </div>
  );
}
