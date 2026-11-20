import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

export default function MujocoOverview({ part }: { part?: number }) {
  const id = useId();
  const [gravity, setGravity] = useState(true);
  const [time, setTime] = useState(0);
  const height = Math.max(0, 1.5 - (gravity ? 0.5 * 9.81 * time * time : 0));
  const bottom = 270 - height * 100;
  const message =
    time === 0
      ? "시간을 흘리기 전, 공은 처음 높이에 있어요."
      : !gravity
        ? "중력이 없어서 공이 처음 높이에 그대로 있어요."
        : height === 0
          ? "공이 바닥에 닿아 멈췄어요."
          : "중력 때문에 공이 아래로 떨어지고 있어요.";

  return (
    <div className="mujoco-overview">
      <LessonParts name="mujoco-overview" part={part}>
        <div className="mujoco-lab">
          <p className="eyebrow">화면 속에서 해 보는 물리 실험</p>
          <h3>로봇이 공을 놓으면 어떻게 될까요?</h3>
          <p className="mujoco-instruction">
            중력을 고르고, 시간 막대를 움직여 보세요.
          </p>
          <div
            className="mujoco-gravity"
            role="group"
            aria-label="중력 조건 선택"
          >
            <button
              type="button"
              aria-pressed={gravity}
              onClick={() => setGravity(true)}
            >
              중력 있음
            </button>
            <button
              type="button"
              aria-pressed={!gravity}
              onClick={() => setGravity(false)}
            >
              중력 없음
            </button>
          </div>
          <svg
            className="mujoco-scene"
            viewBox="0 0 560 330"
            role="img"
            aria-labelledby={`${id}-title ${id}-description`}
          >
            <title id={`${id}-title`}>
              {gravity ? "중력이 있는" : "중력이 없는"} 공 놓기 실험
            </title>
            <desc id={`${id}-description`}>
              {time.toFixed(2)}초 뒤 공 아래쪽의 높이는 {height.toFixed(2)}
              미터예요. {message}
            </desc>
            <defs>
              <pattern
                id={`${id}-grid`}
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0H0V40"
                  fill="none"
                  stroke="var(--color-line)"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>
            <rect
              x="20"
              y="20"
              width="520"
              height="250"
              rx="12"
              fill={`url(#${id}-grid)`}
              opacity="0.5"
            />
            <path d="M30 270H530" stroke="var(--color-muted)" strokeWidth="2" />
            <rect
              x="50"
              y="242"
              width="70"
              height="28"
              rx="7"
              fill="var(--color-raised)"
              stroke="var(--color-muted)"
              strokeWidth="2"
            />
            <path
              d="M85 242V198L170 110 300 70"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M85 242V198L170 110 300 70"
              fill="none"
              stroke="var(--color-raised)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              { x: 85, y: 198 },
              { x: 170, y: 110 },
              { x: 300, y: 70 },
            ].map((point) => (
              <g key={point.x}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="13"
                  fill="var(--color-surface)"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="var(--color-accent)"
                />
              </g>
            ))}
            <path
              d="M313 70H320V88m-20 28V88h40v28"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="320"
              cy={bottom - 16}
              r="16"
              fill="var(--color-accent)"
              stroke="var(--color-ink)"
              strokeWidth="1.5"
            />
            <circle
              cx="315"
              cy={bottom - 21}
              r="4"
              fill="var(--color-surface)"
              opacity="0.25"
            />
            <g stroke="var(--color-muted)" strokeWidth="1.2" fill="none">
              <path d={`M420 ${bottom}V270m-8 0h16M412 ${bottom}h16`} />
              <path d="M344 120H440" strokeDasharray="4 6" opacity="0.5" />
            </g>
            <g fill="var(--color-muted)" className="mujoco-svg-label">
              <text x="355" y={bottom - 9}>
                공
              </text>
              <text x="70" y="310">
                바닥
              </text>
            </g>
          </svg>
          <div className="mujoco-controls">
            <label htmlFor={`${id}-time`}>시간 흘려보기</label>
            <output htmlFor={`${id}-time`}>{time.toFixed(2)}초</output>
            <input
              id={`${id}-time`}
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={time}
              aria-valuetext={`${time.toFixed(2)}초`}
              onChange={(event) => setTime(Number(event.target.value))}
            />
            <span>처음 · 0초</span>
            <span>나중 · 0.8초</span>
          </div>
          <div
            className="mujoco-result"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="mujoco-height">
              공 아래쪽 높이 {height.toFixed(2)}m
            </span>
            <p>{message}</p>
          </div>
          <button
            type="button"
            className="mujoco-reset"
            onClick={() => {
              setTime(0);
              setGravity(true);
            }}
          >
            처음으로
          </button>
          <p className="mujoco-caption">
            공이 바닥에서 튕기지 않고 멈추도록 만든 JavaScript 설명 예시예요.
            실제 MuJoCo 실행 결과는 아니에요.
          </p>
        </div>
        <div className="mujoco-explanation">
          <h3>모양에 물리 조건을 더해요.</h3>
          <p>
            로봇과 물체의 모양, 무게, 관절, 바닥의 마찰 등을 정해요. MuJoCo는
            힘을 받거나 서로 닿을 때 움직임이 어떻게 달라지는지 계산해요.
          </p>
        </div>
        <div className="mujoco-explanation">
          <h3>로봇을 만들기 전에 실험해요.</h3>
          <p>
            로봇팔로 물건을 잡거나, 다리가 달린 로봇이 균형을 잡는 동작을 시험할
            수 있어요. 조건을 바꾸고 같은 실험을 반복하기도 좋아요.
          </p>
          <p>
            다만 실제 무게와 마찰을 얼마나 잘 맞췄는지에 따라 결과가 달라져요.
            화면 속 결과와 실제 로봇의 움직임은 차이가 날 수 있어요.
          </p>
        </div>
        <aside className="mujoco-connection">
          <h3>MoveIt과는 무엇이 다를까요?</h3>
          <p>
            MoveIt은 로봇팔이 어떻게 움직일지 계획해요. MuJoCo는 힘과 접촉 같은
            물리 조건에서 어떻게 움직이는지 실험하도록 도와줘요.
          </p>
          <Link to="/blog/moveit-concept-block">MoveIt이란? 읽기</Link>
        </aside>
      </LessonParts>
    </div>
  );
}
