import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import fallback from "../assets/kinematic-sculpture.svg";
import { createKinematicSculpture } from "./KinematicSculpture";

// Shared spring response drives rigid joint angles and a subtle viewing tilt.
export default function RuledSurface({ paused }: { paused: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const stopped = useRef(paused);
  const invalidateRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    stopped.current = paused;
    invalidateRef.current();
  }, [paused]);
  useEffect(() => {
    const element = host.current!;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
    camera.position.set(0, 3.7, 12);
    camera.lookAt(0, 0, 0);
    const group = new THREE.Group();
    group.position.y = -0.95;
    scene.add(new THREE.AmbientLight(0xffffff, 1.7));
    const key = new THREE.DirectionalLight(0xffead8, 3.2);
    key.position.set(-4, 6, 8);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xf4c8dc, 1.4);
    fill.position.set(5, 1, -3);
    scene.add(fill);
    scene.add(group);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const state = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      vx: 0,
      vy: 0,
      energy: 0,
      time: 0,
      last: 0,
      active: false,
      visible: true,
      lost: false,
      raf: 0,
    };
    const sculpture = createKinematicSculpture(group);
    const clamp = THREE.MathUtils.clamp;
    function draw() {
      sculpture.update(state.time, state.x, state.y);
      group.rotation.y = -0.38 + state.x * 0.024;
      group.rotation.x = 0.22 + state.y * 0.018;
      renderer.render(scene, camera);
      element.dataset.motion =
        stopped.current || media.matches ? "paused" : "playing";
      element.dataset.deflection = state.energy.toFixed(3);
      element.dataset.geometry = "articulated-linkage";
    }
    function frame(now: number) {
      state.raf = 0;
      if (!state.visible || document.hidden || state.lost) return;
      const dt = state.last
        ? Math.min((now - state.last) / 1000, 0.04)
        : 1 / 60;
      state.last = now;
      if (!stopped.current && !media.matches) {
        state.time += dt;
        state.vx =
          (state.vx + (state.tx - state.x) * 40 * dt) * Math.exp(-9 * dt);
        state.vy =
          (state.vy + (state.ty - state.y) * 40 * dt) * Math.exp(-9 * dt);
        state.x += state.vx * dt;
        state.y += state.vy * dt;
        state.energy +=
          ((state.active ? 1 : 0) - state.energy) * (1 - Math.exp(-3.5 * dt));
      }
      draw();
      if (!stopped.current && !media.matches)
        state.raf = requestAnimationFrame(frame);
    }
    function invalidate() {
      if (!state.raf && state.visible && !document.hidden && !state.lost)
        state.raf = requestAnimationFrame(frame);
    }
    invalidateRef.current = () => {
      state.last = 0;
      invalidate();
    };
    function resize() {
      const w = element.clientWidth,
        h = element.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(
        Math.min(devicePixelRatio || 1, w < 768 ? 1.4 : 1.75),
      );
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w < 500 ? 14 : 12;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      invalidate();
    }
    function theme() {
      const style = getComputedStyle(document.documentElement),
        accent = new THREE.Color(
          style.getPropertyValue("--color-accent").trim(),
        ),
        ink = new THREE.Color(style.getPropertyValue("--color-ink").trim());
      sculpture.theme(
        accent,
        ink,
        document.documentElement.dataset.theme === "light",
      );
      invalidate();
    }
    function move(event: PointerEvent) {
      if (stopped.current || media.matches || event.pointerType === "touch")
        return;
      const rect = element.getBoundingClientRect();
      state.tx = clamp(
        ((event.clientX - rect.left) / rect.width - 0.5) * 11,
        -5.5,
        5.5,
      );
      state.ty = clamp(
        (0.65 - (event.clientY - rect.top) / rect.height) * 5,
        -1.5,
        1.5,
      );
      state.active = true;
      invalidate();
    }
    function leave() {
      state.active = false;
      state.tx = 0;
      state.ty = 0;
      invalidate();
    }
    function visibility() {
      state.last = 0;
      if (document.hidden) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      } else invalidate();
    }
    function lost(event: Event) {
      event.preventDefault();
      state.lost = true;
      cancelAnimationFrame(state.raf);
      setReady(false);
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    const intersection = new IntersectionObserver((entries) => {
      state.visible = entries[0].isIntersecting;
      state.last = 0;
      if (!state.visible) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      } else invalidate();
    });
    intersection.observe(element);
    const stage = element.parentElement!.parentElement!;
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("wonho:themechange", theme);
    media.addEventListener("change", invalidate);
    canvas.addEventListener("webglcontextlost", lost);
    element.appendChild(canvas);
    theme();
    resize();
    setReady(true);
    return () => {
      cancelAnimationFrame(state.raf);
      invalidateRef.current = () => {};
      resizeObserver.disconnect();
      intersection.disconnect();
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("wonho:themechange", theme);
      media.removeEventListener("change", invalidate);
      canvas.removeEventListener("webglcontextlost", lost);
      sculpture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);
  return (
    <div
      ref={host}
      className={`ruled-surface ${ready ? "is-ready" : ""}`}
      data-renderer={ready ? "three.js" : "static"}
    >
      <img className="surface-fallback" src={fallback} alt="" hidden={ready} />
    </div>
  );
}
