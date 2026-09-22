import type { Project } from '../schema'

/**
 * 완료 판정 기준은 스타일 값 비교 하나다. ACTION 의 확인 절차에는 화면 비교도 있지만 그건
 * 절차 설명이지 판정 기준이 아니다. AFTER 와 tw-migration-check 에 화면 비교를 넣지 않는 이유다.
 */
export const coditTailwindSkill: Project = {
  id: 'codit-tailwind-skill',
  companyId: 'codit',
  parentId: 'codit-codit',
  name: 'Tailwind 마이그레이션 작업 표준화',
  role: '설계·구현 리드',
  roleDetail: '마이그레이션 방식과 확인 절차를 정하고 문서로 작성',
  contribution: '확인 절차를 먼저 정하고 그에 맞춘 작업 문서를 설계',
  stack: {
    primary: ['Claude Code', 'Tailwind'],
    secondary: [],
  },
  metricIds: ['tw-migration-backlog', 'tw-migration-check'],
  depth: 'supporting',
  kind: 'build',
  narrative: {
    problem:
      '저장소에 styled-components, SCSS, Tailwind 세 방식이 섞여 있었다. styled-components를 참조하는 파일이 222개, .scss 파일이 60개 남아 있었고, 파일을 옮길 때마다 어디까지 손대고 어디를 그대로 둘지 사람이 그때그때 정하고 있었다.',
    insight:
      '변환 자체는 AI로도 된다. 남는 문제는 결과가 원래 화면과 같은지 확인하는 쪽이다. 특히 상태나 props에 따라 달라지는 스타일은 코드만 봐서는 판단할 수 없고 실제로 렌더링해서 상태별로 확인해야 한다. 그래서 변환을 맡기는 것보다 확인하는 방법을 정해두는 게 먼저였다.',
    decision: {
      chosen:
        '변환보다 결과 확인이 오래 걸린다고 봤다. 확인 절차를 먼저 정하고, 그에 맞춘 작업 문서를 만들어 팀이 명령 하나로 불러 쓰게 했다',
      rejected: [
        {
          option: '파일을 만질 때 그때그때 AI에 요청하고 직접 확인하기',
          reason:
            '지금까지 하던 방식이다. 한두 파일은 되지만 확인을 매번 사람이 해야 해서 남은 파일 전체를 옮길 엄두가 나지 않는다',
        },
        {
          option: '일반적인 Tailwind 변환 방법을 문서에 담기',
          reason: 'AI가 이미 아는 내용이라 적어봐야 이 저장소에서만 통하는 값이 묻힌다',
        },
      ],
      constraint:
        'styled-components 참조 222개 파일과 .scss 60개가 남은 상태 / 서비스 중단 없이 조금씩 옮겨야 함 / FE 3명이 서비스 개발과 병행',
    },
    action: [
      '변환 기준과 확인 절차를 문서로 만들어 저장소에 넣고, 팀이 명령으로 호출할 수 있게 구성',
      '이 저장소에서만 통하는 설정값을 문서에 담아, 값이 애매할 때 추측하지 않도록 함',
      '확인 절차에 브라우저가 계산한 스타일 값 비교와 화면 비교를 모두 넣고, hover, focus, 비활성 같은 상태별로 각각 확인하도록 정함',
      '완료 조건을 목록으로 고정. 스타일 값 비교 결과 차이 없음, 타입 검사 통과, 옛 스타일 참조가 남아 있지 않을 것, 지운 .scss를 쓰는 곳이 없을 것',
      '자체 화면이 없는 공통 컴포넌트는 그 컴포넌트가 쓰인 페이지 단위로 묶어 확인하도록 분기. 많은 파일을 연속으로 처리할 때 확인이 병목이 되지 않게 한 절충',
    ],
    beforeAfter: {
      before:
        '파일을 만지다 Tailwind가 아니면 그때 옮기고 결과는 직접 확인했다. 한 번에 한두 개씩만 가능해서 남은 파일 전체는 손대지 못했다.',
      after:
        '변환 기준과 확인 절차가 문서로 고정되어 팀이 같은 방식으로 작업할 수 있고, 완료 여부가 스타일 값 비교로 판정된다.',
    },
    result:
      '저장소에 반영되어 팀이 명령 하나로 사용할 수 있게 됐다. 변환 소요 시간과 문제 발생률은 아직 측정하지 않았다. 남은 파일을 옮기면서 확인할 계획이다.',
    learning:
      '반복 작업을 AI에 맡길 때 병목은 변환이 아니라 확인이다. "잘 됐는지 봐 달라"는 매번 결과가 달라져서 많은 파일에 쓸 수 없다.',
  },
}
