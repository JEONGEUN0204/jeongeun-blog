# 핸드오프 블록 포맷

Claude 챗에서 내용을 확정한 뒤 이 형태로 Claude Code 에 붙여넣는다.
챗에 넣을 지침은 `docs/chat-instructions.md`, 받는 쪽 절차는 `CLAUDE.md` 를 따른다.

이 포맷의 목적은 하나다. **대안 검토가 비면 코드까지 가지 못하게 막는 것.**
`depth: flagship` 인데 `DECISION.rejected` 가 비면 `npm run verify` 가 실패하므로,
챗에서 그 칸을 채우지 않으면 포트폴리오에 올라가지 않는다.

## 블록이 가는 곳

| 대상 | 파일                       | 담는 것                                                  |
| ---- | -------------------------- | -------------------------------------------------------- |
| 작업 | `content/projects/{id}.ts` | 회사·제품·역할·스택·지표·7단 서술·이력서 한 줄           |
| 제품 | `content/products.ts`      | 이름·platform·카드 요약·대표 스크린샷 (항목 하나)        |
| 회사 | `data/careers/{id}.mdx`    | 로고·소개·태그와 /careers 본문의 배치. **MDX 는 여기뿐** |

예전에는 작업과 제품도 `content/` 의 사실과 `data/` 의 MDX 로 나뉘어 있었다. MDX 쪽에 남은 것이
한 줄 요약과 이미지 경로뿐이라 한 대상이 두 파일로 갈라지기만 했고, "제품에는 MDX 가 반드시
있어야 한다" 같은 규칙을 verify 가 따로 지켜야 했다. 지금은 사실과 표현이 같은 항목에 있다.

`data/careers/*.mdx` 는 남는다. 여기에는 본문이 있다 — `<ProductGroup>`·`<ProjectNarrative>` 로
순서를 잡고, 7단 서술을 아직 받지 못한 작업은 `<Section>` 으로 직접 적는다.

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

HIGHLIGHT: 불완전한 JSON을 직접 해석하던 구조를 블록 단위 전송 규격({m:sse-protocol-scope})으로 재설계해 백엔드에 제안, 수동 파서 {m:sse-parser-lines} 제거

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
| `PROJECT:`             | `id`                                | `content/projects/{id}.ts` 의 파일명이 된다                              |
| `company`              | `companyId`                         | `codit` \| `ezllabs`. 없는 id 면 회사부터 등록하고 물어본다              |
| `product`              | `productId`                         | **필수.** `content/products.ts` 에 없는 id 면 제품부터 등록하고 물어본다 |
| `name`                 | `name`                              | 작업 이름만. 제품 이름으로 시작하거나 TBD·조사·'다' 로 끝나면 실패       |
| `depth`                | `depth`                             | `flagship` \| `supporting`. 제품마다 flagship 최대 1개 (초과면 실패)     |
| `kind`                 | `kind`                              | `improvement` \| `build` \| `operation`                                  |
| `role`                 | `role`                              | `단독 담당` \| `설계·구현 리드` \| `기능 담당` \| `일부 참여` \| `TBD`   |
| `roleDetail`           | `roleDetail`                        | 비어 있으면 verify 실패                                                  |
| `contribution`         | `contribution`                      | 문자열 또는 `TBD`                                                        |
| `summary`              | —                                   | 작업에는 요약을 두지 않는다. /portfolio 는 제품 요약과 7단 서술로 읽힌다 |
| `stack.*`              | `stack.primary` / `stack.secondary` | 버전 표기 금지. primary 가 비면 verify 실패                              |
| `PROBLEM` ~ `LEARNING` | `narrative`                         | 7단이 다 오지 않으면 `narrative` 자체를 만들지 않는다                    |
| `METRICS`              | `metricIds` + `content/metrics.ts`  | 지표는 `metrics.ts` 에 먼저 등록하고 id 만 참조한다                      |
| `HIGHLIGHT`            | `highlight`                         | **필수.** /resume 한 줄. 아래 규칙                                       |
| `ASK`                  | —                                   | 코드로 옮기지 않는다. 작업 종료 시 질문 목록으로 되돌려준다              |

### 이력서 한 줄 (`name` + `HIGHLIGHT`)

/resume 하이라이트는 따로 쓰지 않는다. 제목은 `name`, 설명은 `HIGHLIGHT` 를 그대로 찍는다.
**작업 하나 = 이력서 한 줄**이다. 두 줄이 필요하면 작업을 나눠야 한다는 신호다.

- `name` 은 세 문서가 같이 쓴다. 명사로 끝내고, 구조 이름보다 무엇이 바뀌었는지 보이게 쓴다.
  제품 이름과 같으면 /resume 은 소제목과 겹치지 않게 제목을 생략한다.
- `HIGHLIGHT` 는 새로 쓰지 않고 7단에서 파생한다 — `DECISION.chosen` + `RESULT` 를 한 줄로.
  `PROBLEM` 은 판단 이유에 꼭 필요할 때만 앞에 짧게. 7단에 없는 행위·성과는 쓰지 않는다.
- 끝은 내가 한 행위의 명사형이다 — `적용`·`설계`·`제거`·`구축`. 결과 상태(`없음`·`감소`)나
  도구가 한 일(`자동 진행`·`판정`), '~하는 구조/방식' 으로 끝내지 않는다.
- 수치는 타이핑하지 않고 `{m:<metric-id>}` 로 참조한다. id 는 그 작업의 `METRICS` 에 있어야 한다.
  지표 `value` 가 문장에 어색하면 지표에 `inline` 을 둔다(예: `2건 → 0건`).

verify: 명사로 끝남('다'·'함'·'됨'·마침표 금지), `{m:}` id 가 `metricIds` 안에 있음, `RESULT` 와 글자
그대로 같으면 실패, 비었거나 `TBD` 면 실패. `{m:}` 밖의 수치+단위(%, 건, 초, 줄, 회, 종, 장)와
렌더 기준 110자 초과는 경고. 날짜(`2025.09`)는 수치로 보지 않는다.

### 제품 (`product`)

`product: codit-platform` 처럼 제품 id 를 주면 `Project.productId` 가 된다. 모든 작업에 필요하고,
제품에 작업이 하나뿐이어도 생략하지 않는다. 같은 회사의 제품만 가리킬 수 있고,
한 제품의 flagship 작업은 최대 하나다 (verify 가 검사).

작업 이름(`name`)에는 제품 이름을 붙이지 않는다. 제품 이름은 아래 세 자리가 각각 적는다.

| 경로         | 제품이 적히는 자리                               | 작업이 적히는 자리                                                    |
| ------------ | ------------------------------------------------ | --------------------------------------------------------------------- |
| `/resume`    | 그룹 소제목 — 회사의 제품을 `products.ts` 순서로 | 그룹 안의 한 줄 — `name` + `highlight`                                |
| `/careers`   | `<ProductGroup id="..." />` 구분선               | `<ProjectNarrative id="..." no="NN" />` 자리. 제목에는 `name` 만 쓴다 |
| `/portfolio` | 카드 제목과 상세 헤더                            | 상세 본문의 섹션. 작업이 하나뿐인 제품은 섹션 없이 개요에 바로 실린다 |

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

| 블록       | 가는 곳                       | 규칙                                                       |
| ---------- | ----------------------------- | ---------------------------------------------------------- |
| `PRODUCT:` | `content/products.ts` 의 `id` | 작업 블록의 `product:` 가 이 id 를 가리킨다                |
| `company`  | `companyId`                   | 그 제품에 속한 작업과 회사가 같아야 한다                   |
| `name`     | `name`                        | 카드 제목·구분선·그룹 소제목에 그대로 나간다               |
| `platform` | `platform`                    | 라벨은 `이름 · platform` 으로 만들어진다                   |
| `summary`  | `summary`                     | /portfolio 카드 요약. 입력에 없으면 지어내지 말고 물어본다 |

스크린샷은 블록으로 오지 않는다. 새 제품의 카드 이미지는 따로 전달받아 `public/static/images/` 에
두고 `content/products.ts` 의 `images`·`imageSize` 에 경로를 적는다. 파일이 없으면 verify 가 실패한다.

---

## 지표 블록

```
### METRIC: cs-inquiry
value: 40%↓
label: 충전 실패 CS 인입
inline: 40%        # 선택. HIGHLIGHT 의 {m:cs-inquiry} 자리에 value 대신 들어갈 표기
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
### COPY: profile.about
웹(PC·Mobile)과 iOS·Android 앱을 ...

불필요한 요청을 찾아 줄입니다
같은 API를 여러 번 부르거나 ...
```

대상: `profile.aboutLead` + `profile.about`(홈 ABOUT) · `profile.tagline` ·
`collaborationIntro` / `collaborationOutro` · `content/experience.ts` 의 회사 요약(`summary`).
이력서 하이라이트는 문구 블록이 아니라 작업 블록의 `name` · `HIGHLIGHT` 로 온다

ABOUT 은 첫 줄이 `aboutLead`, 그 뒤로 제목 한 줄 + 본문 한 줄이 한 항목(`{title, body}`)이다.
**본문이 제목을 그대로 되풀이하면 verify 가 실패한다.** 같은 말을 두 번 읽힐 이유가 없다.

---

## `narrative` 가 들어오면 함께 해야 하는 일

7단 서술을 아직 받지 못한 작업은 `data/careers/*.mdx` 본문이 손으로 들고 있다.
프로젝트에 `narrative` 가 채워지면 그 프로젝트에 한해 아래로 옮긴다.

| 경로         | 렌더할 단계                                                                |
| ------------ | -------------------------------------------------------------------------- |
| `/resume`    | `name` + `highlight` 한 줄 (`decision.chosen` + `result` 에서 파생)        |
| `/careers`   | 7단 전체 요약                                                              |
| `/portfolio` | flagship 은 7단 풀 전개 + `decision.rejected`, supporting 은 카드 1개 분량 |

옮기고 나면 해당 MDX 본문에서 서술 블록(`<Block>`, `<Steps>`)을 걷어낸다. 같은 문장이 두 곳에
남으면 그게 다음 불일치의 씨앗이다. 작업 MDX 에 남는 것은 `summary`·`platform`·소제목 본문뿐이고,
그마저 없으면 파일을 지운다 — 제품 MDX 는 카드 요약과 대표 스크린샷이 있어 그대로 남는다.

---

## 지금 비어 있는 칸

`npm run verify` 의 `TBD` 목록이 곧 다음에 챗에서 확정할 것들이다. 현재 11건, 경고 0건:

- `codit-platform` 제품의 카드 요약(`summary`)
- 기술 지표들의 `label` 과 연결할 사업 지표

verify 가 보고하지 않는 빈칸이 있다. ChatCODIT(Web)의 작업 2건(대화형 문서 초안 작성 ·
반응형 웹·0→1 구축)과 ChatCODIT App 의 인증·보안·배포는 `content/projects` 에 작업이 없어
세 문서 어디에도 보이지 않는다. 7단 서술 + `HIGHLIGHT` 로 받으면 작업으로 세운다.
