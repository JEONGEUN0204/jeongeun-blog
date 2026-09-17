import type { Project } from '../schema'

export const coditChatCoditApp: Project = {
  id: 'codit-chatcodit-app',
  companyId: 'codit',
  name: 'ChatCODIT App',
  role: 'TBD',
  roleDetail: '웹→네이티브 마이그레이션·인앱결제(IAP)·구독 결제 신뢰성 설계 및 구현',
  contribution: 'TBD',
  stack: {
    primary: ['React Native', 'Expo', 'TypeScript'],
    secondary: ['expo-iap', 'EAS', 'reCAPTCHA'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'build',
}
