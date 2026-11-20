import LessonParts from "./LessonParts";
import { useId, useRef, useState } from "react";
import type { PointerEvent } from "react";

const clamp = (n: number) => Math.max(-4, Math.min(4, Math.round(n)));

export default function CoordinatesPlayground({ part }: { part?: number }) {
  const uid = useId().replaceAll(":", "");
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef<number | null>(null);
  const [position, setPosition] = useState<[number, number]>([3, 2]);
  const [unit, setUnit] = useState<"m" | "cm">("m");
  const factor = unit === "m" ? 1 : 100;
  const [forward, left] = position;
  const x = 300 - left * 50;
  const y = 270 - forward * 50;
  const pair = `(${forward * factor}, ${left * factor})`;
  const description = `${forward < 0 ? "뒤로" : "앞으로"} ${Math.abs(forward) * factor}${unit}, ${left < 0 ? "오른쪽으로" : "왼쪽으로"} ${Math.abs(left) * factor}${unit}`;
  const fromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix || !svg.current) return;
    const point = svg.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    setPosition([clamp((270 - local.y) / 50), clamp((300 - local.x) / 50)]);
  };

  return (
    <div className="coordinates-lesson">
      <LessonParts name="coordinates-playground" part={part}>
        <div className="coordinates-lab">
          <div className="coordinates-toolbar">
            <h3>공의 위치를 알려 주세요.</h3>
            <button
              type="button"
              onClick={() => {
                setPosition([3, 2]);
                setUnit("m");
              }}
            >
              예시로 돌아가기
            </button>
          </div>
          <p className="coordinates-help">
            그림을 누르거나 공을 끌어 보세요. 슬라이더로도 움직일 수 있어요.
          </p>
          <div className="coordinates-workspace">
            <figure className="coordinates-field">
              <svg
                ref={svg}
                viewBox="0 0 600 540"
                role="img"
                aria-labelledby={`${uid}-title ${uid}-description`}
                onPointerDown={(event) => {
                  if (event.button !== 0) return;
                  event.preventDefault();
                  dragging.current = event.pointerId;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  fromPointer(event);
                }}
                onPointerMove={(event) => {
                  if (dragging.current === event.pointerId) fromPointer(event);
                }}
                onPointerUp={() => {
                  dragging.current = null;
                }}
                onPointerCancel={() => {
                  dragging.current = null;
                }}
                onLostPointerCapture={() => {
                  dragging.current = null;
                }}
              >
                <title id={`${uid}-title`}>운동장 위 공의 좌표</title>
                <desc id={`${uid}-description`}>
                  원점은 운동장 한가운데. 첫 번째 숫자는 앞쪽, 두 번째 숫자는
                  왼쪽 거리예요. 공은 {description}, 좌표는 {pair}, 단위는{" "}
                  {unit}예요.
                </desc>
                <defs>
                  <pattern
                    id={`${uid}-grid`}
                    x="0"
                    y="20"
                    width="50"
                    height="50"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M50 0H0V50"
                      fill="none"
                      stroke="var(--color-line)"
                      strokeWidth="1"
                    />
                  </pattern>
                  <radialGradient id={`${uid}-ball`} cx=".3" cy=".25" r=".8">
                    <stop stopColor="#fff8ed" />
                    <stop offset=".65" stopColor="#e7cbb8" />
                    <stop offset="1" stopColor="#ab8171" />
                  </radialGradient>
                  <marker
                    id={`${uid}-arrow`}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M1 1 9 5 1 9"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="1.8"
                    />
                  </marker>
                </defs>
                <rect
                  x="40"
                  y="40"
                  width="520"
                  height="460"
                  rx="12"
                  fill="var(--color-surface)"
                />
                <rect
                  x="40"
                  y="40"
                  width="520"
                  height="460"
                  rx="12"
                  fill={`url(#${uid}-grid)`}
                />
                <g
                  fill="none"
                  stroke="var(--color-interactive-line)"
                  strokeWidth="2"
                  opacity=".6"
                >
                  <rect x="40" y="40" width="520" height="460" rx="12" />
                  <path d="M40 270H560M190 40V100H410V40M190 500V440H410V500M245 40V28H355V40M245 500V512H355V500" />
                  <circle cx="300" cy="270" r="62" />
                </g>
                <g
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="3"
                  markerEnd={`url(#${uid}-arrow)`}
                >
                  <path d="M300 270V53" />
                  <path d="M300 270H55" />
                </g>
                <path
                  d={`M300 270V${y}H${x}`}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="3"
                  strokeDasharray="6 7"
                  opacity=".8"
                />
                <circle
                  cx="300"
                  cy="270"
                  r="8"
                  fill="var(--color-accent)"
                  stroke="var(--color-background)"
                  strokeWidth="3"
                />
                <text
                  x="315"
                  y="307"
                  fill="var(--color-ink)"
                  fontSize="36"
                  fontFamily="var(--font-mono)"
                >
                  0
                </text>
                <g
                  data-testid="coordinate-ball"
                  transform={`translate(${x} ${y})`}
                >
                  <ellipse
                    cx="3"
                    cy="14"
                    rx="21"
                    ry="8"
                    fill="#705049"
                    opacity=".22"
                  />
                  <circle
                    r="20"
                    fill={`url(#${uid}-ball)`}
                    stroke="#a57a6c"
                    strokeWidth="1.5"
                  />
                  <path d="M-5-8 5-8 10 1 0 8-10 1Z" fill="#69524d" />
                  <path
                    d="M-5-8-8-17M5-8 10-16M10 1 19 4M0 8 0 19M-10 1-19 4"
                    fill="none"
                    stroke="#99776c"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M-8-17-16-10-19 4-12 15 0 19 12 15 19 4 16-10 10-16"
                    fill="none"
                    stroke="#a58173"
                  />
                  <ellipse
                    cx="-7"
                    cy="-12"
                    rx="5"
                    ry="2.5"
                    fill="#fff8ed"
                    opacity=".8"
                    transform="rotate(-25)"
                  />
                </g>
              </svg>
              <figcaption>
                <span>
                  한 칸 = {factor}
                  {unit}
                </span>
                <span>화면 위쪽은 앞, 왼쪽은 왼쪽</span>
              </figcaption>
            </figure>
            <div className="coordinates-controls">
              <p className="coordinates-origin-label">원점: 운동장 한가운데</p>
              <div className="coordinates-axis-key">
                <span>첫 번째 숫자 = 앞·뒤</span>
                <span>두 번째 숫자 = 왼쪽·오른쪽</span>
              </div>
              {["앞·뒤 위치", "왼쪽·오른쪽 위치"].map((label, index) => (
                <div className="coordinates-slider" key={label}>
                  <div>
                    <label htmlFor={`${uid}-axis-${index}`}>{label}</label>
                    <output htmlFor={`${uid}-axis-${index}`}>
                      {position[index] * factor}
                      {unit}
                    </output>
                  </div>
                  <input
                    id={`${uid}-axis-${index}`}
                    type="range"
                    min={-4 * factor}
                    max={4 * factor}
                    step={factor}
                    value={position[index] * factor}
                    onChange={(event) => {
                      const value = Number(event.target.value) / factor;
                      setPosition((current) =>
                        index === 0 ? [value, current[1]] : [current[0], value],
                      );
                    }}
                  />
                </div>
              ))}
              <div
                className="coordinates-units"
                role="group"
                aria-label="거리 단위"
              >
                <button
                  type="button"
                  aria-pressed={unit === "m"}
                  onClick={() => setUnit("m")}
                >
                  미터 (m)
                </button>
                <button
                  type="button"
                  aria-pressed={unit === "cm"}
                  onClick={() => setUnit("cm")}
                >
                  센티미터 (cm)
                </button>
              </div>
              <p className="coordinates-unit-note">
                단위를 바꿔도 공은 그대로예요.
              </p>
            </div>
          </div>
          <div className="coordinates-answer" role="status">
            <p>
              운동장 한가운데에서
              <br />
              <strong>{description}</strong>에 공이 있어요.
            </p>
            <p>
              <span>공의 좌표</span>
              <strong data-testid="coordinate-pair">{pair}</strong>
              <span>단위: {unit}</span>
            </p>
          </div>
        </div>
        <div className="coordinates-agreement">
          <h3>원점·방향·단위로 좌표를 정해요.</h3>
          <dl>
            <div>
              <dt>원점</dt>
              <dd>
                “어디에서부터 잴까?”<strong>운동장 한가운데</strong>
              </dd>
            </div>
            <div>
              <dt>방향 축</dt>
              <dd>
                “어느 쪽으로 갈까?”<strong>앞쪽과 왼쪽</strong>
              </dd>
            </div>
            <div>
              <dt>단위</dt>
              <dd>
                “무슨 단위로 잴까?”<strong>미터(m)</strong>
              </dd>
            </div>
            <div>
              <dt>좌표</dt>
              <dd>
                이 약속에 따라 나타낸<strong>위치의 숫자 (3, 2)</strong>
              </dd>
            </div>
          </dl>
          <p className="coordinates-example-note">
            위 설명은 처음 예시의 약속이에요. ‘예시로 돌아가기’를 누르면 미터
            단위의 (3, 2)로 돌아가요.
          </p>
        </div>
        <div className="coordinates-origin-explanation">
          <h3>원점은 하나의 점, 좌표계는 전체 약속이에요.</h3>
          <p>
            <strong>원점</strong>은 기준점 하나를 뜻해요.{" "}
            <strong>좌표계</strong>는 그 기준점에{" "}
            <span className="lesson-underline">방향과 단위</span>
            까지 정한 전체 체계예요.
          </p>
          <p>
            기준점만 정하고 “3m 떨어져 있어”라고 하면 어느 방향인지 알 수
            없어요. 그래서 방향도 필요해요.
          </p>
        </div>
        <p className="coordinates-word-note">
          ‘좌표’는 위치를 나타내는 숫자, ‘계’는 그 숫자를 정하고 해석하는 체계를
          뜻해요. ‘계’가 방향이라는 뜻은 아니에요.
        </p>
      </LessonParts>
    </div>
  );
}
