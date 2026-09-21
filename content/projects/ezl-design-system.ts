import type { Project } from '../schema'

/**
 * 서술은 narrative 가 원천이다. /portfolio 는 supporting 카드(문제·관점·선택·결과)를,
 * /careers 는 ezllabs.mdx 의 03 자리(<ProjectNarrative>)에서 7단 요약을 렌더한다.
 *
 * insight·decision.chosen·learning 은 입력 블록이 TBD 로 준 값이다. 지어내지 않고 그대로 둔다 —
 * Narrative 컴포넌트가 TBD 를 거르지 않아 /portfolio 카드의 '관점'·'선택' 칸과 /careers 요약에
 * 그대로 보인다. decision.rejected 는 따로 검토한 대안이 없어 비운다 (supporting 이라 verify 통과).
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
  name: '디자인 시스템',
  /**
   * 재직은 2024.06 ~ 2025.10, 디자인 시스템 작업은 2024.07 ~ 2025.07 로 앞뒤가 모두 다르다.
   * 회사 기간과 프로젝트 기간이 다른 의도된 구분이므로 여기서만 덮어쓴다.
   */
  periodOverride: { start: '2024.07', end: '2025.07' },
  role: '기능 담당',
  roleDetail:
    '사내 React Native 디자인 시스템 패키지에서 결제·교통카드 도메인 컴포넌트 구현과 Storybook 앱 배포 자동화 담당',
  contribution:
    '요청받은 신규 컴포넌트 6종 구현과 기존 컴포넌트 8종 확장, Storybook 앱 자동 배포 파이프라인 구축, Storybook Controls 적용',
  stack: {
    primary: ['React Native', 'TypeScript', 'Storybook'],
    secondary: ['Expo', 'EAS', 'Jenkins'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'build',
  narrative: {
    problem:
      '이즐충전소 앱과 모바일 이즐 앱이 함께 쓰는 디자인 시스템에 도메인 컴포넌트가 추가로 필요했고, 컴포넌트 확인용 Storybook 앱은 배포 파이프라인 없이 수동으로 배포하고 있었다',
    insight: 'TBD',
    decision: {
      chosen: 'TBD',
      rejected: [],
      constraint:
        '합류 전부터 운영 중이던 디자인 시스템 위에서 작업. 토큰 구조와 스타일링 방식은 이미 정해져 있었음',
    },
    action: [
      '신규 컴포넌트 구현: DropDowns, PaymentCardListItem, MobileCardMyCard, TransitCardFeedCard(서브컴포넌트 4개 포함), GuideBoxBottomText, PlateCard 분실 카드 표시 영역',
      '기존 컴포넌트 확장: MobileCardHome 버튼 배열·CTA 문구 지원, TextField editable/readOnly 전달과 HiddenTextField 입력 처리, Announcement bullet-caption 타입 추가, SettingListHeader·HistoryListItem·CardImage·MenuItem·GuideBox props와 레이아웃 수정',
      'Jenkins 파이프라인을 새로 작성해 main 머지 시 앱 버전·빌드 번호를 올리고 EAS 빌드가 실행되도록 구축',
      'Storybook Controls 적용',
    ],
    beforeAfter: {
      before:
        '레포에 Storybook 앱 배포용 CI 설정 없음. 스토리에서 props를 바꿔 보려면 코드를 수정해야 했음',
      after:
        'main 머지만으로 버전 증가와 EAS 빌드까지 자동 진행. 개발자가 Storybook 화면에서 props를 바꿔가며 컴포넌트 확인',
    },
    result: '신규·확장 컴포넌트가 이즐충전소 앱과 모바일 이즐 앱에 반영됨',
    learning: 'TBD',
  },
}
