export interface ResumeMetric {
  value: string
  label: string
}

export interface ResumeSkillGroup {
  category: string
  items: string[]
}

export interface ResumeEducation {
  school: string
  detail?: string
  period: string
}

export interface ResumeCertificate {
  name: string
  issuer: string
  date: string
}

export interface ResumeHighlight {
  /** 성과 제목 (— 앞부분) */
  title: string
  /** 성과 상세 (— 뒷부분) */
  detail: string
}

export interface ResumeExperienceGroup {
  /** 예: 'Codit 플랫폼 (Web)' */
  product: string
  highlights: ResumeHighlight[]
}

export interface ResumeExperience {
  company: string
  role: string
  period: string
  duration: string
  summary: string
  groups: ResumeExperienceGroup[]
}

export interface ResumeCollaboration {
  audience: string
  body: string
  example: string
}

export interface ResumeProfile {
  name: string
  title: string
  tagline: string
  email: string
  phone: string
  github: string
}

export const profile: ResumeProfile = {
  name: '신정은',
  title: 'Frontend Engineer',
  tagline:
    '문제의 원인을 구조에서 찾는 프론트엔드 엔지니어. 웹(PC·Mobile)과 네이티브 앱을 오가며 0→1 구축부터 실시간 스트리밍 프로토콜 설계, 앱 출시·배포까지 담당했습니다.',
  email: 'wjddms9921@gmail.com',
  phone: '010-9921-1047',
  github: 'github.com/JEONGEUN0204',
}

export const summary =
  '웹(PC·Mobile)과 네이티브 앱을 오가며 회원·인증·구독·결제 같은 핵심 플로우를 실서비스로 구현해 온 프론트엔드 엔지니어입니다(총 경력 약 2년, 2024.06~현재). 중복 호출·전역 일괄 로딩처럼 드러나지 않는 요청·렌더링 구조의 비효율을 찾아 재설계했고(조회 API 호출 75%↓, 대시보드 순차 로딩 재설계), 거대한 JSON을 문자 단위로 쪼개 보내던 실시간 응답 방식을 블록 단위 SSE 프로토콜로 직접 설계해 백엔드에 제안하며 약 1,281줄의 수동 파서를 걷어냈습니다. React → Next.js 마이그레이션으로 웹을 0→1로 구축하고 Expo로 iOS·Android 1.0.0을 출시해 EAS OTA 배포까지 운영했으며, MAU 30만 규모 서비스에서는 Sentry로 런타임 에러를 추적해 Crash Free Rate를 약 3%p 끌어올렸습니다. 판단 근거를 문서로 남겨 백엔드·디자인·QA와 합의하며 일하는 것을 협업의 기본으로 삼습니다.'

export const metrics: ResumeMetric[] = [
  { value: 'API 75%↓', label: '조회 로직 캐싱 최적화' },
  { value: '+3%p', label: 'Crash Free Rate 향상' },
  { value: '0 → 1', label: '웹·앱 신규 구축·운영' },
  { value: 'Web · App', label: '웹·앱 전 영역 개발' },
]

export const skills: ResumeSkillGroup[] = [
  { category: 'Language', items: ['TypeScript', 'JavaScript'] },
  { category: 'Frontend', items: ['React', 'Next.js', 'React Native', 'Expo', 'Tailwind'] },
  { category: 'State · Data', items: ['TanStack Query', 'Zustand', 'Recoil'] },
  { category: 'Dev · Ops', items: ['Storybook', 'Sentry', 'expo-iap', 'EAS', 'Genkit'] },
  { category: 'Collaboration', items: ['Git/GitHub', 'Bitbucket', 'Jira', 'Figma', 'Confluence'] },
]

export const education: ResumeEducation[] = [
  { school: '숙명여자대학교', detail: 'IT공학전공', period: '2019.03 ~ 2024.02' },
  { school: '삼성고등학교', period: '2015.03 ~ 2018.02' },
]

export const certificates: ResumeCertificate[] = [
  { name: '정보처리기사', issuer: '한국산업인력공단', date: '2022.06' },
]

export const experiences: ResumeExperience[] = [
  {
    company: '코딧 (Codit)',
    role: 'Frontend Engineer',
    period: '2025.11 ~ 현재',
    duration: '약 8개월',
    summary:
      '정책·입법 데이터 플랫폼 「Codit」과 분리 서비스 「ChatCODIT」의 웹·네이티브 앱 프론트엔드 담당',
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
              '거대한 JSON을 수동 파싱하던 기존 방식을 블록 단위 SSE 프로토콜(7종)로 직접 설계해 백엔드에 요청, 약 1,281줄에 달하던 수동 파서를 걷어내 파싱 로직 대폭 단순화',
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
            title: '코딧 웹을 WebView로 감싼 네이티브 앱',
            detail:
              '웹 자산을 활용해 앱 스토어 배포·네이티브 연동을 담당, 빠르게 모바일 앱으로 서비스 제공',
          },
        ],
      },
    ],
  },
  {
    company: '이즐랩스',
    role: 'Frontend Engineer',
    period: '2024.06 ~ 2025.10',
    duration: '1년 4개월',
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
            detail: 'Sentry로 런타임 에러를 확인·수정해 Crash Free Rate 약 3%p 향상',
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

export const collaborationIntro =
  '상대 부서의 제약을 이해하고, 판단 근거를 남겨 소통하는 것을 협업의 기본으로 삼습니다.'

export const collaborations: ResumeCollaboration[] = [
  {
    audience: 'BACKEND',
    body: '응답 구조 변경이 필요할 때 현행 문제·개선안·스펙·스키마 리뷰를 문서로 정리해 제안하고, 그 문서를 기준으로 함께 리뷰하며 합의합니다.',
    example: '블록 단위 SSE 프로토콜(7종) 설계안을 문서로 제안, citations 매칭 방식 스키마 리뷰',
  },
  {
    audience: 'DESIGN · PRODUCT',
    body: '구현 제약이나 엣지 케이스를 먼저 공유해 화면이 확정되기 전에 조율합니다.',
    example:
      'iOS 심사 가이드·플랫폼 정책상 구독 화면에 필수로 노출해야 하는 요소나 결제 실패·미완료 상태를 미리 공유해 화면에 반영하도록 조율',
  },
  {
    audience: 'QA',
    body: '재현 경로와 원인 분석을 함께 정리해 이슈 범위를 좁힙니다.',
    example: 'WebView 모달 중복 오픈 건, 재현 조건을 함께 좁혀 브릿지 주입 타이밍까지 원인 규명',
  },
]

export const collaborationOutro =
  '이렇게 각 부서의 언어로 맥락과 근거를 전달하는 소통 덕분에, 요청이 오해 없이 전달되고 재작업을 줄일 수 있었습니다.'

const resumeData = {
  profile,
  summary,
  metrics,
  skills,
  education,
  certificates,
  experiences,
  collaborationIntro,
  collaborations,
  collaborationOutro,
}

export default resumeData
