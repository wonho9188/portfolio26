import { Fragment } from "react";

export type LessonEmphasis = { strong?: string[]; underline?: string[] };

// Editorial marks are explicit per section; render text safely without HTML parsing.
export default function LessonText({
  text,
  emphasis,
}: {
  text: string;
  emphasis?: LessonEmphasis;
}) {
  const terms = new Set(emphasis?.strong ?? []);
  const underlines = new Set(emphasis?.underline ?? []);
  const phrases = [...new Set([...terms, ...underlines])]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  if (!phrases.length) return <>{text}</>;
  const pattern = new RegExp(
    `(${phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gu",
  );
  return (
    <>
      {text.split(pattern).map((part, index) =>
        terms.has(part) ? (
          <strong className="lesson-term" key={index}>
            {part}
          </strong>
        ) : underlines.has(part) ? (
          <span className="lesson-underline" key={index}>
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
