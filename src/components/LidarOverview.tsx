import LessonParts from "./LessonParts";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

export default function LidarOverview({ part }: { part?: number }) {
  const [distance, setDistance] = useState(3);
  const id = useId();
  const wallX = 120 + distance * 80;
  const format = (value: number) => `${Number(value.toFixed(1))}m`;

  return (
    <div className="lidar-overview">
      <LessonParts name="lidar-overview" part={part}>
        <div className="lidar-lab">
          <p className="eyebrow">빛으로 재는 거리</p>
          <h3>벽을 가까이, 멀리 옮겨 보세요.</h3>
          <svg
            className="lidar-scene"
            viewBox="0 0 640 270"
            role="img"
            aria-labelledby={`${id}-title ${id}-description`}
          >
            <title id={`${id}-title`}>
              LiDAR에서 벽까지 {format(distance)}
            </title>
            <desc id={`${id}-description`}>
              로봇의 LiDAR가 빛을 벽으로 보내고 반사된 빛을 받아요. 벽까지의
              거리는 {format(distance)}, 빛이 왕복한 거리는{" "}
              {format(distance * 2)}
              예요.
            </desc>
            <defs>
              <marker
                id={`${id}-arrow`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M2 1 8 5 2 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </marker>
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
              y="44"
              width="600"
              height="192"
              rx="12"
              fill={`url(#${id}-grid)`}
              opacity="0.45"
            />
            <g
              fill="var(--color-raised)"
              stroke="var(--color-muted)"
              strokeWidth="2"
            >
              <rect x="73" y="94" width="94" height="80" rx="24" />
              <rect x="63" y="108" width="14" height="50" rx="5" />
              <rect x="163" y="108" width="14" height="50" rx="5" />
              <circle cx="120" cy="124" r="19" fill="var(--color-surface)" />
            </g>
            <circle cx="120" cy="124" r="7" fill="var(--color-accent)" />
            <rect
              x={wallX}
              y="65"
              width="24"
              height="116"
              rx="4"
              fill="var(--color-raised)"
              stroke="var(--color-muted)"
              strokeWidth="2"
            />
            <g
              stroke="var(--color-accent)"
              color="var(--color-accent)"
              strokeWidth="2.5"
              fill="none"
            >
              <path
                d={`M142 112H${wallX - 5}`}
                markerEnd={`url(#${id}-arrow)`}
              />
              <path
                d={`M${wallX - 2} 138H143`}
                strokeDasharray="6 6"
                markerEnd={`url(#${id}-arrow)`}
              />
            </g>
            <g fill="var(--color-accent)">
              <circle cx={wallX} cy="112" r="4" />
              <circle cx={wallX} cy="138" r="4" />
            </g>
            <g
              className="lidar-svg-label"
              fill="var(--color-ink)"
              textAnchor="middle"
            >
              <text x="120" y="213">
                LiDAR
              </text>
              <text x={wallX + 12} y="213">
                벽
              </text>
            </g>
            <g stroke="var(--color-muted)" strokeWidth="1" fill="none">
              <path d={`M120 226v16m0-8H${wallX}m0-8v16`} />
            </g>
            <text
              x={(120 + wallX) / 2}
              y="263"
              className="lidar-svg-label"
              textAnchor="middle"
              fill="var(--color-accent)"
            >
              {format(distance)}
            </text>
          </svg>
          <div className="lidar-key" aria-hidden="true">
            <span>실선: 보내는 빛</span>
            <span>점선: 돌아오는 빛</span>
          </div>
          <div className="lidar-control">
            <label htmlFor={`${id}-distance`}>벽까지의 거리</label>
            <output
              htmlFor={`${id}-distance`}
              className="lidar-distance"
              aria-live="polite"
            >
              {format(distance)}
            </output>
            <input
              id={`${id}-distance`}
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={distance}
              aria-valuetext={`${distance}미터`}
              onChange={(event) => setDistance(Number(event.target.value))}
            />
            <span className="lidar-range-label">가까이 · 1m</span>
            <span className="lidar-range-label">멀리 · 5m</span>
          </div>
          <div
            className="lidar-roundtrip"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>빛이 왕복한 거리 {format(distance * 2)}</span>
            <span>÷ 2 = 벽까지 {format(distance)}</span>
          </div>
          <p className="lidar-caption">
            빛의 길을 보기 쉽게 벌려 그린 설명 그림이에요.
          </p>
        </div>
        <div className="lidar-explanation">
          <h3>보내고, 반사되고, 돌아와요.</h3>
          <p>
            펄스 방식의 LiDAR는 빛이 돌아오는 데 걸린 시간으로 거리를 구해요.
            멀리 있는 벽일수록 더 오래 걸려요.
          </p>

          <p>
            빛은 벽까지 갔다가 돌아오니까, 왕복한 거리의 절반이 벽까지의
            거리예요.
          </p>
        </div>
        <div className="lidar-explanation">
          <h3>여러 방향으로 재면, 주변 모양이 보여요.</h3>
          <p>
            측정한 방향과 거리를 점으로 찍으면 벽과 물체의 윤곽이 나타나요. 한
            평면을 살피는 2D LiDAR도, 높이까지 살피는 3D LiDAR도 있어요.
          </p>
          <p>
            주행 프로그램은 이 정보를 이용해 장애물을 피하거나 지도를 만드는 데
            도움을 받아요.
          </p>
        </div>
        <aside className="lidar-connection">
          <h3>ROS 2와 연결하면?</h3>
          <p>
            LiDAR의 거리 정보를 다른 노드에 전할 수 있어요. 정보를 받은 주행
            프로그램이 어디로 움직일지 판단해요.
          </p>
          <Link to="/blog/ros2-concept-block">ROS 2란? 읽기</Link>
        </aside>
        <p className="lidar-reference">
          설명의 바탕:{" "}
          <a
            href="https://www.nasa.gov/technology/improving-lidars-for-exploration/"
            target="_blank"
            rel="noreferrer"
          >
            NASA의 LiDAR 원리 설명
          </a>{" "}
          ·{" "}
          <a
            href="https://docs.ros.org/en/jazzy/p/sensor_msgs/msg/LaserScan.html"
            target="_blank"
            rel="noreferrer"
          >
            ROS 2 거리 측정 메시지
          </a>
        </p>
      </LessonParts>
    </div>
  );
}
