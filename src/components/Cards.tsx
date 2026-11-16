import { Link } from "react-router-dom";
import { mainWork } from "../data/content";
import type { Post } from "../data/content";
import { Arrow } from "./primitives";

export function ProjectCard({
  project,
  wide = false,
  detail = false,
}: {
  project: (typeof mainWork)[number];
  wide?: boolean;
  detail?: boolean;
}) {
  return (
    <article
      id={detail ? project.id : undefined}
      className={`project-card ${wide ? "project-wide" : ""} ${detail ? "project-detail" : ""}`}
    >
      <div className="project-identity">
        <p className="eyebrow">{project.category}</p>
        <h3>
          {detail ? (
            project.title
          ) : (
            <Link to={`/work#${project.id}`} className="stretched-link">
              {project.title}
            </Link>
          )}
        </h3>
      </div>
      <img
        className="project-illustration"
        src={project.image}
        alt={project.alt}
        loading="lazy"
        width={500}
        height={300}
      />
      <p className="project-description preserve-lines">
        {project.description}
      </p>
      <p className="project-keywords">{project.keywords}</p>
      {!detail && <Arrow />}
    </article>
  );
}
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <p className="eyebrow">{post.category}</p>
      <h3>
        <Link
          className="stretched-link"
          to={`/${post.kind === "tech" ? "blog" : "life"}/${post.slug}`}
        >
          {post.title}
        </Link>
      </h3>
      <p>{post.excerpt}</p>
      <div className="card-meta">
        <span>
          {post.status === "draft"
            ? post.meta.replace("DRAFT ·", "DRAFT /")
            : post.meta}
        </span>
        <Arrow />
      </div>
    </article>
  );
}
export function PostRow({ post, number }: { post: Post; number: number }) {
  return (
    <article className={`post-row ${post.image ? "has-media" : ""}`}>
      {!post.image && (
        <span className="row-number">{String(number).padStart(2, "0")}</span>
      )}
      {post.image && (
        <img
          src={post.image}
          alt={post.title.split(" — ")[0] + " 영화 포스터"}
          width={144}
          height={208}
          loading="lazy"
        />
      )}
      <div className="post-row-copy">
        <p className="eyebrow">{post.category}</p>
        <h3>
          <Link
            className="stretched-link"
            to={`/${post.kind === "tech" ? "blog" : "life"}/${post.slug}`}
          >
            {post.title}
          </Link>
        </h3>
        <p>{post.excerpt}</p>
        <p className="meta">{post.meta}</p>
      </div>
      <Arrow />
    </article>
  );
}
