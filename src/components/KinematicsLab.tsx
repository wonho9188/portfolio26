import LessonParts from "./LessonParts";
import { useId, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { forwardKinematics, inverseKinematics, wrapAngle } from "./kinematics";
import type { Angles, Pose } from "./kinematics";

const initialAngles: Angles = [30, 65, -35];
const initialPose = forwardKinematics(initialAngles);
const scale = 8;
const screenPoint = (p: { x: number; y: number }) => ({
  x: 300 + p.x * scale,
  y: 270 - p.y * scale,
});
const fixed = (value: number) =>
  Math.abs(value) < 0.05 ? "0.0" : value.toFixed(1);

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="kin-slider">
      <div>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {fixed(value)}
          {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function KinematicsLab({ part }: { part?: number }) {
  const uid = useId().replaceAll(":", "");
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef<number | null>(null);
  const [mode, setMode] = useState<"fk" | "ik">("fk");
  const [fkAngles, setFkAngles] = useState<Angles>(initialAngles);
  const [target, setTarget] = useState<Pose>(initialPose);
  const [branch, setBranch] = useState(0);
  const [lastReachable, setLastReachable] = useState<Angles>(initialAngles);
  const solutions = inverseKinematics(target);
  const selected = branch % Math.max(1, solutions.length);
  const angles =
    mode === "fk" ? fkAngles : (solutions[selected] ?? lastReachable);
  const hand = forwardKinematics(angles);
  const points = hand.points.map(screenPoint);
  const pointList = points.map((p) => `${p.x},${p.y}`).join(" ");
  const targetPoint = screenPoint(target);
  const ghost =
    mode === "ik" && solutions.length === 2
      ? forwardKinematics(solutions[1 - selected])
          .points.map(screenPoint)
          .map((p) => `${p.x},${p.y}`)
          .join(" ")
      : undefined;
  const unreachable = mode === "ik" && solutions.length === 0;

  const updateTarget = (next: Pose) => {
    setTarget(next);
    const options = inverseKinematics(next);
    if (options.length) setLastReachable(options[branch % options.length]);
  };
  const changeMode = (next: "fk" | "ik") => {
    if (next === mode) return;
    dragging.current = null;
    if (next === "ik") {
      const pose = forwardKinematics(fkAngles);
      const options = inverseKinematics(pose);
      const distance = (candidate: Angles) =>
        candidate.reduce(
          (sum, angle, i) => sum + wrapAngle(angle - fkAngles[i]) ** 2,
          0,
        );
      setTarget(pose);
      setBranch(
        options.length === 2 && distance(options[1]) < distance(options[0])
          ? 1
          : 0,
      );
      setLastReachable(fkAngles);
    } else setFkAngles(angles);
    setMode(next);
  };
  const updateFromPointer = (e: PointerEvent<SVGSVGElement>) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix || !svg.current) return;
    const point = svg.current.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const local = point.matrixTransform(matrix.inverse());
    const clamp = (v: number) =>
      Math.max(-30, Math.min(30, Math.round(v * 2) / 2));
    updateTarget({
      ...target,
      x: clamp((local.x - 300) / scale),
      y: clamp((270 - local.y) / scale),
    });
  };
  const pointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (mode !== "ik" || e.button !== 0) return;
    e.preventDefault();
    dragging.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPointer(e);
  };
  const reset = () => {
    setFkAngles(initialAngles);
    setTarget(initialPose);
    setBranch(0);
    setLastReachable(initialAngles);
  };

  return (
    <div className="kinematics-lesson">
      <LessonParts name="kinematics" part={part}>
        <div className="kin-lab" aria-label="정기구학과 역기구학 로봇팔 실험">
          <div className="kin-toolbar">
            <div className="kin-modes" role="group" aria-label="계산 방식">
              <button
                type="button"
                aria-pressed={mode === "fk"}
                onClick={() => changeMode("fk")}
              >
                FK · 각도 바꾸기
              </button>
              <button
                type="button"
                aria-pressed={mode === "ik"}
                onClick={() => changeMode("ik")}
              >
                IK · 목표 옮기기
              </button>
            </div>
            <button type="button" className="kin-reset" onClick={reset}>
              처음으로
            </button>
          </div>
          <p className="kin-instruction" id={`${uid}-help`}>
            {mode === "fk"
              ? "관절 각도를 바꾸면 손이 어디로 가는지 보세요."
              : "그림을 누르거나 목표점을 끌어 보세요. 손의 방향도 바꿀 수 있어요."}
          </p>
          <div className="kin-workspace">
            <div className="kin-drawing">
              <svg
                ref={svg}
                viewBox="0 -40 640 600"
                role="img"
                aria-labelledby={`${uid}-title ${uid}-description`}
                aria-describedby={`${uid}-help`}
                className={mode === "ik" ? "is-interactive" : ""}
                onPointerDown={pointerDown}
                onPointerMove={(e) => {
                  if (dragging.current === e.pointerId && mode === "ik")
                    updateFromPointer(e);
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
                <title id={`${uid}-title`}>관절 세 개를 가진 2D 로봇팔</title>
                <desc id={`${uid}-description`}>
                  손 위치 x {fixed(hand.x)}cm, y {fixed(hand.y)}cm, 방향{" "}
                  {fixed(hand.direction)}도.{" "}
                  {unreachable
                    ? "선택한 목표에 닿는 자세가 없습니다."
                    : "슬라이더로 실험할 수 있습니다."}
                </desc>
                <defs>
                  <pattern
                    id={`${uid}-grid`}
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M40 0H0V40"
                      fill="none"
                      stroke="var(--color-line)"
                      strokeWidth="0.7"
                    />
                  </pattern>
                  <linearGradient
                    id={`${uid}-metal`}
                    x1="0"
                    y1="0"
                    x2="0.6"
                    y2="1"
                  >
                    <stop stopColor="#f5e5d6" />
                    <stop offset="0.55" stopColor="#dac2ae" />
                    <stop offset="1" stopColor="#ad8e80" />
                  </linearGradient>
                  <linearGradient id={`${uid}-rose`}>
                    <stop stopColor="#efbacb" />
                    <stop offset="1" stopColor="#ac727f" />
                  </linearGradient>
                </defs>
                <rect
                  x="16"
                  y="16"
                  width="608"
                  height="488"
                  rx="12"
                  fill={`url(#${uid}-grid)`}
                />
                <circle
                  cx="300"
                  cy="270"
                  r="208"
                  fill="none"
                  stroke="var(--color-interactive-line)"
                  strokeDasharray="4 9"
                  opacity="0.6"
                />
                <path
                  d="M30 270H610M300 28V492"
                  stroke="var(--color-interactive-line)"
                  opacity="0.7"
                />
                <g
                  fill="var(--color-muted)"
                  fontSize="18"
                  fontFamily="var(--font-mono)"
                >
                  <text x="584" y="257">
                    +x
                  </text>
                  <text x="314" y="45">
                    +y
                  </text>
                  <text x="311" y="296">
                    0
                  </text>
                </g>
                {ghost && (
                  <polyline
                    points={ghost}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="8"
                    strokeDasharray="6 12"
                    opacity="0.27"
                    strokeLinecap="round"
                  />
                )}
                <rect
                  x="270"
                  y="257"
                  width="60"
                  height="38"
                  rx="9"
                  fill="#66514d"
                />
                <polyline
                  points={pointList}
                  fill="none"
                  stroke="#69534e"
                  strokeWidth="31"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <polyline
                  points={pointList}
                  fill="none"
                  stroke={`url(#${uid}-metal)`}
                  strokeWidth="24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <polyline
                  points={pointList}
                  fill="none"
                  stroke="#f9ebdf"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                {points.slice(0, 3).map((point, i) => (
                  <g key={i} transform={`translate(${point.x} ${point.y})`}>
                    <circle
                      r={18 - i * 2}
                      fill={`url(#${uid}-metal)`}
                      stroke="#80665e"
                      strokeWidth="2"
                    />
                    <circle
                      r={10 - i}
                      fill={`url(#${uid}-rose)`}
                      stroke="#956975"
                      strokeWidth="1.5"
                    />
                    <circle r="3" fill="#f8e2d4" />
                  </g>
                ))}
                <g
                  transform={`translate(${points[3].x} ${points[3].y}) rotate(${-hand.direction})`}
                >
                  <path
                    d="M-6-11H13V-5M-6 11H13V5"
                    fill="none"
                    stroke="#b37987"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 0H39L31-5M39 0 31 5"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2.5"
                  />
                </g>
                {mode === "ik" && (
                  <g
                    transform={`translate(${targetPoint.x} ${targetPoint.y}) rotate(${-target.direction})`}
                  >
                    <circle
                      r="17"
                      fill="var(--color-surface)"
                      fillOpacity="0.75"
                      stroke="var(--color-accent)"
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                    />
                    <path
                      d="M-9 0H9M0-9V9M19 0H47L39-5M47 0 39 5"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      fill="none"
                    />
                  </g>
                )}
              </svg>
              <p className="kin-diagram-caption">
                위에서 본 2D 팔 · 길이 12 / 10 / 4cm
              </p>
            </div>
            <div className="kin-controls">
              <p className="kin-control-title">
                {mode === "fk" ? "관절 → 손" : "손의 목표 → 관절"}
              </p>
              {mode === "fk" ? (
                ["어깨 각도", "팔꿈치 각도", "손목 각도"].map((label, i) => (
                  <Slider
                    key={label}
                    label={label}
                    value={fkAngles[i]}
                    min={-180}
                    max={180}
                    unit="°"
                    onChange={(value) =>
                      setFkAngles(
                        (current) =>
                          current.map((v, index) =>
                            index === i ? value : v,
                          ) as Angles,
                      )
                    }
                  />
                ))
              ) : (
                <>
                  <Slider
                    label="목표 x"
                    value={target.x}
                    min={-30}
                    max={30}
                    step={0.5}
                    unit="cm"
                    onChange={(x) => updateTarget({ ...target, x })}
                  />
                  <Slider
                    label="목표 y"
                    value={target.y}
                    min={-30}
                    max={30}
                    step={0.5}
                    unit="cm"
                    onChange={(y) => updateTarget({ ...target, y })}
                  />
                  <Slider
                    label="손의 목표 방향"
                    value={target.direction}
                    min={-180}
                    max={180}
                    unit="°"
                    onChange={(direction) =>
                      updateTarget({ ...target, direction })
                    }
                  />
                  <div className="kin-presets">
                    <button
                      type="button"
                      onClick={() =>
                        updateTarget({ x: 14, y: 12, direction: 0 })
                      }
                    >
                      닿는 목표
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateTarget({ x: 30, y: 16, direction: 0 })
                      }
                    >
                      먼 목표
                    </button>
                  </div>
                  <button
                    type="button"
                    className="kin-other"
                    disabled={solutions.length < 2}
                    onClick={() => {
                      const other = 1 - selected;
                      setBranch(other);
                      setLastReachable(solutions[other]);
                    }}
                  >
                    다른 팔 자세 보기
                  </button>
                </>
              )}
              <div className="kin-readout" aria-label="계산 결과">
                <p>
                  손 위치{" "}
                  <strong data-testid="hand-position">
                    x {fixed(hand.x)} / y {fixed(hand.y)} cm
                  </strong>
                </p>
                <p>
                  손 방향 <strong>{fixed(hand.direction)}°</strong>
                </p>
                {mode === "ik" && (
                  <p>
                    {unreachable ? "마지막 자세 각도" : "계산된 각도"}{" "}
                    <strong>
                      {angles.map((v) => `${fixed(v)}°`).join(" · ")}
                    </strong>
                  </p>
                )}
              </div>
            </div>
          </div>
          <p
            className={`kin-status${unreachable ? " is-unreachable" : ""}`}
            role="status"
          >
            {mode === "fk"
              ? "관절에서 손으로 계산하는 정기구학(FK)이에요."
              : unreachable
                ? "이 위치·방향에는 손이 닿지 않아요. 팔은 마지막으로 닿았던 자세에 있어요."
                : solutions.length === 2
                  ? "같은 손 위치·방향을 만드는 팔 자세가 두 개 있어요. ‘다른 팔 자세 보기’를 눌러 보세요."
                  : "이 목표를 만드는 팔 자세가 하나 있어요."}
          </p>
          <p className="kin-model-note">
            관절 제한과 장애물을 생략한 2D 기구학 실험이에요. 화살표는 손이
            향하는 방향이에요.
          </p>
        </div>
        <div className="kin-comparison">
          <table>
            <caption>정기구학과 역기구학 비교</caption>
            <thead>
              <tr>
                <th scope="col">구분</th>
                <th scope="col">주어진 정보 → 계산할 결과</th>
                <th scope="col">쉬운 질문</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">정기구학(FK)</th>
                <td data-label="계산 방향">관절 각도 → 손의 위치·방향</td>
                <td data-label="쉬운 질문">
                  “팔꿈치를 이렇게 굽히면 손은 어디에 있을까?”
                </td>
              </tr>
              <tr>
                <th scope="row">역기구학(IK)</th>
                <td data-label="계산 방향">손의 목표 위치·방향 → 관절 각도</td>
                <td data-label="쉬운 질문">
                  “손을 상자 위에 놓으려면 관절을 어떻게 굽혀야 할까?”
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="kin-summary">
          정기구학은 관절에서 손으로,
          <br />
          역기구학은 손의 목표에서 관절로 계산해요.
        </p>
        <p className="kin-explanation">
          역기구학은 같은 손 위치를 만드는 팔 자세가 여러 개일 수도 있고, 너무
          먼 목표라면 가능한 자세가 없을 수도 있어요.
        </p>
        <a
          className="text-link kin-reference"
          href="https://motion.cs.illinois.edu/RoboticSystems/InverseKinematics.html"
        >
          기구학 계산 원리 읽기
        </a>
      </LessonParts>
    </div>
  );
}
