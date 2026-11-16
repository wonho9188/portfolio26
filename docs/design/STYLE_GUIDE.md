# WONHO 웹 스타일 가이드와 컴포넌트

현재 피그마 홈·서브페이지·포스트 상세를 기준으로 정리한 구현 기준입니다. 실제 사이트 배포본은 아니며, 기존 화면을 자동으로 새 컴포넌트로 교체한 상태도 아닙니다.

## 먼저 볼 곳

- [피그마 스타일 가이드](https://www.figma.com/design/uRijW3DcSLT7oSFLqkpoQL/?node-id=251-120)
- [피그마 컴포넌트 예시](https://www.figma.com/design/uRijW3DcSLT7oSFLqkpoQL/?node-id=253-223)
- `preview.html`: 브라우저에서 확인하는 HTML/CSS 예시. 같은 폴더의 CSS·JS와 상위 assets 폴더를 함께 사용합니다.
- `tokens.css` / `tokens.json`: 색상·타입·간격·레이아웃 값.
- `components.css`: 반응형 카드·목록·탭·버튼·경력·읽기 화면.
- `theme.js`: 시스템 초기값, 사용자 선택 저장, 라이트·다크 버튼.
- `tabs.js`: 클릭·방향키·Home·End 탭 전환, 접힌 메뉴 열기·Escape·초점 복귀.
- `post.schema.json`: 기술·일상 포스트 데이터 계약.
- `component-map.json`: 피그마 컴포넌트 ID와 CSS 클래스·속성 대응.

## 기준과 범위

관찰한 데스크톱 값과 새로 제안한 웹 규칙을 구분합니다.

| 항목           | 현재 화면에서 확인한 값      | 웹 구현 기준                          |
| -------------- | ---------------------------- | ------------------------------------- |
| 화면 / 콘텐츠  | 1440 / 1312px                | 콘텐츠 max 1312px, 가운데 정렬        |
| 좌우 여백      | 64px                         | 데스크톱 64, 태블릿 32, 모바일 20px   |
| 섹션 여백      | 주로 상하 88px, 소개 72px    | 데스크톱 유지, 모바일 기본 56px       |
| 본문           | 18 / 30–32px                 | 기본 18 / 30px, 모바일도 18px 이상    |
| 장문 본문      | 22 / 40px, 실제 열 폭 1032px | 데스크톱 읽기 폭 최대 840px 권장      |
| 카드 제목      | 28–36px                      | 일반 28 / 40, 주요 36 / 52px          |
| 한글 섹션 제목 | 44–48px                      | 44 / 64px, 모바일 36 / 48px           |
| 헤더           | 88px                         | 데스크톱 88, 접힌 메뉴 64px           |
| 조작 크기      | 44px 링크·버튼               | 최소 44×44px을 프로젝트 기준으로 적용 |

모바일 전체 사이트는 아직 만들어진 것이 아닙니다. 이번 라이브러리에는 주요 컴포넌트의 모바일 변형과 반응형 코드 예시를 제공합니다.

## 글꼴

| 글꼴             | 쓰임                           | 사용 굵기                       |
| ---------------- | ------------------------------ | ------------------------------- |
| Noto Sans KR     | 한글 제목·본문·버튼·포스트     | 400 / 500 / 700                 |
| Manrope          | 영문 헤드라인                  | 700 / 800, 기존 장식 소제목 300 |
| Space Grotesk    | WONHO 로고·영문 메뉴           | 400 / 700                       |
| IBM Plex Mono    | 기술 분류·번호·코드·메타데이터 | 400                             |
| Inter            | WANNA CREATE? / WANT A HOW?    | 700                             |
| Instrument Serif | it real. 같은 짧은 강조        | Italic 400                      |

한글을 Manrope에 넣고 브라우저의 대체 글꼴에 맡기지 않습니다. 설명형 제목은 ‘영화와 이야기’, ‘책으로 읽는 세상’처럼 한글을 사용합니다.

배너는 데스크톱 기준 질문 28/40, WONHO makes 90/112, it real. 100/116px입니다. 질문은 두 줄, 메인 두 문구는 넓은 화면에서 같은 줄을 유지합니다. 모바일에서는 제목을 유동적으로 줄이되 본문·메뉴까지 함께 축소하지 않습니다.

`tokens.css`에 24개 타입 역할을 정의했습니다. `14px`는 저작권처럼 부수적인 정보에만 사용합니다. 구현 시 `html` 기본 크기는 100%로 두고 `rem`을 사용해 확대 설정을 존중합니다. 실서비스에서는 필요한 굵기만 제공하고, 글꼴은 가능한 경우 WOFF2로 자체 제공하며 `font-display: swap`을 사용합니다. 미리보기만 Google Fonts를 사용합니다.

## 색상과 테마

피그마 `WONHO DS / Color`의 Dark / Light 모드와 CSS `[data-theme]`가 같은 역할 이름을 사용합니다.

| 역할             | Dark    | Light   |
| ---------------- | ------- | ------- |
| background       | #1C1C1C | #FAF7F4 |
| surface          | #242424 | #FFFCFA |
| raised           | #2E2E2E | #F1E5EB |
| ink              | #F4EFF2 | #30272D |
| muted            | #BDA6B3 | #75616C |
| accent           | #E7A0C8 | #9D4D72 |
| accent-hover     | #F3C0DB | #85385F |
| line             | #51404D | #DCCCD4 |
| interactive-line | #92798A | #AA879A |
| on-accent        | #2B1B24 | #FFFCFA |

`line`은 조용한 구분선, `interactive-line`은 조작 요소의 테두리입니다. disabled 색은 별도 역할을 사용합니다. 텍스트 색은 배경 위의 최종 대비로 확인하며 반투명도만 낮춰 핵심 내용을 표현하지 않습니다.

테마 초기값은 저장된 선택이 우선이고, 없으면 시스템 설정을 따릅니다. 버튼을 누르면 선택을 저장하고 `wonho:themechange` 이벤트를 보냅니다. Three.js 곡면은 이 이벤트에서 실제 CSS 색상 값을 다시 읽어 재질 색상에 반영하도록 통합합니다. 현재 모션 프로토타입 자체를 두 모드로 변경한 것은 아닙니다.

## 간격과 배치

- 간격 토큰: 0, 4, 6, 8, 12, 16, 20, 24, 28, 32, 40, 44, 48, 56, 64, 72, 80, 88, 96, 120px.
- 카드 안쪽 24–32px, 카드 사이 32px, 모바일 카드 사이 24px.
- 둥근 모서리: 기본 콘텐츠 0, 버튼 8, 보조 표면 16, 칩·모드 버튼 pill.
- 그림자는 기본값으로 추가하지 않습니다. 면·선·간격으로 계층을 만듭니다.
- 페이지를 1440px 고정 캔버스로 코딩하지 않습니다. 배경은 화면 폭을 채우고, 콘텐츠는 max-width로 제한합니다.
- CSS Grid는 카드·읽기 열에, Flex는 헤더·버튼·메타데이터에 사용합니다.
- 자식 열에는 `min-width: 0`, 이미지에는 `max-width: 100%`를 적용합니다.
- 콘텐츠 컨테이너의 높이는 자동입니다. 고정 높이는 아이콘·조작 영역·정해진 미디어 비율에만 사용합니다.

### 반응형

| 구간        | 페이지               | 카드 목록 | 메뉴 |
| ----------- | -------------------- | --------- | ---- |
| 1200px 이상 | 12열 기준, 좌우 64px | 3열       | 펼침 |
| 768–1199px  | 8열 기준, 좌우 32px  | 2열       | 접힘 |
| 767px 이하  | 4열 기준, 좌우 20px  | 1열       | 접힘 |

12열 안내 그리드의 열 사이는 24px이고, 실제 카드 사이 간격은 32px입니다. 이 둘을 같은 값으로 혼동하지 않습니다. 모바일에서 경력의 날짜·기관·설명은 세로로 쌓고 스킬 분야명도 도구명 위에 표시합니다. 읽기 화면의 목차는 본문 위로 이동합니다.

## 컴포넌트 계약

새 라이브러리는 18개 묶음·64개 변형입니다. 테마는 Color 모드로 처리하며 모든 카드에 Dark/Light 변형을 중복 생성하지 않았습니다. 헤더는 실제 모드 버튼을 재사용하므로 Theme 축을 함께 제공합니다.

| 피그마         | 웹 역할 / 클래스                      | 변형                                                     |
| -------------- | ------------------------------------- | -------------------------------------------------------- |
| Button         | button 또는 이동용 a / .button        | Primary·Secondary × Default·Hover·Focus·Pressed·Disabled |
| TextLink       | a / .text-link                        | Default·Hover·Focus·Disabled                             |
| NavigationItem | nav 안의 a / .main-nav                | Default·Active·Focus                                     |
| TabItem        | button[role=tab] / .tab               | Default·Selected·Hover·Focus                             |
| Tag            | span / .tag                           | Neutral·Accent·Award                                     |
| SectionHeading | section + h2                          | Default·Compact                                          |
| ProjectCard    | article / .project-card               | Wide·Standard × Desktop·Mobile                           |
| PostCard       | article + h3 링크 / .post-card        | Desktop·Mobile × Default·Hover·Focus                     |
| PostRow        | article / .post-row                   | Text·Media × Desktop·Mobile                              |
| PostCollection | ul + li / .post-grid 또는 .post-list  | Grid·List × Desktop·Mobile                               |
| SkillRow       | dl > dt + dd / .skill-row             | Desktop·Mobile                                           |
| ExperienceRow  | 시간순 경력 묶음 / .experience-row    | Desktop·Mobile                                           |
| Callout        | aside 또는 blockquote / .callout      | Note·Quote                                               |
| EmptyState     | 상태 메시지 / .list-state             | Empty·Loading·Error                                      |
| ArticleHeader  | header + h1 / .page-title             | Desktop·Mobile                                           |
| ArticleBlock   | p·pre/code·blockquote / .article-body | Paragraph·Code·Quote                                     |
| SiteHeader     | header + nav / .site-header           | Dark·Light × Desktop·Mobile                              |
| SiteFooter     | footer / .site-footer                 | Desktop·Mobile                                           |

기존 `Award chip / KDT`, `Theme switch / Light and Dark`, `Life / Tabbed posts`, `Tech Blog / Topic tabs`는 기존 화면의 실제 데이터·연결을 유지합니다. 컴포넌트 예시 보드에서 실제 인스턴스도 확인할 수 있습니다. 새 라이브러리의 제목·설명·분류·기간 등은 텍스트 속성으로 바꿀 수 있습니다.

피그마 메인 컴포넌트는 예시 보드 오른쪽에 있습니다. 코드에서는 클래스 이름과 데이터 계약을 따릅니다. 실제 앱의 React/Vue 컴포넌트 파일이 아직 없으므로 Code Connect에 가짜 경로를 등록하지 않았습니다. 사이트를 구현한 뒤 실제 컴포넌트 경로에 연결하면 됩니다.

## 포스트 목록과 데이터

- 기술 / 일상 포스트를 `section`으로 분리하고 세부 분류는 `category`, 교차 주제는 `topics[]`로 관리합니다.
- 기술 분류: ROS2, 경로 계획, 주행 제어, React, PyQt, 디자인 시스템.
- 일상 분류: 영화와 이야기, 책으로 읽는 세상, 삶을 돌아보는 질문들, 만들고·그리고·연주한 활동.
- 필수 필드: id, slug, title, section, category, excerpt, status.
- 선택 필드: topics, publishedAt, readingMinutes, thumbnail, sourceUrl, body.
- published 상태에는 실제 본문 블록이 필요합니다. 실제 데이터가 없는 날짜·읽는 시간·정량 결과는 출력하지 않습니다.
- `draft`는 게시된 글과 구분합니다. 홈에서 초안을 미리 보여주는 경우에도 ‘기록 초안’ 상태를 유지합니다.
- 제목은 목록과 상세에서 자르지 않습니다. 요약의 줄 제한이 필요하면 목록에서만 적용하고 상세에서는 전체를 표시합니다.
- 카드 전체 클릭은 하나의 제목 링크를 확장하는 방식으로 처리합니다. 카드 안에 독립 링크·버튼을 중첩하지 않습니다.
- 같은 화면의 패널 교체는 ARIA tabs, 새 URL로 이동하는 분류는 일반 링크를 사용합니다.
- Empty / Loading / Error는 구분하고, 실제 서비스에서만 목록 요청과 재시도를 연결합니다. 미리보기는 네트워크 요청을 하지 않습니다.

## 이미지와 아이콘

- 프로젝트 일러스트는 기존 승인 이미지를 재사용하며 `object-fit: contain`으로 잘리지 않게 합니다.
- 영화 포스터는 약 9:13, 원출처는 기존 Notion 자료를 따릅니다.
- 프로필은 얼굴만 확대하지 않고 배경 여백을 확보합니다.
- 내용 이미지에는 alt, 장식 이미지에는 빈 alt를 제공합니다.
- 해·달 아이콘은 현재 Figma의 Simple Design System 원본을 SVG로 내보냈습니다. `currentColor`로 색상을 상속하며 아이콘 자체는 보조 장식입니다. 버튼에 전환할 모드를 이름으로 제공합니다.

## 배너 모션

사용자가 선택한 02 / Ruled Architecture 방식을 유지합니다. 정밀한 선 곡면을 Three.js로 재구성해 커서를 살짝 늦게 따라 휘게 하고, 작은 파동 뒤 천천히 복귀합니다. 제목과 하단 문구를 침범하거나 형태가 과하게 무너지면 안 됩니다.

- 기존 프로토타입: `C:/Users/pinklab/.codex/visualizations/2026/11/14/01a1d917-a7e0-7f32-a3be-93a57ce5f37c/ruled-surface-motion.html`
- hover 약 160ms, 테마 220ms, 큰 배치 변화 약 300ms.
- 자동 모션 정지, reduced-motion, 화면 밖·숨겨진 탭 렌더 중지.
- 모바일 선 개수와 DPR 제한, WebGL 미지원 시 정적 곡면 또는 가벼운 대체 렌더링.

## 접근성과 검증

일반 텍스트 4.5:1, 큰 글자 3:1을 대비 기준으로 확인합니다. 프로젝트의 44px 조작 기준은 WCAG 2.2 AA의 24px 최소 목표보다 여유 있게 잡은 값이며, 두 기준을 같은 것으로 표현하지 않습니다.

- h1은 페이지마다 하나, section h2와 card h3로 계층을 만듭니다.
- focus-visible: 2px 포인트 선, offset 4px. 마우스 hover 없이도 모든 정보와 동작이 있어야 합니다.
- 네이티브 button과 a, tabs의 aria-selected·aria-controls·tabindex를 사용합니다.
- 접힌 메뉴는 펼침 상태를 알리고 Escape로 닫으면 여는 버튼으로 초점을 돌립니다. 예시는 모달 메뉴가 아닌 인라인 펼침 메뉴입니다.
- 320px과 200% 확대에서 페이지 전체 가로 스크롤·글자 잘림을 확인합니다. 코드 블록만 내부 가로 스크롤을 허용합니다.
- CSS/JS 미리보기는 사이트 통합 전 참고 구현입니다. 화면별 실제 데이터·라우팅·반응형 동작은 앱 통합 시 다시 확인합니다.

근거: [W3C 텍스트 대비](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [W3C 목표 크기](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [MDN 모션 줄이기](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

## 유지보수

색상·타입·간격의 기준은 `spec.json`과 피그마의 WONHO DS 컬렉션입니다. 변경 시 CSS/JSON을 함께 갱신합니다. `build-*.js`는 이번 네이티브 피그마 작성에 사용한 작업 스크립트이며 일반 웹 코드가 아닙니다. 재실행 전에 `state.json`과 생성된 ID를 확인해 중복 컴포넌트를 만들지 않습니다.
