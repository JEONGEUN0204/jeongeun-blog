import type { Project } from '../schema'

/**
 * 서술은 narrative 가 원천이다. /portfolio 는 supporting 카드(문제·조치·결과)를,
 * /careers 는 ezllabs.mdx 의 03 자리(<ProjectNarrative>)에서 요약을 렌더한다.
 *
 * 요청받은 구현이라 관점·선택·배움에 넣을 내용이 없어(셋 다 TBD 였다) ShortNarrative(문제·조치·결과)로
 * 옮겼다(2026-09-30). 예전 constraint('합류 전부터 운영 중이던 디자인 시스템 위에서 작업. 토큰 구조와
 * 스타일링 방식은 이미 정해져 있었음')는 칸이 없어져 빠졌다.
 *
 * 예전 data/projects/ezl-design-system.mdx 본문과 data/careers/ezllabs.mdx 03 에 있던
 * '개발 시간을 단축' 은 입력 블록에 없는 주장이라 서술을 이쪽으로 옮기면서 걷어냈다.
 * 입력 블록이 준 것은 '개발자가 Storybook 화면에서 props 를 바꿔가며 확인' 까지다.
 *
 * result 의 '앱 릴리스 커밋 57건이 CI 계정으로 처리됨' 은 입력 블록에 있었지만 빼달라고 해서 뻐다.
 * /resume 의 content/experience.ts 하이라이트에서도 같이 빼신다 — 두 곳이 갈라지면 그게 다음 불일치다.
 */
export const ezlDesignSystem: Project = {
  id: 'ezl-design-system',
  companyId: 'ezllabs',
  productId: 'ezl-design-system',
  name: '디자인 시스템',
  role: '기능 구현',
  roleDetail: '결제·교통카드 도메인 컴포넌트 구현과 Storybook 앱 배포 자동화 담당',
  contribution:
    '요청받은 신규 컴포넌트 6종 구현과 기존 컴포넌트 8종 확장, Storybook 앱 자동 배포 파이프라인 구축, Storybook Controls 적용',
  stack: ['React Native', 'TypeScript', 'Expo', 'EAS', 'Storybook', 'Jenkins'],
  metricIds: [],
  highlight:
    '신규·확장 컴포넌트를 구현해 이즐충전소 앱과 모바일 이즐 앱에 반영하고, main 머지만으로 Storybook 앱 버전 증가·EAS 빌드가 도는 배포 파이프라인 구축',
  depth: 'supporting',
  kind: 'build',
  narrative: {
    problem:
      '이즐충전소 앱과 모바일 이즐 앱이 함께 쓰는 디자인 시스템에 도메인 컴포넌트가 추가로 필요했다. 컴포넌트 확인용 Storybook 앱은 수동으로 배포하고 있었고, 스토리에서 props 값을 바꿔 보려면 코드를 직접 수정해야 했다.',
    action: [
      '결제·교통카드 도메인 신규 컴포넌트 6종 구현(결제 카드 목록, 교통카드 피드 카드, 드롭다운, 분실 카드 표시 영역 등)',
      '기존 컴포넌트 8종 확장(버튼 배열·CTA 문구 지원, 입력 필드 읽기 전용 처리, 안내 문구 타입 추가, props·레이아웃 수정)',
      'Jenkins 파이프라인을 새로 작성해 main 머지 시 앱 버전·빌드 번호를 올리고 EAS 빌드가 실행되도록 구축',
      'Storybook Controls를 적용해 화면에서 컴포넌트 props 값을 조정하며 미리 볼 수 있게 함',
    ],
    beforeAfter: {
      before:
        '레포에 Storybook 앱 배포용 CI 설정 없음. 스토리에서 props를 바꿔 보려면 코드를 수정해야 했음',
      after:
        'main 머지만으로 버전 증가와 EAS 빌드까지 자동 진행. 개발자가 Storybook 화면에서 props를 바꿔가며 컴포넌트 확인',
    },
    result:
      '신규·확장 컴포넌트를 이즐충전소 앱과 모바일 이즐 앱에 반영했다. 수동으로 하던 Storybook 앱 배포를 자동화해 main 머지만으로 배포되고, Storybook 화면에서 props 값을 조정하며 컴포넌트를 바로 미리 볼 수 있게 됐다.',
  },
}
