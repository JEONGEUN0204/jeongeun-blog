import type { Project } from '../schema'

/**
 * 지표가 없는 프로젝트다. METRICS 가 비어 있으므로 metricIds 도 비운다 —
 * 숫자를 만들어 채우면 그 자리가 그대로 방어 못 하는 문장이 된다.
 */
export const coditAgentsMd: Project = {
  id: 'codit-agents-md',
  companyId: 'codit',
  productId: 'codit-platform',
  name: 'AGENTS.md · 에이전트 컨텍스트 단일 원본',
  role: '설계·구현 리드',
  roleDetail: '에이전트 컨텍스트 도입을 제안하고 문서 구조와 내용을 직접 작성',
  contribution: '도구 중립 단일 원본 방식 결정, AGENTS.md 작성',
  stack: {
    primary: ['Claude Code'],
    secondary: [],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'build',
  narrative: {
    problem:
      '저장소에 예전 구조와 새로 정리한 구조가 함께 남아 있는데, 새로 짠 코드가 새 구조가 아니라 예전 구조 쪽에 들어가는 일이 있었다. 팀원들이 Cursor와 Claude Code를 함께 쓰는데, 두 도구 모두 참조할 구조 설명이 저장소에 없었다.',
    insight:
      '구조가 흔들린 건 규칙이 없어서가 아니라 규칙이 팀 안에만 있고 저장소에는 없어서였다. 구조와 규칙을 저장소에 적어 두면 어떤 도구를 쓰든 같은 기준으로 코드가 나온다.',
    decision: {
      chosen: 'AGENTS.md를 단일 원본으로 두고, 도구별 파일은 import 문법으로 그것을 불러오게 구성',
      rejected: [
        {
          option: '도구별 컨텍스트 문서를 각각 관리',
          reason: '같은 내용을 두 벌 두게 되고 두 파일은 결국 갈라진다',
        },
        {
          option: '심볼릭 링크로 연결',
          reason:
            '원본과 완전히 같아져서 도구별로 필요한 내용을 덧붙일 수 없다. import 방식은 단일 원본을 유지하면서 도구별로 추가할 여지를 남긴다',
        },
      ],
      constraint: '예전 구조와 새 구조가 함께 있어 정리가 진행 중 / 서비스 개발과 병행',
    },
    action: [
      '도구 중립 AGENTS.md를 작성하고, 도구별 파일은 이를 불러오는 한 줄로 구성',
      '상태 관리 계층 구분, 새 코드 배치 규칙, API 관련 파일 관리 규칙 등 저장소를 처음 만질 때 헷갈리는 항목 위주로 수록',
      '읽고 고칠 사람이 한국어 팀이라 한국어로 작성',
    ],
    beforeAfter: {
      before: '저장소에 구조·규칙 문서가 없어, 도구마다 참조하는 기준이 달랐다.',
      after: 'AGENTS.md 하나를 원본으로 두고 도구별 파일이 이를 불러오는 구조.',
    },
    result: '저장소에 반영되어 팀이 같은 문서를 참조하게 됐다.',
    learning: '도구가 늘어날수록 문서를 도구별로 두면 안 된다. 원본은 도구 밖에 둬야 한다.',
  },
}
