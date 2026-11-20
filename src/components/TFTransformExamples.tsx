import LessonParts from "./LessonParts";
import { useId, useState } from "react";

export default function TFTransformExamples({ part }: { part?: number }) {
  const uid = useId().replaceAll(":", "");
  const [turned, setTurned] = useState(false);
  const yaw = turned ? 90 : 0;
  // Express the camera's forward vector in the robot frame, then add its origin.
  const radians = (yaw * Math.PI) / 180;
  const relativeForward = Math.round(30 * Math.cos(radians));
  const relativeLeft = Math.round(30 * Math.sin(radians));
  const forward = 20 + relativeForward;
  const left = relativeLeft;
  const boxX = 420 - left * 7;
  const boxY = 470 - forward * 7;
  const result = turned
    ? `앞으로 ${forward}cm, 왼쪽으로 ${left}cm`
    : `앞으로 ${forward}cm`;

  return (
    <div className="tf-transform-lesson">
      <LessonParts name="tf-transform" part={part}>
        <div className="tf-transform-flow" aria-label="좌표 변환 과정">
          <span>카메라 기준 상자 위치</span>
          <span>TF로 변환</span>
          <span>로봇 기준 상자 위치</span>
        </div>
        <div className="tf-transform-lab">
          <h3>카메라 앞 30cm, 로봇에게는?</h3>
          <div
            className="tf-transform-controls"
            role="group"
            aria-label="변환 예시 선택"
          >
            <button
              type="button"
              aria-pressed={!turned}
              onClick={() => setTurned(false)}
            >
              같은 방향
            </button>
            <button
              type="button"
              aria-pressed={turned}
              onClick={() => setTurned(true)}
            >
              카메라가 왼쪽으로 90°
            </button>
          </div>
          <p className="tf-transform-orientation">
            위에서 본 모습 · 화면 위쪽은 로봇의 앞, 왼쪽은 로봇의 왼쪽
          </p>
          <div className="tf-transform-workspace">
            <figure className="tf-transform-drawing">
              <svg
                viewBox="0 0 600 580"
                role="img"
                aria-labelledby={`${uid}-title ${uid}-desc`}
              >
                <title id={`${uid}-title`}>
                  {turned
                    ? "카메라가 왼쪽으로 90도 돌아간 예시"
                    : "로봇과 카메라가 같은 방향을 보는 예시"}
                </title>
                <desc id={`${uid}-desc`}>
                  카메라는 로봇 앞 20cm에 있고, 상자는 카메라가 바라보는
                  방향으로 30cm 앞에 있어요. 상자의 로봇 기준 위치는 {result}
                  예요.
                </desc>
                <defs>
                  <pattern
                    id={`${uid}-grid`}
                    x="0"
                    y="50"
                    width="70"
                    height="70"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M70 0H0V70"
                      fill="none"
                      stroke="var(--color-line)"
                      strokeWidth="1"
                    />
                  </pattern>
                  <linearGradient id={`${uid}-cream`} x2=".7" y2="1">
                    <stop stopColor="#f6e7d8" />
                    <stop offset="1" stopColor="#b28a74" />
                  </linearGradient>
                  <radialGradient id={`${uid}-rose`} cx=".3" cy=".3">
                    <stop stopColor="#f4c8d1" />
                    <stop offset="1" stopColor="#a3677a" />
                  </radialGradient>
                  <marker
                    id={`${uid}-arrow`}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M1 1 9 5 1 9"
                      fill="none"
                      stroke="context-stroke"
                      strokeWidth="1.6"
                    />
                  </marker>
                </defs>
                <rect
                  x="25"
                  y="25"
                  width="550"
                  height="530"
                  rx="12"
                  fill={`url(#${uid}-grid)`}
                  opacity=".7"
                />
                <g
                  fill="none"
                  stroke="var(--color-interactive-line)"
                  strokeWidth="2"
                  markerEnd={`url(#${uid}-arrow)`}
                >
                  <path d="M420 470V60M420 470H70" />
                </g>
                {turned && (
                  <path
                    d={`M420 470H${boxX}V${boxY + 30}`}
                    fill="none"
                    stroke="var(--color-muted)"
                    strokeWidth="2.5"
                    strokeDasharray="6 8"
                  />
                )}
                <path
                  d="M453 450V350"
                  fill="none"
                  stroke="var(--color-muted)"
                  strokeWidth="3"
                  markerEnd={`url(#${uid}-arrow)`}
                />
                <path
                  d={turned ? `M388 330H${boxX + 35}` : `M420 298V${boxY + 35}`}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="4"
                  markerEnd={`url(#${uid}-arrow)`}
                />
                {turned && (
                  <path
                    d="M420 270A60 60 0 0 0 360 330"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    markerEnd={`url(#${uid}-arrow)`}
                  />
                )}
                <g
                  data-testid="tf-transform-robot"
                  transform="translate(420 470)"
                >
                  <circle cy="4" r="29" fill="#80665b" opacity=".3" />
                  <circle
                    r="27"
                    fill={`url(#${uid}-cream)`}
                    stroke="#967766"
                    strokeWidth="2"
                  />
                  <circle r="17" fill={`url(#${uid}-rose)`} stroke="#9e7379" />
                  <path
                    d="M-8-5 0-14 8-5"
                    fill="none"
                    stroke="#fff1e4"
                    strokeWidth="3"
                  />
                  <circle cy="5" r="4" fill="#e8cbbb" />
                </g>
                <g
                  data-testid="tf-transform-camera"
                  transform={`translate(420 330) rotate(${-yaw})`}
                >
                  <rect
                    x="-25"
                    y="-16"
                    width="50"
                    height="34"
                    rx="7"
                    fill={`url(#${uid}-cream)`}
                    stroke="#967766"
                    strokeWidth="2"
                  />
                  <rect
                    x="-12"
                    y="-27"
                    width="24"
                    height="14"
                    rx="3"
                    fill="#a16b77"
                  />
                  <path d="M-8-23H8" stroke="#f6e7d8" strokeWidth="2" />
                  <circle cx="14" cy="5" r="3.5" fill="#b27886" />
                  <path d="M-15 9H2" stroke="#efdbcb" strokeWidth="2" />
                </g>
                <g
                  data-testid="tf-transform-box"
                  transform={`translate(${boxX} ${boxY})`}
                >
                  <rect
                    x="-26"
                    y="-25"
                    width="52"
                    height="52"
                    rx="4"
                    fill="#a97e5f"
                    opacity=".3"
                    transform="translate(3 4)"
                  />
                  <rect
                    x="-26"
                    y="-26"
                    width="52"
                    height="52"
                    rx="4"
                    fill="#d2a17a"
                    stroke="#a77d5e"
                    strokeWidth="2"
                  />
                  <path
                    d="M-24-22H24M-24 22H24"
                    stroke="#ebc6a1"
                    strokeWidth="2"
                  />
                  <path d="M-6-26H6V26H-6Z" fill="#eed2b1" />
                  <path d="M0-26V26" stroke="#ba916f" />
                </g>
                <g
                  fontFamily="var(--font-body)"
                  fontSize="36"
                  fill="var(--color-ink)"
                >
                  <text x="420" y="535" textAnchor="middle">
                    로봇
                  </text>
                  <text x="454" y="338">
                    카메라
                  </text>
                  <text x={boxX} y={boxY - 43} textAnchor="middle">
                    상자
                  </text>
                </g>
                <g fontFamily="var(--font-mono)" fontSize="36">
                  <text x="470" y="421" fill="var(--color-muted)">
                    20cm
                  </text>
                  <text
                    x={turned ? 312 : 450}
                    y={turned ? 305 : 234}
                    textAnchor={turned ? "middle" : "start"}
                    fill="var(--color-accent)"
                  >
                    30cm
                  </text>
                  {turned && (
                    <text
                      x="353"
                      y="257"
                      textAnchor="middle"
                      fill="var(--color-accent)"
                      fontSize="32"
                    >
                      90°
                    </text>
                  )}
                </g>
              </svg>
              <figcaption>높이를 생략한 2D 그림이에요.</figcaption>
            </figure>
            <div className="tf-transform-calculation">
              <h4>{turned ? "카메라가 왼쪽을 볼 때" : "같은 방향을 볼 때"}</h4>
              <div>
                <strong>방향을 맞춰요.</strong>
                <p>
                  카메라의 ‘앞으로 30cm’는 로봇에게{" "}
                  {turned ? "왼쪽으로 30cm" : "앞으로 30cm"}
                  예요.
                </p>
              </div>
              <div>
                <strong>기준점 차이를 더해요.</strong>
                <p>카메라는 로봇보다 20cm 앞에 있어요. 이 차이를 반영해요.</p>
              </div>
              <p className="tf-transform-equation">
                {turned
                  ? "앞 20 + 0 = 20cm\n왼쪽 0 + 30 = 30cm"
                  : "앞 20 + 30 = 50cm"}
              </p>
            </div>
          </div>
          <div className="tf-transform-result" role="status">
            <span>상자의 로봇 기준 위치</span>
            <strong>{result}</strong>
          </div>
          <p className="tf-transform-scenario-note">
            두 예시는 카메라 앞 30cm에 상자를 각각 놓은 서로 다른 배치예요.
          </p>
        </div>
        <p className="tf-transform-tf2">
          ROS에서는 좌표계 사이의 위치·회전 관계를 관리하고, 그 관계를 이용해
          변환해요. ROS 2에서는 두 번째 세대인{" "}
          <strong>
            <code>tf2</code>
          </strong>
          를 사용해요.
        </p>
        <a
          className="text-link tf-transform-reference"
          href="https://index.ros.org/p/tf2/"
        >
          tf2 공식 설명 읽기
        </a>
      </LessonParts>
    </div>
  );
}
