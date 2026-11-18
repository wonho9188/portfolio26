# 피그마와 코드의 대응

파일: `uRijW3DcSLT7oSFLqkpoQL`. 제작한 웹 스타일 가이드의 색상·타입·간격을 토대로, 고정 캔버스 좌표는 CSS Grid와 Flex 레이아웃으로 옮겼습니다. 별도 UI 라이브러리를 추가하지 않고 기존 가이드의 컴포넌트 계약을 React로 구현했습니다.

| 피그마 노드                 | 코드                                            |
| --------------------------- | ----------------------------------------------- |
| `144:593`, `234:562` 홈     | `src/pages/Home.tsx`, `src/components/Hero.tsx` |
| `174:398` Main Work         | `src/pages/Work.tsx`의 `MainWork`               |
| `174:441` Side Work         | `src/pages/Work.tsx`의 `SideWork`               |
| `174:484` Utilities         | `src/pages/Work.tsx`의 `Utilities`              |
| `174:527` Tech Blog         | `src/pages/Posts.tsx`의 `TechBlog`              |
| `174:570` Life & Thoughts   | `src/pages/Posts.tsx`의 `Life`                  |
| `227:421` 기술 글 상세 패턴 | `src/pages/Posts.tsx`의 `Article`               |
| `251:120` 스타일 가이드     | `src/styles/tokens.css`, `src/styles/site.css`  |
| Theme switch, Award chip    | `Layout.tsx`, `ThemeProvider.tsx`, `Home.tsx`   |

실제 앱 컴포넌트가 없던 초기 시점의 Code Connect 경로 `primitives`·`icons`를 외부 패키지로 설치하지 않았습니다. 현재 저장소에서 `TextLink`, `IconSun`, `IconMoon`을 구현했고 SVG는 승인된 원본을 그대로 재사용합니다. 아직 Figma Code Connect에 실제 소스 URL을 등록한 상태는 아닙니다.

## 사용자 확정 사항을 우선 적용한 부분

- 홈 배너는 2026-11-18 요청에 따라 Three.js 곡면에서 관절·중공 링크·그리퍼를 갖춘 기하학적 로봇 조형으로 변경했습니다. 커서와 감쇠 스프링이 강체의 관절 각도·시점을 움직이고, React 생명주기에 맞춰 이벤트·관찰자·GPU 자원을 해제합니다. 정적 대체 화면도 같은 조형의 SVG를 사용합니다.
- Utilities 제목은 일부 피그마 화면에 남은 ‘전달력’ 대신 사용자가 확정한 **기술의 완성도를 높이는 역량**을 사용합니다.
- Life 탭의 일부 이전 컴포넌트에 남은 영어 제목은 요청에 따라 한글 제목으로 사용합니다.
- 소개에는 요청한 ‘원호는 이해하고, 설계하고, 작동하는 결과를 만듭니다.’ 문장을 사용합니다.
- 출처를 확인할 수 없는 오픈채팅 링크를 만들어 넣지 않고, 확인된 이메일과 GitHub를 연결했습니다.
- 프로젝트 실사진을 추가하지 않고 세 종류의 승인된 컨셉 일러스트를 그대로 사용합니다.
- 데스크톱 프로젝트 첫 제목은 한 줄, 작은 화면은 자연 줄바꿈으로 처리합니다. 잘림을 피하려고 전체 화면을 축소하지 않습니다.

## 이미지와 폰트

`src/assets/portrait.png`, `workstation.png`, `robot-arms.png`, `robot-maze.png`와 영화 포스터 2개, 배경·선 그래픽은 `get_design_context`에서 받은 파일을 내려받은 원본입니다. `assets.json`은 원본 노드·슬롯 대응 기록이며, 임시 다운로드 주소는 사이트에서 사용하지 않습니다. Lorenz 원본은 원본 대응 기록용으로만 남아 있고 배너에서는 사용하지 않습니다.

폰트는 Fontsource 공식 패키지의 OFL 글꼴을 자체 제공하며 각 패키지의 라이선스를 따릅니다. Noto Sans KR은 한국어와 라틴 글자 묶음만 사용해 불필요한 언어별 파일을 줄입니다. Inter·Instrument Serif는 배너, Manrope·Space Grotesk는 영문 헤드라인과 로고·메뉴, Noto Sans KR은 한글, IBM Plex Mono는 분류·메타데이터에 사용합니다.

## 콘텐츠의 범위

기존에 정리된 포트폴리오·활동 자료와 피그마 문구를 옮겼습니다. 시스템 구현이나 실물 로봇의 성과를 새로 검증하거나 추정한 것이 아닙니다. 웹에서의 렌더링·링크·상태 검증과 프로젝트 자체의 실증을 구분합니다.
