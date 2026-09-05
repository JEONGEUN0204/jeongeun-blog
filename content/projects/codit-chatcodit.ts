import type { Project } from '../schema'

/**
 * flagship — /portfolio 에서 유일하게 풀 전개하는 프로젝트.
 *
 * flagship 은 decision.rejected(대안 검토)가 반드시 있어야 한다. narrative 이관 전이라
 * 아직 비어 있고, `npm run verify` 가 이를 미이관 항목으로 계속 보고한다.
 */
export const coditChatCodit: Project = {
  id: 'codit-chatcodit',
  companyId: 'codit',
  name: 'ChatCODIT · 실시간 스트리밍',
  role: 'TBD',
  roleDetail: '스트리밍 응답 형식 설계(백엔드 협의)·프론트 파싱·렌더링·상태 구조 담당',
  team: 'TBD',
  contribution: 'TBD',
  stack: {
    primary: ['Next.js', 'TypeScript', 'Zustand'],
    secondary: ['SSE', 'fetch ReadableStream'],
  },
  metricIds: ['sse-parser-lines'],
  depth: 'flagship',
  kind: 'improvement',
}
