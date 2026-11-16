import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import fallback from "../assets/ruled-surface-fallback.png";

// Geometry and the spring/ripple response preserve the approved 2026-11-14 prototype.
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
    camera.position.set(0, 5.8, 11.5);
    camera.lookAt(0, 1.2, 0);
    const group = new THREE.Group();
    group.position.y = 0.1;
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
    const ripples: { x: number; y: number; t: number; force: number }[] = [];
    let lastRipple = -1;
    const count = element.clientWidth < 500 ? 36 : 52,
      segments = 100;
    const uv: number[] = [];
    for (let i = 0; i < count; i++)
      for (let j = 0; j < segments; j++)
        for (const step of [j, j + 1])
          uv.push((step / segments) * 2 - 1, (i / (count - 1)) * 2 - 1);
    const positions = new Float32Array((uv.length / 2) * 3),
      colors = new Float32Array(positions.length);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(geometry, material);
    lines.frustumCulled = false;
    group.add(lines);
    const edges = [-1, 1].map((v) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(131 * 3), 3).setUsage(
          THREE.DynamicDrawUsage,
        ),
      );
      const line = new THREE.Line(
        g,
        new THREE.LineBasicMaterial({
          transparent: true,
          opacity: 0.86,
          depthWrite: false,
        }),
      );
      line.frustumCulled = false;
      group.add(line);
      return { v, line };
    });
    const clamp = THREE.MathUtils.clamp;
    const shape = (u: number, v: number) => {
      const t = state.time,
        twist = 1.68 * u + 0.12 * Math.sin(t * 0.25);
      const x = u * 5.15 + 0.3 * v * Math.sin(u * 1.3);
      let y =
        0.87 * v * Math.sin(twist) +
        0.43 * Math.sin(u * 2.5 + 0.3) +
        0.17 * (1 - v * v) * Math.cos(u * 3.1);
      const z = 1.28 * v * Math.cos(twist) + 0.14 * Math.cos(u * 2.7);
      if (!media.matches) y += 0.055 * Math.sin(u * 3.2 - t * 0.55 + v * 0.8);
      const dist = (x - state.x) ** 2 / 2.8 + (z - state.y) ** 2 / 1.2;
      y += state.energy * 0.38 * Math.exp(-dist);
      for (const r of ripples) {
        const age = t - r.t,
          d = Math.hypot((x - r.x) * 0.8, (z - r.y) * 1.3);
        y +=
          r.force *
          0.12 *
          Math.sin(d * 3.4 - age * 3.7) *
          Math.exp(-d * 0.4 - age * 1.25) *
          (1 - Math.exp(-age * 8));
      }
      return [x, y, z];
    };
    function draw() {
      for (let i = 0; i < uv.length / 2; i++)
        positions.set(shape(uv[i * 2], uv[i * 2 + 1]), i * 3);
      geometry.attributes.position.needsUpdate = true;
      group.rotation.y = 0.1 + state.x * 0.018;
      group.rotation.z = state.y * 0.018;
      for (const { v, line } of edges) {
        const a = line.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j <= 130; j++) a.set(shape(j / 65 - 1, v), j * 3);
        line.geometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
      element.dataset.motion =
        stopped.current || media.matches ? "paused" : "playing";
      element.dataset.deflection = state.energy.toFixed(3);
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
        while (ripples.length && state.time - ripples[0].t > 5) ripples.shift();
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
      camera.position.z = w < 500 ? 18.5 : 11.5;
      camera.lookAt(0, 1.2, 0);
      camera.updateProjectionMatrix();
      invalidate();
    }
    function theme() {
      const style = getComputedStyle(document.documentElement),
        accent = new THREE.Color(
          style.getPropertyValue("--color-accent").trim(),
        ),
        ink = new THREE.Color(style.getPropertyValue("--color-ink").trim());
      for (let i = 0; i < uv.length / 2; i++) {
        const c = accent
          .clone()
          .lerp(ink, 0.12 + 0.3 * Math.pow(1 - Math.abs(uv[i * 2]), 1.5));
        c.toArray(colors, i * 3);
      }
      geometry.attributes.color.needsUpdate = true;
      for (const { line } of edges)
        line.material.color.copy(accent).lerp(ink, 0.22);
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
      const travel = Math.hypot(state.tx - state.x, state.ty - state.y);
      state.active = true;
      if (state.time - lastRipple > 0.14 && travel > 0.16) {
        ripples.push({
          x: state.tx,
          y: state.ty,
          t: state.time,
          force: clamp(travel * 0.35, 0.12, 1),
        });
        if (ripples.length > 6) ripples.shift();
        lastRipple = state.time;
      }
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
      geometry.dispose();
      material.dispose();
      for (const { line } of edges) {
        line.geometry.dispose();
        line.material.dispose();
      }
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
