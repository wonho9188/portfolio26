import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#1c1c1c" : "#faf7f4");
    window.dispatchEvent(new Event("wonho:themechange"));
  }, [theme]);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: light)");
    const sync = () => {
      try {
        if (localStorage.getItem("wonho-theme")) return;
      } catch {}
      setTheme(media.matches ? "light" : "dark");
    };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const toggle = () =>
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("wonho-theme", next);
      } catch {}
      return next;
    });
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>;
}
export const useTheme = () => useContext(ThemeContext);
