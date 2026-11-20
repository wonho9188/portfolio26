import { mainWork, sideWork } from "./content";

export const portfolioProjects = [
  ...mainWork.map((project) => ({
    id: project.id,
    kind: "work" as const,
    title: project.title,
    category: project.category,
    description: project.description,
    roles: project.keywords,
    image: project.image,
    alt: project.alt,
    name: project.title,
  })),
  ...sideWork.map((project) => ({
    id: project.id,
    kind: "side-work" as const,
    title: project.title,
    category: project.label,
    description: project.description,
    roles: project.type,
    name: project.name,
    image: undefined,
    alt: "",
  })),
];

export type WorldStop = {
  id: string;
  label: string;
  title: string;
  description: string;
  category: string;
  href: string;
  shape:
    | "studio"
    | "arm"
    | "maze"
    | "parcel"
    | "hospital"
    | "profile"
    | "notes"
    | "garden";
  x: number;
  z: number;
};

export const worldStops: WorldStop[] = [
  {
    id: "product",
    label: "제품과 서비스",
    title: mainWork[0].title,
    description:
      "교육용 앱과 웹 서비스·운영 시스템을 기획부터 배포·운영까지 연결합니다.",
    category: "MAIN WORK",
    href: "/work/product",
    shape: "studio",
    x: -5.9,
    z: -2.8,
  },
  {
    id: "arms",
    label: "리더·팔로워 암",
    title: mainWork[1].title,
    description:
      "리더 암과 7DoF 테스트용 미니 팔로워 암, 리드 디바이스 연동을 개발했습니다.",
    category: "MAIN WORK",
    href: "/work/arms",
    shape: "arm",
    x: -1.8,
    z: -4.3,
  },
  {
    id: "education",
    label: "주행과 교육",
    title: mainWork[2].title,
    description:
      "주행 로봇 교육과 현장 시연, 실습 맵 설계·제작 경험을 소개합니다.",
    category: "MAIN WORK",
    href: "/work/education",
    shape: "maze",
    x: 3.1,
    z: -3.5,
  },
  {
    id: "shopee",
    label: "Shopee",
    title: sideWork[1].title,
    description: sideWork[1].description,
    category: "SIDE WORK",
    href: "/side-work/shopee",
    shape: "parcel",
    x: 6.2,
    z: -0.6,
  },
  {
    id: "asan-hero",
    label: "Asan Hero",
    title: sideWork[2].title,
    description: sideWork[2].description,
    category: "SIDE WORK",
    href: "/side-work/asan-hero",
    shape: "hospital",
    x: 4.8,
    z: 3,
  },
  {
    id: "about",
    label: "About Me",
    title: "로봇 개발자 최원호입니다.",
    description: "소개와 일하는 방식, 그동안의 작업과 경력을 만나 보세요.",
    category: "ABOUT ME",
    href: "/about",
    shape: "profile",
    x: 0.3,
    z: 4.2,
  },
  {
    id: "blog",
    label: "Tech Blog",
    title: "차곡차곡 쌓아가는 기술 기록",
    description:
      "프로젝트에서 고민한 설계와 문제 해결, 로보틱스 개념을 기록합니다.",
    category: "TECH BLOG",
    href: "/blog",
    shape: "notes",
    x: -4.3,
    z: 3.1,
  },
  {
    id: "life",
    label: "Life & Thoughts",
    title: "사람과 세상을 읽는 시간",
    description: "영화와 독서, 철학과 관계, 만들고 연주한 경험을 나눕니다.",
    category: "LIFE & THOUGHTS",
    href: "/life",
    shape: "garden",
    x: -7,
    z: 0.7,
  },
];

export const fallbackMarkers = worldStops.map((stop) => ({
  x: 50 + stop.x * 4.6 - stop.z * 2,
  y: 47 + stop.z * 4 + stop.x * 1.5,
}));
