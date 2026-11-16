import { lazy, Suspense, useEffect, useState } from "react";
import heroGlow from "../assets/hero-glow.svg";
import fallback from "../assets/ruled-surface-fallback.png";
import { scrollTo } from "./primitives";
const RuledSurface = lazy(() => import("./RuledSurface"));
export default function Hero() {
  const [paused, setPaused] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(media.matches);
      if (media.matches) setPaused(true);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-art" aria-hidden="true">
          <img className="hero-glow" src={heroGlow} alt="" />
          <Suspense
            fallback={
              <img className="surface-fallback" src={fallback} alt="" />
            }
          >
            <RuledSurface paused={paused} />
          </Suspense>
        </div>
        <div className="hero-statement">
          <p className="hero-question">
            WANNA CREATE?
            <br />
            WANT A HOW?
          </p>
          <h1 id="hero-title">
            <span>WONHO makes</span> <em>it real.</em>
          </h1>
        </div>
        <div className="container hero-bottom">
          <p>
            복잡한 움직임에 질서를.
            <br />
            정교한 기술에 사람의 감각을.
          </p>
          <div>
            <button
              className="motion-button"
              aria-pressed={paused || reduced}
              disabled={reduced}
              onClick={() => setPaused(!paused)}
            >
              {reduced
                ? "모션 줄이기 적용"
                : paused
                  ? "움직임 재생"
                  : "움직임 멈춤"}
            </button>
            <button className="text-link" onClick={() => scrollTo("main-work")}>
              Explore my work ↗
            </button>
          </div>
        </div>
      </section>
      <div className="scroll-gateway">
        <button
          aria-label="소개와 작업으로 스크롤"
          onClick={() => scrollTo("about")}
        >
          ↓
        </button>
      </div>
    </>
  );
}
