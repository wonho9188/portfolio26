import { useEffect, useRef } from "react";
import * as THREE from "three";
import { fallbackMarkers, worldStops } from "../data/world";
import { advanceOnLoop } from "./world-motion";
import { createRoverScene, landmarkPosition } from "./RoverScene";

export type WorldView = {
  renderer: "three.js" | "static";
  markers: { x: number; y: number }[];
};

export default function RoverWorld({
  paused,
  destination,
  onArrive,
  onView,
}: {
  paused: boolean;
  destination: string;
  onArrive: (id: string) => void;
  onView: (view: WorldView) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const current = useRef({ paused, destination, onArrive, onView });
  const invalidate = useRef<() => void>(() => {});
  useEffect(() => {
    current.current = { paused, destination, onArrive, onView };
    invalidate.current();
  }, [paused, destination, onArrive, onView]);
  useEffect(() => {
    const element = host.current!;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    let renderer: THREE.WebGLRenderer | undefined;
    let fallback = false;
    let lastFallback = "";
    const fallbackFrame = () => {
      if (lastFallback === current.current.destination) return;
      lastFallback = current.current.destination;
      element.dataset.renderer = "static";
      element.dataset.motion = "paused";
      element.dataset.phase = "arrived";
      element.dataset.stop = lastFallback;
      current.current.onView({ renderer: "static", markers: fallbackMarkers });
      current.current.onArrive(lastFallback);
    };
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      fallback = true;
      invalidate.current = fallbackFrame;
      fallbackFrame();
      return () => {
        invalidate.current = () => {};
      };
    }
    const draw = renderer;
    draw.setClearColor(0, 0);
    draw.outputColorSpace = THREE.SRGBColorSpace;
    draw.toneMapping = THREE.ACESFilmicToneMapping;
    draw.toneMappingExposure = 1.15;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-12, 12, 8, -8, 0.1, 100);
    camera.position.set(12, 16, 19);
    camera.lookAt(0, 0.15, 0);
    camera.updateMatrixWorld();
    scene.add(new THREE.HemisphereLight("#fff1df", "#96778a", 2.3));
    const key = new THREE.DirectionalLight("#ffe7cd", 3.8);
    key.position.set(-7, 12, 7);
    scene.add(key);
    const rim = new THREE.DirectionalLight("#eac2d5", 2.1);
    rim.position.set(8, 7, -8);
    scene.add(rim);
    const model = createRoverScene(scene);
    const initial = Math.max(
      0,
      worldStops.findIndex((stop) => stop.id === current.current.destination),
    );
    const state = {
      progress: current.current.paused ? initial / worldStops.length : 0.94,
      goal: initial,
      arrived: false,
      direction: 1,
      raf: 0,
      last: 0,
      visible: true,
      disposed: false,
    };
    function frame(now: number) {
      state.raf = 0;
      if (state.disposed || !state.visible || document.hidden || fallback)
        return;
      const dt = state.last
        ? Math.min((now - state.last) / 1000, 0.045)
        : 1 / 60;
      state.last = now;
      const goal = Math.max(
        0,
        worldStops.findIndex((stop) => stop.id === current.current.destination),
      );
      if (goal !== state.goal) {
        state.goal = goal;
        state.arrived = false;
        if (current.current.paused) state.progress = goal / worldStops.length;
      }
      const previous = model.curve.getPoint(state.progress);
      const target = goal / worldStops.length;
      if (
        !current.current.paused ||
        Math.abs(state.progress - target) < 0.00001
      ) {
        const next = advanceOnLoop(
          state.progress,
          target,
          current.current.paused ? 0 : dt * 0.095,
        );
        state.progress = next.progress;
        if (!next.arrived) state.direction = next.direction;
        if (next.arrived && !state.arrived) {
          state.arrived = true;
          current.current.onArrive(worldStops[goal].id);
        }
      }
      const distance = previous.distanceTo(
        model.curve.getPoint(state.progress),
      );
      model.update(state.progress, state.direction, distance, dt, goal);
      draw.render(scene, camera);
      element.dataset.renderer = "three.js";
      element.dataset.motion = current.current.paused ? "paused" : "playing";
      element.dataset.phase = state.arrived
        ? "arrived"
        : current.current.paused
          ? "paused"
          : "driving";
      element.dataset.progress = state.progress.toFixed(5);
      element.dataset.stop = worldStops[goal].id;
      if (!current.current.paused && !state.arrived)
        state.raf = requestAnimationFrame(frame);
    }
    function requestFrame() {
      if (fallback) {
        fallbackFrame();
        return;
      }
      if (!state.disposed && !state.raf && state.visible && !document.hidden)
        state.raf = requestAnimationFrame(frame);
    }
    invalidate.current = () => {
      state.last = 0;
      element.dataset.motion = current.current.paused ? "paused" : "playing";
      if (!state.visible) {
        const goal = Math.max(
          0,
          worldStops.findIndex(
            (stop) => stop.id === current.current.destination,
          ),
        );
        if (goal !== state.goal) {
          state.goal = goal;
          state.progress = goal / worldStops.length;
          state.arrived = true;
          model.update(state.progress, state.direction, 0, 1, goal);
          element.dataset.progress = state.progress.toFixed(5);
          element.dataset.stop = worldStops[goal].id;
          current.current.onArrive(worldStops[goal].id);
        }
        element.dataset.phase = state.arrived ? "arrived" : "paused";
      }
      requestFrame();
    };
    function resize() {
      const w = element.clientWidth,
        h = element.clientHeight;
      if (!w || !h || fallback) return;
      draw.setPixelRatio(Math.min(devicePixelRatio || 1, w < 768 ? 1.2 : 1.5));
      draw.setSize(w, h, false);
      const aspect = w / h;
      let extentX = 0,
        extentY = 0;
      for (const x of [-10, 10])
        for (const y of [-0.5, 2])
          for (const z of [-7, 7]) {
            const p = new THREE.Vector3(x, y, z).applyMatrix4(
              camera.matrixWorldInverse,
            );
            extentX = Math.max(extentX, Math.abs(p.x));
            extentY = Math.max(extentY, Math.abs(p.y));
          }
      const half = Math.max(extentY + 0.25, (extentX + 0.3) / aspect);
      camera.left = -half * aspect;
      camera.right = half * aspect;
      camera.top = half;
      camera.bottom = -half;
      camera.updateProjectionMatrix();
      const markers = worldStops.map((_, index) => {
        const p = landmarkPosition(index).setY(1.95).project(camera);
        return { x: (p.x + 1) * 50, y: (1 - p.y) * 50 };
      });
      current.current.onView({ renderer: "three.js", markers });
      requestFrame();
    }
    function theme() {
      model.theme(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-accent")
          .trim(),
        document.documentElement.dataset.theme === "light",
      );
      requestFrame();
    }
    function visibility() {
      state.last = 0;
      if (document.hidden) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      } else requestFrame();
    }
    function contextLost(event: Event) {
      event.preventDefault();
      fallback = true;
      cancelAnimationFrame(state.raf);
      state.raf = 0;
      fallbackFrame();
    }
    const size = new ResizeObserver(resize);
    size.observe(element);
    const intersection = new IntersectionObserver((entries) => {
      state.visible = entries[0].isIntersecting;
      state.last = 0;
      if (!state.visible) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      } else requestFrame();
    });
    intersection.observe(element);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("wonho:themechange", theme);
    canvas.addEventListener("webglcontextlost", contextLost);
    element.appendChild(canvas);
    theme();
    resize();
    requestFrame();
    return () => {
      state.disposed = true;
      cancelAnimationFrame(state.raf);
      invalidate.current = () => {};
      size.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("wonho:themechange", theme);
      canvas.removeEventListener("webglcontextlost", contextLost);
      model.dispose();
      draw.dispose();
      draw.forceContextLoss();
      canvas.remove();
    };
  }, []);
  return (
    <div
      ref={host}
      className="rover-renderer"
      data-renderer="static"
      aria-hidden="true"
    />
  );
}
