import type { Project } from '../schema'

/**
 * 서술은 narrative 가 원천이다. /portfolio 는 supporting 카드(문제·조치·결과)를,
 * /careers 는 ezllabs.mdx 의 04 자리(<ProjectNarrative>)에서 요약을 렌더한다.
 *
 * 서술을 ShortNarrative(문제·조치·결과)로 옮겼다(2026-09-30). 검색이 불편했다 → 이렇게 작업했다 →
 * 사내에서 쓰게 됐다는 흐름만 남기고, LLM 호출 수(2단계 → 1회) 이야기는 빼달라는 답을 받아 걷어냈다.
 * 그 이야기를 담던 decision(대안·제약)과 TBD 였던 insight·learning 도 함께 빠졌다.
 *
 * kind 는 'build' 에서 'improvement' 로 바꿨었다. 이미 돌아가던 flow 의 LLM 호출 구조를 고친 작업이라서였다.
 *
 * name 의 Confluence 는 확인 답변으로 포함이 확정됐다. 제품 summary('사내 Jira·Confluence
 * 데이터를 검색하는', content/products.ts)도 같은 범위라 둘 다 그대로 둔다.
 * 7단 서술과 roleDetail 이 Jira 만 말하는 것은 맡은 작업의 범위가 거기였기 때문이다 —
 * 도구 전체의 범위(name)와 내가 한 일의 범위(roleDetail)는 다른 칸이고, 어긋난 게 아니다.
 *
 * metricIds 는 비운다. 입력 블록에 METRICS 가 없다.
 *
 * 예전 data/projects/ezl-ai.mdx 본문과 data/careers/ezllabs.mdx 04 에 있던 '운영 정보를 빠르게
 * 찾도록 했다' 는 입력 블록에 없는 주장이라 서술을 이쪽으로 옮기면서 걷어냈다.
 *
 */
export const ezlAi: Project = {
  id: 'ezl-ai',
  companyId: 'ezllabs',
  productId: 'ezl-ai',
  name: 'Jira/Confluence 검색 AI',
  role: '기능 구현',
  roleDetail: 'Jira 검색 AI의 LLM 인터페이스 레이어(프롬프트, 도구 호출, 응답 포맷) 담당',
  contribution:
    '3인 프로젝트에 자발적으로 참여해 client 영역(Genkit flow의 프롬프트·도구 호출 인터페이스·응답 포맷)을 수정',
  stack: ['TypeScript', 'Genkit'],
  metricIds: [],
  highlight:
    '3인 프로젝트에 자발적으로 참여해, PM까지 사내에서 직접 쓰게 된 검색 AI의 프롬프트·도구 호출·응답 포맷을 맡고 최종 프롬프트 작성',
  depth: 'supporting',
  kind: 'improvement',
  narrative: {
    problem:
      'Jira·Confluence에서는 정확히 같은 단어가 아니면 관련된 이슈나 문서를 찾기 어려웠다. 댓글까지 포함해, 관련된 내용으로 이슈와 문서를 찾을 수 있는 검색이 필요했다.',
    action: [
      'Genkit flow의 프롬프트·도구 호출 인터페이스·응답 포맷을 수정',
      '검색 결과를 한국어 요약·관련성·주요 댓글 형식의 최종 응답으로 구성',
    ],
    beforeAfter: {
      before: '정확히 같은 단어가 아니면 관련 이슈·문서를 찾기 어려움',
      after: '댓글까지 포함한 관련 이슈·문서를 한국어 요약·관련성·주요 댓글 형식으로 받아 봄',
    },
    result:
      'Genkit Developer UI가 그대로 인터페이스가 되는 구조로 배포되어, 개발 외 직군(PM)도 사내에서 직접 검색에 사용하게 됐다.',
  },
}
