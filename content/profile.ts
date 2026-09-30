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
  'React, Next.js와 React Native로 웹·앱 제품을 설계·구현했습니다. 데이터를 불러오는 구조를 다듬어 사용자가 기다리는 시간을 줄이고, 팀이 함께 쓰는 도구와 규칙을 정리해 협업 효율화에 기여했습니다.'

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
    primary: ['React', 'Next.js', 'React Native', 'Expo', 'Tailwind'],
    secondary: [],
  },
  {
    category: 'State · Data',
    primary: ['TanStack Query', 'Zustand'],
    secondary: ['Recoil'],
  },
  {
    category: 'Dev · Ops',
    primary: ['EAS', 'Claude Code'],
    secondary: ['Storybook', 'Sentry', 'expo-iap', 'Genkit'],
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
  '일하면서 반복되는 불편을 그냥 넘기지 않고, 바꿀 방법을 정리해 먼저 제안합니다.'

export const collaborations: Collaboration[] = [
  {
    audience: 'PM · 스프린트 운영',
    body: "큰 티켓 하나에 하위작업을 계속 붙이는 방식이라 어떤 작업이 어디에 묶여 있는지 파악하기 어려웠고, 보드는 할 일·진행 중·완료 세 칸뿐이라 Dev Completed·TEST SERVER 상태가 보이지 않았습니다. 기능을 스토리로 만들고 하위작업으로 쪼개 단위를 줄이는 방식과, 진행 중 다음에 '개발 완료' 컬럼을 두고 두 상태를 매핑하는 안을 PM에게 제안했습니다. 이후 관련 작업을 찾기 쉬워졌고, 활성 스프린트 진행 상황을 보드 한 화면에서 관리하게 됐습니다.",
  },
  {
    audience: 'BACKEND · 응답 형식',
    body: '응답 형식이 바뀔 때마다 프론트 파서를 고쳐야 했습니다. 현재 문제와 바꿔야 하는 이유, 새 형식을 정리해 제안했고, 블록 단위 SSE 이벤트 9종으로 합의했습니다. 프론트는 처리 로직을 새로 짜면서 수동 파서 1,281줄을 걷어냈습니다.',
  },
  {
    audience: 'DESIGN · 아이콘 정리',
    body: 'CODIT 플랫폼의 아이콘이 화면마다 제각각이었습니다. 디자이너에게 아이콘을 한곳에 정의하자고 제안하고, 팀에는 정의된 아이콘에 맞춘 사용 규칙을 제안했습니다. 쓰지 않는 아이콘은 빠지고 제각각이던 아이콘은 정의된 아이콘으로 교체되면서, 플랫폼 전체 아이콘이 통일됐습니다.',
  },
]
