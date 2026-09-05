import type { Certificate, Collaboration, Education, ProfileBasic, SkillGroup } from './schema'

export const profile: ProfileBasic = {
  name: '신정은',
  title: 'Frontend Engineer',
  tagline:
    '문제의 원인을 구조에서 찾는 프론트엔드 엔지니어. 웹(PC·Mobile)과 iOS·Android 앱을 오가며 0→1 구축부터 실시간 스트리밍 프로토콜 설계, 앱 출시·배포까지 담당했습니다.',
  email: 'wjddms9921@gmail.com',
  phone: '010-9921-1047',
  github: 'github.com/JEONGEUN0204',
}

/**
 * /resume 의 SUMMARY. 숫자 중심 압축.
 * about 과 문장이 겹치면 verify 가 실패한다 — 두 문서가 같은 말을 하면 한쪽은 읽을 이유가 없다.
 */
export const summary =
  '웹(PC·Mobile)과 iOS·Android 앱을 오가며 회원·인증·구독·결제 같은 핵심 플로우를 실서비스로 구현해 온 프론트엔드 엔지니어입니다(2024.06~현재). 중복 호출·전역 일괄 로딩처럼 드러나지 않는 요청·렌더링 구조의 비효율을 찾아 재설계했고(조회 API 호출 75%↓, 대시보드 순차 로딩 재설계), 거대한 JSON을 문자 단위로 쪼개 보내던 실시간 응답 방식을 블록 단위 SSE 프로토콜로 직접 설계해 백엔드에 제안하며 1,281줄의 수동 파서를 걷어냈습니다. React → Next.js 마이그레이션으로 웹을 0→1로 구축하고 Expo로 iOS·Android 1.0.0을 출시해 EAS OTA 배포까지 운영했으며, MAU 30만 규모 서비스에서는 Sentry로 런타임 에러를 추적해 Crash Free Rate를 3%p 끌어올렸습니다. 판단 근거를 문서로 남겨 백엔드·디자인·QA와 합의하며 일하는 것을 협업의 기본으로 삼습니다.'

/**
 * 렌더 전용 파생값. 한 문단 벽 텍스트를 문장 단위로 끊어 문단을 나눈다.
 *
 * 원본 summary 문자열은 그대로 둔다 — verify 의 summary↔about 문장 중복 검사 대상이고,
 * 문구를 고치는 일은 이 파일이 아니라 챗에서 확정한다.
 * 분리 기준은 scripts/verify-content.ts 의 sentences() 와 같다. `.` 뒤가 공백일 때만
 * 끊으므로 '2024.06'·'1.0.0'·'Next.js'·'3%p' 는 오분리되지 않는다.
 */
export const summarySentences = summary
  .split(/(?<=[.!?])\s+/)
  .map((sentence) => sentence.trim())
  .filter(Boolean)

/** /portfolio 의 ABOUT. 과정과 태도 중심 서술. summary 와 문장이 겹치면 안 된다. */
export const about = [
  '안녕하세요. 웹과 앱 환경에서 프론트엔드 개발을 담당하고 있습니다.',
  '단순한 기능 구현을 넘어 근본적인 문제 해결과 React 리렌더링 최적화를 통해 성능과 사용자 경험을 개선하는 데 집중해왔습니다.',
  '지속적으로 효율적이고 확장 가능한 코드를 고민하며 성장하고 있습니다.',
]

/**
 * primary = 실제 프로젝트에서 주력으로 쓴 기술, secondary = 보조.
 * 나열만 하면 무엇을 잘하는지 알 수 없다는 지적에 따라 두 단으로 나눈다.
 */
export const skills: SkillGroup[] = [
  {
    category: 'Language',
    primary: ['TypeScript'],
    secondary: ['JavaScript'],
  },
  {
    category: 'Frontend',
    primary: ['React', 'Next.js', 'React Native', 'Expo'],
    secondary: ['Tailwind'],
  },
  {
    category: 'State · Data',
    primary: ['TanStack Query', 'Zustand'],
    secondary: ['Recoil'],
  },
  {
    category: 'Dev · Ops',
    primary: ['Storybook'],
    secondary: ['Sentry', 'expo-iap', 'EAS', 'Genkit'],
  },
  {
    category: 'Collaboration',
    primary: ['Git/GitHub', 'Bitbucket', 'Jira', 'Figma', 'Confluence'],
    secondary: [],
  },
]

export const education: Education[] = [
  { school: '숙명여자대학교', detail: 'IT공학전공', period: '2019.03 ~ 2024.02' },
  { school: '삼성고등학교', period: '2015.03 ~ 2018.02' },
]

export const certificates: Certificate[] = [
  { name: '정보처리기사', issuer: '한국산업인력공단', date: '2022.06' },
]

export const collaborationIntro =
  '상대 부서의 제약을 이해하고, 판단 근거를 남겨 소통하는 것을 협업의 기본으로 삼습니다.'

export const collaborations: Collaboration[] = [
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
