import type {
  AboutPoint,
  Certificate,
  Collaboration,
  Education,
  ProfileBasic,
  SkillGroup,
} from './schema'

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
 * 홈(= 이력서)의 ABOUT. 한 줄 정체성 + 일하는 방식 네 가지.
 *
 * 수치는 여기 적지 않는다 — 바로 위 Metrics 카드와 아래 Experience 가 맡는다.
 * 같은 숫자를 두 번 읽히면 ABOUT 이 요약이 아니라 중복이 된다.
 */
export const aboutLead =
  '웹과 앱의 기능 개발부터 운영까지 맡고, 문제가 생기면 근본 원인을 찾아 해결하는 프론트엔드 엔지니어입니다.'

export const about: AboutPoint[] = [
  {
    title: '불필요한 요청을 찾아 줄입니다',
    body: '같은 API를 여러 번 부르거나, 첫 화면에 필요 없는 데이터까지 한 번에 받는 코드를 찾아 요청의 순서와 단위를 다시 짭니다.',
  },
  {
    title: '실패해도 깨지지 않는 흐름을 만듭니다',
    body: '결제·구독처럼 중간에 끊기면 안 되는 흐름에서 실패 상황을 먼저 정리하고, 다시 시도하거나 스스로 복구되도록 만듭니다.',
  },
  {
    title: '프론트와 백엔드 사이의 응답 형식을 직접 설계합니다',
    body: '화면에서 다루기 어려운 응답 구조는 프론트에서 억지로 맞추지 않고, 바꿀 형식을 문서로 제안해 백엔드와 합의합니다.',
  },
  {
    title: '팀이 같이 쓰는 기준을 만듭니다',
    body: '먼저 정리한 구조와 규칙을 문서로 남겨, 동료들이 같은 방식으로 작업할 수 있게 합니다.',
  },
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
    secondary: ['Sentry', 'expo-iap', 'EAS', 'Genkit', 'Claude Code'],
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
