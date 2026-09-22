import type { Project } from '../schema'

/**
 * 'Codit 플랫폼' 상위 프로젝트. 대시보드·AppShell·AGENTS.md·Tailwind 작업이 parentId 로 여기에 붙는다.
 *
 * 예전에는 이 파일이 대시보드 작업 자체를 담았다. 대시보드 입력 블록이 이 id 로 왔지만 그 기간을 여기 넣으면
 * 하위 작업 전체의 카드 기간이 줄어들어 codit-dashboard 로 뗐다. (작업별 기간 표시는 이후 제거됐다.)
 *
 * roleDetail 의 예전 값은 대시보드 한 작업의 설명이라 codit-dashboard 로 대체됐다. 플랫폼 단위 설명은 입력 블록에 없어 TBD 다.
 * verify 는 roleDetail 의 TBD 를 목록에 올리지 않으니 여기서 기억해 둔다.
 */
export const coditCodit: Project = {
  id: 'codit-codit',
  companyId: 'codit',
  name: 'Codit 플랫폼',
  role: 'TBD',
  roleDetail: 'TBD',
  contribution: 'TBD',
  stack: {
    primary: ['React', 'TypeScript', 'TanStack Query', 'Zustand'],
    secondary: ['embla-carousel', 'Tailwind'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'improvement',
}
