import type { Project } from '../schema'

/**
 * 제품 'CODIT 플랫폼 앱' 의 유일한 작업. name 에서 제품 이름을 떼어 'WebView 하이브리드' 만 남겼다가, result 가 보이는 이름으로 바꿨다(2026-09-29) —
 * 제품 이름은 content/products.ts 의 codit-thecodit-app 이 적는다.
 *
 * 서술은 narrative 가 원천이다. /careers 는 codit.mdx 의 07 자리(<ProjectNarrative>)에서
 * 7단 요약을, /portfolio 는 작업이 하나뿐인 제품이라 개요에 바로 싣는다.
 *
 * 두 번째 입력 블록으로 범위를 원문 모달 CS 하나에서 앱↔웹 경계 전반(뒤로가기·모달·edge-to-edge)과
 * 릴리즈 배포로 넓혔다.
 *
 * 운영 중 버그 대응이라 관점·선택·배움에 넣을 내용이 없어 ShortNarrative(문제·원인·조치·전후·결과)로
 * 옮겼다(2026-09-30). 원인은 예전 PROBLEM·BEFORE 에 있던 문장을 떼어 왔다. 예전 decision 의
 * rejected(Android 방어 조건 철회)·constraint(웹 코드 수정 불가·공유 파일 회귀 위험·한 릴리즈 안에 완료)는
 * 칸이 없어져 빠졌다. 원문은 git 이력에 있다.
 *
 * action 은 원인과 인과가 있는 두 줄만 남겼다(2026-09-30). 인디케이터·방어 조건 철회, 스테이징 배포 경로,
 * 헤더 넘침·챗코딧 진입, 릴리즈 배포 4회는 이 문제의 조치가 아니라는 답을 받아 뺐다.
 * result 의 'app/modal.tsx 이후 변경이 모두 다른 주제' 는 재인입 없음의 근거였는데 밖에서 읽히지 않아 뺐다.
 *
 * ISSUE 의 '9개월간' 은 걷어냈다. 진행 중인 기간이라 계속 늘어나는 개월 수이고,
 * RESULT 의 '이후 재인입 없음' 과도 부딪쳤다.
 *
 * 입력 블록의 periodOverride(2025.12 ~ 현재)는 필드가 없어져 옮기지 않았다.
 * metricIds 는 비운다. 입력 블록에 METRICS 가 없다.
 */
export const coditTheCoditApp: Project = {
  id: 'codit-thecodit-app',
  companyId: 'codit',
  productId: 'codit-thecodit-app',
  name: '브릿지·네비게이션 처리로 앱↔웹 경계 반복 CS 해소',
  role: '기능 구현',
  roleDetail: 'WebView 모달 네비게이션·브릿지 이슈 대응과 앱 릴리즈/실서버 배포 담당',
  contribution:
    '모달 중첩의 원인을 뒤로가기 경로 분기로 좁혀 핸들러를 일원화하고, 스테이징 배포를 Firebase App Distribution으로 전환',
  stack: ['React Native', 'Expo', 'expo-router', 'EAS', 'react-native-webview'],
  metricIds: [],
  highlight:
    '앱↔웹 경계에서 반복 인입되던 모달 중첩의 원인을 뒤로가기 경로 분기로 좁히고, 하드웨어 백·헤더 백 핸들러 일원화',
  depth: 'supporting',
  kind: 'operation',
  narrative: {
    problem:
      'WebView로 된 앱에서 앱↔웹 경계 문제가 반복해서 인입됐다. 모달 화면이 겹치거나 열리지 않았고, 시스템 바가 콘텐츠와 겹쳤다. QA용 스테이징 빌드는 파일을 직접 전달하거나 TestFlight에 올려 배포하고 있어 확인할 때마다 번거로웠다.',
    cause:
      '하드웨어 백과 헤더 백이 서로 다른 핸들러를 타서 모달 스택과 WebView 히스토리가 따로 움직였다. 시스템 바 겹침은 Android targetSdk 36 전환으로 edge-to-edge가 강제됐는데 SafeAreaView 처리가 화면마다 달랐기 때문이다.',
    action: [
      '뒤로가기 경로 일원화: 하드웨어 백과 헤더 백이 같은 handleBackPress를 타도록 Header.tsx에 onBackPress를 주입',
      'Android targetSdk 36 전환으로 강제된 edge-to-edge 대응: edgeToEdgeEnabled를 켜고 modal · search · (mypage) · WebViewLayout 4개 화면의 SafeAreaView 처리를 react-native-safe-area-context 기준으로 통일',
      '스테이징 배포를 Firebase App Distribution으로 전환: staging 프로파일을 internal로 바꾸고 DEV 그룹 배포 스크립트를 추가',
    ],
    beforeAfter: {
      before: 'Android에서 모달이 겹쳐 보임. targetSdk 36 전환 후 시스템 바가 콘텐츠와 겹침',
      after:
        'iOS·Android가 같은 브릿지 처리를 타고 모달이 겹치지 않음. 4개 화면의 시스템 바 처리가 한 기준으로 정리됨',
    },
    result:
      '앱↔웹 경계에서 반복 인입되던 CS를 브릿지·네비게이션 처리로 해소하고 배포했다. 이후 모달 중첩·네비게이션 관련 CS는 다시 인입되지 않았다. 스테이징 빌드를 빠르고 간편하게 배포할 수 있게 되어 QA가 원활하게 진행됐다.',
  },
}
