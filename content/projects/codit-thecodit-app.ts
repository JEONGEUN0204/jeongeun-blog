import type { Project } from '../schema'

/**
 * 제품 '더코딧 앱' 의 유일한 작업. name 에서 제품 이름을 떼어 'WebView 하이브리드' 만 남겼다 —
 * 제품 이름은 content/products.ts 의 codit-thecodit-app 이 적는다. codit.mdx 의 손으로 쓴
 * 10 Section 제목도 이미 'WebView 하이브리드' 다.
 */
export const coditTheCoditApp: Project = {
  id: 'codit-thecodit-app',
  companyId: 'codit',
  productId: 'codit-thecodit-app',
  name: 'WebView 하이브리드',
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
