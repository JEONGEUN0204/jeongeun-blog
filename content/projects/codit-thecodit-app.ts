import type { Project } from '../schema'

/**
 * 제품 '더코딧 앱' 의 유일한 작업. name 에서 제품 이름을 떼어 'WebView 하이브리드' 만 남겼다가, result 가 보이는 이름으로 바꿨다(2026-09-29) —
 * 제품 이름은 content/products.ts 의 codit-thecodit-app 이 적는다.
 *
 * 서술은 narrative 가 원천이다. /careers 는 codit.mdx 의 07 자리(<ProjectNarrative>)에서
 * 7단 요약을, /portfolio 는 작업이 하나뿐인 제품이라 개요에 바로 싣는다.
 *
 * 두 번째 입력 블록으로 범위를 원문 모달 CS 하나에서 앱↔웹 경계 전반(뒤로가기·모달·edge-to-edge)과
 * 릴리즈 배포로 넓혔다. 이 블록에는 INSIGHT · DECISION.chosen · LEARNING 이 없어 TBD 다.
 * Narrative 컴포넌트가 TBD 를 거르지 않아 /careers 요약에 그대로 보인다.
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
  role: '기능 담당',
  roleDetail: 'WebView 모달 네비게이션·브릿지 이슈 대응과 앱 릴리즈/실서버 배포 담당',
  contribution:
    '모달 중첩의 원인을 뒤로가기 경로 분기로 좁혀 핸들러를 일원화하고, 함께 넣은 플랫폼 방어 조건이 과했다는 걸 배포 전 스테이징 확인에서 잡아 철회. 스테이징 실기기 배포 경로 구성, 로딩 인디케이터 추가, 실서버 배포 4회 담당. 앱은 기존 구축분을 이어받아 여러 명이 함께 수정하는 구조',
  stack: {
    primary: ['React Native', 'Expo', 'expo-router', 'EAS'],
    secondary: ['react-native-webview'],
  },
  metricIds: [],
  highlight:
    '앱↔웹 경계에서 반복 인입되던 모달 중첩의 원인을 뒤로가기 경로 분기로 좁혀, 하드웨어 백·헤더 백 핸들러 일원화',
  depth: 'supporting',
  kind: 'operation',
  narrative: {
    problem:
      '100% WebView로 된 앱에서 앱↔웹 경계 문제가 반복 인입됨. 모달 스택과 WebView 히스토리가 따로 움직여 화면이 겹치거나 열리지 않고, SafeAreaView 처리가 화면마다 달라 시스템 바와 겹침',
    insight: 'TBD',
    decision: {
      chosen: 'TBD',
      rejected: [
        {
          option:
            '근본 수정과 함께 넣은 방어 조건 — Android에서는 앱이 OPEN_MODAL_VIEW를 처리하지 않도록 iOS 한정으로 좁힘',
          reason:
            '중복 메시지가 또 올라올 수 있다고 봤으나, 스테이징 빌드에서 Android 원문 모달이 아예 열리지 않는 것이 확인돼 가정이 틀렸음을 알고 삭제. 후속 CS를 체감 로딩 문제로만 보고 인디케이터로 마무리하려던 단계를 거쳤는데, 인디케이터를 넣은 뒤에도 모달 자체가 안 열렸음 — 보이는 문제와 실제 문제가 달랐음',
        },
      ],
      constraint:
        '웹 코드는 수정할 수 없고, 앱에서 할 수 있는 건 브릿지 메시지 처리(handleModalMessage)뿐. app/modal.tsx는 같은 시기 다른 팀원 둘이 각자 다른 CS로 동시에 수정하던 공유 파일(이력상 5명이 수정)이라 회귀 위험이 컸음. 착수부터 실서버 배포까지 한 릴리즈 안에서 끝내야 했음',
    },
    action: [
      '뒤로가기 경로 일원화: 하드웨어 백과 헤더 백이 같은 handleBackPress를 타도록 Header.tsx에 onBackPress를 주입',
      '모달 로딩 중 인디케이터 추가 후, 스테이징 빌드에서 Android 모달이 열리지 않는 것을 확인해 iOS 한정 조건을 삭제하고 같은 릴리즈에 실어 배포',
      '확인 수단을 직접 마련: staging 프로파일을 internal로 바꾸고 Firebase App Distribution DEV 그룹 배포 스크립트를 추가해 배포 전 실기기 검증 경로를 만듦',
      '모달 헤더 제목 넘침 처리, 앱에서 챗코딧 바로가기 진입 처리',
      'Android targetSdk 36 전환으로 강제된 edge-to-edge 대응: edgeToEdgeEnabled를 켜고 modal · search · (mypage) · WebViewLayout 4개 화면의 SafeAreaView 처리를 react-native-safe-area-context 기준으로 통일',
      '릴리즈 배포 4회 담당',
    ],
    beforeAfter: {
      before:
        '하드웨어 백과 헤더 백이 서로 다른 핸들러를 타서 Android에서 모달이 겹쳐 보이고, 모달을 여는 동안 흰 화면이라 멈춘 것처럼 보임. SafeAreaView 처리가 화면마다 달라 targetSdk 36 전환 후 시스템 바가 콘텐츠와 겹침',
      after:
        'iOS·Android가 같은 브릿지 처리를 타고 모달이 겹치지 않음. 모달이 뜨는 동안 인디케이터가 보임. 4개 화면의 시스템 바 처리가 한 기준으로 정리됨',
    },
    result:
      '앱↔웹 경계에서 반복 인입되던 CS를 브릿지·네비게이션 처리로 해소하고 릴리즈까지 냄. 이후 app/modal.tsx 변경은 로그인 · 파일 다운로드 · edge-to-edge로 전부 다른 주제였고, 모달 중첩·네비게이션으로는 재인입 없음',
    learning: 'TBD',
  },
}
