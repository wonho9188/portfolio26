import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

const examples = [
  {
    text: "안내 데스크로 가 줘.",
    destination: "안내 데스크",
    response: "가고 싶은 곳이 분명해요. 이동 목표로 정리할 수 있어요.",
  },
  {
    text: "안내 데스크까지 이동해 줄래?",
    destination: "안내 데스크",
    response: "말투는 달라도, 이 예에서는 같은 이동 요청이에요.",
  },
  {
    text: "저기로 가 줘.",
    destination: null,
    response:
      "‘저기’가 어디인가요? 가리키는 곳을 알 수 없다면 다시 물어봐야 해요.",
  },
];

export default function NaturalLanguageOverview({ part }: { part?: number }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const example = examples[selected];
  return (
    <div className="natural-language-overview">
      <LessonParts name="natural-language-overview" part={part}>
        <div className="natural-language-lab">
          <p className="eyebrow">사람의 말에서, 요청의 뜻으로</p>
          <h3>표현을 바꿔 볼까요?</h3>
          <p className="natural-language-instruction">
            문장을 눌러 뜻을 비교해 보세요.
          </p>
          <div
            className="natural-language-examples"
            role="group"
            aria-label="자연어 문장 선택"
          >
            {examples.map((item, index) => (
              <button
                key={item.text}
                type="button"
                aria-pressed={selected === index}
                aria-controls={`${id}-result`}
                onClick={() => setSelected(index)}
              >
                <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path
                    d="M8 5h16a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H13l-7 5v-6a4 4 0 0 1-2-3V9a4 4 0 0 1 4-4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 12h12M10 17h8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{item.text}</span>
              </button>
            ))}
          </div>
          <div
            id={`${id}-result`}
            className="natural-language-result"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="natural-language-result-heading">
              <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <g
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="14" width="30" height="25" rx="8" />
                  <path d="M24 6v8M5 23v8m38-8v8M18 32h12" />
                  <circle cx="24" cy="5" r="2" />
                  <circle cx="18" cy="24" r="2" />
                  <circle cx="30" cy="24" r="2" />
                </g>
              </svg>
              <h4>요청의 뜻을 정리하면</h4>
            </div>
            <dl>
              <div>
                <dt>하고 싶은 일</dt>
                <dd>이동하기</dd>
              </div>
              <div>
                <dt>가고 싶은 곳</dt>
                <dd>{example.destination ?? "확인이 필요해요"}</dd>
              </div>
            </dl>
            <p className="natural-language-response">{example.response}</p>
          </div>
          <p className="natural-language-caption">
            미리 준비한 문장으로 표현과 뜻의 관계를 비교하는 예예요.
          </p>
        </div>
        <div className="natural-language-explanation">
          <h3>말에는 상황도 담겨 있어요.</h3>
          <p>
            친구를 가리키며 ‘저기로 가 줘’라고 하면 뜻이 통할 수 있어요. 하지만
            무엇을 가리켰는지 모르면, 문장만으로는 목적지를 정하기 어려워요.
          </p>
          <p>
            이렇게 말의 뜻을 파악할 때 함께 살피는 앞뒤 이야기와 상황을
            맥락이라고 해요.
          </p>
        </div>
        <div className="natural-language-explanation">
          <h3>자연어와 자연어 처리는 달라요.</h3>
          <p>
            자연어는 사람이 쓰는 말이에요. 컴퓨터가 그 말을 분석하거나 만들어
            내도록 다루는 분야가 자연어 처리(NLP)예요.
          </p>
        </div>
        <aside className="natural-language-connection">
          <h3>로봇에게 말로 부탁하려면?</h3>
          <p>
            먼저 요청의 뜻을 파악하고, ‘안내 데스크’가 지도에서 어디인지 찾아
            이동 목표로 바꿔요. 그다음 Nav2에 목적지까지의 이동을 맡길 수
            있어요.
          </p>
          <Link to="/blog/nav2-concept-block">Nav2란? 읽기</Link>
        </aside>
        <p className="natural-language-reference">
          함께 참고한 자료:{" "}
          <a
            href="https://aclanthology.org/2023.emnlp-main.51/"
            target="_blank"
            rel="noreferrer"
          >
            자연어의 모호성에 관한 연구
          </a>
        </p>
      </LessonParts>
    </div>
  );
}
