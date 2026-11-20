export function advanceOnLoop(progress: number, target: number, step: number) {
  const delta = ((target - progress + 1.5) % 1) - 0.5;
  if (Math.abs(delta) <= step)
    return {
      progress: target,
      arrived: true,
      direction: Math.sign(delta) || 1,
    };
  return {
    progress: (progress + Math.sign(delta) * step + 1) % 1,
    arrived: false,
    direction: Math.sign(delta),
  };
}
