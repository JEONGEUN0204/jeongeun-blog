import type { Project } from '../schema'

/**
 * 서술은 narrative 가 원천이다. /portfolio 는 supporting 카드(문제·관점·선택·결과)를,
 * /careers 는 ezllabs.mdx 의 02 자리(<ProjectNarrative>)에서 7단 요약을 렌더한다.
 *
 * kind 는 'build' 에서 'improvement' 로 바꿨다. 신규 메뉴 구축도 맡았지만 7단 서술이 다루는 건
 * 이미 운영 중이던 백오피스의 에러 처리 구조 개선이다.
 *
 * 스택은 확인 답변으로 받은 목록을 따른다 — 입력 블록에 함께 있던 MUI·react-hook-form·Vite 는 뺀다.
 *
 * 예전 data/projects/ezl-backoffice.mdx 와 data/careers/ezllabs.mdx 02 에만 있던
 * '가독성·유지보수성·일관성 향상' 과 '다운로드 내역·비밀번호 초기화' 는 입력 블록에 없는 주장이라
 * 서술을 이쪽으로 옮기면서 함께 걷어냈다.
 *
 * learning 은 입력 블록에 없어 TBD 다. Narrative 컴포넌트가 TBD 를 거르지 않아 /careers 에 그대로 보인다.
 * decision.rejected 는 따로 검토한 대안이 없어 비운다 (supporting 이라 verify 통과).
 */
export const ezlBackoffice: Project = {
  id: 'ezl-backoffice',
  companyId: 'ezllabs',
  productId: 'ezl-backoffice',
  name: '백오피스',
  role: '기능 담당',
  roleDetail:
    '이즐충전소 운영용 관리자 페이지(CS팀·운영팀 사용)의 신규 메뉴 구축, 에러 처리 구조 개선, 운영 이슈 대응',
  contribution:
    '이미 운영 중인 백오피스에 카드 배경 관리·포인트 조회·URL 관리·룰렛 등 신규 화면을 만들고, API 스펙 변경 대응과 버그 수정을 맡았다. 에러 처리에서는 react-error-boundary를 저장소에 처음 도입해 목록 단위 에러 경계를 7개 도메인에 적용하고 공통 ErrorFallback 컴포넌트를 작성했다. 커스텀 에러 객체(EnhancedError)와 throwOnError 전역 설정은 동료가 만들었고, 이를 fallback 전반에 적용하는 일을 했다.',
  stack: {
    primary: ['React', 'TypeScript', 'React Query', 'react-error-boundary'],
    secondary: ['Recoil', 'AG Grid'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'improvement',
  narrative: {
    problem:
      "목록 조회 에러를 페이지 훅마다 isError → useEffect → isAxiosError 분기로 스낵바에 띄우는 코드가 도메인 이름만 바꿔 반복돼 있었다. 에러가 나도 빈 목록이 그대로 남아 '데이터 없음'과 '불러오기 실패'가 구분되지 않았고, 스낵바를 놓치면 다시 불러올 방법이 없었다.",
    insight:
      '에러를 보여줄 범위를 페이지가 아니라 실패한 목록으로 좁히면, 필터와 등록 버튼은 살아 있어 조건을 바꿔 다시 검색할 수 있다.',
    decision: {
      chosen:
        '목록·그리드 컴포넌트만 ErrorBoundary로 감싸고 필터·등록 버튼·breadcrumb은 경계 밖에 둔다. QueryErrorResetBoundary의 reset을 onReset에 연결해 재시도 버튼으로 다시 불러오게 한다.',
      rejected: [],
      constraint:
        '라우트 단위 에러 화면(errorElement, 다른 개발자가 만든 것)이 이미 있어, 그 구조는 그대로 두고 아래에 목록 단위 층을 추가해야 했다.',
    },
    action: [
      'react-error-boundary를 저장소에 처음 추가하고 카드 배경 목록에 첫 적용',
      '공지·이벤트·뉴스레터, FAQ·이용가이드, 이즐워크, 긴급 관리, URL 관리, 포인트 관리로 확대 (2024.08 ~ 2024.09, 전용 PR 8건)',
      'QueryErrorResetBoundary의 reset을 ErrorBoundary onReset에 연결해, 재시도 버튼이 쿼리 에러 상태를 지우고 다시 요청하게 함',
      '동료가 만든 EnhancedError를 fallback 전반에 적용하고 공통 ErrorFallback 컴포넌트를 작성해, 화면마다 에러 문구를 따로 쓰지 않게 함',
    ],
    beforeAfter: {
      before:
        '페이지 훅마다 같은 에러 분기 코드가 반복되고, 실패 시 빈 목록 위에 스낵바만 잠깐 떴다가 사라짐',
      after:
        "실패한 목록 자리에만 '무엇을 불러오지 못했는지' 문구, 서버 메시지, 재시도 버튼이 표시되고 필터·등록 버튼은 그대로 사용 가능",
    },
    result:
      '7개 도메인에 목록 단위 에러 경계를 적용했다. 일주일 뒤부터 동료 개발자가 같은 파일 규칙과 구성으로 다른 화면을 작성했고, 2025.09에는 동료가 쓴 기능별 README에 기본 구조로 실렸다.',
    learning: 'TBD',
  },
}
