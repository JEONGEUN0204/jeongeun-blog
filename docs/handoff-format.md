# 핸드오프 블록 포맷

Claude 챗에서 내용을 확정한 뒤 이 형태로 Claude Code 에 붙여넣는다.
챗에 넣을 지침은 `docs/chat-instructions.md`, 받는 쪽 절차는 `CLAUDE.md` 를 따른다.

이 포맷의 목적은 하나다. **대안 검토가 비면 코드까지 가지 못하게 막는 것.**
`depth: flagship` 인데 `DECISION.rejected` 가 비면 `npm run verify` 가 실패하므로,
챗에서 그 칸을 채우지 않으면 포트폴리오에 올라가지 않는다.

## 한 작업이 놓이는 두 파일

| 파일                       | 담는 것                                      | 블록의 어느 부분                  |
| -------------------------- | -------------------------------------------- | --------------------------------- |
| `content/projects/{id}.ts` | **사실** — 회사·제품·역할·스택·지표·7단 서술 | `company` ~ `LEARNING`, `METRICS` |
| `data/projects/{id}.mdx`   | **표현** — 한 줄 요약·스크린샷·본문          | `summary`, `platform`, `images`   |

파일명(`{id}`)이 둘을 잇는 유일한 키다. 한쪽만 있으면 verify 가 실패한다.

작업이 놓인 **제품**도 같은 모양으로 두 파일을 갖는다 — `content/products.ts` 의 한 항목과
`data/products/{제품 id}.mdx` 다. /portfolio 의 카드 한 장이 곧 제품 하나이고,
카드의 요약·대표 스크린샷은 제품 MDX 에서 온다.

---

## 작업 블록

```
### PROJECT: codit-chatcodit-streaming
company: codit
product: codit-chatcodit
name: 실시간 스트리밍
depth: flagship
kind: improvement
role: 설계·구현 리드
roleDetail: SSE 프로토콜 초안 설계, 백엔드 협의, 프론트 파서 전면 교체
contribution: 프로토콜 설계 100%, 프론트 구현 100%, 백엔드 스키마 합의 주도
summary: 정책·규제 리서치를 위한 AI 챗봇의 실시간 응답 방식을 다시 설계했습니다.

stack.primary: Next.js, TypeScript, Zustand
stack.secondary: SSE, fetch ReadableStream

PROBLEM: ...
INSIGHT: ...
DECISION.chosen: 블록 단위 + text_delta SSE
DECISION.rejected:
  - WebSocket → 이유: ...
  - 기존 파서 보강 → 이유: ...
DECISION.constraint: 백엔드 변경 필요, 스프린트 1회 내
ACTION:
  - ...
BEFORE: 수동 파서 1,281줄 / 파셜 JSON 파서 4~5개 중복
AFTER: JSON.parse() 한 줄
RESULT: ...
LEARNING: ...

METRICS:
  - id: sse-parser-lines | value: 1,281줄 제거 | kind: tech
    evidence: useChatStreamingParser.ts 삭제 diff
    businessImpact: TBD

ASK:
  - 백엔드가 SSE 전환에 든 공수는?
```

### 필드가 코드로 가는 곳

| 블록                   | `Project` 필드                      | 규칙                                                                     |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| `PROJECT:`             | `id`                                | `data/projects/{id}.mdx` 와 같은 이름이어야 한다                         |
| `company`              | `companyId`                         | `codit` \| `ezllabs`. 없는 id 면 회사부터 등록하고 물어본다              |
| `product`              | `productId`                         | **필수.** `content/products.ts` 에 없는 id 면 제품부터 등록하고 물어본다 |
| `name`                 | `name`                              | 작업 이름만. 제품 이름으로 시작하면 verify 실패                          |
| `depth`                | `depth`                             | `flagship` \| `supporting`. 제품마다 flagship 최대 1개 (초과면 실패)     |
| `kind`                 | `kind`                              | `improvement` \| `build` \| `operation`                                  |
| `role`                 | `role`                              | `단독 담당` \| `설계·구현 리드` \| `기능 담당` \| `일부 참여` \| `TBD`   |
| `roleDetail`           | `roleDetail`                        | 비어 있으면 verify 실패                                                  |
| `contribution`         | `contribution`                      | 문자열 또는 `TBD`                                                        |
| `summary`              | —                                   | `data/projects/{id}.mdx` 의 `summary` 로 간다. 없으면 줄을 지운다        |
| `stack.*`              | `stack.primary` / `stack.secondary` | 버전 표기 금지. primary 가 비면 verify 실패                              |
| `PROBLEM` ~ `LEARNING` | `narrative`                         | 7단이 다 오지 않으면 `narrative` 자체를 만들지 않는다                    |
| `METRICS`              | `metricIds` + `content/metrics.ts`  | 지표는 `metrics.ts` 에 먼저 등록하고 id 만 참조한다                      |
| `ASK`                  | —                                   | 코드로 옮기지 않는다. 작업 종료 시 질문 목록으로 되돌려준다              |

### 제품 (`product`)

`product: codit-platform` 처럼 제품 id 를 주면 `Project.productId` 가 된다. 모든 작업에 필요하고,
제품에 작업이 하나뿐이어도 생략하지 않는다. 같은 회사의 제품만 가리킬 수 있고,
한 제품의 flagship 작업은 최대 하나다 (verify 가 검사).

작업 이름(`name`)에는 제품 이름을 붙이지 않는다. 제품 이름은 아래 세 자리가 각각 적는다.

| 경로         | 제품이 적히는 자리                                   | 작업이 적히는 자리                                                    |
| ------------ | ---------------------------------------------------- | --------------------------------------------------------------------- |
| `/resume`    | 그룹 소제목 — `content/experience.ts` 의 `productId` | 그룹 안의 하이라이트                                                  |
| `/careers`   | `<ProductGroup id="..." />` 구분선                   | `<ProjectNarrative id="..." no="NN" />` 자리. 제목에는 `name` 만 쓴다 |
| `/portfolio` | 카드 제목과 상세 헤더                                | 상세 본문의 섹션. 작업이 하나뿐인 제품은 섹션 없이 개요에 바로 실린다 |

### 제품 블록

기존 제품에 작업을 얹을 때는 내지 않는다. 작업 블록의 `product:` 로만 가리킨다.
**새 제품일 때만** 작업 블록과 함께 온다.

```
### PRODUCT: codit-chatcodit-app
company: codit
name: ChatCODIT App
platform: iOS · Android
summary: React 모바일 웹만 있던 ChatCODIT에 iOS·Android 앱을 추가하고, 두 스토어 모두 인앱 구독을 붙여 운영 중입니다.
```

| 블록       | 가는 곳                               | 규칙                                                       |
| ---------- | ------------------------------------- | ---------------------------------------------------------- |
| `PRODUCT:` | `content/products.ts` 의 `id`         | `data/products/{id}.mdx` 와 같은 이름이어야 한다           |
| `company`  | `companyId`                           | 그 제품에 속한 작업과 회사가 같아야 한다                   |
| `name`     | `name`                                | 카드 제목·구분선·그룹 소제목에 그대로 나간다               |
| `platform` | `platform`                            | 라벨은 `이름 · platform` 으로 만들어진다                   |
| `summary`  | `data/products/{id}.mdx` 의 `summary` | /portfolio 카드 요약. 입력에 없으면 지어내지 말고 물어본다 |

스크린샷은 블록으로 오지 않는다. 새 제품의 카드 이미지는 따로 전달받아
`data/products/{id}.mdx` 의 `images`·`imageSize` 에 넣는다.

---

## 지표 블록

```
### METRIC: cs-inquiry
value: 40%↓
label: 충전 실패 CS 인입
kind: business
evidence: 2025.03 vs 2025.06 CS 티켓 집계
```

| `kind`     | `evidence` | `businessImpact`                                         |
| ---------- | ---------- | -------------------------------------------------------- |
| `tech`     | 필수       | **필수** (없으면 verify 실패, `TBD` 는 통과하되 보고)    |
| `business` | 필수       | 불필요                                                   |
| `scope`    | 필수       | 불필요 — `0 → 1`, `Web · App` 처럼 숫자가 아닌 범위 표기 |

`evidence` 는 **화면에 렌더하지 않는다.** 면접 대비용이다.
입력 블록에 `evidence` 가 없으면 지표를 등록하지 말고 물어본다.

---

## 문구 블록

문구는 코드에서 다듬지 않는다. 챗에서 확정한 최종본을 통째로 준다.

```
### COPY: profile.summary
웹(PC·Mobile)과 iOS·Android 앱을 오가며 ...
```

대상: `profile.summary`(이력서) · `profile.about`(포트폴리오) · `profile.tagline` ·
`collaborationIntro` / `collaborationOutro` · `content/experience.ts` 의 하이라이트

`profile.summary` 와 `profile.about` 은 **같은 문장을 쓰면 verify 가 실패한다.**
두 문서가 같은 말을 하면 한쪽은 읽을 이유가 없어진다.

---

## `narrative` 가 들어오면 함께 해야 하는 일

지금 세 문서의 서술은 `data/*/*.mdx` 본문과 `content/experience.ts` 가 손으로 나눠 갖고 있다.
프로젝트에 `narrative` 가 채워지면 그 프로젝트에 한해 아래로 옮긴다.

| 경로         | 렌더할 단계                                                                |
| ------------ | -------------------------------------------------------------------------- |
| `/resume`    | `problem` · `decision.chosen` · `result` 각 1줄                            |
| `/careers`   | 7단 전체 요약                                                              |
| `/portfolio` | flagship 은 7단 풀 전개 + `decision.rejected`, supporting 은 카드 1개 분량 |

옮기고 나면 해당 MDX 본문에서 서술 블록(`<Block>`, `<Steps>`)을 걷어내고
요약·스크린샷만 남긴다. 같은 문장이 두 곳에 남으면 그게 다음 불일치의 씨앗이다.

---

## 지금 비어 있는 칸

`npm run verify` 의 `TBD` 목록이 곧 다음에 챗에서 확정할 것들이다. 현재 16건, 경고 0건:

- `codit-chatcodit-app-infra` 의 `role` · `contribution`
- `codit-appshell` 의 `name`
- 기술 지표들의 `label` 과 연결할 사업 지표
- `content/experience.ts` 코딧 하이라이트 제목 2건

verify 가 보고하지 않는 빈칸도 있다. `codit-platform` 제품의 카드 요약
(`data/products/codit-platform.mdx` 의 `summary`)과, 아직 경력기술서 본문에 손으로 쓴 채
남아 있는 ChatCODIT(Web)의 작업 2건(Draft · 렌더링·구축·운영)이다.
