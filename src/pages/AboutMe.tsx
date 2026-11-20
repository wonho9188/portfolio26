import { Link } from "react-router-dom";
import {
  career,
  experience,
  experiments,
  mainWork,
  posts,
  principles,
  sideWork,
  skills,
  utilities,
} from "../data/content";
import { Arrow, SectionHeading, TextLink } from "../components/primitives";
import { ProjectCard, PostCard } from "../components/Cards";
import portrait from "../assets/portrait.png";
import thoughtLines from "../assets/thought-lines.svg";
import thoughtGlow from "../assets/thought-glow.svg";

export function SideRows({ all = false }: { all?: boolean }) {
  return (
    <div className="side-rows">
      {sideWork.slice(0, all ? 4 : 3).map((work, i) => (
        <article className="side-row" key={work.id}>
          <span className="row-number">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <p className="meta">{work.label}</p>
            <h3>
              <Link className="stretched-link" to={`/side-work/${work.id}`}>
                {work.title}
              </Link>
            </h3>
            <p>{work.description}</p>
          </div>
          <span className="row-type">{work.type}</span>
          <Arrow />
        </article>
      ))}
    </div>
  );
}
export function Experiments() {
  return (
    <>
      <div className="subsection-title">
        <h3>작은 도구와 실험</h3>
        <TextLink href="/side-work#experiments">
          실험 모아보기 <Arrow />
        </TextLink>
      </div>
      <div className="card-grid">
        {experiments.map((e) => (
          <article className="experiment-card" key={e.title}>
            <p className="eyebrow">{e.label}</p>
            <h4>
              {e.post ? (
                <Link className="stretched-link" to={`/blog/${e.post}`}>
                  {e.title}
                </Link>
              ) : (
                <TextLink className="stretched-link" href={e.source!}>
                  {e.title}
                </TextLink>
              )}
            </h4>
            <p>{e.description}</p>
            <div className="card-meta">
              <span>{e.tag}</span>
              <Arrow />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
export function UtilitiesSummary() {
  return (
    <div className="utilities-grid">
      {utilities.map((u) => (
        <article key={u.id}>
          <p className="eyebrow">{u.label}</p>
          <h3>{u.title}</h3>
          <p>{u.description}</p>
          <TextLink href={`/utilities#${u.id}`}>
            {u.label === "UX / UI" ? "UX/UI" : "Presentation"} 작업 보기{" "}
            <Arrow />
          </TextLink>
        </article>
      ))}
    </div>
  );
}
export function ExperienceRows({
  items,
}: {
  items: ((typeof career)[number] & { award?: string })[];
}) {
  return (
    <div className="experience-rows">
      {items.map((item, i) => (
        <article className="experience-row" key={item.company + i}>
          <p className="meta">{item.period}</p>
          <div>
            <h4>{item.company}</h4>
            <p className="accent preserve-lines">{item.status}</p>
          </div>
          <div>
            <p className="preserve-lines">{item.description}</p>
            {item.award && <span className="award-chip">{item.award}</span>}
          </div>
        </article>
      ))}
    </div>
  );
}
export default function AboutMe() {
  return (
    <div className="home-page about-page">
      <section id="about" className="section about container" tabIndex={-1}>
        <header className="about-page-heading">
          <p className="eyebrow">ABOUT / WONHO CHOI</p>
          <h1>About Me.</h1>
        </header>
        <div className="profile-layout">
          <div className="portrait">
            <img src={portrait} alt="최원호 프로필" width={208} height={255} />
          </div>
          <div className="biography">
            <h3>로봇 개발자 최원호입니다.</h3>
            <p className="bio-lead">
              디자인의 감각과 공학의 정밀함으로,
              <br />
              사람과 로봇 사이를 연결합니다.
            </p>
            <div className="biography-copy">
              <p>
                웹 디자이너와 퍼블리셔로 시작해, 로봇 시스템을 만드는 개발자로
                영역을 넓혔습니다.
              </p>
              <p>
                작은 코드에도 배려와 체계를 담고, 함께 만드는 사람이 이해할 수
                있는 구조를 고민합니다.
              </p>
              <p>
                리더암·팔로워암과 교육용 웹·앱을 개발하며, 아이디어를 실제로
                작동하는 시스템으로 연결합니다.
              </p>
            </div>
          </div>
        </div>
        <div className="approach">
          <p className="eyebrow">
            HOW I WORK <span className="approach-ko">| Wonho의 업무 방식</span>
          </p>
          <div className="approach-intro">
            <h3>이해 → 설계 → 실현</h3>
            <p>
              로봇이 보고, 판단하고, 움직이듯.
              <br />
              원호는 이해하고, 설계하고, 작동하는 결과를 만듭니다.
            </p>
          </div>
        </div>
        <div className="principles">
          {principles.map((p, i) => (
            <article key={p.name}>
              <h3>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {p.name}
              </h3>
              <p className="principle-title preserve-lines">{p.title}</p>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="main-work" className="section container" tabIndex={-1}>
        <SectionHeading
          label="01 / MAIN WORK"
          title={
            <>
              ENGINEERED <em>to move.</em>
            </>
          }
          link="작업 모아보기"
          href="/work"
          description="최근의 제품과 시스템 작업을 중심으로, 어떤 문제를 다뤄왔는지 소개합니다."
        />
        <div className="project-grid">
          {mainWork.map((p, i) => (
            <ProjectCard project={p} wide={i === 0} key={p.id} />
          ))}
        </div>
      </section>
      <section className="section surface-section">
        <div className="container">
          <SectionHeading
            label="02 / SIDE WORK"
            title="꾸준한 프로젝트 활동"
            link="사이드 작업 보기"
            href="/side-work"
            description="프로젝트부터 개발을 돕는 작은 도구까지, 문제를 풀어온 작업들을 모았습니다."
          />
          <SideRows />
          <Experiments />
        </div>
      </section>
      <section className="section container utilities-section">
        <SectionHeading
          label="03 / UTILITIES"
          title="기술의 완성도를 높이는 역량"
        />
        <UtilitiesSummary />
      </section>
      <section className="section container home-blog">
        <SectionHeading
          label="04 / TECH BLOG"
          title="엔지니어링 노트"
          link="기술 글 모아보기"
          href="/blog"
          description={
            <>
              실제 프로젝트에서 맡았던 역할과 마주한 문제를 바탕으로,
              <br />
              설계의 이유와 해결 과정을 기록합니다.
            </>
          }
        />
        <div className="card-grid">
          {posts
            .filter((p) => p.kind === "tech")
            .slice(0, 4)
            .map((p) => (
              <PostCard post={p} key={p.slug} />
            ))}
        </div>
      </section>
      <section className="section container home-experience">
        <SectionHeading
          label="05 / SKILLS & EXPERIENCE"
          title="디자인으로 시작해, 로보틱스로 확장"
          description="하드웨어와 소프트웨어를 넘나들며 생각과 구현 사이의 간격을 좁혀갑니다."
        />
        <h3 className="subheading">Skills</h3>
        <dl className="skill-list">
          {skills.map(([name, value]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <h3 className="subheading">실무 경력</h3>
        <ExperienceRows items={career} />
        <h3 className="subheading">기타 경험</h3>
        <ExperienceRows items={experience} />
      </section>
      <section className="section surface-section">
        <div className="container">
          <SectionHeading
            label="06 / LIFE & THOUGHTS"
            title="사람과 세상에 대한 이해"
            link="취미와 생각 모아보기"
            href="/life"
          />
          <div className="life-layout">
            <div>
              <div className="thought-art" aria-hidden="true">
                <img className="thought-glow" src={thoughtGlow} alt="" />
                <img className="thought-lines" src={thoughtLines} alt="" />
              </div>
              <p className="life-statement">
                로봇은 제어하고,
                <br />
                마음은 이해해보는 중.
              </p>
              <p>
                보고 읽고, 만들고 연주하며
                <br />
                사람과 세상을 이해해가는 기록.
              </p>
            </div>
            <div className="life-categories">
              {[
                [
                  "READING",
                  "감정을 이해하고, 세상을 읽는 독서",
                  "『가짜감정』에서 배운 감정의 이해와 존중.\n『지적 대화를 위한 넓고 얕은 지식』으로 넓힌 세계관.",
                  "reading",
                ],
                [
                  "FILM",
                  "로봇과 사람, 그리고 노력의 가치",
                  "〈바이센티니얼 맨〉에서 생각한 인간과 로봇의 경계.\n〈가타카〉를 통해 돌아본 노력과 인간의 가치.",
                  "films",
                ],
                [
                  "ACTIVITIES",
                  "만들고, 그리고, 함께 연주한 경험",
                  "AI 스피커를 제안한 산업디자인 졸업작품,\n호국미술대전 회화 부문 입상,\n합창단 반주자로 함께한 경험.",
                  "activities",
                ],
              ].map(([label, title, body, group]) => (
                <article key={label}>
                  <p className="eyebrow">{label}</p>
                  <h3>
                    <Link
                      className="stretched-link"
                      to={`/life?topic=${group}`}
                    >
                      {title}
                    </Link>
                  </h3>
                  <p className="preserve-lines">{body}</p>
                  <Arrow />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
