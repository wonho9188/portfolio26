import { worldStops } from "../data/world";

export default function WorldMapFallback({ active }: { active: string }) {
  const positions = worldStops.map((stop) => ({
    x: 500 + stop.x * 46 - stop.z * 20,
    y: 282 + stop.z * 24 + stop.x * 9,
  }));
  const rover =
    positions[worldStops.findIndex((stop) => stop.id === active)] ??
    positions[0];
  return (
    <svg
      className="world-map-fallback"
      viewBox="0 0 1000 600"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="world-map-base" x2=".7" y2="1">
          <stop stopColor="var(--color-raised)" />
          <stop offset="1" stopColor="var(--color-surface)" />
        </linearGradient>
      </defs>
      <path
        d="M120 150 645 65 915 390 355 520 85 265Z"
        fill="url(#world-map-base)"
        stroke="var(--color-line)"
        strokeWidth="2"
      />
      <path
        d={
          positions
            .map((p, index) => `${index ? "L" : "M"}${p.x} ${p.y}`)
            .join(" ") + "Z"
        }
        fill="none"
        stroke="var(--color-interactive-line)"
        strokeWidth="27"
        strokeLinejoin="round"
      />
      <path
        d={
          positions
            .map((p, index) => `${index ? "L" : "M"}${p.x} ${p.y}`)
            .join(" ") + "Z"
        }
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeDasharray="5 8"
      />
      {positions.map((p, index) => (
        <g key={index} transform={`translate(${p.x} ${p.y - 30})`}>
          <path
            d="M-22 0 6-10 28 3 0 14Z"
            fill="var(--color-accent)"
            opacity=".65"
          />
          <path
            d="M-22 0V-35L6-45 28-31V3L0 14V-22Z"
            fill="#d9bda7"
            stroke="#a58271"
          />
          <path d="M-22-35 6-45 28-31 0-22Z" fill="#efddcd" />
        </g>
      ))}
      <g transform={`translate(${rover.x} ${rover.y})`}>
        <ellipse cy="12" rx="30" ry="14" fill="#59434b" opacity=".3" />
        <rect
          x="-23"
          y="-15"
          width="46"
          height="32"
          rx="10"
          fill="#e8cfb8"
          stroke="#997168"
          strokeWidth="2"
        />
        <rect x="-30" y="-10" width="9" height="22" rx="3" fill="#3b3037" />
        <rect x="21" y="-10" width="9" height="22" rx="3" fill="#3b3037" />
        <circle cy="-8" r="9" fill="#bd8a9e" stroke="#59434b" strokeWidth="3" />
      </g>
    </svg>
  );
}
