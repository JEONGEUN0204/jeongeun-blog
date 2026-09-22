# 핸드오프 블록 포맷

Claude 챗에서 내용을 확정한 뒤 이 형태로 Claude Code 에 붙여넣는다.
챗에 넣을 지침은 `docs/chat-instructions.md`, 받는 쪽 절차는 `CLAUDE.md` 를 따른다.

이 포맷의 목적은 하나다. **대안 검토가 비면 코드까지 가지 못하게 막는 것.**
`depth: flagship` 인데 `DECISION.rejected` 가 비면 `npm run verify` 가 실패하므로,
챗에서 그 칸을 채우지 않으면 포트폴리오에 올라가지 않는다.

## 한 프로젝트가 놓이는 두 파일

| 파일                       | 담는 것                                 | 블록의 어느 부분                  |
| -------------------------- | --------------------------------------- | --------------------------------- |
| `content/projects/{id}.ts` | **사실** — 회사·역할·스택·지표·7단 서술 | `company` ~ `LEARNING`, `METRICS` |
| `data/projects/{id}.mdx`   | **표현** — 한 줄 요약·스크린샷·본문     | `summary`, `platform`, `images`   |

파일명(`{id}`)이 둘을 잇는 유일한 키다. 한쪽만 있으면 verify 가 실패한다.

---

## 프로젝트 블록

```
### PROJECT: codit-chatcodit
company: codit
depth: flagship
kind: improvement
role: 설계·구현 리드
roleDetail: SSE 프로토콜 초안 설계, 백엔드 협의, 프론트 파서 전면 교체
contribution: 프로토콜 설계 100%, 프론트 구현 100%, 백엔드 스키마 합의 주도

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

| 블록                   | `Project` 필드                      | 규칙                                                                   |
| ---------------------- | ----------------------------------- | ---------------------------------------------------------------------- |
| `PROJECT:`             | `id`                                | `data/projects/{id}.mdx` 와 같은 이름이어야 한다                       |
| `company`              | `companyId`                         | `codit` \| `ezllabs`. 없는 id 면 회사부터 등록하고 물어본다            |
| `parent`               | `parentId`                          | 다른 프로젝트의 하위 작업일 때만. 아래 '하위 프로젝트' 참고            |
| `depth`                | `depth`                             | `flagship` \| `supporting`. flagship 은 1개 원칙 (2개 이상이면 경고)   |
| `kind`                 | `kind`                              | `improvement` \| `build` \| `operation`                                |
| `role`                 | `role`                              | `단독 담당` \| `설계·구현 리드` \| `기능 담당` \| `일부 참여` \| `TBD` |
| `roleDetail`           | `roleDetail`                        | 비어 있으면 verify 실패                                                |
| `contribution`         | `contribution`                      | 문자열 또는 `TBD`                                                      |
| `stack.*`              | `stack.primary` / `stack.secondary` | 버전 표기 금지. primary 가 비면 verify 실패                            |
| `PROBLEM` ~ `LEARNING` | `narrative`                         | 7단이 다 오지 않으면 `narrative` 자체를 만들지 않는다                  |
| `METRICS`              | `metricIds` + `content/metrics.ts`  | 지표는 `metrics.ts` 에 먼저 등록하고 id 만 참조한다                    |
| `ASK`                  | —                                   | 코드로 옮기지 않는다. 작업 종료 시 질문 목록으로 되돌려준다            |

### 하위 프로젝트 (`parent`)

`parent: codit-codit` 처럼 상위 프로젝트 id 를 주면 `Project.parentId` 가 되고, 그 프로젝트의 하위 작업이 된다.
역할·7단 서술은 하위 프로젝트가 그대로 갖고, 렌더 위치만 상위 안으로 들어간다.
같은 회사의 최상위 프로젝트만 가리킬 수 있고, 하위 프로젝트는 flagship 이 될 수 없다 (verify 가 검사).

| 경로         | 렌더 위치                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `/resume`    | `content/experience.ts` 의 상위 제품 그룹에 하이라이트로 넣는다. 그룹을 따로 만들지 않는다                                           |
| `/careers`   | 회사 MDX 의 상위 제품 `<ProductGroup>` 구분선 아래에 `<ProjectNarrative id="..." no="NN" />` 로 자리를 잡는다. 제목에는 name 만 쓴다 |
| `/portfolio` | 카드로 세지 않는다. 상위 프로젝트 상세 끝에 소제목과 카드 1개 분량으로 붙는다                                                        |

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

`npm run verify` 의 `TBD` 목록이 곧 다음에 챗에서 확정할 것들이다. 현재 21건:

- 프로젝트 6건의 `role` · `contribution`
- 기술 지표 3건(`ezl-inquiry-api`, `ezl-crash-free`, `sse-parser-lines`)의 `evidence` 와 사업 지표
- `ezl-mau` 의 `evidence`
- flagship `codit-chatcodit` 의 7단 서술 — 특히 `DECISION.rejected`

경고 1건: `kind: operation` 프로젝트가 0건 (운영 중 발생한 문제 대응 사례 없음)
