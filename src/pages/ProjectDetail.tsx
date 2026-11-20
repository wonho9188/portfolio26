import { Link, useLocation, useParams } from "react-router-dom";
import { portfolioProjects } from "../data/world";
import { links, posts } from "../data/content";
import { TextLink } from "../components/primitives";
import { PostCard } from "../components/Cards";
import { NotFound } from "./Posts";
import { useEffect } from "react";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const kind = pathname.startsWith("/side-work/") ? "side-work" : "work";
  const project = portfolioProjects.find(
    (item) => item.id === projectId && item.kind === kind,
  );
  useEffect(() => {
    if (project) document.title = `${project.title} — WONHO`;
  }, [project]);
  if (!project) return <NotFound />;
  const related = posts.filter(
    (post) =>
      post.kind === "tech" &&
      project.kind === "side-work" &&
      post.meta.includes(project.name),
  );
  return (
    <article className="container inner-page project-page">
      <header className="page-heading">
        <div className="breadcrumbs">
          <TextLink href={`/${kind}`}>
            {kind === "work" ? "Main Work" : "Side Work"} 목록
          </TextLink>
          <p className="eyebrow">{project.category}</p>
        </div>
        <h1>{project.title}</h1>
        <p className="lead preserve-lines">{project.description}</p>
      </header>
      {project.image && (
        <figure className="project-page-visual">
          <img src={project.image} alt={project.alt} />
        </figure>
      )}
      <section className="project-page-scope">
        <h2>참여한 작업</h2>
        <p className="preserve-lines">{project.description}</p>
        <p className="accent">{project.roles}</p>
      </section>
      {related.length > 0 && (
        <section className="project-page-related">
          <h2>이 작업에서 남긴 기술 기록</h2>
          <div className="card-grid">
            {related.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
      <nav className="project-page-links" aria-label="프로젝트 자료">
        <TextLink href={links.slides}>참여 내용과 프로젝트 자료</TextLink>
        <Link className="text-link" to="/">
          로봇 월드로 돌아가기
        </Link>
      </nav>
    </article>
  );
}
