import { getLessonSelection } from "../data/lesson-slides";
import LessonParts from "./LessonParts";
import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "./Cards";
import { posts } from "../data/content";

const kinds = [
  {
    id: "action",
    label: "행동",
    title: "무언가를 실행하게 해요.",
    names: "버튼 · 링크",
    description:
      "버튼은 동작을 실행하고, 링크는 다른 위치로 이동해요. 모양이 비슷해도 역할과 조작 방식은 구분합니다.",
  },
  {
    id: "input",
    label: "입력과 선택",
    title: "사용자의 정보를 받아요.",
    names: "텍스트 입력 · 셀렉트 · 체크박스",
    description:
      "글을 적거나 정해진 항목을 고를 때 사용해요. 입력할 내용과 현재 선택 상태를 분명하게 보여줍니다.",
  },
  {
    id: "navigation",
    label: "탐색",
    title: "원하는 내용을 찾아가게 해요.",
    names: "탭 · 브레드크럼 · 페이지 이동",
    description:
      "탭은 같은 영역의 내용을 나누고, 브레드크럼은 현재 위치를 알려줘요. 이 예시의 탭은 페이지 이동 없이 내용만 바꿉니다.",
  },
  {
    id: "display",
    label: "정보 표시",
    title: "내용을 읽기 좋은 묶음으로 보여줘요.",
    names: "카드 · 목록 · 칩",
    description:
      "카드는 한 주제를 묶고, 목록은 여러 항목을 훑어보게 해요. 칩은 분류나 짧은 상태를 표시할 수 있어요.",
  },
  {
    id: "feedback",
    label: "피드백",
    title: "지금 어떤 상태인지 알려줘요.",
    names: "알림 · 진행 표시 · 오류 메시지",
    description:
      "처리 중인지, 끝났는지, 수정이 필요한지 알려줘요. 색상과 함께 상태 문구도 보여줍니다.",
  },
];

function NavigationExample() {
  const id = useId();
  const [tab, setTab] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = ["개요", "예시"];
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    let next = tab;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = 1 - tab;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else return;
    event.preventDefault();
    setTab(next);
    refs.current[next]?.focus();
  };
  return (
    <div className="component-navigation-example">
      <nav className="component-breadcrumb" aria-label="브레드크럼 예시">
        <Link to="/blog?topic=design">디자인</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">컴포넌트의 종류</span>
      </nav>
      <div
        className="component-demo-tabs"
        role="tablist"
        aria-label="탭 컴포넌트 예시"
        onKeyDown={keyboard}
      >
        {labels.map((label, index) => (
          <button
            type="button"
            key={label}
            ref={(node) => {
              refs.current[index] = node;
            }}
            id={`${id}-tab-${index}`}
            role="tab"
            aria-selected={tab === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={tab === index ? 0 : -1}
            onClick={() => setTab(index)}
          >
            {label}
          </button>
        ))}
      </div>
      {labels.map((label, index) => (
        <div
          key={label}
          className="component-demo-tabpanel"
          role="tabpanel"
          hidden={tab !== index}
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          tabIndex={0}
        >
          <h4>
            {index === 0
              ? "같은 자리에서 내용을 바꿔요."
              : "이 페이지의 주제 선택도 비슷해요."}
          </h4>
          <p>
            {index === 0
              ? "개요와 예시를 나누되, 현재 선택한 항목을 표시합니다."
              : "다른 내용을 고를 수 있다는 점과 지금 보고 있는 내용을 함께 알려줍니다."}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function ComponentKinds({ part }: { part?: number }) {
  const id = useId();
  const [selected, setSelected] = useState(() =>
    getLessonSelection("component-kinds", part),
  );
  const [clicks, setClicks] = useState(0);
  const [title, setTitle] = useState("컴포넌트 정리");
  const [category, setCategory] = useState("디자인");
  const [important, setImportant] = useState(false);
  const [step, setStep] = useState(0);
  const kind = kinds[selected];
  const examplePost = posts.find((post) => post.slug === "design-trends");
  const feedback = [
    "안내 · 다음 단계를 눌러 상태를 살펴보세요.",
    "진행 중 · 예시 내용을 확인하고 있어요.",
    "완료 · 예시 확인이 끝났어요.",
  ];
  return (
    <div className="component-kinds">
      <LessonParts name="component-kinds" part={part}>
        <p className="eyebrow">COMPONENTS / 역할로 나누기</p>
        <h3>사용자가 무엇을 하게 될까요?</h3>
        <p className="component-kinds-intro">
          역할을 골라 대표 예시를 조작해 보세요.
        </p>
        <div
          className="component-kind-options"
          role="group"
          aria-label="컴포넌트 역할 선택"
        >
          {kinds.map((item, index) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={selected === index}
              aria-controls={`${id}-demo`}
              onClick={() => setSelected(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="component-kind-explanation">
          <p className="eyebrow">
            0{selected + 1} / {kind.names}
          </p>
          <h3>{kind.title}</h3>
          <p>{kind.description}</p>
        </div>
        <div className="component-kind-demo" id={`${id}-demo`}>
          {kind.id === "action" && (
            <>
              <div className="component-kind-actions">
                <button
                  type="button"
                  className="component-kind-primary"
                  onClick={() => setClicks((count) => count + 1)}
                >
                  예시 동작
                </button>
                <button type="button" disabled>
                  준비 중
                </button>
                <Link
                  className="component-kind-link"
                  to="/blog/style-guide-components"
                >
                  스타일 가이드로 이동
                </Link>
              </div>
              <p
                className="component-kind-status"
                role="status"
                aria-live="polite"
              >
                버튼을 {clicks}회 눌렀어요.
              </p>
              <p className="component-kind-help">
                ‘준비 중’은 지금 선택할 수 없는 버튼 상태의 예시예요.
              </p>
            </>
          )}
          {kind.id === "input" && (
            <>
              <div className="component-input-fields">
                <div>
                  <label htmlFor={`${id}-title`}>예시 제목</label>
                  <input
                    id={`${id}-title`}
                    value={title}
                    maxLength={40}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={`${id}-category`}>분류 선택</label>
                  <select
                    id={`${id}-category`}
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option>디자인</option>
                    <option>로보틱스</option>
                  </select>
                </div>
                <label className="component-checkbox">
                  <input
                    type="checkbox"
                    checked={important}
                    onChange={(event) => setImportant(event.target.checked)}
                  />
                  중요한 메모로 표시
                </label>
              </div>
              <div className="component-input-preview" aria-live="polite">
                <span className="award-chip">{category}</span>
                {important && <span className="award-chip">중요</span>}
                <h4>{title || "제목을 입력해 보세요."}</h4>
              </div>
              <p className="component-kind-help">
                입력한 내용은 현재 화면의 예시에만 적용돼요.
              </p>
            </>
          )}
          {kind.id === "navigation" && <NavigationExample />}
          {kind.id === "display" && (
            <>
              <div className="component-kind-chips">
                <span className="award-chip">디자인</span>
                <span className="award-chip">기록</span>
              </div>
              {examplePost && (
                <div className="component-kind-card">
                  <PostCard post={examplePost} />
                </div>
              )}
              <p className="component-kind-help">
                사이트의 공통 글 카드예요. 제목을 누르면 해당 글로 이동해요. 위
                칩은 분류를 표시하며 클릭 기능은 없어요.
              </p>
            </>
          )}
          {kind.id === "feedback" && (
            <>
              <label
                className="component-progress-label"
                htmlFor={`${id}-progress`}
              >
                진행 단계 · {step} / 2
              </label>
              <progress id={`${id}-progress`} max={2} value={step} />
              <div
                className="component-inline-notice"
                role="status"
                aria-live="polite"
              >
                <span aria-hidden="true">{step === 2 ? "✓" : "i"}</span>
                <p>{feedback[step]}</p>
              </div>
              <div className="component-kind-actions">
                <button
                  type="button"
                  className="component-kind-primary"
                  disabled={step === 2}
                  onClick={() => setStep((current) => Math.min(current + 1, 2))}
                >
                  다음 단계
                </button>
                <button type="button" onClick={() => setStep(0)}>
                  처음으로
                </button>
              </div>
              <p className="component-kind-help">
                진행 상태를 단계별로 보여주는 예시예요. 실제 요청을 보내지는
                않아요.
              </p>
            </>
          )}
        </div>
        <div className="component-kind-summary">
          <h3>작은 요소가 모여 하나의 화면이 돼요.</h3>
          <p>
            글을 적는 입력창, 확인하는 버튼, 결과를 알려주는 메시지를 조합하면
            하나의 입력 화면이 됩니다. 같은 요소도 위치와 문구, 상태에 따라
            쓰임이 달라져요.
          </p>
          <p>
            이 글에서는 이해를 돕기 위해 다섯 역할로 나눴습니다. 디자인
            시스템마다 이름과 분류는 다를 수 있어요.
          </p>
          <Link to="/blog/style-guide-components">
            스타일 가이드와 컴포넌트 읽기
          </Link>
        </div>
      </LessonParts>
    </div>
  );
}
