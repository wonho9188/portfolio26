import { useEffect, useRef, useState } from "react";

const TOP_EDGE = 8;
const DIRECTION_DISTANCE = 10;

export function useHeaderScroll(pinned: boolean, pathname: string) {
  const headerRef = useRef<HTMLElement>(null);
  const [state, setState] = useState(() => ({
    atTop: window.scrollY <= TOP_EDGE,
    hidden: false,
  }));

  useEffect(() => {
    let previousY = window.scrollY;
    let direction = 0;
    let distance = 0;
    let frame = 0;

    const measure = () => {
      frame = 0;
      // Clamp elastic overscroll so the bottom edge cannot falsely reveal the header.
      const maxY = Math.max(
        0,
        document.documentElement.scrollHeight - innerHeight,
      );
      const y = Math.max(0, Math.min(window.scrollY, maxY));
      const delta = y - previousY;
      previousY = y;
      const atTop = y <= TOP_EDGE;
      const keyboardFocus =
        headerRef.current?.contains(document.activeElement) &&
        document.activeElement?.matches(":focus-visible");

      if (atTop || pinned || keyboardFocus) {
        direction = 0;
        distance = 0;
        setState((current) =>
          current.atTop === atTop && !current.hidden
            ? current
            : { atTop, hidden: false },
        );
        return;
      }

      const nextDirection = Math.sign(delta);
      if (nextDirection && nextDirection !== direction) {
        direction = nextDirection;
        distance = 0;
      }
      distance += Math.abs(delta);
      const changedDirection = distance >= DIRECTION_DISTANCE;
      if (changedDirection) distance = 0;
      setState((current) => {
        const hidden = changedDirection ? direction > 0 : current.hidden;
        return !current.atTop && current.hidden === hidden
          ? current
          : { atTop: false, hidden };
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, [pinned, pathname]);

  const reveal = () =>
    setState((current) =>
      current.hidden ? { ...current, hidden: false } : current,
    );

  return { ...state, headerRef, reveal };
}
