import type { Project } from '../schema'

export const ezlDesignSystem: Project = {
  id: 'ezl-design-system',
  companyId: 'ezllabs',
  name: '디자인 시스템',
  role: 'TBD',
  roleDetail: '공통 디자인 시스템 개발 담당',
  contribution: 'TBD',
  stack: {
    primary: ['React Native', 'TypeScript', 'Storybook'],
    secondary: ['Expo'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'build',
}
