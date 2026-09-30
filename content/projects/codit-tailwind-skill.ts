import type { Project } from '../schema'

/**
 * 완료 판정 기준은 스타일 값 비교 하나다. ACTION 의 확인 절차에는 화면 비교도 있지만 그건
 * 절차 설명이지 판정 기준이 아니다. AFTER 와 tw-migration-check 에 화면 비교를 넣지 않는 이유다.
 */
export const coditTailwindSkill: Project = {
  id: 'codit-tailwind-skill',
  companyId: 'codit',
  productId: 'codit-platform',
  name: 'Tailwind 마이그레이션 작업 표준화',
  headline: '{m:tw-migration-backlog}의 Tailwind 전환을 스킬 하나로 표준화',
  role: '설계·구현 리드',
  roleDetail: '마이그레이션 규칙과 검증 절차를 정해 스킬로 정리',
  contribution: '완료 판정 기준을 먼저 정하고, 그 기준에 맞춘 에이전트 하네스를 설계',
  stack: ['Claude Code', 'Tailwind'],
  metricIds: ['tw-migration-backlog', 'tw-migration-check'],
  highlight:
    '스타일 값 비교를 완료 기준으로 정하고 변환 규칙·검증 절차를 SKILL.md로 설계해, 팀이 /styled-to-tailwind 명령 하나로 쓰도록 공유',
  depth: 'supporting',
  kind: 'build',
  narrative: {
    problem:
      '저장소에 styled-components, SCSS, Tailwind 세 방식이 섞여 있었다. styled-components를 참조하는 파일이 222개, .scss 파일이 60개 남아 있었고, 파일을 옮길 때마다 어디까지 손대고 어디를 그대로 둘지 사람이 그때그때 프롬프트로 정하고 있었다.',
    insight:
      '변환 자체는 AI로도 된다. 남는 문제는 결과가 원래 화면과 같은지 확인하는 쪽이다. 특히 상태나 props에 따라 달라지는 스타일은 코드만 봐서는 판단할 수 없고 실제로 렌더링해서 상태별로 확인해야 한다. 그리고 그 절차를 매번 대화로 설명하면 세션마다 판정이 달라진다. 변환을 맡기는 것보다 확인하는 방법을 하네스에 고정해두는 게 먼저였다.',
    decision: {
      chosen:
        '변환보다 결과 확인이 오래 걸린다고 판단했다. 검증 절차와 완료 조건을 먼저 정하고, 그걸 .claude/skills/styled-to-tailwind/SKILL.md 한 파일에 담아 저장소에 커밋했다. 팀은 /styled-to-tailwind 명령 하나로 같은 절차를 불러 쓴다',
      rejected: [
        {
          option: '파일을 만질 때마다 그때그때 애드혹 프롬프트로 요청하고 직접 확인하기',
          reason:
            '지금까지 하던 방식이다. 한두 파일은 되지만 절차가 세션마다 달라지고 확인을 매번 사람이 해야 해서 남은 파일 전체로 확장하기 어렵다',
        },
        {
          option: '일반적인 Tailwind 변환 방법을 스킬 본문에 담기',
          reason:
            '모델이 이미 아는 내용이라 컨텍스트만 차지하고, 정작 이 저장소에서만 통하는 값이 그 안에 묻힌다',
        },
      ],
      constraint:
        'styled-components 참조 222개 파일과 .scss 60개가 남은 상태 / 서비스 중단 없이 조금씩 옮겨야 함 / FE 3명이 서비스 개발과 병행 / 저장소 공통 가이드(AGENTS.md)는 이미 있어 스킬은 그 위에 얹히는 작업 단위 계층',
    },
    action: [
      'SKILL.md 하나에 변환 규칙·검증 절차·완료 조건을 담아 저장소에 커밋. frontmatter description에 "styled-components를 tailwind로", "스타일 마이그레이션" 같은 트리거 문구를 넣어, 팀이 명령어를 외우지 않아도 해당 작업일 때 스킬이 자동으로 로드되게 함',
      '이 저장소에서만 통하는 값을 스킬 본문에 고정. 토큰의 단일 원본은 global.css의 @theme, 스페이싱 스케일은 1px 단위, 브레이크포인트는 lg=1020처럼 커스텀 오버라이드된 named variant 우선. 값이 애매하면 모델이 추측하지 않고 지정된 파일을 열어 확인하도록 함',
      '검증을 claude-in-chrome으로 고정. 파일을 고치기 전에 baseline부터 캡처하고(스크린샷 + 브라우저가 계산한 스타일 값 스냅샷), 변환 후 같은 UI 상태를 재현해 두 스냅샷 문자열을 비교. hover, focus, 비활성, 모달 열림 같은 상태를 각각 캡처하도록 명시',
      '스냅샷 비교가 성립하도록 불변 규칙을 문서 맨 앞에 박음. DOM 태그와 구조를 바꾸지 않는다(구조 보존이 값 비교의 전제), 불확실한 스타일을 임의로 정리하지 않는다, 확신이 안 서면 TODO(tw-migration) 태그로 남겨 나중에 grep으로 찾게 한다',
      '완료 조건을 체크리스트로 고정. 스타일 값 비교 결과 차이 없음, 타입 검사 통과, 옛 스타일 참조가 남아 있지 않을 것, 지운 .scss를 쓰는 곳이 없을 것',
      '/loop 명령으로 폴더 하나씩 배치 실행. 배치 모드에서는 자기 라우트(URL)를 갖는 페이지 레벨 컴포넌트만 파일별 브라우저 검증을 하고, 조준할 URL이 없는 리프·공통 컴포넌트는 그 컴포넌트를 품은 페이지 단위로 묶어 확인하도록 분기. 파일별 게이트는 타입 검사로 두어, 연속 처리할 때 확인이 병목이 되지 않게 한 절충',
    ],
    beforeAfter: {
      before:
        '파일을 만지다 Tailwind가 아니면 그 자리에서 애드혹 프롬프트로 옮기고 결과는 직접 확인했다. 절차가 매번 달라져 한 번에 한두 개씩만 가능했고 남은 파일 전체는 손대지 못했다.',
      after:
        '변환 규칙과 검증 절차가 스킬 파일 하나로 고정되어 팀이 같은 방식으로 작업하고, 폴더 단위로 배치 실행할 수 있다. 완료 여부는 스타일 값 비교로 판정된다.',
    },
    result:
      '저장소에 커밋되어 팀이 명령 하나로 사용할 수 있게 됐고, 폴더 단위로 배치를 돌려 옮길 수 있게 되었다.',
    learning:
      '반복 작업을 에이전트에 맡길 때 병목은 변환이 아니라 검증이다. "잘 됐는지 봐 달라"는 매번 판정이 달라져서 배치로 돌릴 수 없다. 판정 기준을 사람 눈이 아니라 비교 가능한 값으로 바꿔야 자동 반복이 성립한다.',
  },
}
