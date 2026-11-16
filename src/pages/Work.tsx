import { links, mainWork, sideWork, stages, utilities } from "../data/content";
import {
  PageHeading,
  TextLink,
  Arrow,
  scrollTo,
} from "../components/primitives";
import { ProjectCard } from "../components/Cards";
import { Experiments } from "./Home";

export function MainWork() {
  return (
    <div className="container inner-page">
      <PageHeading
        label="01 / SELECTED WORK"
        title="Main Work"
        subtitle="생각을 설계하고, 현실에서 작동하게."
        description={
          "제품의 시작부터 운영까지, 로봇의 움직임부터 교육 현장까지.\n실제로 만들어 연결해온 주요 작업을 소개합니다."
        }
      />
      <nav className="section-jumps" aria-label="작업 섹션">
        {mainWork.map((p, i) => (
          <button
            className="text-link"
            key={p.id}
            onClick={() => scrollTo(p.id)}
          >{`0${i + 1} ${["솔루션 개발", "로봇팔", "교육과 현장"][i]}`}</button>
        ))}
      </nav>
      <div className="work-detail-list">
        {mainWork.map((p) => (
          <ProjectCard project={p} wide detail key={p.id} />
        ))}
      </div>
      <section className="end-to-end">
        <p className="eyebrow">HOW I WORK / A TO Z</p>
        <h2>Built end to end.</h2>
        <p className="lead">
          화면을 만드는 일에서 끝나지 않고, 실제로 쓰이는 서비스까지 연결합니다.
        </p>
        <div className="card-grid">
          {stages.map(([label, title, description], i) => (
            <article className="stage-card" key={label}>
              <p className="eyebrow">
                0{i + 1} / {label}
              </p>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
export function SideWork() {
  return (
    <div className="container inner-page">
      <PageHeading
        label="02 / PROJECT ARCHIVE"
        title="Side Work"
        subtitle="함께 만들고, 직접 부딪혀본 기록."
        description={
          "팀 프로젝트와 프리랜서 작업, 작은 도구와 실험까지.\n서로 다른 문제를 풀며 넓혀온 개발 경험을 모았습니다."
        }
      />
      <section>
        <p className="eyebrow">PROJECTS & COLLABORATIONS</p>
        <h2 className="section-subtitle">
          Different problems. Same curiosity.
        </h2>
        <p className="lead">
          역할과 문제 해결 경험을 중심으로 모은 프로젝트입니다.
        </p>
        <div className="archive-list">
          {sideWork.map((p, i) => (
            <article id={p.id} className="archive-card" key={p.id}>
              <div>
                <p className="eyebrow">
                  0{i + 1} / {i === 0 ? "FREELANCE" : "TEAM PROJECT"}
                </p>
                <h3>{p.name}</h3>
              </div>
              <div>
                <h4>{p.title.replace(p.name + " · ", "")}</h4>
                <p>{p.description}</p>
                <p className="accent">{p.type}</p>
                <TextLink href={links.slides}>
                  참여 내용과 프로젝트 자료 <Arrow />
                </TextLink>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="experiments-section" id="experiments">
        <p className="eyebrow">SMALL BUILDS / CONTINUOUS EXPERIMENTS</p>
        <Experiments />
        <p className="small-note">
          작은 실습부터 시스템을 이해하는 도구까지, 실험의 기록을 모았습니다.
        </p>
      </section>
      <aside className="cross-link">
        <p>
          실험에서 남은 질문은
          <br />
          기술 기록으로 이어집니다.
        </p>
        <TextLink href="/blog">
          Tech Blog로 이동 <Arrow />
        </TextLink>
      </aside>
    </div>
  );
}
export function Utilities() {
  return (
    <div className="container inner-page">
      <PageHeading
        label="03 / DESIGN & COMMUNICATION"
        title="Utilities"
        subtitle="구조를 읽고, 경험을 다듬습니다."
        description={
          "사용성을 배려한 앱 설계와 복잡한 구조를 설명하는 슬라이드.\n디자이너의 경험으로 개발 과정과 커뮤니케이션을 돕습니다."
        }
      />
      <div className="utility-details">
        {utilities.map((u, i) => (
          <section className="utility-detail" id={u.id} key={u.id}>
            <p className="eyebrow">
              0{i + 1} / {u.label}
            </p>
            <h2>{u.title}</h2>
            <p className="lead">{u.description}</p>
            <div className="utility-steps">
              {u.steps.map(([title, body], j) => (
                <article key={title}>
                  <p className="eyebrow">0{j + 1}</p>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <div className="utility-apply">
              <p className="eyebrow">APPLIED IN</p>
              <p>{u.apply}</p>
            </div>
          </section>
        ))}
      </div>
      <section className="utility-closing">
        <h2>Designed to be understood.</h2>
        <p className="lead">기술의 정밀함과, 사람의 이해 사이에서.</p>
        <p>
          앱에서는 사용자가 다음 행동을 알 수 있게.
          <br />
          슬라이드에서는 고객이 핵심 구조를 이해할 수 있게.
        </p>
        <TextLink href={links.slides}>
          슬라이드와 참여 작업 보기 <Arrow />
        </TextLink>
      </section>
    </div>
  );
}
