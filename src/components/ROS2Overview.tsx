import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

const jobs = [
  {
    title: "주변을 읽어요",
    name: "센서 노드",
    detail:
      "센서가 잰 거리를 전해요. 다른 프로그램은 이 정보를 받아 주변 상황을 알 수 있어요.",
    message: "앞쪽 거리: 50cm",
  },
  {
    title: "어떻게 할지 정해요",
    name: "판단 노드",
    detail:
      "받은 거리를 보고 장애물이 가깝다고 판단해요. 멈추도록 목표 속도를 보내요.",
    message: "목표 속도: 0m/s",
  },
  {
    title: "바퀴를 움직여요",
    name: "제어 노드",
    detail: "목표 속도를 받아 모터를 제어해요. 이 예에서는 바퀴를 멈춰요.",
    message: "바퀴를 멈춰요",
  },
];

function JobIcon({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {index === 0 ? (
          <>
            <rect x="15" y="27" width="34" height="21" rx="6" />
            <path d="M25 27v-6h14v6M20 54h24M26 48v6m12-6v6M17 17a22 22 0 0 1 30 0M23 22a13 13 0 0 1 18 0" />
            <circle cx="26" cy="37" r="2" />
            <circle cx="38" cy="37" r="2" />
          </>
        ) : index === 1 ? (
          <>
            <rect x="18" y="18" width="28" height="28" rx="5" />
            <path d="M25 10v8m14-8v8M25 46v8m14-8v8M10 25h8m-8 14h8m28-14h8m-8 14h8M25 32h14m-6-6 6 6-6 6" />
          </>
        ) : (
          <>
            <path d="M20 24h24v20H20zM26 18h12v6M26 44v6m12-6v6" />
            <rect x="10" y="25" width="10" height="20" rx="4" />
            <rect x="44" y="25" width="10" height="20" rx="4" />
            <path d="M28 34h8M8 16h10m-6-5-5 5 5 5M46 16h10m-5-5 5 5-5 5" />
          </>
        )}
      </g>
    </svg>
  );
}

export default function ROS2Overview({ part }: { part?: number }) {
  const [active, setActive] = useState(0);
  const id = useId();
  return (
    <div className="ros2-overview">
      <LessonParts name="ros2-overview" part={part}>
        <div className="ros2-example">
          <p className="eyebrow">작은 프로그램들의 팀워크</p>
          <h3>앞에 장애물이 나타났어요.</h3>
          <p className="ros2-instruction">세 프로그램을 차례로 눌러 보세요.</p>
          <div
            className="ros2-flow"
            role="group"
            aria-label="로봇 프로그램의 역할"
          >
            {jobs.map((job, index) => (
              <button
                type="button"
                className="ros2-node"
                key={job.name}
                aria-pressed={active === index}
                aria-controls={`${id}-detail`}
                onClick={() => setActive(index)}
              >
                <span className="ros2-node-number">0{index + 1}</span>
                <JobIcon index={index} />
                <span className="ros2-node-title">{job.title}</span>
                <span className="ros2-node-name">{job.name}</span>
              </button>
            ))}
          </div>
          <div
            className="ros2-detail"
            id={`${id}-detail`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="ros2-message">{jobs[active].message}</span>
            <p>{jobs[active].detail}</p>
          </div>
          <p className="ros2-caption">
            역할과 정보의 흐름을 단순하게 그린 예예요.
          </p>
        </div>
        <div className="ros2-building-blocks">
          <h3>작게 나누고, 서로 연결해요.</h3>
          <p>
            각자 역할을 맡은 작은 프로그램을 <strong>노드(Node)</strong>라고
            해요. 노드끼리는 거리나 속도 같은 정보를 메시지로 주고받아요.
          </p>
          <p>
            ROS 2는 이 통신과 개발에 필요한 도구를 제공해요. 무엇을 보고 어떻게
            움직일지는 개발자가 만들거나 알맞은 기능을 연결해요.
          </p>
        </div>
        <aside className="ros2-moveit-note">
          <h3>그럼 MoveIt과는 어떤 관계일까요?</h3>
          <p>
            ROS 2로 여러 프로그램을 연결하고, 로봇팔의 움직임 계획은 MoveIt 2에
            맡길 수 있어요.
          </p>
          <Link to="/blog/moveit-concept-block">MoveIt이란? 읽기</Link>
        </aside>
        <p className="ros2-reference">
          설명의 바탕:{" "}
          <a
            href="https://docs.ros.org/en/jazzy/Concepts/Basic/About-Nodes.html"
            target="_blank"
            rel="noreferrer"
          >
            ROS 2 공식 노드 문서
          </a>{" "}
          ·{" "}
          <a
            href="https://docs.ros.org/en/jazzy/Concepts/Basic/About-Topics.html"
            target="_blank"
            rel="noreferrer"
          >
            토픽 문서
          </a>
        </p>
      </LessonParts>
    </div>
  );
}
