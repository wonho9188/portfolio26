import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { links, navigation } from "../data/content";
import { Arrow, IconMoon, IconSun, TextLink, scrollTo } from "./primitives";
import { useTheme } from "./ThemeProvider";
import { useHeaderScroll } from "./useHeaderScroll";

export function Header() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const location = useLocation();
  const { atTop, hidden, headerRef, reveal } = useHeaderScroll(
    open,
    location.pathname,
  );
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    nav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (
        !(event.target instanceof Node) ||
        nav.current?.contains(event.target) ||
        button.current?.contains(event.target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [open]);
  useEffect(() => {
    const media = matchMedia("(min-width: 1200px)");
    const reset = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", reset);
    return () => media.removeEventListener("change", reset);
  }, []);
  return (
    <div className="header-slot">
      <header
        ref={headerRef}
        className={`site-header${atTop ? "" : " is-compact"}${hidden && !open ? " is-hidden" : ""}`}
        onFocusCapture={reveal}
      >
        <div className="container header-inner">
          <Link
            className="brand"
            to="/"
            aria-label="WONHO 홈"
            onClick={() => {
              if (location.pathname === "/") scrollTo("main");
            }}
          >
            <strong>WONHO</strong>
            <span>ROBOTICS DEVELOPER</span>
          </Link>
          <div className="header-actions">
            <nav className="desktop-nav" aria-label="주 메뉴">
              {navigation.map((n) => (
                <NavLink key={n.to} to={n.to}>
                  {n.label}
                </NavLink>
              ))}
            </nav>
            <button
              className="theme-button"
              onClick={toggle}
              aria-label={`${theme === "dark" ? "라이트" : "다크"} 모드로 전환`}
            >
              {theme === "dark" ? <IconSun /> : <IconMoon />}
              <span>{theme === "dark" ? "라이트" : "다크"}</span>
            </button>
            <button
              ref={button}
              type="button"
              className="menu-button"
              aria-label={open ? "메뉴 닫기" : "메뉴"}
              aria-expanded={open}
              aria-controls="compact-menu"
              onClick={() => setOpen(!open)}
            >
              <svg
                className="menu-icon"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
              >
                <line
                  className="menu-icon-line menu-icon-top"
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                />
                <line
                  className="menu-icon-line menu-icon-middle"
                  x1="3"
                  y1="12"
                  x2="21"
                  y2="12"
                />
                <line
                  className="menu-icon-line menu-icon-bottom"
                  x1="3"
                  y1="18"
                  x2="21"
                  y2="18"
                />
              </svg>
            </button>
          </div>
        </div>
        <nav
          ref={nav}
          id="compact-menu"
          className="compact-nav container"
          hidden={!open}
          aria-label="접힌 주 메뉴"
        >
          {navigation.map((n) => (
            <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}>
              {n.label}
              <Arrow />
            </NavLink>
          ))}
        </nav>
      </header>
    </div>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="eyebrow">HAVE AN IDEA?</p>
        <div className="footer-invitation">
          <p>
            Let’s make
            <br />
            <em>something real.</em>
          </p>
          <div>
            <p>최원호 / 로봇 개발자</p>
            <TextLink href={links.email}>wonho9188@gmail.com</TextLink>
            <TextLink href={links.github}>
              GitHub <Arrow />
            </TextLink>
          </div>
        </div>
        <div className="footer-baseline">
          <small>© {new Date().getFullYear()} WONHO CHOI</small>
          <button className="text-link" onClick={() => scrollTo("main")}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
function RouteFocus() {
  const { pathname, hash } = useLocation();
  const previous = useRef(pathname);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        document
          .getElementById(decodeURIComponent(hash.slice(1)))
          ?.scrollIntoView();
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
        if (previous.current !== pathname)
          document.getElementById("main")?.focus({ preventScroll: true });
      }
      previous.current = pathname;
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}
export function Layout() {
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("main");
        }}
      >
        본문으로 바로가기
      </a>
      <RouteFocus />
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
