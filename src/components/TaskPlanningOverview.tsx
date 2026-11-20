import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

const actions = {
  pick: {
    title: "컵 집기",
    detail: "컵 가까이에 있고, 손이 비어 있어야 해요.",
  },
  move: { title: "선반 앞으로 이동", detail: "컵을 든 채 선반으로 이동해요." },
  place: {
    title: "선반에 컵 놓기",
    detail: "선반 가까이에 있고, 컵을 들고 있어야 해요.",
  },
};
type Action = keyof typeof actions;

export default function TaskPlanningOverview({ part }: { part?: number }) {
  const id = useId();
  const [holdingAtStart, setHoldingAtStart] = useState(false);
  const [completed, setCompleted] = useState(0);
  const plan: Action[] = holdingAtStart
    ? ["move", "place"]
    : ["pick", "move", "place"];
  const done = plan.slice(0, completed);
  const moved = done.includes("move");
  const placed = done.includes("place");
  const holding = !placed && (holdingAtStart || done.includes("pick"));
  const robotX = moved ? 280 : 180;
  const cupX = placed ? 390 : holding ? robotX : 100;
  const cupY = holding ? 130 : 105;
  const cupLocation = placed ? "선반 위" : holding ? "로봇 손" : "탁자 위";

  return (
    <div className="task-planning-overview">
      <LessonParts name="task-planning-overview" part={part}>
        <div className="task-planning-lab">
          <p className="eyebrow">큰 목표를, 작은 작업으로</p>
          <h3>목표: 컵을 선반에 놓기</h3>
          <p className="task-planning-instruction">
            처음 상태를 바꾸면 필요한 작업도 달라져요.
          </p>
          <div
            className="task-planning-start"
            role="group"
            aria-label="컵의 처음 상태 선택"
          >
            <button
              type="button"
              aria-pressed={!holdingAtStart}
              onClick={() => {
                setHoldingAtStart(false);
                setCompleted(0);
              }}
            >
              컵이 탁자 위에 있어요
            </button>
            <button
              type="button"
              aria-pressed={holdingAtStart}
              onClick={() => {
                setHoldingAtStart(true);
                setCompleted(0);
              }}
            >
              컵을 이미 들고 있어요
            </button>
          </div>
          <svg
            className="task-planning-scene"
            viewBox="0 0 480 220"
            role="img"
            aria-labelledby={`${id}-title ${id}-description`}
          >
            <title id={`${id}-title`}>컵을 탁자에서 선반으로 옮기는 작업</title>
            <desc id={`${id}-description`}>
              로봇은 {moved ? "선반" : "탁자"} 앞에 있고, 컵은 {cupLocation}에
              있어요.
            </desc>
            <path
              d="M20 195H460"
              stroke="var(--color-line)"
              strokeWidth="1.5"
            />
            <g
              fill="var(--color-raised)"
              stroke="var(--color-muted)"
              strokeWidth="2"
            >
              <rect x="45" y="105" width="110" height="12" rx="4" />
              <path
                d="M57 117v78m86-78v78M340 195V66h100v129M340 105h100m-100 48h100"
                fill="none"
              />
            </g>
            <path
              d="M195 166h70"
              stroke="var(--color-muted)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            <g
              transform={`translate(${robotX},165)`}
              stroke="var(--color-accent)"
              strokeWidth="1.6"
              fill="var(--color-surface)"
            >
              <rect x="-23" y="-10" width="9" height="26" rx="3" />
              <rect x="14" y="-10" width="9" height="26" rx="3" />
              <rect x="-16" y="-18" width="32" height="38" rx="10" />
              <circle cy="-4" r="6" />
              {holding && <path d="M0-18v-15" fill="none" />}
            </g>
            <g
              transform={`translate(${cupX},${cupY})`}
              fill="var(--color-surface)"
              stroke="var(--color-accent)"
              strokeWidth="2"
            >
              <path d="M-13-24h26v17a7 7 0 0 1-7 7H-6a7 7 0 0 1-7-7Z" />
              <path d="M13-20h5a6 6 0 0 1 0 12h-5" fill="none" />
            </g>
            <g
              className="task-planning-svg-label"
              fill="var(--color-muted)"
              textAnchor="middle"
            >
              <text x="100" y="218">
                탁자
              </text>
              <text x="390" y="218">
                선반
              </text>
            </g>
          </svg>
          <ol className="task-planning-plan" aria-label="목표를 위한 작업 순서">
            {plan.map((action, index) => (
              <li
                key={action}
                className={
                  index < completed
                    ? "is-done"
                    : index === completed
                      ? "is-next"
                      : ""
                }
              >
                <span className="task-planning-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4>{actions[action].title}</h4>
                  <p>{actions[action].detail}</p>
                </div>
                <span className="task-planning-badge">
                  {index < completed
                    ? "완료"
                    : index === completed
                      ? "다음"
                      : "대기"}
                </span>
              </li>
            ))}
          </ol>
          <div className="task-planning-controls">
            <button
              className="task-planning-advance"
              type="button"
              disabled={completed === plan.length}
              onClick={() =>
                setCompleted((count) => Math.min(count + 1, plan.length))
              }
            >
              다음 작업 확인
            </button>
            <button type="button" onClick={() => setCompleted(0)}>
              처음 상태로
            </button>
          </div>
          <div
            className="task-planning-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <p>
              {placed
                ? "목표 달성! 컵이 선반에 있어요."
                : `${completed} / ${plan.length}개 작업 확인`}
            </p>
            <dl>
              <div>
                <dt>로봇 위치</dt>
                <dd>{moved ? "선반 앞" : "탁자 앞"}</dd>
              </div>
              <div>
                <dt>컵 위치</dt>
                <dd>{cupLocation}</dd>
              </div>
            </dl>
          </div>
          <p className="task-planning-caption">
            로봇이 탁자 앞에서 시작하는 설명 예시예요. 미리 정한 조건과 작업으로
            순서를 비교하며, 실제 로봇을 움직이지 않아요.
          </p>
        </div>
        <div className="task-planning-explanation">
          <h3>아무 순서로나 할 수는 없어요.</h3>
          <p>
            컵을 들지 않았는데 선반에 놓을 수는 없어요. 작업 계획은 지금 할 수
            있는 일과, 그 일을 한 뒤 달라질 상태를 함께 살펴요.
          </p>
          <p>
            이미 컵을 들고 있다면 ‘컵 집기’는 필요 없겠죠? 같은 목표라도 처음
            상태에 따라 계획이 달라져요.
          </p>
        </div>
        <div className="task-planning-explanation">
          <h3>작업 계획과 움직임 계획은 달라요.</h3>
          <p>
            Task Planning은 ‘집고 → 이동하고 → 놓자’처럼 어떤 일을 어떤 순서로
            할지 정해요. 움직임 계획은 그 작업을 위해 로봇이 실제로 지나갈 길과
            자세를 구해요.
          </p>
        </div>
        <aside className="task-planning-connection">
          <h3>LLM, Nav2, MoveIt과 연결하면?</h3>
          <p>
            LLM으로 사람의 요청을 목표로 정리할 수 있어요. 작업 계획에서 필요한
            순서를 정한 뒤, 주행은 Nav2에, 로봇팔의 움직임 계획은 MoveIt에 맡길
            수 있어요.
          </p>
          <p>
            Task Planning은 특정 앱 이름이 아니에요. LLM을 쓰지 않고도 작업
            계획을 만들 수 있어요.
          </p>
          <div className="task-planning-related">
            <Link to="/blog/llm-concept-block">LLM이란?</Link>
            <Link to="/blog/nav2-concept-block">Nav2란?</Link>
            <Link to="/blog/moveit-concept-block">MoveIt이란?</Link>
          </div>
        </aside>
      </LessonParts>
    </div>
  );
}
