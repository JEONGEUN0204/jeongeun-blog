# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개요

[tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) v2를 포크해 **개인 이력서·경력기술서·포트폴리오 사이트**로 개조한 저장소다. 블로그 기능(`/blog`, `/tags`)은 스타터 원본 그대로 남아 있고, 실제 커스터마이징의 대부분은 `/resume`, `/careers`, `/portfolio` 문서형 페이지와 그 **인쇄(PDF) 파이프라인**에 집중되어 있다.

`SPEC.md`(45KB)는 이 개조 작업의 설계 문서이자 원본 PDF 3종의 텍스트 원문을 그대로 담고 있다. 콘텐츠나 문서형 페이지 구조를 손볼 때 먼저 참고할 것. `README.md`는 스타터 원본 문서라 이 저장소 고유의 결정은 담고 있지 않다.

## 명령어

```bash
npm run dev      # 개발 서버 (contentlayer가 data/**/*.mdx를 감시·재생성)
npm run lint     # eslint --fix (pages, app, components, lib, layouts, scripts)
npm run build    # 프로덕션 빌드 + RSS 생성(scripts/postbuild.mjs)
npm run analyze  # 번들 분석

# CI(GitHub Pages)와 동일한 정적 export 빌드 — 배포 전 검증용
cross-env EXPORT=1 UNOPTIMIZED=1 npm run build
```

테스트 러너는 없다. 검증은 `npm run lint` + 정적 export 빌드 성공 + 브라우저 인쇄 미리보기 확인으로 한다.

패키지 매니저: `package.json`의 `packageManager`와 CI는 yarn 3.6.1이지만, 현재 `node_modules`는 npm으로 설치되어 있고 `package-lock.json`/`yarn.lock` 둘 다 커밋되어 있다. **의존성을 추가하면 두 lockfile 모두 갱신**해야 CI와 로컬이 어긋나지 않는다.

커밋 시 husky + lint-staged가 eslint/prettier를 자동 실행한다.

## 아키텍처

### 콘텐츠 → Contentlayer2 → 페이지

`contentlayer.config.ts`가 `data/` 아래 MDX를 4개 document type으로 읽어 `contentlayer/generated`(= `.contentlayer/generated`)로 내보낸다. 필드를 추가·변경하려면 이 파일을 고쳐야 하고, 고친 뒤에는 dev 서버 재시작이 필요할 수 있다.

| Type       | 소스                  | 소비하는 곳                                                            |
| ---------- | --------------------- | ---------------------------------------------------------------------- |
| `Blog`     | `data/blog/**/*.mdx`  | `app/blog/*` — 스타터 원본                                             |
| `Authors`  | `data/authors/*.mdx`  | `layouts/AuthorLayout.tsx`(프로필 헤더), `app/Main.tsx`(About Me 본문) |
| `Careers`  | `data/careers/*.mdx`  | `components/CareerList.tsx` → `/careers`, `/resume/full`               |
| `Projects` | `data/projects/*.mdx` | `app/portfolio/page.tsx` → `/portfolio`                                |

- `Careers`의 `logoSize`/`logoFit`, `Projects`의 `imageSize`/`imageFrame`은 **렌더링 레이아웃을 직접 제어하는 프론트매터**다. 각 필드의 의도는 `contentlayer.config.ts`와 소비 컴포넌트의 주석에 적혀 있으니 값을 바꾸기 전에 읽을 것.
- `Projects`는 `order` 오름차순으로 정렬된다. 순서를 바꾸려면 MDX의 `order`를 고친다.
- `onSuccess` 훅이 `app/tag-data.json`과 `public/search.json`(kbar 검색 인덱스)을 **빌드 산출물로 덮어쓴다** — 이 두 파일은 직접 수정하지 말 것.

### 이력서는 MDX가 아니라 TS 데이터

`/resume`만 예외적으로 MDX가 아닌 `data/resumeData.ts`(구조화된 객체)를 쓰고, `components/ResumeContent.tsx`가 렌더링한다. 짧고 고정적인 항목(스킬·학력·자격증)이라 MDX보다 데이터+React가 단순하다는 판단이었다.

`/resume/full`은 `ResumeContent`(`showFullLink={false}`) + `CareerList`를 이어 붙인 **인쇄 전용 통합 페이지**다. 이력서와 경력기술서를 한 문서로 요구하는 곳에 제출하기 위한 것이므로, 두 컴포넌트는 항상 단독 페이지와 통합 페이지 양쪽에서 동작해야 한다.

### 인쇄(PDF) 아키텍처 — 이 저장소의 핵심 제약

GitHub Pages 정적 export라 서버 PDF 생성이 불가능하다. **브라우저 네이티브 인쇄(Ctrl+P → PDF로 저장)** 만으로 제출 가능한 품질이 나와야 한다. `window.print()` 버튼은 의도적으로 만들지 않는다(브라우저 기본 기능과 중복).

문서형 페이지에 손을 댈 때 지켜야 할 규칙:

1. **페이지 경계에서 잘리지 않게 감싼다.** 새 블록은 `break-inside-avoid-page`, 제목은 `break-after-avoid-page`. MDX 안에서는 `<Section>`으로 감싸면 둘 다 적용된다. 이미지는 `break-inside-avoid-page` div로 감싼다.
2. **사이트 UI는 `print:hidden`.** Header/Footer/ScrollTop 등은 이미 적용되어 있다. 새로 추가하는 네비게이션·버튼류도 마찬가지로 숨긴다.
3. **다크모드는 인쇄에서 완전히 무력화된다.** `css/tailwind.css`가 `@custom-variant dark`를 `@media not print`로 재정의해 `dark:` 유틸리티 자체가 인쇄 시 적용되지 않게 한다. `css/print.css`의 색상 강제만으로는 부족했기 때문이다 — 이 커스텀 variant를 지우면 다크모드로 보다가 인쇄할 때 본문이 읽히지 않는다.
4. **배경색 보존.** `css/print.css`가 `print-color-adjust: exact`를 전역으로 걸어 라벨 칩·`StatCard`의 배경이 인쇄에 남는다.
5. `Projects` 이미지의 `imageSize[0]`(표시 폭)은 **A4 인쇄 폭(약 640px 콘텐츠 폭) 안에서 한 프로젝트의 이미지가 gap 포함 한 줄에 들어가도록** 정한다(2장이면 300 등). 높이는 `h-auto`라 원본 비율을 따른다.

변경 후에는 각 문서 페이지에서 인쇄 미리보기를 실제로 확인한다.

### 문서형 MDX 컴포넌트

`components/mdx/`의 컴포넌트들이 `components/MDXComponents.tsx`에 등록되어 `careers`/`projects` MDX 본문에서 태그로 바로 쓰인다. 원본 PDF의 시각 구조를 옮긴 것이다.

- `Section` — 제목 + 인쇄 break 보호 래퍼
- `Label` / `Block` — PROBLEM(앰버) · APPROACH(블루) · RESULT(티얼) 컬러 칩. `Block`은 칩 + 본문 한 덩어리
- `Steps` — 문제/개선/성과 3단을 같은 컬러 체계로 한 줄씩
- `Meta` — "기술 / 역할" 메타 라인
- `Split` — 본문 + 우측 강조 카드 2단(인쇄에서도 2단 유지)
- `StatCard` — 다크 네이비 성과 카드. 라이트/다크 모두 네이비 고정

새 컴포넌트를 만들면 `MDXComponents.tsx`에 등록해야 MDX에서 인식된다.

### 스타일 스코프

- `prose-doc`(`css/tailwind.css`)은 **문서형 페이지 본문에만** 붙이는 스코프 클래스다. h3에 티얼 바, 리스트 마커 색상 등. 이걸 `MDXComponents`에서 전역 오버라이드로 옮기면 블로그 글까지 바뀌므로 스코프를 유지할 것.
- 테마 컬러는 Tailwind 4 `@theme` 블록의 `--color-primary-*`(Deep Teal)다. `primary-700`은 다크 배경에서 읽히지 않아 다크모드에서는 `primary-300/400`을 쓴다.
- 티얼은 성과·강조 전용, 태그/뱃지 같은 중립 요소는 회색을 쓴다는 색 규칙이 문서형 페이지 전반에 적용되어 있다.

### 정적 export 제약

`.github/workflows/pages.yml`이 main 푸시마다 `EXPORT=1 UNOPTIMIZED=1 BASE_PATH=<pages base>`로 빌드해 `./out`을 GitHub Pages에 배포한다. 따라서:

- 동적 라우트는 `generateStaticParams`가 반드시 있어야 하고, route handler와 `sitemap`/`robots`는 `export const dynamic = 'force-static'`이 필요하다.
- 런타임 서버 로직(요청 시점 데이터 fetch, 실동작하는 API 라우트)은 쓸 수 없다.
- `next/image`가 `unoptimized`로 돌아간다.
- 정적 자산 경로에는 `process.env.BASE_PATH`를 붙여야 한다(`app/layout.tsx`의 favicon/manifest, `siteMetadata`의 로고·검색 인덱스 경로가 그 예).

`app/api/newsletter/route.ts`는 스타터 잔재로 `force-static`이 걸려 실제로는 동작하지 않는다.
