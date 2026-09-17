import type { Project } from '../schema'

export const coditTheCoditApp: Project = {
  id: 'codit-thecodit-app',
  companyId: 'codit',
  name: '더코딧 앱 (WebView 하이브리드)',
  role: 'TBD',
  roleDetail: 'WebView 네비게이션·브릿지 트러블슈팅·릴리즈/스토어 배포 담당',
  contribution: 'TBD',
  stack: {
    primary: ['React Native', 'Expo'],
    secondary: ['expo-router', 'react-native-webview', 'EAS'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'build',
}
