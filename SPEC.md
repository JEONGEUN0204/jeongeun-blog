# SPEC: 이력서·경력기술서·포트폴리오 블로그 재구성

> 이 문서는 별도 세션에서 구현할 수 있도록 작성된 스펙 문서입니다. 원본 PDF 3종(이력서/경력기술서/포트폴리오, 2026)의 텍스트를 그대로 옮겨 실었으므로, 구현 세션은 PDF를 다시 열지 않고 이 문서만으로 작업할 수 있습니다.
>
> 원본 PDF 위치(참고용, 특히 포트폴리오의 스크린샷 이미지를 추출할 때 필요):
>
> - `C:\Users\jeongeun\Downloads\신정은_이력서_2026.pdf`
> - `C:\Users\jeongeun\Downloads\신정은_경력기술서_2026.pdf`
> - `C:\Users\jeongeun\Downloads\신정은_포트폴리오_2026.pdf`

## 0. 배경 / 목표

이 저장소는 Next.js 15(App Router) + Contentlayer2 + Tailwind CSS 4 기반이며, `.github/workflows/pages.yml`을 통해 **GitHub Pages로 정적 export 배포**된다(서버/API 라우트 없음, `EXPORT=1 UNOPTIMIZED=1 next build`). 이 제약은 PDF 내보내기 방식 설계에 직접 영향을 준다(§4 참고).

목표: 2026년 최신 이력서/경력기술서/포트폴리오 PDF의 내용을 블로그에 반영해, 앞으로는 PDF를 직접 수정하지 않고 블로그 콘텐츠(MDX)를 관리하며, 필요할 때 브라우저 인쇄로 PDF를 뽑아 회사에 제출한다.

기존 `data/careers/*.mdx`, `data/projects/*.mdx`는 **구조는 재사용 가능하지만 내용이 완전히 오래됨**(예: 현재 `codit.mdx`는 "회의록 상세 페이지 리뉴얼" 등 과거 이슈로 채워져 있고 입사일도 `2024-11`로 잘못되어 있음 — 실제는 `2025-11`). 아래 §5의 내용으로 전면 교체한다.

확정된 결정 사항:

- 이력서 / 경력기술서 / 포트폴리오는 **별도 페이지 3개**로 유지한다(병합하지 않음).
- 경력기술서와 포트폴리오는 같은 STAR 스토리를 공유하지만(회사가 요구하는 제출 형식이 텍스트형/비주얼형으로 갈리기 때문에 분리), 콘텐츠는 각 MDX 파일에서 한 번만 관리한다.
- 기존 `app/projects`(예전 스타터 템플릿 잔재, portfolio와 내용 중복)는 **삭제**하고 portfolio로 통합한다.
- PDF 변환 버튼은 별도로 만들지 않는다 — 브라우저 기본 인쇄(Ctrl+P)로 충분하며, 사이트는 본인만 쓰는 개인 도구이므로 버튼은 불필요한 중복이다. 대신 인쇄 결과물의 품질(특히 페이지 경계에서 섹션이 잘리는 문제)을 CSS로 보장한다.

---

## 1. 정보 구조 (라우트)

| 라우트          | 상태             | 설명                                                              |
| --------------- | ---------------- | ----------------------------------------------------------------- |
| `/`             | 유지             | 기존 Home                                                         |
| `/resume`       | **신규**         | 이력서. §3, §5-A                                                  |
| `/resume/full`  | **신규**         | 이력서 + 경력기술서 통합 인쇄용 페이지 (버튼 없이 방문 후 Ctrl+P) |
| `/careers`      | 내용 전면 재작성 | 경력기술서. §5-B                                                  |
| `/portfolio`    | 내용 전면 재작성 | 포트폴리오. §5-C                                                  |
| `/blog`         | 유지             | 기존 블로그                                                       |
| `app/projects/` | **삭제**         | portfolio와 중복되는 레거시 페이지                                |

`data/headerNavLinks.ts`에 Resume 링크 추가:

```ts
const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/resume', title: 'Resume' },
  { href: '/careers', title: 'Career' },
  { href: '/portfolio', title: 'Portfolio' },
  { href: '/blog', title: 'Blog' },
]
```

---

## 2. 정리 작업 (Cleanup)

1. `app/projects/` 디렉토리 전체 삭제.
2. `data/projectsData.ts`(레거시 정적 데이터, `app/projects/page.tsx`가 `Card` 컴포넌트로 그리드 렌더링하던 데이터)를 다른 곳에서 참조하지 않는지 확인 후 삭제.
3. `contentlayer.config.ts`는 **수정 불필요** — `Careers`/`Projects` document type 스키마가 이미 아래 §5 내용을 담기에 충분함(`company/date/endDate/description/logo/duration/tags` 및 `order/name/date/endDate/tags/images/imageSize`).

---

## 3. `/resume` 신규 구현

### 3.1 데이터 파일: `data/resumeData.ts`

기존 코드베이스 패턴(`data/siteMetadata.js`, 구 `data/projectsData.ts`)처럼 구조화된 데이터로 관리(짧고 고정적인 내용이라 MDX보다 단순 데이터 + React 렌더링이 적합). 아래 내용을 그대로 담을 것:

**기본 정보**

```
name: 신정은
title: Frontend Engineer
tagline: 웹과 앱을 아우르며 구조적 문제를 진단하고 재설계해, 성능과 안정성을 함께 끌어올리는 프론트엔드 엔지니어
email: wjddms9921@gmail.com
phone: 010-9921-1047
github: github.com/JEONGEUN0204
```

**Summary (요약)**

> 웹(PC·Mobile)과 앱 WebView 전반의 기능 개발과 운영을 해 온 프론트엔드 엔지니어입니다. 회원·인증·구독·인앱결제(IAP) 같은 핵심 플로우를 실서비스로 구축했고, 중복 호출·전역 일괄 로딩처럼 눈에 띄지 않는 요청·렌더링 구조의 비효율을 찾아 재설계했습니다(조회 API 호출 75%↓, 대시보드 순차 로딩 재설계). MAU 30만 규모 서비스 운영과 실시간 스트리밍(SSE) 프로토콜 설계 경험을 바탕으로, 구조적 문제를 직접 진단하고 재설계하는 데 강점이 있습니다.

**성과 지표 카드 4개**
| 값 | 라벨 |
|---|---|
| API 75%↓ | 조회 로직 캐싱 최적화 |
| +3%p | Crash Free Rate 향상 |
| 0 → 1 | 웹·앱 신규 구축·운영 |
| Web · App | 웹·앱 전 영역 개발 |

**Skills**

- Language: TypeScript, JavaScript
- Frontend: React, Next.js, React Native, Expo, Tailwind
- State · Data: TanStack Query, Zustand, Recoil
- Dev · Ops: Storybook, Sentry, expo-iap, EAS, Genkit
- Collaboration: Git/GitHub, Bitbucket, Jira, Figma, Confluence

**Education**

- 숙명여자대학교 — IT공학전공 · 2019.03 ~ 2024.02
- 삼성고등학교 · 2015.03 ~ 2018.02

**Certificate**

- 정보처리기사 — 한국산업인력공단 · (2022.06)

**Experience (요약 하이라이트 — 경력기술서의 축약판, 별도 텍스트)**

`코딧 (Codit)` — Frontend Engineer · 2025.11 ~ 현재 (약 8개월, 이력서 PDF 기준 시점)
정책·입법 데이터 플랫폼 「Codit」과 분리 서비스 「ChatCODIT」의 웹·네이티브 앱 프론트엔드 담당

- **Codit 플랫폼 (Web)**
  - 대시보드 순차 로딩 아키텍처 설계 — 전 섹션 일괄 요청으로 느리던 초기 로딩을 슬라이드 단위 fetch+prefetch로 재설계, 초기 요청량 축소·진입 로딩 개선
  - 레거시 스타일 마이그레이션 — styled-components → Tailwind 순차 전환·공통 컴포넌트화로 유지보수성 향상
- **ChatCODIT (Web)**
  - 실시간 스트리밍 프로토콜 설계 — 거대한 JSON을 수동 파싱하던 기존 방식을 블록 단위 SSE 프로토콜(7종)로 직접 설계해 백엔드에 요청, 약 1,281줄에 달하던 수동 파서를 걷어내 파싱 로직 대폭 단순화
  - 대화형 문서 초안 작성(Draft) — 기존 스트리밍 스토어에 블록 타입만 추가해 멀티턴 문서 생성을 무중단 확장, 에러 3분기·409 자기복구로 복원력 확보
  - 반응형 웹 · 0→1 구축 — SSR 디바이스 감지·라우트 분리·Tailwind 토큰으로 반응형 대응, React → Next.js 마이그레이션·회원·인증·SEO·Bitbucket Pipeline 배포
- **ChatCODIT App (iOS · Android)**
  - 웹→네이티브 마이그레이션 — Expo Router 아키텍처로 재구성하고 스트리밍 채팅·마크다운 렌더링을 앱에 이식해 iOS·Android 1.0.0 정식 출시
  - 인앱결제(IAP)·구독 신뢰성 확보 — expo-iap 서버 검증·IAPProvider 통합, 미완료 거래 sweep·중복 구독 방지로 중복 verify 해소
  - 앱 보안·무중단 배포 — reCAPTCHA·Firebase App Check 무결성 검증, EAS 환경 분리·OTA·rollback 자동 배포 체계 구축
- **더코딧 앱 (iOS · Android · WebView)**
  - 코딧 웹을 WebView로 감싼 네이티브 앱 — 웹 자산을 활용해 앱 스토어 배포·네이티브 연동을 담당, 빠르게 모바일 앱으로 서비스 제공

`이즐랩스` — Frontend Engineer · 2024.06 ~ 2025.10 · 1년 4개월
MAU 30만 교통카드 충전·조회 서비스 「이즐충전소」 운영, 앱·웹·디자인 시스템·내부 AI 전반 개발

- **이즐충전소 (React Native · 앱)**
  - 이즐워크 조회·포인트 전환 API 개선 — 버튼 클릭마다 중복 호출되던 조회 API를 useQuery 전환·캐싱으로 재설계, API 호출 75% 감소
  - Sentry 활용 앱 안정성 대응 — Sentry로 런타임 에러를 확인·수정해 Crash Free Rate 약 3%p 향상
  - 충전·환불 재시도 플로우 구현 — 미완료 거래 재시도·연속 클릭 방지로 중복 결제 차단·CS 인입 감소
- **백오피스 · 디자인 시스템 · 내부 AI (React · React Native)**
  - 백오피스 — 관리자 운영 기능 구현 및 react-error-boundary로 에러 처리 패턴 표준화(가독성·유지보수성 향상)
  - 디자인 시스템 — 공통 UI 컴포넌트·Storybook Controls 적용으로 코드 수정 없이 UI 확인, 개발 시간 단축
  - Jira/Confluence 검색 AI — 자연어 질의로 사내 데이터를 검색하는 내부 도구 구현(Genkit·프롬프트 설계)

**협업 방식 (Collaboration) 카드 3개**

> 상대 부서의 제약을 이해하고, 판단 근거를 남겨 소통하는 것을 협업의 기본으로 삼습니다.

- **BACKEND** — 응답 구조 변경이 필요할 때 현행 문제·개선안·스펙·스키마 리뷰를 문서로 정리해 제안하고, 그 문서를 기준으로 함께 리뷰하며 합의합니다. (예: 블록 단위 SSE 프로토콜(7종) 설계안을 문서로 제안, citations 매칭 방식 스키마 리뷰)
- **DESIGN · PRODUCT** — 구현 제약이나 엣지 케이스를 먼저 공유해 화면이 확정되기 전에 조율합니다. (예: iOS 심사 가이드·플랫폼 정책상 구독 화면에 필수로 노출해야 하는 요소나 결제 실패·미완료 상태를 미리 공유해 화면에 반영하도록 조율)
- **QA** — 재현 경로와 원인 분석을 함께 정리해 이슈 범위를 좁힙니다. (예: WebView 모달 중복 오픈 건, 재현 조건을 함께 좁혀 브릿지 주입 타이밍까지 원인 규명)

> 이렇게 각 부서의 언어로 맥락과 근거를 전달하는 소통 덕분에, 요청이 오해 없이 전달되고 재작업을 줄일 수 있었습니다.

### 3.2 페이지: `app/resume/page.tsx`

`data/resumeData.ts`를 렌더링하는 순수 React 페이지(MDX 불필요). 디자인은 기존 사이트 톤에 맞춰 자유 구성(원본 PDF 디자인과 동일할 필요 없음 — 사용자 확인됨). 최소 구성 요소:

- 헤더(이름/직함/tagline/연락처)
- 성과 지표 카드 4개
- Skills 배지 그룹
- Education / Certificate
- Experience 하이라이트 (회사별 블록)
- Collaboration 카드 3개
- `/resume/full`로 가는 링크("이력서 + 경력기술서 통합 보기")

### 3.3 페이지: `app/resume/full/page.tsx`

`/resume`의 컨텐츠 + `allCareers`(경력기술서, §5-B) 콘텐츠를 이어붙여 렌더링. 회사가 "이력서와 경력기술서를 하나의 PDF로" 요구할 때, 이 페이지를 방문해 Ctrl+P로 인쇄. 별도 버튼 없음.

---

## 4. PDF 내보내기 아키텍처

정적 export 환경(GitHub Pages)이라 서버 PDF 생성(puppeteer 등)은 불가능하다. **브라우저 네이티브 인쇄(Ctrl+P → PDF로 저장)** 만으로 동작하게 만든다. 별도의 "PDF 다운로드/인쇄" 버튼은 만들지 않는다 — `window.print()`만 호출하는 버튼은 브라우저 기본 기능과 완전히 중복이고, 이 사이트는 방문자용이 아니라 본인이 제출용으로 쓰는 개인 도구이기 때문이다.

### 4.1 섹션 잘림 방지 (사용자가 가장 크게 지적한 문제)

인쇄 시 문단·이미지가 페이지 경계에서 잘려 가독성이 나빠지는 문제를 구조적으로 막는다.

**신규 컴포넌트: `components/mdx/Section.tsx`**

```tsx
export default function Section({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <section className="my-8 break-inside-avoid-page">
      {title && <h3 className="break-after-avoid-page">{title}</h3>}
      {children}
    </section>
  )
}
```

- `break-inside-avoid-page`: 요소 내부에서 페이지가 갈라지지 않도록 함(Tailwind 4 기본 유틸리티, 별도 설정 불필요).
- 제목에 `break-after-avoid-page`: 제목이 페이지 하단에 혼자 남고 본문이 다음 페이지로 넘어가는 것을 방지.

`components/MDXComponents.tsx`(pliny 커스텀 컴포넌트 등록부)에 `Section`을 등록해 `data/careers/*.mdx`, `data/projects/*.mdx` 본문에서 `<Section title="...">...</Section>`으로 각 번호 항목/문제-개선-성과 블록을 감싼다. (§5의 콘텐츠를 옮길 때 각 블록을 이 컴포넌트로 감쌀 것.)

이미지도 동일하게 `break-inside-avoid-page`가 적용된 wrapper(`<div className="break-inside-avoid-page">`)로 감싼다.

### 4.2 인쇄 전용 스타일시트: `css/print.css`

새로 생성해 `app/layout.tsx` 또는 `css/tailwind.css`에서 import. `@media print` 블록에 포함할 규칙:

```css
@media print {
  @page {
    size: A4;
    margin: 16mm 14mm;
  }

  html {
    color-scheme: light !important; /* 다크모드와 무관하게 항상 라이트로 인쇄 */
  }

  * {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important; /* 뱃지 배경색(pink-600 등) 인쇄 시 보존 */
  }

  p,
  li {
    orphans: 3;
    widows: 3; /* 문단 첫/끝 줄이 홀로 페이지에 남는 것 방지 */
  }

  body {
    font-size: 13px; /* 원본 PDF와 비슷한 페이지 수를 위해 인쇄 시 축소 */
  }
}
```

- Header/Footer/ThemeSwitch/사이드바 등 사이트 UI 요소는 각 컴포넌트에 Tailwind의 `print:hidden` 클래스를 추가해 인쇄 시 숨김(추가 설정 없이 바로 사용 가능한 Tailwind 4 변형자).
- `/resume`, `/careers`, `/portfolio`, `/resume/full` 페이지 본문에 상기 `Section`/이미지 wrapper 규칙이 적용되어 있어야 함.

---

## 5. 콘텐츠 재작성 (PDF 원문 → MDX)

### 5-A. 이력서 → §3 (`data/resumeData.ts`)

§3.1에 이미 전문 수록됨.

### 5-B. 경력기술서 → `data/careers/codit.mdx`, `data/careers/ezllabs.mdx`

공통 서두(경력기술서 PDF 인트로, 참고용 — MDX에는 필요 시 페이지 상단 소개문으로 사용):

> 웹(PC·Mobile)·앱 환경에서 회원·인증·구독·결제 기능, 웹 성능 최적화, 실시간 스트리밍(SSE) 설계, 네이티브 앱 구축·배포를 담당해 왔습니다. 프로젝트별 본인 역할(ROLE) · 문제 → 개선 → 성과 순으로 정리했습니다. 총 경력 약 2년 (2024.06 ~ 현재)

#### `data/careers/codit.mdx`

Frontmatter 수정:

```yaml
---
company: CODIT
date: 2025-11
description: 국회 의안·법령·회의록·국회의원 데이터를 다루는 정책·입법 데이터 플랫폼 「Codit」과, 여기서 분리된 AI 챗봇 「ChatCODIT」의 웹·네이티브 앱을 담당했습니다. 대시보드 안정화부터 실시간 스트리밍·인앱결제·앱 배포까지 리드했습니다.
logo: /static/images/codit-logo.png
duration: 약 10개월
tags:
  - React
  - Next.js
  - TypeScript
  - TanStack Query
  - Zustand
  - embla-carousel
  - Tailwind CSS
  - i18next
  - next-intl
  - Expo
  - React Native
  - reCAPTCHA Enterprise
  - Firebase App Check
  - EAS
  - Bitbucket
  - Jira
  - Figma
  - Confluence
---
```

> `duration`은 경력기술서/포트폴리오 PDF 기준 "약 10개월"을 사용(이력서 PDF는 스냅샷 시점이 더 일러 "약 8개월"로 되어 있음 — §3의 이력서 하이라이트에는 이력서 PDF 원문 그대로 "약 8개월"을 유지하되, `careers` 항목은 더 최신 스냅샷인 포트폴리오/경력기술서 기준을 따름). 실제 구현 시점의 최신 재직 개월수로 갱신해도 무방.

본문 (8개 `<Section>`으로 구성, 경력기술서 PDF 01~08 그대로):

```mdx
<Section title="01. Codit 플랫폼 · 대시보드 (Web · 대표 성과)">

**기술** React · TanStack Query · Zustand · embla-carousel · TypeScript
**역할** 대시보드 프론트엔드 데이터 로딩 아키텍처·쿼리 계층·캐러셀 인터랙션 설계 및 구현

**대시보드 순차 로딩 아키텍처 설계**

- 문제: 진입 시 뉴스·의안·법령 등 전 섹션·전 슬라이드를 한 번에 요청해 초기 로딩이 느림
- 개선: 현재 슬라이드만 요청하고 인접(±1) 슬라이드는 백그라운드 prefetch하도록 재설계
- 성과: 초기 요청 데이터량 축소, 최초 진입 로딩 개선

**대시보드 쿼리 계층 단일화**

- 문제: 섹션마다 쿼리 훅이 산발적으로 흩어져 유지보수가 어려움
- 개선: useDashboard 단일 훅·단일 캐시 정책으로 통합, deviceType 자동 주입
- 성과: 신규 섹션 추가 비용 감소

**캐러셀 인터랙션 고도화**

- 문제: 한 번 스와이프에 여러 칸이 넘어가고 섹션 간 동작이 불일치
- 개선: useSwipeOneStep 등 커스텀 훅으로 1칸 이동·드래그 스냅·화살표 네비 구현
- 성과: 스와이프 정확도·인터랙션 일관성 확보

</Section>

<Section title="02. Codit 플랫폼 · 품질·구조 (Web)">

**기술** React · Tailwind CSS · i18next · TypeScript
**역할** AppShell 구조 도입·레거시 스타일 마이그레이션 담당

**AppShell 아키텍처 도입 & 레거시 마이그레이션**

- 문제: 라우트 전환마다 전역 폴백 노출, styled-components 레거시로 유지보수 부담
- 개선: AppShell 분리·Suspense L1/L3 계층화, Tailwind 순차 전환·공통 컴포넌트화
- 성과: 첫 진입 폴백 최소화, 유지보수성 향상

</Section>

<Section title="03. ChatCODIT · 실시간 스트리밍 (Web · 핵심)">

**기술** Next.js · fetch ReadableStream · SSE · Zustand · TypeScript
**역할** 스트리밍 응답 형식 설계(백엔드 협의)·프론트 파싱·렌더링·상태 구조 담당

**스트리밍 응답 형식(SSE 프로토콜) 직접 설계**

- 문제: 기존 구조에서는 백엔드가 하나의 거대한 JSON을 문자 단위로 쪼개 전송했고, 이를 받는 프론트 파서(약 1,281줄)가 불완전한 JSON을 수동 파싱(brace counting·escape)해야 했으며 파셜 JSON 파서가 4~5개 중복 존재
- 개선: "모든 SSE 이벤트는 그 자체로 유효한 JSON"이라는 원칙으로 블록 단위 + 텍스트 델타 프로토콜(meta·step·block_start·text_delta·block_end·block_data·done 7종)을 직접 설계해 백엔드에 요청
- 성과: 모든 data: 라인이 완전한 JSON → JSON.parse() 한 줄로 처리, 약 1,281줄에 달하던 수동 파셜 JSON 파서를 걷어내 파싱 로직 대폭 단순화

**스키마 리뷰·제안 & 렌더러 선정**

- 개선: citations의 위치 표기가 본문 문자 오프셋(range) 기반이어서 스트리밍 중 텍스트가 늘어나면 틀어질 위험을 발견해, 본문의 [^1] 마커 id로 매칭하는 방식을 대안으로 제안. 스트리밍 최적화 렌더러(streamdown) 채택
- 성과: 불완전 JSON 파싱 자체가 불필요해지고, 스트리밍 중에도 마크다운이 안정적으로 렌더링

**연결 안정성 & 채팅 상태 단일화**

- 개선: Promise.race 타임아웃으로 죽은 연결 감지·예외 방어, Zustand StreamingStore로 상태를 통합하고 이벤트 리듀서 패턴으로 불변 갱신
- 성과: 도착 순서 무관 일관성, 신규 답변 타입 확장 기반 확보

</Section>

<Section title="04. ChatCODIT · 대화형 문서 초안 작성(Draft) (Web)">

**기술** Next.js · SSE · Zustand · TypeScript
**역할** 멀티턴 문서 생성 플로우 설계·블록 모델 확장·에러 복원 로직·파일 첨부 파이프라인 구현 담당

**기존 스트리밍 아키텍처 위 멀티턴 문서 생성 확장**

- 문제: 템플릿 질문에 순차로 답하면 이를 종합해 법률 문서 초안을 생성하는 "질문→답변→문서" 멀티턴 흐름을, 기존 스트리밍 구조를 깨지 않고 얹어야 함
- 개선: 기존 SSE 스토어에 question·user_message·document 블록 타입만 추가해 기존 렌더링 경로 수정 없이 통합(확장 가능한 구조를 실제로 검증), 세션 판정 로직을 draftBlocks.utils로 단일 소스화
- 성과: 기존 아키텍처 재사용으로 신규 피처를 무중단 확장

**에러 복원력 있는 UX**

- 개선: SSE 에러를 StreamError로 타입화하고 API 에러 코드를 카탈로그화해 재시도가능/입력오류/치명 3갈래 분기. 중복 요청(409) 시 '생성 중' 표시를 유지한 채 Retry-After 대기→세션 폴링→같은 키로 replay하는 자기복구 구현
- 성과: 중복 요청·네트워크 오류에도 진행 상태를 잃지 않는 복원력 확보

**파일 첨부 파이프라인**

- 초안 질문에 파일을 multipart로 전송하고, 첨부 개수·용량(5MB) 제한과 초과 시 안내, '내 문서에서 업로드' 개수 제한 연동을 처리. 기존 파일은 재업로드하지 않고 existingFileIds로 전달하는 방식으로 설계.

</Section>

<Section title="05. ChatCODIT · 렌더링·구축·운영 (Web)">

**기술** Next.js · React · TypeScript · next-intl · Tailwind CSS
**역할** 반응형 웹 대응·0→1 웹 구축(React→Next.js 마이그레이션·회원·인증·SEO·다국어) 담당

**반응형 웹 — 다층 전략 설계**

- 문제: 단순 CSS 분기로는 모바일 바텀시트 vs 데스크톱 모달·문서 패널 같은 구조적 차이를 감당하기 어려움
- 개선: ① next/server userAgent로 SSR 시점 디바이스 확정(DeviceProvider·useDeviceType)해 hydration 깜빡임 방지 ② desktop/mobile 라우트 분리 + device rewrite ③ Tailwind @theme 커스텀 브레이크포인트 토큰화(1920~480px) ④ 컴포넌트 단위 반응형으로 답변 영역 콘텐츠를 화면 폭에 맞춰 동적 배치
- 성과: 감지→라우팅→토큰→컴포넌트 전 계층에서 일관된 반응형 확보

**0→1 신규 구축 & 배포 단순화**

- React → Next.js(App Router) 마이그레이션, 로그인 Guard(회원·인증)·next-intl 다국어·SEO 구축. Bitbucket Pipeline으로 테스트 서버 배포 과정을 자동화·단순화.

</Section>

<Section title="06. ChatCODIT App · 구축·결제 (iOS · Android)">

**기술** Expo · React Native · TypeScript · Zustand · TanStack Query · expo-iap
**역할** 웹→네이티브 마이그레이션·인앱결제(IAP)·구독 결제 신뢰성 설계 및 구현

- Expo Router·스트리밍 채팅·마크다운 이식으로 1.0.0 정식 출시. expo-iap 기반 BASIC/PRO 구독을 서버 검증까지 연동하고 결제 상태를 IAPProvider로 통합.

**결제 신뢰성 확보**

- 문제: 인앱결제 검증 과정에서 동일 거래가 중복으로 verify되는 이슈 발생
- 개선: 앱 실행 시 미완료 거래 sweep·재검증, 계정 UUID 바인딩·중복 구독 방지 가드 적용
- 성과: 중복 verify 해소

</Section>

<Section title="07. ChatCODIT App · 인증·보안·배포 (iOS · Android)">

**기술** Expo · React Native · reCAPTCHA Enterprise · Firebase App Check · EAS
**역할** 소셜 로그인·딥링크 처리·앱 보안·EAS 무중단 배포 담당

- 이메일·Apple·Google 소셜 로그인을 구현하고, 비밀번호 재설정·이메일 인증 링크를 딥링크로 처리해 앱 설치 시 앱으로, 미설치 시 모바일 웹으로 연결되도록 구현. reCAPTCHA Enterprise 봇 방어 + Firebase App Check로 클라이언트 무결성 검증을 적용.
- EAS Build 프로파일(dev/staging/production) 분리, EAS Update(OTA)·rollback 스크립트로 무중단 배포·빠른 복구 체계 구축. 출시 이후 발생하는 버그와 운영 이슈를 지속적으로 대응하고, i18n 수정처럼 급한 변경은 OTA로 즉시 반영.

</Section>

<Section title="08. 더코딧 앱 (WebView 하이브리드) (iOS · Android · WebView)">

**기술** React Native · Expo · expo-router · react-native-webview · EAS · Firebase App Distribution
**역할** WebView 네비게이션·브릿지 트러블슈팅·릴리즈/스토어 배포 담당

**원문링크 모달 2번 열림 — 브릿지 주입 타이밍 이슈 규명**

- 문제: 원문링크 클릭 시 모달이 두 번 열림. 근본 원인은 네이티브 판별 상수 isNativeMobile이 모듈 로드 시점에 1번만 평가되는데, 그 시점엔 injectedObjectJson이 아직 늦게 주입돼 값이 false로 캐싱된 것
- 개선: "ReactNativeWebView 객체의 존재 자체가 앱 웹뷰 환경"이라는 판단으로 판별 기준을 Boolean(window.ReactNativeWebView)로 변경해 주입 타이밍 의존을 제거
- 성과: 중복 오픈 제거, iOS·Android 동작 일관성 확보

**배포 자동화 & 릴리즈 오너십**

- EAS staging 빌드와 Firebase App Distribution 배포 스크립트로 QA/내부 배포 파이프라인을 간소화하고, 여러 마이너 버전의 릴리즈와 스토어 배포 전 과정(브랜치 병합·실서버 반영)을 주도.

</Section>
```

#### `data/careers/ezllabs.mdx`

Frontmatter는 기존 값 유지(이미 정확함: `company: 이즐랩스`, `date: 2024-06`, `endDate: 2025-10`, `duration: 1년 4개월`) — `tags`만 아래로 갱신:

```yaml
tags:
  - React Native
  - TypeScript
  - React Query
  - Recoil
  - Kotlin
  - Swift
  - Storybook
  - Genkit
```

본문 (경력기술서 PDF 01~02 그대로):

```mdx
<Section title="01. 이즐충전소 (React Native · 앱)">

**기술** React Native · TypeScript · React Query · Recoil · Kotlin · Swift
**역할** 조회 API 성능 개선·앱 안정성(Sentry)·충전/환불 결제 흐름 담당

**이즐워크 조회·포인트 전환 API 개선**

- 문제: 버튼 클릭마다 조회 API가 중복 호출되어 리소스·UX 저하
- 개선: useMutation→useQuery 전환·캐싱, 연속 클릭 방지 처리
- 성과: API 호출 75% 감소

**Sentry 활용 앱 안정성 대응**

- 개선: Sentry로 수집되는 런타임 에러를 확인해 원인 파악·수정
- 성과: Crash Free Rate 약 3%p 향상

**충전·환불 재시도 플로우 구현**

- 문제: 충전·환불 미완료 거래로 CS 문의가 발생
- 개선: 재시도 플로우와 연속 클릭 방지 로직 추가
- 성과: 중복 결제 차단, CS 인입 감소

</Section>

<Section title="02. 백오피스 · 디자인 시스템 · 내부 AI (React · React Native)">

**기술** React · TypeScript · React Query · Recoil · Storybook · Genkit
**역할** 백오피스 운영 기능·공통 디자인 시스템·사내 검색 AI 개발 담당

**백오피스 — 에러 처리 구조 개선**

- 관리자 운영 필수 기능을 구현하고, react-error-boundary 적용으로 에러 처리 패턴을 표준화(가독성·유지보수성·일관성 향상).

**디자인 시스템 — Storybook 개발 환경 개선**

- 공통 UI 컴포넌트를 구현하고, props 확인 시 코드 수정이 필요하던 것을 Storybook Controls 적용으로 코드 수정 없이 UI를 즉시 확인하도록 개선해 개발 시간을 단축.

**Jira/Confluence 검색 AI**

- 자연어 질의로 Jira·Confluence 데이터를 검색해 원하는 정보를 즉시 확인하는 내부 도구를 구현(Genkit·프롬프트 설계).

</Section>
```

### 5-C. 포트폴리오 → `data/projects/*.mdx`

포트폴리오 PDF는 코딧에서 **4개** 프로젝트 카드(Codit 플랫폼, ChatCODIT·실시간 스트리밍, ChatCODIT App, 더코딧 앱)를 다룬다. 현재 `data/projects/`에는 `codit-codit.mdx`, `codit-chatcodit.mdx` 2개뿐이므로 아래처럼 **2개 신규 추가**가 필요하다. 이즐랩스 쪽은 기존 3개 파일(`ezl-charge`, `ezl-backoffice`, `ezl-design-system`, `ezl-ai` — 4개, PDF는 "백오피스·디자인시스템·검색AI"를 하나의 카드로 묶지만 현재 파일 구조는 세분화되어 있음, 그대로 유지해도 무방)을 내용만 갱신.

공통 frontmatter 스키마 (변경 없음, 재확인):

```yaml
order: number       # 노출 순서
name: string
date: "YYYY-MM"      # 문자열
endDate: "YYYY-MM"?  # 선택
tags: string[]
images: string[]     # public/static/images/ 경로
imageSize: [number, number]
```

> **이미지 에셋 안내**: 포트폴리오 PDF에는 앱 스크린샷·대시보드 캡처가 다수 포함되어 있으나(이즐충전소 3장, Codit 대시보드 2장, ChatCODIT 웹 2장, ChatCODIT App 3장, 더코딧 앱 2장, 백오피스/디자인시스템 3장), 이 스펙 문서는 텍스트만 옮겼습니다. 구현 세션에서 원본 PDF(`신정은_포트폴리오_2026.pdf`)를 열어 해당 페이지의 스크린샷을 이미지로 추출해 `public/static/images/`에 저장하고 `images`/`imageSize`에 채워 넣어야 합니다. (페이지 참고: 이즐충전소 p.6, 백오피스/디자인시스템 p.9, Codit 대시보드 p.11, ChatCODIT 웹 p.14, ChatCODIT App p.20, 더코딧 앱 p.23)

각 mdx 본문은 `<Section>` 없이도 되지만(이미 카드 단위로 페이지가 나뉨), **문제(PROBLEM)/접근(APPROACH)/결과(RESULT)** 소제목 구조와 강조된 수치(스탯 박스)를 유지한다. 이미지는 `<div className="break-inside-avoid-page">` 등으로 감싸는 것을 본문에서 직접 명시하기보다, `app/portfolio/page.tsx`의 이미지 렌더링 wrapper에 해당 클래스를 적용하는 방식으로 처리(§4.1 참고).

#### `data/projects/ezl-charge.mdx` (이즐충전소)

```yaml
order: 1
name: 이즐충전소
date: '2024-07'
endDate: '2025-10'
tags: [React Native, TypeScript, React Query, Recoil, Kotlin, Swift]
images: [] # 추출 필요, imageSize 함께
```

본문:

```mdx
MAU 30만 규모의 교통카드 충전·조회 서비스. 모바일 환경에서 안정적이고 직관적인 충전 경험을 제공하고, i18n으로 다국어를 지원했습니다.

### 이즐충전소 · 조회 API 성능 개선 (대표 성과)

**PROBLEM**
이즐워크(걸음 적립)의 일일·연속 미션 조회와 포인트 전환 API가 버튼을 누를 때마다 매번 호출되는 구조였습니다. 사용자가 화면을 오가거나 버튼을 반복 탭할 때 동일한 조회 요청이 중복으로 발생해 불필요한 네트워크 비용과 응답 지연이 생겼습니다.

**APPROACH**

- 매 호출마다 서버를 때리던 useMutation 기반 조회를 useQuery로 전환, 조회 결과를 캐시에 두고 재사용하도록 재설계
- 동일 데이터에 대한 중복 요청을 캐싱으로 흡수하고, 갱신이 필요한 시점에만 무효화(invalidate)
- 버튼 연속 클릭 방지 처리로 순간적인 중복 트리거 차단

**RESULT**
동일 화면·동일 데이터에 대한 중복 조회 요청이 사라지면서 **API 호출이 75% 감소**했고, 조회·전환 흐름의 응답 체감이 개선됐습니다. 이후 다른 조회성 화면에도 같은 캐싱 패턴을 적용하는 기준이 됐습니다.

### 이즐충전소 · 안정성 & 결제 흐름

**Sentry 활용 앱 안정성 대응**
운영 중 발생하는 런타임 에러를 Sentry로 확인해 원인을 파악하고 수정하는 방식으로 앱 안정성 이슈에 대응했습니다. → **Crash Free Rate +3%p**

**충전·환불 재시도 플로우 구현**
충전·환불 거래가 중간에 미완료로 남으면 사용자가 상태를 알기 어렵고 CS 문의로 이어졌습니다. 미완료 거래에 대한 재시도 플로우를 구현해 사용자가 직접 이어서 처리하도록 유도하고, 결제 버튼 연속 클릭 방지로 중복 결제 자체를 차단했습니다. → **중복 결제 차단, CS 인입 감소**
```

#### `data/projects/ezl-backoffice.mdx`, `ezl-design-system.mdx`, `ezl-ai.mdx`

PDF는 이 셋을 "백오피스·디자인 시스템·검색 AI" 한 카드로 묶지만(p.9), 기존 파일 구조(3분할)를 유지해도 무방. 각 파일 본문에 아래 해당 부분만 반영:

- `ezl-backoffice.mdx`: "관리자 운영 기능(카드 관리·다운로드 내역·비밀번호 초기화 등)을 구현하고, 컴포넌트마다 제각각이던 에러 처리를 react-error-boundary로 표준화해 가독성·유지보수성을 높였습니다."
- `ezl-design-system.mdx`: "카드·드롭다운 등 공통 UI 컴포넌트를 구현하고, props 확인 시 코드를 수정해야 하던 것을 Storybook Controls로 코드 수정 없이 확인하도록 개선해 개발 시간을 단축했습니다."
- `ezl-ai.mdx`: "자연어 질의로 사내 Jira·Confluence 데이터를 검색하는 내부 도구를 구현했습니다. 요청에 맞는 tool 선택·답변 형식을 제어하도록 프롬프트를 설계해 운영 정보를 빠르게 찾도록 했습니다." (frontmatter `tags: [TypeScript, Genkit]` 유지)

#### `data/projects/codit-codit.mdx` (Codit 플랫폼 · 대시보드+품질구조)

```yaml
order: 5
name: Codit 플랫폼 · 대시보드
date: '2025-11'
tags: [React, TanStack Query, Zustand, embla-carousel, TypeScript]
```

본문:

```mdx
국회 의안·법령·회의록 등 10여 개 섹션이 캐러셀로 구성된 정책·입법 데이터 대시보드. 초기 로딩 성능과 인터랙션 품질을 끌어올렸습니다.

### 대시보드 · 순차 로딩 아키텍처 설계 (대표 성과)

**PROBLEM**
대시보드 최초 진입 시 뉴스·의안·법령 등 전 섹션과 각 섹션의 전 슬라이드를 한 번에 요청하는 구조였습니다. 사용자가 실제로 보는 건 첫 화면인데도 보이지 않는 데이터까지 모두 로드하느라 초기 로딩이 느렸습니다.

**APPROACH**

- 진입 시 현재 보이는 슬라이드만 요청하도록 데이터 로딩 단위를 슬라이드로 축소
- 다음 탐색을 대비해 인접(±1) 슬라이드는 백그라운드에서 prefetch, 스와이프 시 즉시 표시
- 섹션별 스켈레톤 UI·에러 바운더리를 추상화해 부분 로딩과 안정적 에러 처리 적용

**RESULT**
필요한 데이터만 순차적으로 불러오면서 초기 요청량이 줄고 진입 로딩이 개선됐습니다(**진입 로딩↓**). 캐러셀 인터랙션도 useSwipeOneStep 등 커스텀 훅으로 1칸 이동·드래그 스냅을 구현해 동작 일관성을 확보했습니다. 쿼리 계층을 useDashboard 단일 훅으로 통합해 신규 섹션 추가 비용도 감소했습니다.

### Codit 플랫폼 · 품질·구조

렌더링 품질과 유지보수성을 높이기 위해 앱 구조와 레거시 스타일링을 정리했습니다.

- **AppShell 아키텍처 도입** — 문제: 라우트 전환마다 전역 폴백 노출 / 개선: AppShell 분리·Suspense L1/L3 계층화 / 성과: 첫 진입 폴백 최소화
- **레거시 스타일 마이그레이션** — 문제: styled-components 레거시 유지보수 부담 / 개선: Tailwind v4 순차 전환·공통 컴포넌트화 / 성과: 유지보수성 향상
```

#### `data/projects/codit-chatcodit.mdx` (ChatCODIT · 실시간 스트리밍 + 대화형 문서 + 렌더링/구축/운영)

```yaml
order: 6
name: ChatCODIT · 실시간 스트리밍
date: '2025-11'
tags: [Next.js, fetch ReadableStream, SSE, Zustand, TypeScript]
```

본문:

```mdx
정책·규제 리서치를 위한 AI 챗봇. LLM 답변은 생성에 수십 초가 걸리기 때문에, 답변을 실시간으로 흘려보내는 스트리밍 경험이 서비스의 핵심입니다.

### 실시간 스트리밍 프로토콜 설계 (핵심)

**PROBLEM**
기존 구조에서는 백엔드가 하나의 거대한 JSON을 문자 단위로 쪼개 청크로 전송했습니다. 이를 받는 프론트 파서(useChatStreamingParser.ts, 약 1,281줄)는 불완전한 JSON 문자열을 수동으로 파싱(brace counting·escape 처리·부분 문자열 추출)해야 했고, parsePartialJson·parseStreamingTextArray 등 수동 파서가 4~5개 중복 존재했으며, 순서 보장을 위해 \_\_seq 메타데이터를 수동 부여·정렬하는 로직까지 필요했습니다.

**APPROACH — 새 SSE 프로토콜 설계**
핵심 원칙: 모든 SSE 이벤트는 그 자체로 유효한 JSON이어야 한다. 하나의 JSON을 쪼개 보내는 대신, 블록 단위 + 텍스트 델타 방식을 직접 설계해 백엔드에 요청했습니다.

- 텍스트는 text_delta로 스트리밍, 구조화 데이터(news·references)는 block_data로 일괄 전송
- 모든 data: 라인이 완전한 JSON → JSON.parse() 한 줄로 파싱, 수동 파셜 파서가 불필요
- citations·entity_links 등 메타데이터는 block_end에서 텍스트 완성 후 일괄 전달

**RESULT**
약 1,281줄에 달하던 수동 파서를 걷어내고 **파싱 로직을 대폭 단순화**했습니다. 텍스트는 자연스럽게 흐르고, 구조화 데이터는 완전한 JSON으로 일괄 전달되며, citations·entity_links 같은 메타데이터는 텍스트 완성 후 전달되는 구조를 확보했습니다.

**이벤트 타입 설계 (7종)**: `meta`(응답 메타정보) · `step`(로딩 단계) · `block_start`(블록 시작 선언) · `text_delta`(md 블록 텍스트 스트리밍 청크) · `block_end`(블록 종료+citations·entity_links) · `block_data`(구조화 데이터 일괄 전송) · `done`(전체 완료)

**스키마 리뷰·제안**: 백엔드 초안은 인용 위치를 "본문 텍스트의 몇 번째 글자~몇 번째 글자"(문자 오프셋, range)로 표현했으나, 스트리밍 중 텍스트가 늘어나며 위치가 계속 바뀌어 인용이 엉뚱한 곳에 붙을 위험이 있었습니다. 본문에 이미 들어있는 `[^1]` 같은 각주 마커의 id로 인용을 연결하는 방식을 제안해, 위치가 흔들려도 정확히 매칭되도록 했습니다. 스트리밍에 최적화된 streamdown을 채택해 청크가 이어 붙는 동안에도 마크다운이 안정적으로 렌더링되도록 했습니다.

### ChatCODIT · 대화형 문서 초안 작성 (신규 피처)

**PROBLEM**
단발성 Q&A를 넘어, 사용자가 템플릿 질문에 순차로 답하면 그 입력을 종합해 법률 문서 초안을 생성하는 멀티턴 대화형 문서 작성 기능이 필요했습니다. "질문 박스 → 사용자 답변 → 문서 초안"이라는 새 흐름을, 기존 스트리밍 구조를 깨지 않고 얹어야 했습니다.

**APPROACH**

- 블록 모델 확장으로 무중단 확장 — 기존 SSE 스토어에 question·user_message·document 블록 타입만 추가해, 기존 답변 렌더링 경로 수정 없이 통합
- 세션 판정 로직 단일화 — 초안 세션 여부·질문 해소·대기 상태 판정을 draftBlocks.utils로 응집
- 파일 첨부 파이프라인 — multipart 전송, 첨부 개수·용량(5MB) 제한과 초과 시 안내

**RESULT**
기존 스트리밍 아키텍처를 재사용해 멀티턴 대화형 문서 생성 기능을 무중단으로 확장, 신규 피처로 배포했습니다. SSE 에러를 StreamError로 타입화(재시도/입력오류/치명 3갈래), 409 "처리 중" 응답 시 Retry-After 대기→세션 폴링→replay 자기복구로 **에러 복원력 있는 UX**를 확보했습니다.

### ChatCODIT · 렌더링·구축·운영

반응형 웹 대응, 0→1 신규 구축, 다국어·SEO, 테스트 서버 배포 단순화까지 웹 서비스의 기반과 운영 품질을 담당했습니다.

**반응형 웹 · 다층 전략 (SSR · Route · Token)**: 반응형을 "미디어 쿼리 몇 개"가 아니라 감지→라우팅→토큰→컴포넌트의 다층 전략으로 설계.

- ① SSR 디바이스 감지 — next/server의 userAgent로 디바이스 판별(getDeviceType), DeviceProvider(Context)로 전역 주입·useDeviceType() 훅으로 소비. SSR 시점에 디바이스를 확정해 hydration 레이아웃 깜빡임 방지
- ② 데스크톱/모바일 라우트 분리 — app/[locale]/desktop과 mobile로 라우트 트리 분리 + device rewrite. 바텀시트 vs 모달, 문서 패널처럼 CSS 분기로 감당 안 되는 구조적 차이를 라우트 레벨에서 분리
- ③ 커스텀 브레이크포인트 토큰 — Tailwind @theme에 서비스 기준(xs480/sm768/md1024/lg1280/xl1920/2xl2560 + laptop1156) 토큰화
- ④ 컴포넌트 단위 반응형 — 답변 영역 콘텐츠를 화면 폭에 맞춰 동적 배치

**0→1 신규 구축**: React → Next.js(App Router) 마이그레이션, 로그인 Guard(회원·인증)·next-intl 다국어·SEO 대응. Bitbucket Pipeline으로 테스트 서버 배포 과정을 자동화·단순화.
```

#### `data/projects/codit-chatcodit-app.mdx` (신규)

```yaml
order: 7
name: ChatCODIT App
date: '2025-11'
tags: [Expo, React Native, TypeScript, expo-iap, reCAPTCHA, EAS]
```

본문:

```mdx
웹 챗봇을 iOS·Android 네이티브 앱으로 신규 구축. 스트리밍 채팅·마크다운·인앱결제부터 소셜 로그인·앱 보안·무중단 배포까지 서비스에 필요한 프론트엔드 인프라를 완성했습니다.

### ChatCODIT App · 구축 & 결제 신뢰성

**웹 → 네이티브 마이그레이션 & IAP 구축**: Expo Router 아키텍처와 스트리밍 채팅·마크다운을 이식해 1.0.0 정식 출시 기반을 마련하고, expo-iap 기반 BASIC/PRO 구독을 서버 검증까지 연동해 결제 상태를 IAPProvider로 통합했습니다.

**PROBLEM** 인앱결제 과정에서 동일 결제가 중복으로 verify(검증)되는 이슈가 있었습니다.

**APPROACH & RESULT**

- 앱 실행 시 미완료 거래를 sweep·재검증해 누락된 결제 처리
- 결제를 계정 UUID에 바인딩하고 중복 구독 방지 가드 적용
  → **결제 검증 안정화, 중복 verify 이슈 해소, iOS·Android 1.0.0 출시**

### ChatCODIT App · 인증·보안·배포

네이티브 앱의 로그인·보안·배포 인프라를 구축해 보안 리스크를 줄이고 무중단 배포 체계를 갖췄습니다.

- **소셜 로그인·딥링크 처리** — 이메일·Apple·Google 소셜 로그인, 비밀번호 재설정·이메일 인증 링크를 딥링크로 처리(앱 설치 시 앱·미설치 시 모바일 웹 연결)
- **앱 보안 강화** — reCAPTCHA 봇 방어 + Firebase App Check로 클라이언트 무결성 검증
- **배포 인프라·OTA** — EAS Build 환경 분리 + EAS Update·rollback으로 무중단 배포·빠른 복구
```

#### `data/projects/codit-thecodit-app.mdx` (신규, 더코딧 앱)

```yaml
order: 8
name: 더코딧 앱 (WebView 하이브리드)
date: '2025-11'
tags: [React Native, Expo SDK, expo-router, react-native-webview, EAS]
```

본문:

```mdx
코딧 웹 서비스를 WebView로 래핑한 하이브리드 앱. 네이티브 셸과 웹 콘텐츠 간 브릿지(postMessage) 통신·모달 웹뷰 네비게이션이 핵심입니다.

### 더코딧 앱 트러블슈팅

**PROBLEM** 대시보드 → 법령 상세 → 원문링크를 클릭하면, 네이티브 모달이 두 번 열리는 문제가 있었습니다.

**근본 원인**
앱 웹뷰 환경인지 판별하는 isNativeMobile 상수가 원인이었습니다. 기존 판별 기준은 injectedObjectJson() 함수가 주입해 준 값(coditWebView 플래그)을 파싱하는 방식이었는데, 이 상수는 모듈 로드 시점에 딱 1번만 평가됩니다. 그런데 그 시점엔 ReactNativeWebView 객체는 있어도 injectedObjectJson 함수가 아직 늦게 주입돼, 값이 false로 굳어버렸습니다. 이후 링크 클릭 시 ①네이티브가 모달 열기 + ②!isNativeMobile 조건이 참이 되어 window.open()까지 둘 다 실행된 것입니다.

**해결**
"ReactNativeWebView 객체가 존재한다는 것 자체가 지금 이 웹페이지가 앱의 WebView 안에서 실행되고 있다는 의미"라고 판단해, 판별 기준을 함수 주입 여부에 의존하지 않도록 `Boolean(window.ReactNativeWebView)`로 변경했습니다. 이로써 주입 타이밍과 무관하게 항상 올바르게 판별됩니다. → **중복 오픈 제거, iOS·Android 동작 일관성 확보**

**핵심 역량**: iOS·Android WebView 동작 차이와 브릿지 주입 타이밍까지 파고들어 근본 원인을 규명했고, EAS + Firebase App Distribution 스테이징 배포 스크립트로 QA 배포를 간소화하며 릴리즈·스토어 배포 전 과정을 주도했습니다.
```

---

## 6. 체크리스트

- [ ] `app/projects/` 삭제, `data/projectsData.ts` 미사용 확인 후 삭제
- [ ] `data/headerNavLinks.ts`에 Resume 링크 추가
- [ ] `data/resumeData.ts` 신규 작성 (§3.1)
- [ ] `app/resume/page.tsx` 신규 작성 (§3.2)
- [ ] `app/resume/full/page.tsx` 신규 작성 (§3.3)
- [ ] `components/mdx/Section.tsx` 신규 작성, `components/MDXComponents.tsx`에 등록 (§4.1)
- [ ] `css/print.css` 신규 작성 및 import (§4.2)
- [ ] Header/Footer 등 사이트 chrome 컴포넌트에 `print:hidden` 클래스 추가
- [ ] `data/careers/codit.mdx` 전면 교체 (§5-B)
- [ ] `data/careers/ezllabs.mdx` tags·본문 갱신 (§5-B)
- [ ] `data/projects/ezl-charge.mdx`, `ezl-backoffice.mdx`, `ezl-design-system.mdx`, `ezl-ai.mdx` 내용 갱신 (§5-C)
- [ ] `data/projects/codit-codit.mdx`, `codit-chatcodit.mdx` 내용 갱신 (§5-C)
- [ ] `data/projects/codit-chatcodit-app.mdx`, `codit-thecodit-app.mdx` 신규 작성 (§5-C)
- [ ] 포트폴리오 PDF에서 스크린샷 이미지 추출 → `public/static/images/`에 저장, 각 project mdx의 `images`/`imageSize` 채움
- [ ] `npm run dev` 로컬 확인: `/resume`, `/resume/full`, `/careers`, `/portfolio` 콘텐츠·다크모드 정상 확인
- [ ] 각 페이지 Ctrl+P 인쇄 미리보기 확인: 헤더/푸터 숨김, 섹션 안 잘림, 뱃지 배경색 유지
- [ ] `EXPORT=1 UNOPTIMIZED=1 next build` 정적 export 빌드 성공 확인
