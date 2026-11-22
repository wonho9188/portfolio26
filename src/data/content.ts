import source from "./posts-source.json";
import type { LessonEmphasis } from "../components/LessonText";
import workstation from "../assets/workstation.png";
import arms from "../assets/robot-arms.png";
import maze from "../assets/robot-maze.png";
import bicentennial from "../assets/bicentennial-man.png";
import gattaca from "../assets/gattaca.png";
import moveitIntro from "../assets/moveit-intro.png";
import moveitMotionPlanning from "../assets/moveit-motion-planning.png";
import moveitGoalToMotion from "../assets/moveit-goal-to-motion.png";

export const links = {
  email: "mailto:wonho9188@gmail.com",
  github: "https://github.com/wonho9188",
  slides:
    "https://docs.google.com/presentation/d/1FRmCMWqPVFUYd9ySCsaYBou0RVl7gKxb23RYdFvpsDQ/edit",
  activity:
    "https://app.notion.com/p/Activity-22a483ba22f880c698b9cf8ffde6c7b5",
};
export const navigation = [
  { to: "/about", label: "About Me" },
  { to: "/work", label: "Main Work" },
  { to: "/side-work", label: "Side Work" },
  { to: "/utilities", label: "Utilities" },
  { to: "/blog", label: "Tech Blog" },
  { to: "/life", label: "Life & Thoughts" },
];
export const principles = [
  {
    name: "UNDERSTAND",
    title: "문제를 읽고,\n사람을 이해합니다.",
    body: "사용자의 맥락과 현장의 제약을 살피며, 풀어야 할 문제를 먼저 정의합니다.",
  },
  {
    name: "ARCHITECT",
    title: "경계는 명확하게,\n연결은 정교하게 설계합니다.",
    body: "역할과 책임을 분명히 나누고, 하드웨어와 소프트웨어의 연결을 설계합니다.",
  },
  {
    name: "REALIZE",
    title: "아이디어가 현실에서\n작동하도록 만듭니다.",
    body: "설계와 구현, 테스트를 오가며, 실제로 쓰이는 결과물까지 완성합니다.",
  },
];
export const mainWork = [
  {
    id: "product",
    category: "01 / SOLUTION DEVELOPMENT · A TO Z",
    title: "로봇 교육용 앱과 웹·운영 시스템",
    description:
      "로봇 교육용 앱부터 웹 서비스·운영 시스템까지 직접 설계하고 구현합니다.\n기획·디자인·개발·배포·운영·관리·마케팅까지, 제품의 전 과정을 A to Z로 연결합니다.",
    keywords: "기획 → 디자인 → 개발 → 배포 → 운영·관리 → 마케팅",
    image: workstation,
    alt: "로봇 교육 앱과 운영 대시보드를 표현한 두 대의 모니터",
  },
  {
    id: "arms",
    category: "02 / ROBOT ARMS",
    title: "리더 암과 로봇팔 개발",
    description:
      "밴드형 리드 디바이스와 리더 암 개발.\n7DoF 기반 테스트용 미니 팔로워 암 제작,\n리드 디바이스 연동 테스트.",
    keywords: "로봇팔 / 리드 디바이스 / 프로토타이핑",
    image: arms,
    alt: "리더 암과 팔로워 암이 연결된 로봇팔 일러스트",
  },
  {
    id: "education",
    category: "03 / ROBOT NAVIGATION",
    title: "로봇 교육과 현장 수업",
    description:
      "Go2·주행로봇 주행 교육과 현장 강의·시연.\n3D 모델링·프린팅을 활용한 실습 맵 제작.",
    keywords: "교육 콘텐츠 / 강의·시연 / 3D 설계",
    image: maze,
    alt: "미로 맵을 주행하는 교육용 로봇",
  },
];
export const sideWork = [
  {
    id: "seerslab",
    label: "시어스랩 / 프리랜서",
    name: "시어스랩",
    title: "주행 로봇 모니터링 · 2D/3D 공간 관리",
    description: "웹 연동, UI 개선, 에디터 기능 구현",
    type: "WEB / ROBOTICS",
  },
  {
    id: "shopee",
    label: "TEAM PROJECT",
    name: "Shopee",
    title: "Shopee · 원격 쇼핑 로봇 서비스",
    description: "ROS2 통신 설계, 트래킹·경로 생성, UI/UX",
    type: "ROS2 / PLANNING",
  },
  {
    id: "asan-hero",
    label: "TEAM PROJECT",
    name: "Asan Hero",
    title: "Asan Hero · 대형병원 안내 로봇",
    description: "ROS2 주행·시뮬레이션, C++ Qt, 하드웨어 제작",
    type: "ROS2 / C++ QT",
  },
  {
    id: "gigachad",
    label: "TEAM PROJECT",
    name: "Gigachad",
    title: "로그와 CCTV를 연결한 관제 GUI",
    description:
      "TCP 이벤트 로그와 UDP CCTV 이미지를 PyQt 화면에서 연동했습니다.",
    type: "PYQT / TCP·UDP",
  },
];
export const experiments = [
  {
    label: "01 / DEBUG",
    title: "통신 디버깅 GUI",
    description:
      "GUI–서버–로봇 사이의 통신 상태를 한 화면에서 확인하기 위한 도구.",
    tag: "SYSTEM MONITORING",
    source: links.slides,
  },
  {
    label: "02 / BUILD",
    title: "하루 완성 계산기",
    description: "Python·PyQt로 계산기의 동작 원리와 로직을 구현한 실습.",
    tag: "PYTHON / PYQT",
    source: links.slides,
  },
  {
    label: "03 / EXPLORE",
    title: "데이터 분석 실험",
    description: "웹 크롤링과 데이터 분석으로 커피 매장 입지와 양돈 지표 탐색.",
    tag: "CRAWLING / EDA",
    source: links.slides,
  },
];
export const utilities = [
  {
    id: "ux-ui",
    label: "UX / UI",
    title: "사용성을 배려한 앱 설계 능력",
    description:
      "디자이너로 쌓은 경험을 바탕으로, 단순한 앱 하나도 사용자 경험과 사용성을 고려해 설계합니다.",
    steps: [
      ["화면의 흐름", "사용자의 작업 순서와 다음 행동이 보이도록 구성합니다."],
      [
        "컴포넌트의 체계",
        "반복되는 UI의 규칙과 일관된 표현 방식을 정리합니다.",
      ],
      ["상태와 피드백", "조작 결과와 진행 상태가 이해되는 화면을 고민합니다."],
    ],
    apply: "업무 시스템 · 관리자 GUI · 디자인 시스템 · 포트폴리오",
  },
  {
    id: "presentation",
    label: "PRESENTATION",
    title: "슬라이드 제작 및 발표 능력",
    description:
      "복잡한 아키텍처를 고객이 이해하기 쉬운 슬라이드로 정리하고, 핵심을 명료하게 전달합니다.",
    steps: [
      ["핵심 구조 읽기", "구성 요소와 연결 관계에서 전달할 핵심을 골라냅니다."],
      [
        "이야기로 편집하기",
        "문제와 해결 과정이 이어지도록 정보의 순서와 밀도를 조정합니다.",
      ],
      [
        "이해할 언어로 전달하기",
        "고객이 구조와 의도를 이해하도록 슬라이드와 설명을 함께 준비합니다.",
      ],
    ],
    apply: "시스템 아키텍처 설명 · 프로젝트 소개 · 제안 및 발표 자료",
  },
];
export const skills = [
  ["ROBOT / DEVELOPMENT", "ROS2 · OpenCV · PyQt · MySQL · Python · C++"],
  [
    "WEB",
    "HTML · CSS · JavaScript · TypeScript · React · SCSS · MUI · Chart.js · ag-grid",
  ],
  ["DESIGN", "Figma · Photoshop · Illustrator · Clip Studio"],
  ["3D DESIGN", "Fusion 360 · Blender 3D"],
  ["COLLABORATION", "Slack · Confluence · Jira · Git"],
];
export const career = [
  {
    period: "2026.02 — PRESENT",
    company: "핑크랩",
    status: "정규직 · 재직 중",
    description: "로봇 개발, 웹·앱 개발·운영, 교육 콘텐츠와 현장 수업",
  },
  {
    period: "2 MONTHS / FREELANCE",
    company: "시어스랩",
    status: "프리랜서 · 2개월",
    description: "주행 로봇 모니터링 웹, 2D/3D 공간 관리 플랫폼",
  },
  {
    period: "2020.07 — 2024.10",
    company: "넥스트리",
    status: "인턴 2년 2개월,\n정규직 2년 2개월",
    description:
      "인턴 경력 2년을 인정받아, 경력 3년 차로 정규직 입사.\n웹디자인·퍼블리싱, 업무 시스템과 디자인 시스템 제작.\n학생 인턴 · 2020.07 — 2022.08",
  },
];
export const experience = [
  {
    period: "2025.09 — 2025.11",
    company: "에드인에듀",
    status: "교육 · 수료",
    description: "ROS2 단기 심화 7기 수료",
    award: "KDT 단기심화 최우수상",
  },
  {
    period: "2025.02 — 2025.08",
    company: "에드인에듀",
    status: "교육 · 수료",
    description: "ROS2 9기 부트캠프 수료",
    award: "KDT 훈련과정 최우수상",
  },
  {
    period: "2018.06 — 2020.02",
    company: "7포병여단",
    status: "군 복무",
    description: "병장 만기 전역",
  },
  {
    period: "2016.01 — 2016.11",
    company: "중계 피플 미술학원",
    status: "교육 · 강의",
    description: "입시반 보조강사",
  },
];
export const stages = [
  ["PLAN", "기획", "화면 흐름과 조작 방식, 제품의 전달할 메시지를 정리합니다."],
  ["DESIGN", "디자인", "필요한 레이아웃, 컴포넌트와 인터랙션을 설계합니다."],
  [
    "BUILD",
    "개발",
    "웹 퍼블리싱과 프론트엔드로 실제로 쓰일 화면을 구현합니다.",
  ],
  [
    "RELEASE",
    "배포",
    "도메인을 연결하고, 사용자가 접근하는 서비스를 공개합니다.",
  ],
  [
    "OPERATE",
    "운영·관리",
    "콘텐츠와 서비스의 상태를 살피며 운영을 유지하고 이어갑니다.",
  ],
  [
    "COMMUNICATE",
    "마케팅",
    "배너, 문구와 소개 자료로 제품의 가치를 전달합니다.",
  ],
];
export type Section = {
  title: string;
  p: string[];
  emphasis?: LessonEmphasis;
  bullets?: string[];
  illustration?: string;
  illustrationAlt?: string;
  illustrationCaption?: string;
  steps?: { title: string; body: string }[];
  interactive?: string;
  supplement?: string;
  componentPart?: number;
};
export const articleIllustrations: Record<string, string> = {
  "moveit-intro": moveitIntro,
  "moveit-motion-planning": moveitMotionPlanning,
  "moveit-goal-to-motion": moveitGoalToMotion,
};
export type Post = {
  slug: string;
  kind: "tech" | "life";
  title: string;
  category: string;
  excerpt: string;
  meta: string;
  status: "draft" | "planned" | "record";
  group: string;
  parentSlug?: string;
  sections: Section[];
  source?: string;
  sourceLabel?: string;
  image?: string;
  seriesOrder?: number;
  presentation?: "screens";
};
const postImages: Record<string, string> = {
  "bicentennial-man": bicentennial,
  gattaca,
};
export const posts: Post[] = source.posts.map((p) => ({
  ...p,
  kind: p.kind as Post["kind"],
  status: p.status as Post["status"],
  presentation: ("presentation" in p
    ? p.presentation
    : undefined) as Post["presentation"],
  image: postImages[p.slug],
}));
export const roboticsTopic = {
  id: "robotics-concept-blocks",
  label: "로보틱스 개념 블록",
  title: "차곡차곡, 로보틱스 개념 블록",
  description:
    "작은 개념을 하나씩 이해하고, 블록처럼 연결해 로봇이라는 큰 구조를 알아갑니다.",
};
export const designTopic = {
  id: "design",
  label: "디자인",
  title: "디자인과 사용자 경험",
  description:
    "시각적 표현과 사용 경험을 함께 살피며, 화면을 설계하는 기준을 기록합니다.",
};
export const mathTopic = {
  id: "math",
  label: "수학",
  title: "수학",
};
export function getTopicPosts(
  kind: Post["kind"],
  group: string,
  parentSlug?: string,
) {
  return posts
    .filter(
      (post) =>
        post.kind === kind &&
        post.group === group &&
        post.parentSlug === parentSlug,
    )
    .sort(
      (a, b) =>
        (a.seriesOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.seriesOrder ?? Number.MAX_SAFE_INTEGER),
    );
}
export const techGroups = [
  [designTopic.id, designTopic.label, designTopic.title],
  [roboticsTopic.id, roboticsTopic.label, roboticsTopic.title],
  [mathTopic.id, mathTopic.label, mathTopic.title],
  ["ai-masters", "인공지능 대학원(석사)", "인공지능 대학원(석사)"],
];
export const lifeGroups = [
  ["films", "영화·이야기", "영화와 이야기"],
  ["reading", "독서", "책으로 읽는 세상"],
  ["thoughts", "생각", "삶을 돌아보는 질문들"],
  ["activities", "활동", "만들고, 그리고, 연주하며"],
];
