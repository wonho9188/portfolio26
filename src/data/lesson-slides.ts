import type { Post, Section } from "./content";

type LessonPart = { title: string; children: number[]; selection?: number };
const part = (title: string, ...children: number[]): LessonPart => ({
  title,
  children,
});

// Each group keeps an explanation or a complete interactive example together.
// Child indices refer to the component's direct content blocks, not DOM selectors.
export const lessonParts: Record<string, LessonPart[]> = {
  "moveit-usage": [
    part("설치해서 쓰는 도구 모음", 0, 1),
    part("화면에서 사용하기", 2),
    part("코드에서 사용하기", 3),
    part("MoveIt은 엔진, RViz는 화면", 4),
  ],
  "moveit-versions": [
    part("MoveIt 1과 MoveIt 2 비교", 0, 1),
    part("이 프로젝트에서는 MoveIt 2", 2, 3, 4, 5),
  ],
  kinematics: [
    part("관절에서 손으로, 손에서 관절로", 1, 2),
    part("직접 움직여 보는 FK와 IK", 0),
    part("같은 목표, 다른 자세", 3, 4),
  ],
  "coordinate-frames": [
    part("기준을 바꾸어 거리 재기", 0),
    part("같은 상자, 서로 다른 숫자", 1),
    part("TF는 위치 통역사", 2),
    part("좌표계와 TF, 질문으로 구분하기", 3),
    part("카메라에서 로봇 손까지", 4, 5),
  ],
  "coordinates-playground": [
    part("원점·방향·단위의 약속", 1),
    part("공을 움직여 좌표 읽기", 0),
    part("원점과 좌표계는 달라요", 2, 3),
  ],
  "tf-transform": [
    part("방향과 기준점을 바꾸어 보기", 0, 1),
    part("ROS 2에서는 tf2", 2, 3),
  ],
  "ros2-overview": [
    part("세 프로그램의 팀워크", 0),
    part("작은 프로그램, 노드", 1),
    part("ROS 2와 MoveIt의 관계", 2, 3),
  ],
  "lidar-overview": [
    part("벽을 옮겨 거리 재기", 0),
    part("빛이 돌아오는 시간", 1),
    part("거리에서 주변 모양으로", 2),
    part("LiDAR와 ROS 2 연결하기", 3, 4),
  ],
  "nav2-overview": [
    part("목적지를 정하고 이동해 보기", 0),
    part("목적지까지 이동하는 순서", 1),
    part("Nav2와 MoveIt의 차이", 2, 3),
  ],
  "natural-language-overview": [
    part("표현을 바꾸어 요청해 보기", 0),
    part("말을 이해하려면 상황도 필요해요", 1),
    part("자연어와 자연어 처리", 2),
    part("사람의 말을 로봇의 목표로", 3, 4),
  ],
  "llm-overview": [
    part("답변이 만들어지는 모습", 0),
    part("글을 다루는 작은 조각, 토큰", 1),
    part("자연스러워도 틀릴 수 있어요", 2),
    part("로봇에서 LLM의 역할", 3, 4),
  ],
  "mujoco-overview": [
    part("중력을 바꾸어 실험하기", 0),
    part("모양에 물리 조건을 더해요", 1),
    part("실제 로봇을 움직이기 전에", 2),
    part("MuJoCo와 MoveIt의 차이", 3),
  ],
  "task-planning-overview": [
    part("작업을 하나씩 실행해 보기", 0),
    part("작업의 순서와 조건", 1),
    part("작업 계획과 움직임 계획", 2),
    part("여러 도구가 함께 일해요", 3),
  ],
  "fms-overview": [
    part("어떤 로봇에게 일을 맡길까요?", 0),
    part("상태 확인부터 완료 확인까지", 1),
    part("충전과 통로도 함께 조율해요", 2),
    part("FMS와 Nav2의 관계", 3, 4),
  ],
  "design-trends": [
    ...["타이포그래피", "정돈된 인덱스", "반투명 레이어", "의미 있는 모션"].map(
      (title, selection) => ({ ...part(title, 0, 1, 2, 3), selection }),
    ),
    part("유행보다 화면의 역할부터", 4, 5),
  ],
  "style-guide-overview": [
    ...["색상과 폰트", "여백과 레이아웃", "컴포넌트", "글 목록"].map(
      (title, selection) => ({ ...part(title, 0, 1), selection }),
    ),
    part("가이드를 웹 구현으로 연결하기", 2),
  ],
  "reference-practice": [
    ...["크기와 위계 관찰하기", "여백 관찰하기", "정렬 관찰하기"].map(
      (title, selection) => ({
        ...part(title, 0, 1, 2, 3, 4, 5, 6),
        selection,
      }),
    ),
    part("관찰하고 기록하는 순서", 7, 8),
    part("내가 다시 꺼내 볼 기준 만들기", 9, 10),
  ],
  "visual-priority": [
    part("읽는 순서를 직접 바꾸어 보기", 0, 1, 2, 3, 4, 5),
    part("레이아웃·여백·크기·색상", 6),
    part("보여줄 순서를 먼저 적어 봐요", 7, 8),
  ],
  "component-kinds": [
    ...[
      "행동을 실행하는 요소",
      "입력하고 선택하는 요소",
      "화면을 탐색하는 요소",
      "정보를 보여주는 요소",
      "상태를 알려주는 요소",
    ].map((title, selection) => ({
      ...part(title, 0, 1, 2, 3, 4, 5),
      selection,
    })),
    part("작은 요소를 하나의 화면으로", 6),
  ],
  "tone-and-feel": [
    part("표현의 방향과 경험의 인상", 0, 1),
    part("말투와 시각 표현 비교하기", 2),
    part("원하는 인상을 규칙으로", 3),
    part("일관된 경험 만들기", 4, 5),
  ],
};

export function getLessonSelection(name: string, index?: number) {
  return index === undefined ? 0 : (lessonParts[name]?.[index]?.selection ?? 0);
}

export function getLessonSlides(post: Post): Section[] {
  if (post.kind !== "tech") return post.sections;
  return post.sections.flatMap((section) => {
    const widget = section.interactive ?? section.supplement;
    const parts = widget && lessonParts[widget];
    const intro: Section = { ...section };
    delete intro.interactive;
    delete intro.supplement;
    delete intro.steps;
    const slides = [intro];
    if (section.steps) {
      slides.push(
        ...section.steps.map((step) => ({
          title: step.title,
          p: [step.body],
          emphasis: section.emphasis,
        })),
      );
    }
    if (parts) {
      slides.push(
        ...parts.map((item, componentPart) => ({
          title: item.title,
          p: [],
          interactive: section.interactive,
          supplement: section.supplement,
          componentPart,
        })),
      );
    } else if (widget) {
      // Unregistered widgets remain attached instead of losing content.
      intro.interactive = section.interactive;
      intro.supplement = section.supplement;
    }
    return slides;
  });
}
