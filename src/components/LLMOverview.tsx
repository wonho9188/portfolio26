import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

const examples = [
  {
    prompt: "손님을 안내해 줘.",
    pieces: ["안내를", "위해", "안내 데스크로", "이동할게요."],
  },
  {
    prompt: "로봇의 배터리가 부족해.",
    pieces: ["충전을", "위해", "충전소로", "이동할게요."],
  },
];

export default function LLMOverview({ part }: { part?: number }) {
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);
  const id = useId();
  const example = examples[selected];
  const complete = count === example.pieces.length;
  return (
    <div className="llm-overview">
      <LessonParts name="llm-overview" part={part}>
        <div className="llm-lab">
          <p className="eyebrow">앞의 내용을 보고, 다음 조각으로</p>
          <h3>답변이 조금씩 만들어져요.</h3>
          <p className="llm-instruction">
            요청을 고르고, 답변 조각을 붙여 보세요.
          </p>
          <div
            className="llm-prompts"
            role="group"
            aria-label="LLM 설명 예시 선택"
          >
            {examples.map((item, index) => (
              <button
                key={item.prompt}
                type="button"
                aria-pressed={selected === index}
                aria-controls={`${id}-answer`}
                onClick={() => {
                  setSelected(index);
                  setCount(0);
                }}
              >
                {item.prompt}
              </button>
            ))}
          </div>
          <div className="llm-answer" id={`${id}-answer`}>
            <div className="llm-answer-heading">
              <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <g
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="30" height="30" rx="8" />
                  <path d="M17 18h14M17 24h10M17 30h6M5 18H2m3 12H2m41-12h3m-3 12h3M18 5V2m12 3V2M18 43v3m12-3v3" />
                </g>
              </svg>
              <h4>이어 붙이는 답변</h4>
              <span className="llm-count">
                {count} / {example.pieces.length}
              </span>
            </div>
            <div
              className="llm-output"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {count === 0 ? (
                <span className="llm-placeholder">
                  아직 답변을 만들기 전이에요.
                </span>
              ) : (
                example.pieces.slice(0, count).map((piece, index) => (
                  <span
                    className={
                      index === count - 1 ? "llm-piece is-latest" : "llm-piece"
                    }
                    key={`${selected}-${index}`}
                  >
                    {piece}
                  </span>
                ))
              )}
            </div>
            <div className="llm-controls">
              <button
                className="llm-add"
                type="button"
                disabled={complete}
                onClick={() =>
                  setCount((current) =>
                    Math.min(current + 1, example.pieces.length),
                  )
                }
              >
                다음 조각 붙이기
              </button>
              <button type="button" onClick={() => setCount(0)}>
                처음부터 보기
              </button>
            </div>
          </div>
          <p className="llm-caption">
            준비된 문장을 크게 나누어 펼치는 설명 예시예요. 실제 LLM을
            실행하거나 토큰을 분석한 결과는 아니에요.
          </p>
        </div>
        <div className="llm-explanation">
          <h3>실제로는 ‘토큰’ 단위로 다뤄요.</h3>
          <p>
            토큰은 모델이 글을 다루는 작은 조각이에요. 단어 하나일 수도, 단어의
            일부나 문장 부호일 수도 있어요.
          </p>
          <p>
            대화형 LLM은 보통 앞의 내용을 바탕으로 다음 토큰을 예측하고 골라요.
            이 과정을 반복하며 답변을 이어 가요.
          </p>
        </div>
        <div className="llm-explanation">
          <h3>자연스러운 답변도 틀릴 수 있어요.</h3>
          <p>
            글을 자연스럽게 만드는 것과 사실을 정확하게 말하는 것은 달라요.
            그럴듯한 답변에도 오류가 있을 수 있어 중요한 내용은 자료와 비교해
            확인해요.
          </p>
        </div>
        <aside className="llm-connection">
          <h3>로봇에서는 어떤 역할을 할까요?</h3>
          <p>
            LLM으로 ‘손님을 안내해 줘’라는 요청에서 할 일과 목적지를 정리할 수
            있어요. 프로그램이 목적지를 지도상의 위치로 바꾸고 실행 가능한지
            확인한 뒤, Nav2에 이동을 맡길 수 있어요.
          </p>
          <p>말을 다루는 역할과 실제 이동을 계산하는 역할이 연결되는 거예요.</p>
          <div className="llm-related">
            <Link to="/blog/natural-language-concept-block">자연어란?</Link>
            <Link to="/blog/nav2-concept-block">Nav2란?</Link>
          </div>
        </aside>
        <p className="llm-reference">
          함께 참고한 자료:{" "}
          <a
            href="https://learn.microsoft.com/en-us/agent-framework/journey/llm-fundamentals"
            target="_blank"
            rel="noreferrer"
          >
            Microsoft Learn의 토큰·답변 생성 설명
          </a>
        </p>
      </LessonParts>
    </div>
  );
}
