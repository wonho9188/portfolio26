export type Angles = [number, number, number];
export type Pose = { x: number; y: number; direction: number };
export const armLengths = [12, 10, 4] as const;
const radians = (degrees: number) => (degrees * Math.PI) / 180;
const degrees = (radians: number) => (radians * 180) / Math.PI;
export const wrapAngle = (angle: number) =>
  ((((angle + 180) % 360) + 360) % 360) - 180;

export function forwardKinematics(angles: Angles) {
  let x = 0,
    y = 0,
    direction = 0;
  const points = [{ x, y }];
  angles.forEach((angle, i) => {
    direction += angle;
    x += armLengths[i] * Math.cos(radians(direction));
    y += armLengths[i] * Math.sin(radians(direction));
    points.push({ x, y });
  });
  return { x, y, direction: wrapAngle(direction), points };
}

// Solve the wrist's 2R problem, then use joint 3 to match hand orientation.
// Joints are unrestricted revolute joints in this teaching model.
export function inverseKinematics(pose: Pose): Angles[] {
  if (![pose.x, pose.y, pose.direction].every(Number.isFinite)) return [];
  const [a, b, tool] = armLengths;
  const phi = radians(pose.direction);
  const x = pose.x - tool * Math.cos(phi);
  const y = pose.y - tool * Math.sin(phi);
  const cosine = (x * x + y * y - a * a - b * b) / (2 * a * b);
  if (Math.abs(cosine) > 1 + 1e-10) return [];
  const elbow = Math.acos(Math.max(-1, Math.min(1, cosine)));
  const branches = Math.abs(Math.sin(elbow)) < 1e-9 ? [elbow] : [elbow, -elbow];
  return branches.map((q2) => {
    const q1 =
      Math.atan2(y, x) - Math.atan2(b * Math.sin(q2), a + b * Math.cos(q2));
    return [
      wrapAngle(degrees(q1)),
      wrapAngle(degrees(q2)),
      wrapAngle(degrees(phi - q1 - q2)),
    ];
  });
}
