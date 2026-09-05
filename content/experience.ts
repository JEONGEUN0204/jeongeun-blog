import type { Experience } from './schema'

/**
 * /resume 의 Experience 하이라이트 — 경력기술서의 축약판.
 *
 * 회사명·재직기간은 여기에 두지 않는다. companyId 로 companies.ts 를 참조한다.
 * 7단 narrative 이관이 끝나면 이 목록은 projects 의 problem·decision·result 에서
 * 파생되어야 하며, 그때까지는 손으로 관리하는 압축본이다.
 */
export const experiences: Experience[] = [
  {
    companyId: 'codit',
    role: 'Frontend Engineer',
    summary:
      '정책·입법 데이터 플랫폼 「Codit」과 분리 서비스 「ChatCODIT」의 웹·iOS·Android 앱 프론트엔드 담당',
    groups: [
      {
        product: 'Codit 플랫폼 (Web)',
        highlights: [
          {
            title: '대시보드 순차 로딩 아키텍처 설계',
            detail:
              '전 섹션 일괄 요청으로 느리던 초기 로딩을 슬라이드 단위 fetch+prefetch로 재설계, 초기 요청량 축소·진입 로딩 개선',
          },
          {
            title: '레거시 스타일 마이그레이션',
            detail: 'styled-components → Tailwind 순차 전환·공통 컴포넌트화로 유지보수성 향상',
          },
        ],
      },
      {
        product: 'ChatCODIT (Web)',
        highlights: [
          {
            title: '실시간 스트리밍 프로토콜 설계',
            detail:
              '거대한 JSON을 수동 파싱하던 기존 방식을 블록 단위 SSE 프로토콜(7종)로 직접 설계해 백엔드에 요청, 1,281줄에 달하던 수동 파서를 걷어내 파싱 로직 대폭 단순화',
          },
          {
            title: '대화형 문서 초안 작성(Draft)',
            detail:
              '기존 스트리밍 스토어에 블록 타입만 추가해 멀티턴 문서 생성을 무중단 확장, 에러 3분기·409 자기복구로 복원력 확보',
          },
          {
            title: '반응형 웹 · 0→1 구축',
            detail:
              'SSR 디바이스 감지·라우트 분리·Tailwind 토큰으로 반응형 대응, React → Next.js 마이그레이션·회원·인증·SEO·Bitbucket Pipeline 배포',
          },
        ],
      },
      {
        product: 'ChatCODIT App (iOS · Android)',
        highlights: [
          {
            title: '웹→네이티브 마이그레이션',
            detail:
              'Expo Router 아키텍처로 재구성하고 스트리밍 채팅·마크다운 렌더링을 앱에 이식해 iOS·Android 1.0.0 정식 출시',
          },
          {
            title: '인앱결제(IAP)·구독 신뢰성 확보',
            detail:
              'expo-iap 서버 검증·IAPProvider 통합, 미완료 거래 sweep·중복 구독 방지로 중복 verify 해소',
          },
          {
            title: '앱 보안·무중단 배포',
            detail:
              'reCAPTCHA·Firebase App Check 무결성 검증, EAS 환경 분리·OTA·rollback 자동 배포 체계 구축',
          },
        ],
      },
      {
        product: '더코딧 앱 (iOS · Android · WebView)',
        highlights: [
          {
            title: '코딧 웹을 WebView로 감싼 iOS·Android 앱',
            detail:
              '웹 자산을 활용해 앱 스토어 배포·네이티브 연동을 담당, 빠르게 모바일 앱으로 서비스 제공',
          },
        ],
      },
    ],
  },
  {
    companyId: 'ezllabs',
    role: 'Frontend Engineer',
    summary:
      'MAU 30만 교통카드 충전·조회 서비스 「이즐충전소」 운영, 앱·웹·디자인 시스템·내부 AI 전반 개발',
    groups: [
      {
        product: '이즐충전소 (React Native · 앱)',
        highlights: [
          {
            title: '이즐워크 조회·포인트 전환 API 개선',
            detail:
              '버튼 클릭마다 중복 호출되던 조회 API를 useQuery 전환·캐싱으로 재설계, API 호출 75% 감소',
          },
          {
            title: 'Sentry 활용 앱 안정성 대응',
            detail: 'Sentry로 런타임 에러를 확인·수정해 Crash Free Rate 3%p 향상',
          },
          {
            title: '충전·환불 재시도 플로우 구현',
            detail: '미완료 거래 재시도·연속 클릭 방지로 중복 결제 차단·CS 인입 감소',
          },
        ],
      },
      {
        product: '백오피스 · 디자인 시스템 · 내부 AI (React · React Native)',
        highlights: [
          {
            title: '백오피스',
            detail:
              '관리자 운영 기능 구현 및 react-error-boundary로 에러 처리 패턴 표준화(가독성·유지보수성 향상)',
          },
          {
            title: '디자인 시스템',
            detail:
              '공통 UI 컴포넌트·Storybook Controls 적용으로 코드 수정 없이 UI 확인, 개발 시간 단축',
          },
          {
            title: 'Jira/Confluence 검색 AI',
            detail: '자연어 질의로 사내 데이터를 검색하는 내부 도구 구현(Genkit·프롬프트 설계)',
          },
        ],
      },
    ],
  },
]
