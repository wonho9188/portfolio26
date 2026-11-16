import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

export function IconSun() {
  return <span className="theme-icon sun-icon" aria-hidden="true" />;
}
export function IconMoon() {
  return <span className="theme-icon moon-icon" aria-hidden="true" />;
}
export function Arrow() {
  return (
    <span className="arrow" aria-hidden="true">
      ↗
    </span>
  );
}
export function TextLink({
  href,
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  if (href.startsWith("/"))
    return (
      <Link className={`text-link ${className}`} to={href} {...props}>
        {children}
      </Link>
    );
  return (
    <a className={`text-link ${className}`} href={href} {...props}>
      {children}
    </a>
  );
}
export function SectionHeading({
  label,
  title,
  description,
  link,
  href,
}: {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  link?: string;
  href?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <div className="section-heading-row">
        <h2>{title}</h2>
        {link && href && (
          <TextLink href={href}>
            {link} <Arrow />
          </TextLink>
        )}
      </div>
      {description && <p className="lead">{description}</p>}
    </div>
  );
}
export function PageHeading({
  label,
  title,
  subtitle,
  description,
}: {
  label: string;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <div className="breadcrumbs">
        <TextLink href="/">← Home</TextLink>
        <p className="eyebrow">{label}</p>
      </div>
      <h1>
        {title}
        <span className="accent">.</span>
      </h1>
      <p className="page-subtitle">{subtitle}</p>
      <p className="lead preserve-lines">{description}</p>
    </div>
  );
}
export function scrollTo(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
  el?.focus({ preventScroll: true });
}
