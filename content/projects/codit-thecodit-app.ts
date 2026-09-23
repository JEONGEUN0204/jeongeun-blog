import type { Project } from '../schema'

/**
 * 제품 '더코딧 앱' 의 유일한 작업. name 에서 제품 이름을 떼어 'WebView 하이브리드' 만 남겼다 —
 * 제품 이름은 content/products.ts 의 codit-thecodit-app 이 적는다.
 *
 * 서술은 narrative 가 원천이다. /careers 는 codit.mdx 의 10 자리(<ProjectNarrative>)에서
 * 7단 요약을, /portfolio 는 작업이 하나뿐인 제품이라 개요에 바로 싣는다.
 *
 * 예전 서술('웹의 isNativeMobile 을 Boolean(window.ReactNativeWebView) 로 바꿔 중복 오픈 제거')은
 * 걷어냈다. 입력 블록의 제약이 '웹 코드는 수정할 수 없음' 이고, 중복 오픈은 그렇게 보였을 뿐
 * 실제 원인은 뒤로가기 경로가 둘로 갈라진 것이었다.
 *
 * 입력 블록의 periodOverride(2025.12 ~ 현재)는 필드가 없어져 옮기지 않았다.
 * metricIds 는 비운다. 입력 블록의 METRICS 가 비어 있다.
 */
export const coditTheCoditApp: Project = {
  id: 'codit-thecodit-app',
  companyId: 'codit',
  productId: 'codit-thecodit-app',
  name: 'WebView 하이브리드',
  role: '기능 담당',
  roleDetail: 'WebView 모달 네비게이션·브릿지 이슈 대응과 앱 릴리즈/실서버 배포 담당',
  contribution:
    '모달 중첩의 원인을 뒤로가기 경로 분기로 좁혀 핸들러를 일원화하고, 함께 넣은 플랫폼 방어 조건이 과했다는 걸 배포 전 스테이징 확인에서 잡아 철회. 스테이징 실기기 배포 경로 구성, 로딩 인디케이터 추가, 1.21.0 · 1.25.0 · 1.25.2 · 1.26.0 실서버 배포 PR 작성. 앱은 기존 구축분을 이어받아 여러 명이 함께 수정하는 구조',
  stack: {
    primary: ['React Native', 'Expo', 'expo-router', 'EAS'],
    secondary: ['react-native-webview'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'operation',
  narrative: {
    problem:
      'Android에서 법령 상세의 원문 보기 모달이 겹쳐 보인다는 CS가 들어옴. 이 앱의 핵심 열람 기능이 깨진 상태였음',
    insight:
      '브릿지 메시지가 중복으로 올라와 모달이 두 번 열리는 것처럼 보였지만, 실제 원인은 뒤로가기 경로가 둘로 갈라져 있던 것이었음. 하드웨어 백과 헤더 백 버튼이 각각 다른 핸들러를 타면서 WebView 내부 히스토리와 expo-router 스택이 따로 움직였음',
    decision: {
      chosen:
        'Header에 onBackPress를 내려 헤더 백 버튼도 handleBackPress를 타게 하고, 뒤로가기 경로를 하나로 합침',
      rejected: [
        {
          option:
            '근본 수정과 함께 넣은 방어 조건 — Android에서는 앱이 OPEN_MODAL_VIEW를 처리하지 않도록 iOS 한정으로 좁힘',
          reason:
            '중복 메시지가 또 올라올 수 있다고 봤는데, 일주일 뒤 배포 전 스테이징 빌드에서 Android 원문 모달이 아예 열리지 않는 게 확인되면서 그 가정이 틀렸다는 게 드러나 조건을 삭제',
        },
        {
          option: 'CS-9213을 체감 로딩 문제로만 보고 인디케이터로 마무리하는 안',
          reason:
            '인디케이터 PR이 승인·머지된 뒤에도 Android에서는 모달 자체가 안 열렸음. 보이는 문제와 실제 문제가 달랐음',
        },
        {
          option:
            'Android의 WebView 마운트 지연(InteractionManager)을 제거해 체감 속도를 올리는 안',
          reason:
            '지연을 없애면 모달 열기 애니메이션이 끊김. 지연은 두고 기다리는 동안 무엇이 일어나는지 보여주는 쪽을 택함',
        },
      ],
      constraint:
        '웹 코드는 수정할 수 없고 앱에서 할 수 있는 건 브릿지 메시지 처리(handleModalMessage)뿐. app/modal.tsx는 같은 시기에 다른 팀원 둘이 각자 다른 CS로 동시에 수정하던 공유 파일이라 회귀 위험이 컸음. 04.06 착수부터 04.14 1.25.0 실서버 배포까지 한 릴리즈 안에서 끝내야 했음',
    },
    action: [
      'Header.tsx에 onBackPress를 주입해 헤더 백과 하드웨어 백이 같은 handleBackPress를 타도록 수정하고, 같은 작업에서 OPEN_MODAL_VIEW를 iOS 한정으로 좁히는 방어 조건 추가 (04.06) → CS-9145로 release/1.24.0 머지 (PR #45, 04.07)',
      'staging 배포를 store에서 internal로 바꾸고 Firebase App Distribution으로 DEV 그룹에 뿌리는 스크립트를 추가. 이후 이 경로가 배포 전 실기기 확인 수단이 됨 (04.13 오전)',
      'CS-9213을 체감 로딩 문제로 보고 모달 WebView 로딩 중 BallBeat 인디케이터 추가, PR #50 머지 (04.13 오전~오후)',
      '같은 날 밤, 스테이징 빌드에서 Android 원문 모달이 열리지 않는 것이 확인돼 iOS 한정 조건 삭제. 같은 티켓 재수정 PR #51로 올려 다음 날 오전 머지 (04.13~04.14)',
      '1.25.0 실서버 배포 (04.14)',
    ],
    beforeAfter: {
      before:
        '하드웨어 백과 헤더 백이 서로 다른 핸들러를 타서 Android에서 모달 화면이 겹쳐 보임. 모달을 여는 동안 흰 화면이라 멈춘 것처럼 보임',
      after:
        '뒤로가기 경로가 하나로 합쳐지고, iOS·Android가 같은 브릿지 처리를 탐. 로딩 중에는 인디케이터가 보임',
    },
    result:
      '승인·머지까지 끝난 코드가 실서버 배포 전날 스테이징 확인에서 걸렸고, 앞서 얹은 방어 조건이 과했다는 걸 같은 릴리즈 안에서 철회. 새 CS로 다시 들어오기 전에 정리됐고, 이후 app/modal.tsx 변경 이력은 로그인(CS-9060) · 파일 다운로드(CS-9396) · edge-to-edge(CS-10100)로 전부 다른 주제. 모달 중첩·네비게이션으로는 재인입 없음',
    learning:
      '근본 원인을 고치면서 얹은 방어 조건이 다음 버그의 원인이 될 수 있다. 조건을 넣을 땐 그게 틀렸을 때 어떤 증상으로 드러날지도 같이 정해둔다',
  },
}
