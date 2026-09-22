import type { Project } from '../schema'

/**
 * 서술은 narrative 가 원천이다. /portfolio 는 supporting 카드(문제·관점·선택·결과)를,
 * /careers 는 codit.mdx 의 08 자리(<ProjectNarrative>)에서 7단 요약을 렌더한다.
 *
 * 인증·보안·배포는 codit-chatcodit-app-infra 로 떼어 냈고(입력 블록이 다루지 않은 범위),
 * 남은 이 작업의 범위가 구축·결제라 name 이 '구축·결제' 다. 제품 이름('ChatCODIT App')은
 * content/products.ts 의 codit-chatcodit-app 이 적는다.
 *
 * 예전 roleDetail·MDX summary·experience.ts 의 '웹→네이티브 마이그레이션' 은 교체했다.
 * 입력 블록의 제약이 '기존 React 모바일 웹은 그대로 유지' 이고 PROBLEM 도 앱을 새로 만든 일이라,
 * 웹을 앱으로 옮긴 게 아니라 앱을 추가한 것이다.
 *
 * metricIds 는 비운다. 입력 블록의 METRICS 가 비어 있고, AFTER 의 출시 날짜·버전은
 * evidence 를 붙일 지표가 아니라 서술이라 beforeAfter 에만 둔다.
 *
 * learning 은 입력 블록이 TBD 로 준 값이다. 지어내지 않고 그대로 둔다 — Narrative 컴포넌트가
 * TBD 를 거르지 않아 /careers 요약의 '배움' 칸에 그대로 보인다.
 */
export const coditChatCoditAppBuild: Project = {
  id: 'codit-chatcodit-app-build',
  companyId: 'codit',
  productId: 'codit-chatcodit-app',
  name: '구축·결제',
  role: '설계·구현 리드',
  roleDetail:
    'React 모바일 웹만 있던 ChatCODIT에 iOS·Android 앱 추가 — 초기 구조·배포·스트리밍·구독 결제 담당',
  contribution:
    '3명 중 앱 초기 세팅과 구조 설계, 스토어 배포, 채팅 스트리밍, 인앱 구독 결제, iOS 심사 대응을 맡음. Expo와 expo-iap 도입을 직접 결정. 나머지 두 명은 이 구조 위에서 남은 기능을 개발. 영수증 검증과 구독 상태 저장은 백엔드 담당',
  stack: {
    primary: ['React Native', 'Expo', 'TypeScript'],
    secondary: ['expo-iap', 'EAS', 'TanStack Query', 'Zustand', 'reCAPTCHA'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'build',
  narrative: {
    problem:
      '모바일 웹만 있던 서비스에 iOS·Android 앱을 새로 만들어야 했다. 웹의 스트리밍 구조는 RN에서 그대로 돌지 않았고, 스토어 인앱 구독은 결제 성공과 서버 권한 반영 사이에 앱 종료, 같은 거래의 중복 전달, 스토어 계정 공유 같은 빈틈이 있었다.',
    insight:
      '웹 구조는 최대한 그대로 가져오고, RN에서 깨지는 지점(응답 스트림 지원, 앱 백그라운드 전환, 스토어 거래 큐)만 앱에 맞게 다시 설계하면 된다고 봤다.',
    decision: {
      chosen:
        '서버 검증이 성공한 뒤에만 거래를 완료(finish)하고, 실패한 거래는 스토어 큐에 남겨 다음 실행·로그인 때 다시 검증한다. 단, 다른 앱 계정에 이미 묶인 거래(409)는 재시도해도 같은 에러가 반복되므로 검증 없이 완료해 큐를 비운다',
      rejected: [
        {
          option: '구매 직후 바로 finish',
          reason: '서버 검증이 실패하면 결제는 됐는데 권한이 없는 상태가 복구할 방법 없이 남음',
        },
        {
          option: 'react-native-iap',
          reason:
            '앱을 Expo로 구성해서, Expo Module로 만든 expo-iap가 설정·빌드 연동이 더 자연스러웠음',
        },
        {
          option: 'RevenueCat',
          reason: '영수증 검증과 구독 상태 저장을 백엔드가 직접 구현해서 역할이 겹침',
        },
      ],
      constraint:
        '앱 개발 3명, 기존 React 모바일 웹은 그대로 유지, 영수증 검증·구독 상태는 백엔드 담당, App Store 심사 정책',
    },
    action: [
      '앱 초기 세팅과 구조 설계 (PR #1, 2026.03)',
      'RN 기본 fetch와 axios로는 응답 스트림을 받을 수 없어 질문 스트리밍만 expo/fetch로 분리하고 일반 API는 axios로 유지. 별도 SSE 라이브러리나 폴리필 없이 구현',
      '웹 스트리밍 파서 구조(청크 읽기, 불완전한 줄 버퍼링, event·data 파싱, 블록 이벤트 조립)를 가져오되, 타임아웃 시 읽기 루프 탈출과 앱 에러 매핑은 앱에 맞게 새로 작성',
      '청크가 30초 동안 오지 않으면 스트림을 끝내고, done 이벤트를 받지 못해도 UI를 종료 처리해 무한 로딩 방지',
      '스트리밍은 POST 응답이라 끊기면 이어받을 수 없고 서버가 답변을 저장하므로, 포그라운드 복귀 시 스트리밍 상태를 초기화하고 저장된 메시지를 다시 불러오도록 처리',
      '답변 중단은 클라이언트에서 연결을 끊지 않고 서버 stop API로 처리',
      'streamdown-rn을 패치해 한국어 강조 파싱과 테이블 컬럼 폭 문제 수정',
      '앱 실행·로그인 때 미완료 거래(iOS getPendingTransactionsIOS, Android getAvailablePurchases)를 찾아 검증 → 완료 순서로 다시 처리',
      '세션 중 처리한 transaction id를 기록해 중복 검증을 막고, 진행 중인 구매가 있으면 새 구매 요청을 거절',
      '구매 시 iOS appAccountToken, Android obfuscatedAccountId에 앱 계정 UUID를 묶고, 다른 계정에 묶인 거래는 결제 시트를 띄우기 전에 막고 안내',
      '웹·다른 OS 구독자는 재검증을 건너뛰고, 플랜 변경 버튼을 숨기고, 기기 플랫폼이 같을 때만 스토어 구독 관리 화면으로 연결. 웹 구독자 안내 화면 추가',
      '다운그레이드 때 기존 거래가 중복 방지에 걸려 다음 플랜이 갱신되지 않던 문제 수정. Android acknowledge 누락(자동 환불 위험)과 다운그레이드 무한 로딩 수정. Android 업그레이드는 즉시 변경, 다운그레이드는 다음 결제일 변경으로 분리',
      '구매 복원 흐름(스토어 동기화 → 활성 구독 조회 → 서버 restore API → 권한 재조회)을 훅으로 만들고 요금제·설정 화면에 버튼 추가',
      'iOS 심사 대응: 구매 복원 버튼 추가, Apple 표준 EULA 링크 적용, 요금제 FAQ 섹션 제거, iOS 랜딩의 Google Play 버튼 제거, 할인가와 이후 자동 갱신 가격 고지 문구 추가',
      '스토어 배포',
    ],
    beforeAfter: {
      before: 'React 모바일 웹만 있고 앱과 인앱 결제는 없음',
      after:
        '2026.04 iOS·Android 앱 1.0.x 출시(결제 없음). 인앱 구독은 Android 1.1.0(2026.06.08), iOS 1.1.2(2026.06.24)부터 제공. 이후 1.4.0(2026.09.16)까지 이어서 배포',
    },
    result: 'iOS·Android 앱을 출시하고, 두 스토어 모두 인앱 구독을 붙여 운영 중',
    learning: 'TBD',
  },
}
