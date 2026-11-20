import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

export default function FMSOverview({ part }: { part?: number }) {
  const id = useId();
  const [aBusy, setABusy] = useState(false);
  const [bReady, setBReady] = useState(false);
  const [assigned, setAssigned] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const robots = [
    { id: "A", battery: 70, distance: 2, state: aBusy ? "작업 중" : "대기 중" },
    {
      id: "B",
      battery: bReady ? 80 : 15,
      distance: 1,
      state: bReady ? "대기 중" : "충전 중",
    },
    { id: "C", battery: 60, distance: 3, state: "작업 중" },
  ];
  const candidate = robots
    .filter((robot) => robot.state === "대기 중" && robot.battery >= 30)
    .sort((a, b) => a.distance - b.distance)[0];
  const selected = assigned ?? candidate?.id;
  const selectedX = selected
    ? 110 + robots.findIndex((robot) => robot.id === selected) * 210
    : null;
  const resetTask = () => {
    setAssigned(null);
    setComplete(false);
  };
  const message = assigned
    ? complete
      ? `로봇 ${assigned}의 작업이 완료됐어요.`
      : `로봇 ${assigned}에게 작업을 배정했어요.`
    : candidate
      ? `로봇 ${candidate.id}에게 배정할 수 있어요.`
      : "지금 가능한 로봇이 없어 요청을 대기시켜요.";

  return (
    <div className="fms-overview">
      <LessonParts name="fms-overview" part={part}>
        <div className="fms-lab">
          <p className="eyebrow">한 개의 요청, 여러 대의 로봇</p>
          <h3>상자를 작업대로 옮겨 주세요.</h3>
          <p className="fms-rule">
            이 예시에서는 대기 중이고 배터리가 30% 이상인 로봇 중, 픽업지에서
            가장 가까운 로봇을 골라요.
          </p>
          <div
            className="fms-conditions"
            role="group"
            aria-label="로봇 상태 바꾸기"
          >
            <label>
              <input
                type="checkbox"
                checked={aBusy}
                onChange={(event) => {
                  setABusy(event.target.checked);
                  resetTask();
                }}
              />
              A도 다른 작업 중
            </label>
            <label>
              <input
                type="checkbox"
                checked={bReady}
                onChange={(event) => {
                  setBReady(event.target.checked);
                  resetTask();
                }}
              />
              B 충전 완료
            </label>
          </div>
          <svg
            className="fms-diagram"
            viewBox="0 0 640 280"
            role="img"
            aria-labelledby={`${id}-title ${id}-description`}
          >
            <title id={`${id}-title`}>FMS와 세 대의 로봇</title>
            <desc id={`${id}-description`}>
              {message} 각 로봇의 상태와 배터리를 확인하고 작업을 나누는 설명
              그림이에요.
            </desc>
            <rect
              x="220"
              y="20"
              width="200"
              height="70"
              rx="12"
              fill="var(--color-background)"
              stroke="var(--color-interactive-line)"
              strokeWidth="2"
            />
            <text
              x="320"
              y="65"
              textAnchor="middle"
              className="fms-svg-title"
              fill="var(--color-ink)"
            >
              FMS
            </text>
            {robots.map((robot, index) => (
              <path
                key={robot.id}
                d={`M320 90V130H${110 + index * 210}V175`}
                fill="none"
                stroke="var(--color-line)"
                strokeWidth="2"
              />
            ))}
            {selectedX !== null && (
              <path
                d={`M320 90V130H${selectedX}V175`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3"
              />
            )}
            {robots.map((robot, index) => (
              <g
                key={robot.id}
                transform={`translate(${110 + index * 210},205)`}
                stroke={
                  selected === robot.id
                    ? "var(--color-accent)"
                    : "var(--color-muted)"
                }
                strokeWidth="2"
                fill="var(--color-background)"
              >
                <rect x="-34" y="-17" width="10" height="32" rx="4" />
                <rect x="24" y="-17" width="10" height="32" rx="4" />
                <rect x="-26" y="-30" width="52" height="58" rx="16" />
                <circle cy="-17" r="8" />
                <path d="M-10 7h20" strokeLinecap="round" />
                <text
                  x="0"
                  y="62"
                  textAnchor="middle"
                  className="fms-svg-letter"
                  stroke="none"
                  fill="var(--color-ink)"
                >
                  {robot.id}
                </text>
              </g>
            ))}
          </svg>
          <div className="fms-robots">
            {robots.map((robot) => {
              const workingHere = assigned === robot.id && !complete;
              const reason =
                assigned === robot.id
                  ? complete
                    ? "이번 작업 완료"
                    : "이번 작업 수행 중"
                  : robot.state === "작업 중"
                    ? "다른 작업을 하고 있어요."
                    : robot.battery < 30
                      ? "충전이 먼저 필요해요."
                      : !assigned && candidate?.id === robot.id
                        ? "가장 가까운 배정 후보예요."
                        : "배정 가능한 상태예요.";
              return (
                <div
                  className="fms-robot-card"
                  key={robot.id}
                  data-selected={selected === robot.id}
                >
                  <div>
                    <h4>로봇 {robot.id}</h4>
                    <span>{workingHere ? "배정됨" : robot.state}</span>
                  </div>
                  <p>배터리 {robot.battery}%</p>
                  <div className="fms-battery" aria-hidden="true">
                    <span style={{ width: `${robot.battery}%` }} />
                  </div>
                  <p className="fms-distance">픽업지까지 {robot.distance}m</p>
                  <p className="fms-reason">{reason}</p>
                </div>
              );
            })}
          </div>
          <div className="fms-actions">
            <button
              className="fms-assign"
              type="button"
              disabled={!candidate || assigned !== null}
              onClick={() => {
                if (candidate) {
                  setAssigned(candidate.id);
                  setComplete(false);
                }
              }}
            >
              작업 배정
            </button>
            <button
              type="button"
              disabled={!assigned || complete}
              onClick={() => setComplete(true)}
            >
              완료 처리
            </button>
            <button
              type="button"
              onClick={() => {
                setABusy(false);
                setBReady(false);
                resetTask();
              }}
            >
              예시 초기화
            </button>
          </div>
          <p className="fms-status" role="status" aria-live="polite">
            {message}
          </p>
          <p className="fms-caption">
            모두 같은 상자를 옮길 수 있다는 가정의 설명 예시예요. 수치와 30%
            기준은 연습용이며 실제 운영 기준은 아닙니다. 조건을 바꾸면 요청부터
            다시 비교해요. 실제 로봇에는 연결되지 않아요.
          </p>
        </div>
        <div className="fms-explanation">
          <h3>상태를 보고, 일을 나누고, 결과를 확인해요.</h3>
          <p>
            로봇의 위치·배터리·현재 작업을 모아 봐요. 새 요청을 맡을 로봇을
            정하고, 작업이 진행되는지 끝났는지 확인해요.
          </p>
          <p>
            실제 시스템에서는 로봇이 할 수 있는 일, 예상 소요 시간, 작업
            우선순위 같은 조건도 고려할 수 있어요.
          </p>
        </div>
        <div className="fms-explanation">
          <h3>충전이나 통로 사용도 조율할 수 있어요.</h3>
          <p>
            시스템에 따라 충전 일정이나 여러 로봇이 통로를 사용하는 순서도
            관리해요. FMS마다 지원하는 기능과 연결 방식은 달라요.
          </p>
        </div>
        <aside className="fms-connection">
          <h3>Nav2와는 어떤 관계일까요?</h3>
          <p>
            FMS에서 로봇에게 목적지를 전달하고, 그 로봇의 Nav2가 이동할 경로와
            속도를 계산하도록 연결할 수 있어요. 여러 로봇의 운영과 각 로봇의
            주행이 이어지는 거예요.
          </p>
          <div className="fms-related">
            <Link to="/blog/nav2-concept-block">Nav2란?</Link>
            <Link to="/blog/task-planning-concept-block">
              Task Planning이란?
            </Link>
          </div>
        </aside>
        <p className="fms-reference">
          실제 제품의 역할 참고:{" "}
          <a
            href="https://mobile-industrial-robots.com/products/software/mir-fleet"
            target="_blank"
            rel="noreferrer"
          >
            MiR Fleet 공식 소개
          </a>
        </p>
      </LessonParts>
    </div>
  );
}
