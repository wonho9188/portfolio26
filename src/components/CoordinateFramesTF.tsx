import LessonParts from "./LessonParts";
import { useId, useState } from "react";

const objects = [
  { id: "robot", label: "로봇", position: 0, left: "14%" },
  { id: "camera", label: "카메라", position: 20, left: "42.8%" },
  { id: "box", label: "상자", position: 50, left: "86%" },
] as const;

function ObjectDrawing({ kind }: { kind: (typeof objects)[number]["id"] }) {
  const uid = useId().replaceAll(":", "");
  return (
    <svg viewBox="0 0 88 96" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-cream`} x2=".7" y2="1">
          <stop stopColor="#f7e9db" />
          <stop offset=".6" stopColor="#d9beaa" />
          <stop offset="1" stopColor="#a58271" />
        </linearGradient>
        <linearGradient id={`${uid}-rose`} x2="1" y2="1">
          <stop stopColor="#e9b5c3" />
          <stop offset="1" stopColor="#a46a7d" />
        </linearGradient>
      </defs>
      <ellipse cx="44" cy="87" rx="34" ry="5" fill="#a58271" opacity=".14" />
      {kind === "robot" ? (
        <>
          <path d="M16 76 40 69 72 77 48 87 16 81Z" fill="#987969" />
          <path d="M16 76 40 69 72 77 48 82Z" fill={`url(#${uid}-cream)`} />
          <path
            d="M38 72 29 47 48 23 67 43"
            fill="none"
            stroke="#7f625a"
            strokeWidth="15"
            strokeLinejoin="round"
          />
          <path
            d="M38 72 29 47 48 23 67 43"
            fill="none"
            stroke={`url(#${uid}-cream)`}
            strokeWidth="11"
            strokeLinejoin="round"
          />
          {[
            [38, 71],
            [29, 47],
            [48, 23],
          ].map(([x, y]) => (
            <g key={x}>
              <circle
                cx={x}
                cy={y}
                r="8"
                fill={`url(#${uid}-cream)`}
                stroke="#8a6b60"
              />
              <circle cx={x} cy={y} r="4.5" fill={`url(#${uid}-rose)`} />
              <circle cx={x - 1} cy={y - 1} r="1.5" fill="#f7e9db" />
            </g>
          ))}
          <path
            d="M61 42V55H66M73 42V55H68"
            fill="none"
            stroke="#c18b93"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      ) : kind === "camera" ? (
        <>
          <path
            d="M42 61V78M27 82 42 74 58 82"
            stroke="#a58271"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path d="M12 30 58 23 77 32 31 40Z" fill="#eddbcc" />
          <path d="M12 30 31 40V66L12 55Z" fill="#b29382" />
          <path
            d="M31 40 77 32V58L31 66Z"
            fill={`url(#${uid}-cream)`}
            stroke="#ac8b78"
          />
          <ellipse cx="57" cy="47" rx="13" ry="12" fill="#8b6369" />
          <ellipse cx="57" cy="47" rx="9" ry="9" fill="#343036" />
          <ellipse cx="59" cy="45" rx="4.5" ry="5" fill="#b88496" />
          <ellipse cx="60" cy="43" rx="2" ry="2.5" fill="#efd9dd" />
          <path d="M37 46V57" stroke="#f6e7d9" strokeWidth="2" />
          <circle cx="71" cy="38" r="2" fill="#d78e9f" />
        </>
      ) : (
        <>
          <path d="M12 32 46 20 78 34 44 48Z" fill="#e1b68f" stroke="#ad835f" />
          <path d="M12 32 44 48V83L12 66Z" fill="#bd8d6b" stroke="#a67b5d" />
          <path d="M44 48 78 34V67L44 83Z" fill="#d6a27a" stroke="#ad835f" />
          <path d="M29 26 60 41V55L67 52V38L37 23Z" fill="#f0d4ad" />
          <path
            d="M17 38 40 50M48 51 73 40"
            stroke="#ebc59f"
            strokeWidth="1.5"
          />
          <path d="M54 65 68 59V67L54 73Z" fill="#f1d7b7" opacity=".8" />
        </>
      )}
    </svg>
  );
}

export default function CoordinateFramesTF({ part }: { part?: number }) {
  const [frame, setFrame] = useState<"robot" | "camera">("robot");
  const origin = frame === "camera" ? 20 : 0;
  const label = frame === "camera" ? "카메라" : "로봇";
  const distance = 50 - origin;
  const format = (value: number) =>
    `${value < 0 ? "−" : ""}${Math.abs(value)}cm`;

  return (
    <div className="tf-lesson">
      <LessonParts name="coordinate-frames" part={part}>
        <div className="tf-lab">
          <h3>어디에서부터 거리를 잴까요?</h3>
          <div
            className="tf-controls"
            role="group"
            aria-label="위치의 기준 선택"
          >
            <button
              type="button"
              aria-pressed={frame === "robot"}
              onClick={() => setFrame("robot")}
            >
              로봇 기준
            </button>
            <button
              type="button"
              aria-pressed={frame === "camera"}
              onClick={() => setFrame("camera")}
            >
              카메라 기준
            </button>
          </div>
          <figure className="tf-figure">
            <div
              className="tf-scene"
              role="img"
              aria-label={`${label} 기준. 로봇 ${format(-origin)}, 카메라 ${format(20 - origin)}, 상자 ${format(distance)}. 로봇과 카메라는 같은 앞쪽 방향을 보고, 세 물체의 실제 위치는 그대로입니다.`}
            >
              <div className="tf-offset">
                <span>로봇에서 카메라까지 20cm</span>
              </div>
              <div className="tf-axis" aria-hidden="true" />
              {objects.map((object) => (
                <div
                  key={object.id}
                  className="tf-object"
                  data-testid={`tf-${object.id}`}
                  style={{ left: object.left }}
                >
                  <ObjectDrawing kind={object.id} />
                  <span className="tf-object-label">{object.label}</span>
                  <span
                    className={`tf-origin${frame === object.id ? " is-active" : ""}`}
                  />
                  <span className="tf-number">
                    {format(object.position - origin)}
                  </span>
                </div>
              ))}
              <div
                className="tf-distance"
                style={{
                  left: frame === "camera" ? "42.8%" : "14%",
                  width: frame === "camera" ? "43.2%" : "72%",
                }}
                aria-hidden="true"
              >
                <span>{distance}cm</span>
              </div>
              <span className="tf-forward" aria-hidden="true">
                앞쪽 →
              </span>
            </div>
            <figcaption>
              상자는 그대로예요. 0을 놓는 기준만 바뀌어요.
            </figcaption>
          </figure>
          <p className="tf-answer" role="status">
            <span>{label} 기준</span>
            <strong>상자는 앞으로 {distance}cm</strong>
          </p>
          <p className="tf-negative-note">
            {frame === "camera"
              ? "로봇은 카메라 뒤에 있어서 −20cm예요."
              : "로봇의 위치를 0으로 두고 앞쪽으로 재요."}
          </p>
        </div>
        <div className="tf-frame-comparison">
          <h3>좌표계와 TF는 어떻게 다를까요?</h3>
          <p>
            <strong>좌표계</strong>는 ‘위치를 말하는 기준’, <strong>TF</strong>
            는 ‘서로 다른 좌표계를 연결하는 관계와 변환’이에요.
          </p>
          <p>같은 상자를 로봇과 카메라가 보고 있다고 생각해 보세요.</p>
          <dl className="tf-viewpoints">
            <div>
              <dt>로봇 기준</dt>
              <dd>
                “상자는 내 앞 <strong>50cm</strong>에 있어.”
              </dd>
            </div>
            <div>
              <dt>카메라 기준</dt>
              <dd>
                “상자는 내 앞 <strong>30cm</strong>에 있어.”
              </dd>
            </div>
          </dl>
          <p>
            카메라가 로봇보다 20cm 앞에 있고 둘이 같은 방향을 본다면, 두 설명은
            모두 맞아요.
          </p>
        </div>
        <div className="tf-translation">
          <h3>TF는 ‘위치 통역사’예요.</h3>
          <p>
            TF는 ‘카메라가 로봇보다 20cm 앞에 있다’는 관계를 이용해, 카메라 기준
            30cm를 로봇 기준 50cm로 바꿔 줘요.
          </p>
          <div
            className="tf-equation"
            aria-label="카메라 앞 30센티미터에 기준 사이 거리 20센티미터를 더하면 로봇 앞 50센티미터"
          >
            <div>
              <span>카메라 앞</span>
              <strong>30cm</strong>
            </div>
            <span aria-hidden="true">+ 20cm =</span>
            <div>
              <span>로봇 앞</span>
              <strong>50cm</strong>
            </div>
          </div>
          <p className="tf-model-note">
            방향이 다르면, 얼마나 돌아가 있는지를 나타내는 회전 관계도 함께
            반영해요.
          </p>
        </div>
        <div className="tf-question-comparison">
          <table>
            <caption>좌표계와 TF, 질문으로 구분하기</caption>
            <thead>
              <tr>
                <th scope="col">구분</th>
                <th scope="col">쉬운 질문</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">좌표계</th>
                <td>“어디를 기준으로, 어느 방향으로 잴까?”</td>
              </tr>
              <tr>
                <th scope="row">TF</th>
                <td>“이 기준으로 잰 위치를 다른 기준으로 바꾸면 얼마일까?”</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="tf-to-moveit">
          <h3>카메라에서 로봇 손까지</h3>
          <ol>
            <li>
              <strong>카메라</strong>
              <span>상자의 위치를 찾아요.</span>
            </li>
            <li>
              <strong>TF</strong>
              <span>로봇 기준으로 바꿔요.</span>
            </li>
            <li>
              <strong>MoveIt</strong>
              <span>팔의 움직임을 계산해요.</span>
            </li>
          </ol>
          <p>
            카메라가 찾은 상자 위치를 TF로 로봇 기준에 맞춰 바꾼 뒤, MoveIt이
            팔의 움직임을 계산할 수 있어요.
          </p>
        </div>
        <a
          className="text-link tf-reference"
          href="https://docs.ros.org/en/jazzy/Concepts/Intermediate/About-Tf2.html"
        >
          ROS 2의 TF 공식 설명 읽기
        </a>
      </LessonParts>
    </div>
  );
}
