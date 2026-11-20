import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { fallbackMarkers, worldStops } from "../data/world";
import type { WorldView } from "./RoverWorld";
import WorldMapFallback from "./WorldMapFallback";
const RoverWorld = lazy(() => import("./RoverWorld"));

export default function WorldHero() {
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [paused, setPaused] = useState(reduced);
  const [holding, setHolding] = useState(false);
  const [destination, setDestination] = useState(worldStops[0].id);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<WorldView>({
    renderer: "static",
    markers: fallbackMarkers,
  });
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const onArrive = useCallback((id: string) => {
    setActiveId(id);
    setVisited((previous) => new Set(previous).add(id));
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(media.matches);
      if (media.matches) setPaused(true);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const choose = useCallback(
    (id: string) => {
      if (destination === id) return;
      setHolding(false);
      setActiveId(null);
      setDestination(id);
    },
    [destination],
  );
  useEffect(() => {
    if (!activeId || paused || reduced || holding) return;
    const timer = window.setTimeout(() => {
      const index = worldStops.findIndex((stop) => stop.id === activeId);
      choose(worldStops[(index + 1) % worldStops.length].id);
    }, 6500);
    return () => clearTimeout(timer);
  }, [activeId, paused, reduced, holding, choose]);
  const activeIndex = worldStops.findIndex((stop) => stop.id === activeId);
  const active = worldStops[activeIndex];
  const selectedIndex = worldStops.findIndex((stop) => stop.id === destination);
  const marker = view.markers[Math.max(0, activeIndex)];
  const isProject =
    active?.href.startsWith("/work/") || active?.href.startsWith("/side-work/");

  return (
    <section className="exploration-hero" aria-labelledby="hero-title">
      <header className="world-heading container">
        <p className="world-question">
          WANNA CREATE?
          <br />
          WANT A HOW?
        </p>
        <h1 id="hero-title">
          <span>WONHO makes</span> <em>it real.</em>
        </h1>
        <p className="world-introduction">
          작은 로봇과 함께, 원호의 세계를 탐색해 보세요.
        </p>
      </header>
      <div
        className="world-stage container"
        style={
          {
            "--stop-x": `${marker.x}%`,
            "--stop-y": `${marker.y}%`,
          } as CSSProperties
        }
      >
        <div
          className="world-canvas-area"
          aria-label="주행 로봇이 탐색하는 프로젝트 월드"
        >
          <div className="world-ambient" aria-hidden="true" />
          {view.renderer === "static" && (
            <WorldMapFallback active={destination} />
          )}
          <Suspense fallback={null}>
            <RoverWorld
              paused={paused || reduced || holding}
              destination={destination}
              onArrive={onArrive}
              onView={setView}
            />
          </Suspense>
          <div className="world-map-status">
            <span className="world-live-mark" />
            <span>
              {paused || reduced
                ? "탐색 일시 정지"
                : active
                  ? "새로운 곳을 만났어요"
                  : "로봇이 이동하고 있어요"}
            </span>
          </div>
          {worldStops.map((stop, index) => {
            const p = view.markers[index];
            return (
              <button
                key={stop.id}
                type="button"
                tabIndex={-1}
                className={`world-marker${destination === stop.id ? " is-destination" : ""}${visited.has(stop.id) ? " is-visited" : ""}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                aria-label={`${stop.label} 지점`}
                onClick={() => choose(stop.id)}
              >
                <span className="world-marker-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="world-marker-label">{stop.label}</span>
              </button>
            );
          })}
        </div>
        <div className="world-card-slot">
          {active ? (
            <Link
              key={active.id}
              className="world-discovery-card"
              to={active.href}
              aria-label={`${active.title} ${isProject ? "프로젝트" : "페이지"} 보기`}
              onPointerEnter={() => setHolding(true)}
              onPointerLeave={() => setHolding(false)}
              onFocus={() => setHolding(true)}
              onBlur={() => setHolding(false)}
            >
              <span className="world-card-category">{active.category}</span>
              <h2>{active.title}</h2>
              <p>{active.description}</p>
              <span className="world-card-action">
                {isProject ? "프로젝트 보기" : "페이지 보기"}
                <span aria-hidden="true">＋</span>
              </span>
            </Link>
          ) : (
            <p className="world-travel-note" role="status">
              {worldStops[selectedIndex].label}로 이동 중이에요.
              <br />
              <span>도착하면 이야기가 펼쳐집니다.</span>
            </p>
          )}
        </div>
      </div>
      <div className="world-toolbar container">
        <div>
          <p className="world-caption">
            복잡한 움직임에 질서를.
            <br />
            정교한 기술에 사람의 감각을.
          </p>
          <p className="world-help" id="world-help">
            방문할 곳을 골라 보세요. 설명 카드를 누르면 해당 페이지로
            이동합니다.
          </p>
        </div>
        <div className="world-actions">
          <button
            type="button"
            className="world-control"
            aria-pressed={paused || reduced}
            disabled={reduced}
            onClick={() => setPaused((value) => !value)}
          >
            {reduced
              ? "모션 줄이기 적용"
              : paused
                ? "움직임 재생"
                : "움직임 멈춤"}
          </button>
          <button
            type="button"
            className="world-control"
            onClick={() =>
              choose(worldStops[(selectedIndex + 1) % worldStops.length].id)
            }
          >
            다음 장소
          </button>
          <Link className="text-link" to="/work">
            Explore my work ↗
          </Link>
        </div>
      </div>
      <nav className="world-places container" aria-label="월드에서 방문할 곳">
        {worldStops.map((stop, index) => (
          <button
            key={stop.id}
            type="button"
            aria-pressed={destination === stop.id}
            onClick={() => choose(stop.id)}
          >
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            {stop.label}
          </button>
        ))}
      </nav>
    </section>
  );
}
