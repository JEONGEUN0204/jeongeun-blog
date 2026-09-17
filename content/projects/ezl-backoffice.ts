import type { Project } from '../schema'

export const ezlBackoffice: Project = {
  id: 'ezl-backoffice',
  companyId: 'ezllabs',
  name: '백오피스',
  role: 'TBD',
  roleDetail: '백오피스 운영 기능 개발 담당',
  contribution: 'TBD',
  stack: {
    primary: ['React', 'TypeScript'],
    secondary: ['React Query', 'Recoil'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'build',
}
