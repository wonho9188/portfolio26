import { getLessonSelection } from "../data/lesson-slides";
import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

const lenses = [
  {
    id: "hierarchy",
    label: "크기·위계",
    question: "무엇을 가장 먼저 읽게 되나요?",
    note: "제목의 크기와 무게를 달리하면, 같은 문구에도 읽는 우선순위가 생겨요.",
  },
  {
    id: "spacing",
    label: "여백",
    question: "어떤 정보가 한 묶음으로 보이나요?",
    note: "관련된 정보는 가까이, 다른 묶음은 멀리 두었는지 살펴봐요. 바깥 여백과 글 사이 간격을 함께 비교해요.",
  },
  {
    id: "alignment",
    label: "정렬",
    question: "눈이 따라갈 기준선이 일정한가요?",
    note: "글이 시작하는 선을 맞추면 시선이 이동할 기준이 생겨요. 가운데 정렬도 목적에 맞게 일관되게 사용해요.",
  },
];

function ExampleContent() {
  return (
    <>
      <span className="reference-demo-category">FIELD NOTES / 01</span>
      <h4>로봇의 움직임을 기록하다</h4>
      <p>작동한 결과와 설계의 이유를 함께 정리합니다.</p>
      <span className="reference-demo-meta">설계와 경험의 기록</span>
    </>
  );
}

export default function ReferencePractice({ part }: { part?: number }) {
  const [selected, setSelected] = useState(() =>
    getLessonSelection("reference-practice", part),
  );
  const id = useId();
  const lens = lenses[selected];
  return (
    <div className="reference-practice">
      <LessonParts name="reference-practice" part={part}>
        <p className="eyebrow">보기 → 관찰 → 기록 → 적용</p>
        <h3>한 번에 한 가지를 비교해요.</h3>
        <p className="reference-practice-intro">
          레퍼런스의 색이나 사진이 달라도, 크기·간격·정렬처럼 비교할 기준을
          정하면 차이를 설명하기 쉬워져요.
        </p>
        <div
          className="reference-lenses"
          role="group"
          aria-label="레퍼런스 관찰 기준 선택"
        >
          {lenses.map((item, index) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={selected === index}
              aria-controls={`${id}-comparison`}
              onClick={() => setSelected(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          className={`reference-comparison lens-${lens.id}`}
          id={`${id}-comparison`}
        >
          <figure>
            <figcaption>비교 A · 바꾸기 전</figcaption>
            <div className="reference-demo before">
              <ExampleContent />
            </div>
          </figure>
          <figure>
            <figcaption>비교 B · 기준을 적용한 예</figcaption>
            <div className="reference-demo after">
              <ExampleContent />
            </div>
          </figure>
        </div>
        <div
          className="reference-observation"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <h4>{lens.question}</h4>
          <p>{lens.note}</p>
        </div>
        <p className="reference-example-caption">
          같은 문구로 직접 만든 비교 예시예요. 위계·여백·정렬을 바꿨을 때의
          차이를 관찰해 보세요.
        </p>
        <div className="reference-routine">
          <h3>자주 보기 위한 작은 연습 순서</h3>
          <ol>
            <li>
              <span aria-hidden="true">01</span>
              <div>
                <h4>목적이 비슷한 화면 하나 고르기</h4>
                <p>
                  프로젝트를 소개하려면 소개 화면을, 많은 글을 보여주려면 목록
                  화면을 찾아봐요. 실제 서비스에서 작은 화면과 조작 상태도 함께
                  살펴봐요.
                </p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">02</span>
              <div>
                <h4>오늘 볼 기준 하나 정하기</h4>
                <p>
                  제목과 본문의 크기 차이, 카드 안쪽 여백, 정렬선 중 하나를 골라
                  비교해요.
                </p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">03</span>
              <div>
                <h4>좋은 이유를 한 문장으로 남기기</h4>
                <p>
                  화면의 주소와 캡처, 관찰한 이유를 함께 모아요. 나중에 어떤
                  판단을 참고할지 찾기 쉬워져요.
                </p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">04</span>
              <div>
                <h4>내 콘텐츠로 작게 시험하기</h4>
                <p>
                  관찰한 원리를 내 제목과 문장에 적용해요. 원래 화면과 비교하며
                  읽는 순서가 달라졌는지 확인해요.
                </p>
              </div>
            </li>
          </ol>
        </div>
        <blockquote className="reference-note-example">
          <p className="eyebrow">관찰 메모 예시</p>
          <p>“큰 제목 주위에 여백이 넓어서, 소개 문구를 먼저 읽게 된다.”</p>
        </blockquote>
        <aside className="reference-closing">
          <h3>내가 다시 꺼내 볼 수 있는 기준으로 모아요.</h3>
          <p>
            ‘제목이 잘 보이는 화면’, ‘긴 글을 읽기 편한 화면’처럼 이유로 분류해
            보세요. 짧게라도 반복해서 보고, 관찰한 것 하나를 직접 써보는 연습을
            제안합니다.
          </p>
          <div className="reference-related">
            <Link to="/blog/design-trends">디자인 트렌드</Link>
            <Link to="/blog/style-guide-components">
              스타일 가이드와 컴포넌트
            </Link>
          </div>
        </aside>
        <p className="reference-sources">
          관찰 기준 참고:{" "}
          <a
            href="https://www.nngroup.com/articles/principles-visual-design/"
            target="_blank"
            rel="noreferrer"
          >
            NN/g의 시각 디자인 원칙
          </a>{" "}
          ·{" "}
          <a
            href="https://www.figma.com/resource-library/what-is-visual-hierarchy/"
            target="_blank"
            rel="noreferrer"
          >
            Figma의 시각적 위계 설명
          </a>
          . 연습 순서와 비교 예시는 이 글에서 제안한 방법입니다.
        </p>
      </LessonParts>
    </div>
  );
}
