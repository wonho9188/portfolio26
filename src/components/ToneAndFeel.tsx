import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

const tones = [
  {
    label: "차분·정확",
    copy: "작업 기록을 소개합니다. 설계와 구현의 과정을 정리했습니다.",
    action: "프로젝트 살펴보기",
  },
  {
    label: "친근·부드러움",
    copy: "이런 작업을 해왔어요. 만드는 과정에서 고민한 것도 함께 나눌게요.",
    action: "함께 살펴볼까요?",
  },
  {
    label: "대담·명료",
    copy: "아이디어를 작동하는 결과로. 만든 과정과 선택의 이유를 확인하세요.",
    action: "작업 확인하기",
  },
];
const looks = [
  {
    id: "calm",
    label: "정돈된 선",
    note: "절제한 색상, 명확한 테두리, 단정한 글자",
  },
  {
    id: "soft",
    label: "부드러운 면",
    note: "따뜻한 밝은 면, 둥근 모서리, 여유 있는 간격",
  },
  {
    id: "bold",
    label: "따뜻한 대비",
    note: "짙은 적갈색, 밝은 글자, 선명한 조작 영역",
  },
];

export default function ToneAndFeel({ part }: { part?: number }) {
  const [tone, setTone] = useState(0);
  const [look, setLook] = useState(0);
  const id = useId();
  return (
    <div className="tone-and-feel">
      <LessonParts name="tone-and-feel" part={part}>
        <div className="tone-feel-definitions">
          <div>
            <p className="eyebrow">TONE & MANNER</p>
            <h3>어떤 태도로 표현할까요?</h3>
            <p>
              브랜드가 드러내려는 태도와 표현의 방향이에요. 문구의 말투,
              이미지의 분위기, 표현 원칙을 함께 생각해요.
            </p>
          </div>
          <div>
            <p className="eyebrow">LOOK & FEEL</p>
            <h3>어떻게 보이고 반응할까요?</h3>
            <p>
              화면을 보고 조작하며 느끼는 전체 인상이에요.
              색·폰트·여백·형태·움직임이 함께 만들어요.
            </p>
          </div>
        </div>
        <p className="tone-feel-scope">
          실무에서는 두 용어를 겹쳐 쓰기도 해요. 여기서는 표현의 방향과 화면에서
          경험하는 결과로 나눠 살펴봅니다.
        </p>
        <div className="tone-feel-lab">
          <h3>말투와 화면 표현을 바꿔 보세요.</h3>
          <p className="tone-feel-instruction">
            전달하는 내용은 프로젝트 소개, 동작은 작업 목록으로 이동입니다.
          </p>
          <fieldset className="tone-feel-controls">
            <legend>말투 비교</legend>
            <div>
              {tones.map((item, index) => (
                <button
                  type="button"
                  key={item.label}
                  aria-pressed={tone === index}
                  aria-controls={`${id}-preview`}
                  onClick={() => setTone(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="tone-feel-controls">
            <legend>화면 표현 비교</legend>
            <div>
              {looks.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={look === index}
                  aria-controls={`${id}-preview`}
                  onClick={() => setLook(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
          <figure className="tone-feel-example">
            <div
              className="tone-feel-preview"
              id={`${id}-preview`}
              data-look={looks[look].id}
            >
              <span className="tone-feel-preview-label">WORK NOTES / 2026</span>
              <h4>프로젝트 기록</h4>
              <p className="tone-feel-preview-copy">{tones[tone].copy}</p>
              <Link className="tone-feel-preview-link" to="/work">
                {tones[tone].action}
              </Link>
              <span className="tone-feel-preview-footer">
                선택의 이유를 기록합니다.
              </span>
            </div>
            <figcaption>
              설명을 위해 직접 구성한 예시입니다. 선택은 미리보기에만 적용되며
              사이트 전체 테마는 바꾸지 않습니다.
            </figcaption>
          </figure>
          <div
            className="tone-feel-selection"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <p>말투 · {tones[tone].label}</p>
            <p>화면 · {looks[look].label}</p>
            <span>{looks[look].note}</span>
          </div>
          <button
            className="tone-feel-reset"
            type="button"
            onClick={() => {
              setTone(0);
              setLook(0);
            }}
          >
            조합 초기화
          </button>
        </div>
        <div className="tone-feel-workflow">
          <h3>원하는 인상을 구체적인 규칙으로 바꿔요.</h3>
          <ol>
            <li>
              <span aria-hidden="true">01</span>
              <div>
                <h4>인상 키워드 정하기</h4>
                <p>
                  ‘따뜻함·정확함·절제’처럼 표현하고 싶은 태도를 짧게 적어요.
                </p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">02</span>
              <div>
                <h4>화면과 문구로 연결하기</h4>
                <p>
                  키워드에 맞는 색상·글자·여백과 버튼 문구를 함께 정해요. 말투와
                  시각 표현이 서로 어울리는지 살펴봐요.
                </p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">03</span>
              <div>
                <h4>다른 상황에도 적용해 보기</h4>
                <p>
                  소개 화면부터 로딩·오류 안내까지 일관된 태도가 느껴지는지
                  확인해요. 상황에 맞게 말투를 조절하면서 필요한 정보는 분명하게
                  전해요.
                </p>
              </div>
            </li>
          </ol>
        </div>
        <aside className="tone-feel-closing">
          <h3>일관된 경험은 여러 요소가 함께 만들어요.</h3>
          <p>
            색상만 맞춰도 문구나 조작 방식이 달라지면 인상이 달라질 수 있어요.
            정한 방향을 스타일 가이드와 컴포넌트의 상태·문구에 함께 기록해요.
          </p>
          <div className="tone-feel-related">
            <Link to="/blog/style-guide-components">
              스타일 가이드와 컴포넌트
            </Link>
            <Link to="/blog/visual-priority">시각적 우선순위</Link>
          </div>
        </aside>
        <p className="tone-feel-source">
          시각·문구 규칙 참고:{" "}
          <a
            href="https://www.figma.com/resource-library/what-is-a-style-guide/"
            target="_blank"
            rel="noreferrer"
          >
            Figma의 브랜드 스타일 가이드 설명
          </a>
          . 위 세 가지 말투와 화면 조합은 이 글에서 만든 예시입니다.
        </p>
      </LessonParts>
    </div>
  );
}
