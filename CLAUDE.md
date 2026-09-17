# CLAUDE.md

# CLAUDE.md

## 이 저장소

신정은 개인 사이트(Next.js App Router). /resume, /careers, /portfolio 3개
문서를 서비스한다. 세 문서는 같은 사실을 다른 압축률로 보여주는 뷰이며,
사실의 원천은 항상 `content/` 다.

## 절대 규칙

1. **`app/**`에 사실을 하드코딩하지 않는다.**
기간·수치·역할·기술 스택 문자열이 페이지 컴포넌트에 나타나면
그건 버그다. 전부`content/` 에서 import 한다.

2. **없는 사실을 만들지 않는다.**
   전달받은 입력 블록에 없는 수치·행위·성과는 절대 생성하지 않는다.
   빈칸이 필요하면 `'TBD'` 로 두고 작업 종료 시 목록으로 보고한다.

3. **금지 표현** (verify-content.ts 와 동기화 유지)
   - 버전 표기: `v4`, `18` 등
   - 갱신 필요 표기: `약 N개월`, `총 경력 약 N년`
   - `네이티브 앱` → `iOS·Android 앱`
   - `진단`, `사이클을 만들었다`, `풀스택`
   - 근거 없는 형용사, 과한 대구, 추상 명사 나열

4. **개월 수는 저장하지 않는다.** 화면에 필요하면
   `formatTenure(company)` 로 렌더 시점에 계산한다.

## 문서별 역할 (내용 중복 금지)

| 경로       | 역할           | 분량              | 렌더할 narrative 단계                 |
| ---------- | -------------- | ----------------- | ------------------------------------- |
| /resume    | 숫자 중심 압축 | 인쇄 시 A4 1장    | problem·decision.chosen·result 각 1줄 |
| /careers   | 경력기술서     | 회사당 제한 없음  | 7단 전체 요약                         |
| /portfolio | 판단 근거 서술 | flagship 1개 집중 | 7단 풀 전개 + decision.rejected       |

- `profile.summary`(resume)와 `profile.about`(portfolio)는 문장이 겹치면 안 된다.
  겹치면 verify 가 실패한다.
- /careers 는 모든 회사를 렌더한다. 회사 하나가 빠지면 안 된다.
- /portfolio 의 `depth:'supporting'` 프로젝트는 카드 1개 분량을 넘기지 않는다.
- `parentId` 가 있는 하위 프로젝트는 상위 안에서 렌더한다. /portfolio 는 카드로 세지 않고,
  /careers 는 회사 MDX 에 `<ProjectNarrative>` 로 상위 섹션 뒤에 자리를 잡고,
  /resume 은 상위 제품 그룹(`content/experience.ts`)의 하이라이트로 넣는다.

## 내가 콘텐츠를 전달하는 방식

Claude 챗에서 정리한 내용을 아래 블록 형태로 붙여넣는다.
이 블록을 받으면 `content/projects/{id}.ts` 를 생성/수정하고,
세 페이지 중 영향받는 곳을 함께 갱신한 뒤 `pnpm verify` 를 돌린다.
(블록 스펙은 `docs/handoff-format.md` 참조)

## 입력 블록을 받았을 때의 절차

1. `content/companies.ts`·`content/metrics.ts` 와 대조해 **불일치를 먼저 보고**한다.
   불일치가 있으면 코드를 고치기 전에 질문한다.
2. 새 수치가 있으면 `metrics.ts` 에 `evidence` 와 함께 먼저 등록한다.
   evidence 가 입력 블록에 없으면 등록하지 말고 물어본다.
3. `content/projects/{id}.ts` 작성. 스키마 필드를 임의로 비우지 않는다.
4. 영향받는 페이지 컴포넌트 갱신. 렌더 로직만 수정하고 문구는 건드리지 않는다.
5. `pnpm verify && pnpm build` 실행.
6. 보고: ①변경 파일 ②TBD 목록 ③세 문서 중 추가 동기화가 필요한 지점.

## 하지 말 것

- 스키마 필드를 임의로 추가/삭제 (먼저 제안하고 승인받는다)
- 문구를 "더 좋게" 다듬기 — 문구 수정은 챗에서 확정해서 전달한다
- verify 실패를 우회하기 위해 규칙을 완화

## 명령어

pnpm dev / pnpm verify / pnpm build

### 인쇄(PDF) 아키텍처 — 이 저장소의 핵심 제약

GitHub Pages 정적 export라 서버 PDF 생성이 불가능하다. **브라우저 네이티브 인쇄(Ctrl+P → PDF로 저장)** 만으로 제출 가능한 품질이 나와야 한다. `window.print()` 버튼은 의도적으로 만들지 않는다(브라우저 기본 기능과 중복).

문서형 페이지에 손을 댈 때 지켜야 할 규칙:

1. **페이지 경계에서 잘리지 않게 감싼다.** 새 블록은 `break-inside-avoid-page`, 제목은 `break-after-avoid-page`. MDX 안에서는 `<Section>`으로 감싸면 둘 다 적용된다. 이미지는 `break-inside-avoid-page` div로 감싼다.
2. **사이트 UI는 `print:hidden`.** Header/Footer/ScrollTop 등은 이미 적용되어 있다. 새로 추가하는 네비게이션·버튼류도 마찬가지로 숨긴다.
3. **다크모드는 인쇄에서 완전히 무력화된다.** `css/tailwind.css`가 `@custom-variant dark`를 `@media not print`로 재정의해 `dark:` 유틸리티 자체가 인쇄 시 적용되지 않게 한다. `css/print.css`의 색상 강제만으로는 부족했기 때문이다 — 이 커스텀 variant를 지우면 다크모드로 보다가 인쇄할 때 본문이 읽히지 않는다.
4. **배경색 보존.** `css/print.css`가 `print-color-adjust: exact`를 전역으로 걸어 라벨 칩·`StatCard`의 배경이 인쇄에 남는다.
5. `Projects` 이미지의 `imageSize[0]`(표시 폭)은 **A4 인쇄 폭(약 640px 콘텐츠 폭) 안에서 한 프로젝트의 이미지가 gap 포함 한 줄에 들어가도록** 정한다(2장이면 300 등). 높이는 `h-auto`라 원본 비율을 따른다.

변경 후에는 각 문서 페이지에서 인쇄 미리보기를 실제로 확인한다.
