import type { Project } from '../schema'

export const ezlCharge: Project = {
  id: 'ezl-charge',
  companyId: 'ezllabs',
  name: '이즐충전소',
  /**
   * 입사는 2024.06, 이즐충전소 투입은 2024.07 로 한 달 차이가 있다.
   * 회사 기간과 프로젝트 기간이 다른 의도된 구분이므로 여기서만 덮어쓴다.
   */
  periodOverride: { start: '2024.07', end: '2025.10' },
  role: 'TBD',
  roleDetail: '조회 API 성능 개선·앱 안정성(Sentry)·충전/환불 결제 흐름 담당',
  team: 'TBD',
  contribution: 'TBD',
  stack: {
    primary: ['React Native', 'TypeScript', 'React Query'],
    secondary: ['Recoil', 'Kotlin', 'Swift'],
  },
  metricIds: ['ezl-inquiry-api', 'ezl-crash-free', 'ezl-mau'],
  depth: 'supporting',
  kind: 'improvement',
}
