import type { Project } from '../schema'

/**
 * 서술은 narrative 가 원천이다. /portfolio 는 supporting 카드(문제·관점·선택·결과)를,
 * /careers 는 ezllabs.mdx 의 04 자리(<ProjectNarrative>)에서 7단 요약을 렌더한다.
 *
 * kind 는 'build' 에서 'improvement' 로 바꿨다. 이미 돌아가던 flow 의 LLM 호출 구조를 고친 작업이고,
 * 7단 서술이 다루는 것도 신규 구축이 아니라 2단계 호출을 1회로 줄인 일이다.
 *
 * name 의 Confluence 는 확인 답변으로 포함이 확정됐다. data/projects/ezl-ai.mdx 의
 * summary('사내 Jira·Confluence 데이터를 검색하는')도 같은 범위라 둘 다 그대로 둔다.
 * 7단 서술과 roleDetail 이 Jira 만 말하는 것은 맡은 작업의 범위가 거기였기 때문이다 —
 * 도구 전체의 범위(name)와 내가 한 일의 범위(roleDetail)는 다른 칸이고, 어긋난 게 아니다.
 *
 * metricIds 는 비운다. beforeAfter 의 '질의 1건당 LLM 호출 1회' 는 입력 블록에 evidence 가 없어
 * metrics.ts 에 등록하지 않는다.
 *
 * 예전 data/projects/ezl-ai.mdx 본문과 data/careers/ezllabs.mdx 04 에 있던 '운영 정보를 빠르게
 * 찾도록 했다' 는 입력 블록에 없는 주장이라 서술을 이쪽으로 옮기면서 걷어냈다.
 *
 * insight·learning 은 입력 블록이 TBD 로 준 값이다. 지어내지 않고 그대로 둔다 — Narrative 컴포넌트가
 * TBD 를 거르지 않아 /portfolio 카드의 '관점' 칸과 /careers 요약에 그대로 보인다.
 */
export const ezlAi: Project = {
  id: 'ezl-ai',
  companyId: 'ezllabs',
  productId: 'ezl-ai',
  name: 'Jira/Confluence 검색 AI',
  role: '기능 담당',
  roleDetail: 'Jira 검색 AI의 LLM 인터페이스 레이어(프롬프트, 도구 호출, 응답 포맷) 담당',
  contribution:
    '3인 프로젝트에 자발적으로 참여해 client 영역(Genkit flow의 프롬프트·도구 호출 인터페이스·응답 포맷)을 수정. 배포 브랜치의 최종 프롬프트 작성. 수집 배치·검색 서버·인프라는 참여하지 않음',
  stack: {
    primary: ['TypeScript'],
    secondary: ['Genkit'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'improvement',
  narrative: {
    problem:
      'Jira 댓글까지 포함해, 정확히 같은 단어가 아니어도 관련된 내용으로 이슈를 찾게 하는 것이 목표였다. 그런데 기존 구조는 검색된 티켓 수만큼 LLM을 다시 불러 요약하고 있었다',
    insight: 'TBD',
    decision: {
      chosen: '도구 선택과 응답 작성을 LLM 호출 1회로 통합',
      rejected: [
        {
          option: '도구 선택 후 티켓별로 LLM을 따로 불러 요약하는 2단계 구조 유지',
          reason: '티켓 수만큼 LLM 호출이 늘어나 응답이 느리고 비효율적인 구조',
        },
      ],
      constraint:
        '검색 서버 API와 수집 구조는 다른 팀원 담당이라 client 레이어 안에서 해결해야 했음',
    },
    action: [
      'LLM 호출 2단계(도구 선택 → 티켓별 요약 루프)를 1회 호출로 통합하고, 응답 형식은 프롬프트에서 지정',
      '검색 결과를 한국어 요약·관련성·주요 댓글 형식의 최종 응답으로 구성',
    ],
    beforeAfter: {
      before: '질의 1건당 LLM 호출이 도구 선택 1회 + 티켓 수만큼 추가',
      after: '질의 1건당 LLM 호출 1회',
    },
    result:
      '수정한 flow가 배포 브랜치의 최종 버전으로 AWS ECS에 배포되어 사내에서 테스트 수준으로 사용됨. 회사 사정으로 본격 사용 전에 중단',
    learning: 'TBD',
  },
}
