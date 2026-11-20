import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import AboutMe from "./pages/AboutMe";
import ProjectDetail from "./pages/ProjectDetail";
import { MainWork, SideWork, Utilities } from "./pages/Work";
import { Article, Life, NotFound, TechBlog } from "./pages/Posts";

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const title = (
      {
        "/": "WONHO makes it real.",
        "/about": "About Me",
        "/work": "Main Work",
        "/side-work": "Side Work",
        "/utilities": "Utilities",
        "/blog": "Tech Blog",
        "/life": "Life & Thoughts",
      } as Record<string, string>
    )[pathname];
    if (title) document.title = `${title} — 최원호`;
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <DocumentTitle />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutMe />} />
            <Route path="work" element={<MainWork />} />
            <Route path="work/:projectId" element={<ProjectDetail />} />
            <Route path="side-work" element={<SideWork />} />
            <Route path="side-work/:projectId" element={<ProjectDetail />} />
            <Route path="utilities" element={<Utilities />} />
            <Route path="blog" element={<TechBlog />} />
            <Route path="life" element={<Life />} />
            <Route path="blog/:slug" element={<Article />} />
            <Route path="life/:slug" element={<Article />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
