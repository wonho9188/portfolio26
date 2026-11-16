# WONHO makes it real.

[공개 사이트](https://wonho9188.github.io/portfolio26/) · [배포 결과](https://github.com/wonho9188/portfolio26/actions/runs/43802632214)

로봇 개발자 최원호의 2026 포트폴리오. 승인한 **Signal & silence / Warm Rose** 피그마 시안과 웹 스타일 가이드를 React로 구현했습니다.

## 실행

Node.js 24와 npm을 사용합니다.

```sh
npm ci
npm run dev
```

기본 주소는 터미널에 표시되는 `http://127.0.0.1:5173/portfolio26/`입니다.

```sh
npm run build
npm run preview
```

빌드 결과는 `dist/`에 생성됩니다. 글꼴과 이미지는 자체 제공하며, 임시 피그마 이미지 주소를 런타임에서 사용하지 않습니다.

## 화면과 구현

- 홈: 배너, 소개, 이해·설계·실현, 주요 작업, 사이드 작업, 유틸리티, 기술 글, 스킬·경력, 취미·생각.
- Main Work / Side Work / Utilities: 메뉴별 독립 페이지와 섹션 바로가기.
- Tech Blog / Life & Thoughts: URL에 선택이 유지되는 분류 탭과 목록.
- 기술 글 6개와 일상 기록 10개의 상세 화면: 목차, 출처, 이전·다음 글, 목록 복귀.
- 시스템 설정과 저장된 선택을 따르는 라이트·다크 모드.
- Three.js 곡면: 승인한 커서 반응형 배너의 정점 변형과 감쇠 파동을 재사용. 재생·정지, 모션 줄이기, 화면 밖·탭 숨김 시 렌더 중지, WebGL 실패 시 승인된 정적 이미지 표시.
- 반응형 레이아웃, 명시적 메뉴 버튼, 키보드 탭 전환, Escape와 초점 복귀, 본문 바로가기.

React 19, TypeScript, Vite 8, React Router 7, Three.js를 사용합니다. GitHub Pages의 하위 경로와 상세 화면 새로고침을 지원하기 위해 Vite의 `base: '/portfolio26/'`와 `HashRouter`를 함께 사용합니다.

## 콘텐츠 수정

| 위치                         | 내용                                                     |
| ---------------------------- | -------------------------------------------------------- |
| `src/data/content.ts`        | 메뉴·프로젝트·경력·수상·스킬·주제·글 식별자              |
| `src/data/posts-source.json` | 실제 글 제목·요약·본문·출처                              |
| `src/styles/tokens.css`      | 피그마 스타일 가이드에서 가져온 공통 색상·간격·서체 변수 |
| `src/styles/site.css`        | 화면과 반응형 레이아웃                                   |
| `src/components/`            | 헤더·푸터·카드·링크·테마·배너                            |
| `src/pages/`                 | 홈·작업·유틸리티·목록·글 상세                            |
| `src/assets/`                | 실제 피그마 프로필·일러스트·SVG·영화 포스터              |

글 추가 시 본문 JSON의 각 글에 고유한 `slug`, `group`, `status`를 함께 입력합니다. 순서를 바꿔도 글 주소와 분류가 바뀌지 않습니다. 새 분류를 만들 때만 `content.ts`의 주제 목록을 수정합니다. 현재는 서버나 CMS 없이 Git에 저장한 콘텐츠를 빌드합니다. 기술 노트는 **초안**, 아직 쓰지 않은 생각 글은 **작성 예정**으로 유지하며 게시일·성과·읽는 시간을 만들어 넣지 않습니다. 원본 PDF나 사내 자료 전체는 저장소에 포함하지 않습니다.

기존 회사명 `핑크랩`의 재직 시작은 사용자 제공 정보인 **2026.02**를 유지합니다. 실무 경력과 기타 경험을 분리했고 KDT 두 과정의 최우수상은 칩으로 표시합니다.

## GitHub Pages

대상 저장소: [wonho9188/portfolio26](https://github.com/wonho9188/portfolio26)

대상 주소: `https://wonho9188.github.io/portfolio26/`

1. `main`에 코드를 업로드합니다.
2. 저장소 **Settings → Pages → Source → GitHub Actions**를 선택합니다.
3. `.github/workflows/pages.yml`이 테스트·빌드·배포를 진행합니다. 처음 설정한 후에는 Actions에서 직접 다시 실행할 수 있습니다.

현재 공개 배포와 실제 URL 검증을 완료했습니다. 이후 main의 앱 변경은 Actions에서 검사·빌드·배포됩니다. 상세 검증 범위는 [작업 상태](docs/STATUS.md)와 [검증 기록](docs/verification.json)에 정리합니다.

## 검사

```sh
npx playwright install chromium
npm test
```

테스트용 브라우저는 개인 브라우저와 별도로 실행됩니다. 사용자 화면이나 마우스·키보드를 조작하지 않습니다. Linux 환경에서는 `npx playwright install --with-deps chromium`을 사용합니다.

검사 범위: 메뉴와 분류, 초점, 상세 글 새로고침, 테마 저장, 320–1440px 전체 페이지 넘침·제목 잘림, 이미지 로딩, 배너 정지·재생, 모션 줄이기. 결과와 스크린샷은 추적하지 않는 `artifacts/`, `test-results/`, `playwright-report/`에 저장합니다.

## 디자인 기준

- [피그마 홈](https://www.figma.com/design/uRijW3DcSLT7oSFLqkpoQL/?node-id=144-593)
- [피그마 스타일 가이드](https://www.figma.com/design/uRijW3DcSLT7oSFLqkpoQL/?node-id=251-120)
- [피그마 컴포넌트](https://www.figma.com/design/uRijW3DcSLT7oSFLqkpoQL/?node-id=253-223)
- [구현 결정과 원본 대응](docs/design/IMPLEMENTATION.md)

참고: [Vite의 GitHub Pages 배포](https://vite.dev/guide/static-deploy#github-pages), [React Router HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter), [Three.js 리소스 해제](https://threejs.org/manual/pages/how-to-dispose-of-objects.html), [GitHub Pages 공식 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
