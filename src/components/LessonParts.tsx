import { Children } from "react";
import type { ReactNode } from "react";
import { lessonParts } from "../data/lesson-slides";

export default function LessonParts({
  name,
  part,
  children,
}: {
  name: string;
  part?: number;
  children: ReactNode;
}) {
  const blocks = Children.toArray(children).filter(
    (child) => typeof child !== "string" || child.trim().length > 0,
  );
  if (part === undefined) return <>{blocks}</>;
  const selected = lessonParts[name]?.[part];
  return <>{selected?.children.map((index) => blocks[index])}</>;
}
