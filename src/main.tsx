import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/noto-sans-kr/korean-400.css";
import "@fontsource/noto-sans-kr/korean-500.css";
import "@fontsource/noto-sans-kr/korean-700.css";
import "@fontsource/noto-sans-kr/latin-400.css";
import "@fontsource/noto-sans-kr/latin-500.css";
import "@fontsource/noto-sans-kr/latin-700.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/manrope/latin-800.css";
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./styles/tokens.css";
import "./styles/site.css";
import "./styles/home.css";
import "./styles/pages.css";
import "./styles/kinematics.css";
import "./styles/coordinate-frames.css";
import "./styles/coordinates-playground.css";
import "./styles/tf-transform.css";
import "./styles/moveit-usage.css";
import "./styles/moveit-versions.css";
import "./styles/rover-world.css";
import "./styles/ros2-overview.css";
import "./styles/lidar-overview.css";
import "./styles/nav2-overview.css";
import "./styles/natural-language-overview.css";
import "./styles/llm-overview.css";
import "./styles/mujoco-overview.css";
import "./styles/task-planning-overview.css";
import "./styles/design-trends.css";
import "./styles/style-guide-overview.css";
import "./styles/reference-practice.css";
import "./styles/visual-priority.css";
import "./styles/component-kinds.css";
import "./styles/tone-and-feel.css";
import "./styles/fms-overview.css";
import "./styles/tech-post-grid.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
