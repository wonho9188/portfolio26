import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

type Cell = { x: number; y: number };
const start: Cell = { x: 1, y: 5 };
const goals = [
  { name: "안내 데스크", cell: { x: 10, y: 1 }, symbol: "A" },
  { name: "충전소", cell: { x: 10, y: 6 }, symbol: "B" },
];
const obstacles: Cell[] = [
  ...Array.from({ length: 8 }, (_, index) => ({
    x: 5 + (index % 2),
    y: 2 + Math.floor(index / 2),
  })),
  { x: 9, y: 4 },
  { x: 9, y: 5 },
];
const cellKey = (cell: Cell) => `${cell.x},${cell.y}`;
const center = (cell: Cell) => ({ x: 40 + cell.x * 40, y: 40 + cell.y * 40 });

// A tiny grid search for this teaching diagram, independent of Nav2 / ROS.
function findExamplePath(goal: Cell, blocked: Cell[]): Cell[] {
  const occupied = new Set(blocked.map(cellKey));
  const queue: Cell[][] = [[start]];
  const visited = new Set([cellKey(start)]);
  for (let index = 0; index < queue.length; index++) {
    const path = queue[index];
    const last = path[path.length - 1];
    if (cellKey(last) === cellKey(goal)) return path;
    for (const [dx, dy] of [
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, 0],
    ]) {
      const next = { x: last.x + dx, y: last.y + dy };
      const key = cellKey(next);
      if (
        next.x < 0 ||
        next.x >= 12 ||
        next.y < 0 ||
        next.y >= 8 ||
        occupied.has(key) ||
        visited.has(key)
      )
        continue;
      visited.add(key);
      queue.push([...path, next]);
    }
  }
  return [];
}

export default function Nav2Overview({ part }: { part?: number }) {
  const id = useId();
  const [destination, setDestination] = useState(0);
  const [extraObstacle, setExtraObstacle] = useState(false);
  const [step, setStep] = useState(0);
  const blocked = extraObstacle ? [...obstacles, { x: 3, y: 5 }] : obstacles;
  const path = findExamplePath(goals[destination].cell, blocked);
  const currentStep = Math.min(step, Math.max(0, path.length - 1));
  const position = center(path[currentStep] ?? start);
  const arrived = path.length > 0 && currentStep === path.length - 1;

  return (
    <div className="nav2-overview">
      <LessonParts name="nav2-overview" part={part}>
        <div className="nav2-lab">
          <p className="eyebrow">목적지까지, 길을 찾아서</p>
          <h3>로봇을 어디로 보낼까요?</h3>
          <div
            className="nav2-destinations"
            role="group"
            aria-label="목적지 선택"
          >
            {goals.map((goal, index) => (
              <button
                type="button"
                key={goal.name}
                aria-pressed={destination === index}
                onClick={() => {
                  setDestination(index);
                  setStep(0);
                }}
              >
                {goal.symbol} · {goal.name}
              </button>
            ))}
          </div>
          <svg
            className="nav2-map"
            viewBox="0 0 520 360"
            role="img"
            aria-labelledby={`${id}-title ${id}-description`}
          >
            <title id={`${id}-title`}>
              {goals[destination].name}까지의 설명용 경로
            </title>
            <desc id={`${id}-description`}>
              격자 위의 로봇이 벽과 장애물을 피해 목적지로 가는 예예요. 목적지를
              선택하거나 장애물을 추가하면 출발점에서 경로를 다시 찾아요.
            </desc>
            <defs>
              <pattern
                id={`${id}-grid`}
                width="40"
                height="40"
                x="20"
                y="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0H0V40"
                  fill="none"
                  stroke="var(--color-line)"
                  strokeWidth="0.8"
                />
              </pattern>
            </defs>
            <rect
              x="20"
              y="20"
              width="480"
              height="320"
              rx="8"
              fill={`url(#${id}-grid)`}
              stroke="var(--color-muted)"
            />
            {blocked.map((cell) => (
              <rect
                key={cellKey(cell)}
                x={20 + cell.x * 40}
                y={20 + cell.y * 40}
                width="40"
                height="40"
                rx="4"
                fill="var(--color-raised)"
                stroke="var(--color-muted)"
                strokeWidth="1.5"
              />
            ))}
            <polyline
              className="nav2-route"
              points={path
                .map((cell) => {
                  const point = center(cell);
                  return `${point.x},${point.y}`;
                })
                .join(" ")}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 9"
            />
            {goals.map((goal, index) => {
              const point = center(goal.cell);
              return (
                <g key={goal.name} opacity={destination === index ? 1 : 0.45}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="19"
                    fill="var(--color-surface)"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                  />
                  <text
                    x={point.x}
                    y={point.y + 8}
                    textAnchor="middle"
                    fill="var(--color-accent)"
                    className="nav2-map-symbol"
                  >
                    {goal.symbol}
                  </text>
                </g>
              );
            })}
            <g transform={`translate(${position.x},${position.y})`}>
              <circle r="23" fill="var(--color-accent)" opacity="0.12" />
              <rect
                x="-18"
                y="-10"
                width="7"
                height="20"
                rx="3"
                fill="var(--color-muted)"
              />
              <rect
                x="11"
                y="-10"
                width="7"
                height="20"
                rx="3"
                fill="var(--color-muted)"
              />
              <rect
                x="-13"
                y="-15"
                width="26"
                height="30"
                rx="9"
                fill="var(--color-surface)"
                stroke="var(--color-accent)"
                strokeWidth="2"
              />
              <circle r="5" fill="var(--color-accent)" />
            </g>
          </svg>
          <div className="nav2-map-key">
            <span>점선 · 이동할 길</span>
            <span>네모 · 벽과 장애물</span>
          </div>
          <div className="nav2-controls">
            <button
              type="button"
              className="nav2-step"
              disabled={arrived || !path.length}
              onClick={() => setStep(currentStep + 1)}
            >
              한 칸 이동
            </button>
            <button
              type="button"
              aria-pressed={extraObstacle}
              onClick={() => {
                setExtraObstacle(!extraObstacle);
                setStep(0);
              }}
            >
              {extraObstacle ? "추가한 장애물 치우기" : "장애물 추가"}
            </button>
            <button type="button" onClick={() => setStep(0)}>
              출발점으로
            </button>
          </div>
          <p
            className="nav2-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {arrived
              ? `${goals[destination].name}에 도착했어요.`
              : !path.length
                ? "이동할 수 있는 길이 없어요."
                : currentStep > 0
                  ? `${goals[destination].name}로 이동 중이에요. (${currentStep} / ${path.length - 1}칸)`
                  : `${goals[destination].name}까지 ${extraObstacle ? "추가된 장애물을 피해 " : ""}길을 찾았어요.`}
          </p>
          <p className="nav2-caption">
            Nav2의 역할을 설명하는 격자 예시예요. 목적지나 장애물을 바꾸면
            출발점부터 다시 살펴봐요.
          </p>
        </div>
        <div className="nav2-explanation">
          <h3>목적지를 주면, 이동할 방법을 구해요.</h3>
          <ol className="nav2-steps">
            <li>
              <span aria-hidden="true">01</span>
              <div>
                <h4>내 위치와 주변을 살펴요.</h4>
                <p>현재 위치와 지도, 센서로 확인한 장애물 정보를 이용해요.</p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">02</span>
              <div>
                <h4>지나갈 길을 찾아요.</h4>
                <p>플래너(Planner)가 목적지까지 갈 경로를 계산해요.</p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">03</span>
              <div>
                <h4>길을 따라 움직이게 해요.</h4>
                <p>
                  컨트롤러(Controller)가 전진 속도와 회전 속도를 구해 로봇의
                  구동 제어 쪽으로 보내요.
                </p>
              </div>
            </li>
          </ol>
          <p>
            주변 상황이 달라지면 경로를 다시 찾거나, 속도를 바꾸고 멈추는 동작을
            할 수 있어요.
          </p>
        </div>
        <aside className="nav2-connection">
          <h3>MoveIt과는 무엇이 다를까요?</h3>
          <p>
            여기서 배우는 로봇팔의 움직임 계획은 MoveIt 2, 주행 로봇이 목적지로
            이동하는 일은 Nav2가 맡아요. 둘 다 ROS 2와 함께 사용할 수 있어요.
          </p>
          <div className="nav2-related">
            <Link to="/blog/ros2-concept-block">ROS 2란?</Link>
            <Link to="/blog/lidar-concept-block">LiDAR란?</Link>
            <Link to="/blog/moveit-concept-block">MoveIt이란?</Link>
          </div>
        </aside>
        <p className="nav2-reference">
          설명의 바탕:{" "}
          <a
            href="https://docs.nav2.org/rolling/getting_started/navigation_concepts/navigation_servers/"
            target="_blank"
            rel="noreferrer"
          >
            Nav2 공식 플래너·컨트롤러 설명
          </a>
        </p>
      </LessonParts>
    </div>
  );
}
