import type { Project } from '../schema'

/**
 * 예전에는 data/careers/codit.mdx 02 와 data/projects/codit-codit.mdx 가 이 작업을 손으로 적어 두었다.
 * 이 파일이 원천이 되면서 둘 다 걷어냈다. 그쪽에만 있던 'Suspense L1/L3 계층화' ·
 * '첫 진입 폴백 최소화' 는 확인 질문에서 빠져도 된다는 답을 받았다.
 *
 * 스택은 입력 블록(secondary: Recoil)이 아니라 확인 질문에서 받은 답(Zustand)을 따른다.
 * 예전 02 섹션의 Tailwind CSS · i18next 는 이 작업의 스택이 아니라는 답을 받아 넣지 않는다.
 *
 * name · decision.constraint · learning 은 입력 블록에 없어 TBD 다. Narrative 컴포넌트가 TBD 를
 * 거르지 않아 /careers · /portfolio 에 그대로 보이고, verify 는 name 만 보고한다.
 * decision.rejected 는 따로 검토한 대안이 없어 비운다 (supporting 이라 verify 통과).
 */
export const coditAppShell: Project = {
  id: 'codit-appshell',
  companyId: 'codit',
  productId: 'codit-platform',
  name: 'TBD',
  role: '단독 담당',
  roleDetail:
    '화면 전환 로딩 문제를 직접 발견해 원인 파악부터 AppShell 구조 설계·구현·전후 측정까지 담당',
  contribution:
    '문제를 직접 발견하고 AppShell 구조를 제안·결정. 헤더 이동, Suspense 경계 분리, 모바일 BootFallback, 세션 prefetch를 구현',
  stack: {
    primary: ['React', 'TypeScript', 'TanStack Query'],
    secondary: ['Zustand'],
  },
  metricIds: ['codit-header-refetch'],
  depth: 'supporting',
  kind: 'improvement',
  narrative: {
    problem:
      '화면을 옮길 때마다 헤더까지 사라지고 흰 배경에 BallBeat 로딩만 떠서, 실제보다 기다리는 시간이 길게 느껴졌다.',
    insight:
      '로딩 시간보다 로딩 중에 보이는 화면이 문제였다. 헤더가 라우트 안에 있어서 Suspense 폴백이 헤더까지 덮고 있었다.',
    decision: {
      chosen:
        '헤더·알림·디바이스 모달을 AppShell로 올려 라우트 바깥에서 한 번만 마운트하고, 전역 Suspense 경계를 계층으로 나눴다.',
      rejected: [],
      constraint: 'TBD',
    },
    action: [
      '헤더·알림·디바이스 모달을 라우트 트리 밖 AppShell로 옮겨 한 번만 마운트되게 변경',
      '전역 Suspense 경계를 계층으로 나눔',
      '모바일 화면에 같은 구조를 적용하고, 앱 첫 부팅용 BootFallback을 따로 분리',
      '세션 조회를 미리 불러오도록 prefetch 추가',
      '적용 전후 커밋을 나란히 띄워 전환 중 요청 수와 헤더 유지 여부를 측정',
    ],
    beforeAfter: {
      before:
        '화면 전환 시 헤더까지 사라지고 흰 배경에 BallBeat만 표시됨. 전환할 때마다 헤더 API 2건이 다시 호출됨',
      after: '처음 들어가는 라우트 6곳 모두 전환 중 헤더가 유지됨. 전환 시 헤더 API 호출 0건',
    },
    result:
      '화면 전환 중에도 헤더가 유지되고, 헤더가 다시 마운트되지 않으면서 전환 1회당 헤더 API 호출이 2건에서 0건으로 줄었다.',
    learning: 'TBD',
  },
}
