import type { Project } from '../schema'

/**
 * 서술은 narrative 가 원천이다. /portfolio 는 supporting 카드(문제·관점·선택·결과)를,
 * /careers 는 ezllabs.mdx 의 01 자리(<ProjectNarrative>)에서 7단 요약을 렌더한다.
 *
 * 7단 서술은 이즐워크 조회 API 작업 하나만 다룬다. 충전 실패 재시도 플로우와 Sentry 대응은
 * 입력 블록에 서술이 없어 roleDetail·contribution 에만 있다 — 예전 MDX 의 '환불'·'중복 결제 차단'·
 * 'CS 인입 감소' 는 입력 블록에 없는 주장이라 함께 걷어냈다.
 *
 * decision.rejected·constraint 는 입력 블록이 '없음' 으로 준 값이다. 빈칸(TBD)이 아니다.
 */
export const ezlCharge: Project = {
  id: 'ezl-charge',
  companyId: 'ezllabs',
  name: '이즐충전소',
  role: '기능 담당',
  roleDetail: '이즐워크 조회 API 호출 개선·충전 실패 재시도 플로우 구현·Sentry 이슈 대응',
  contribution:
    '이즐워크 API 호출 개선은 원인 파악부터 구현까지 혼자 진행. 충전 실패 재시도 플로우는 기획을 받아 결과 코드별 분기(처음부터 재충전·미완료 거래 NFC 재처리·카드 불일치 재시도)를 구현. Sentry 이슈 확인·수정은 팀원과 나눠서 담당. Kotlin·Swift는 SDK 연동 코드 일부만 작성',
  // Kotlin·Swift 는 SDK 연동 코드 일부만 작성해 스택에서 뺐다 (contribution 참고).
  stack: {
    primary: ['React Native', 'TypeScript', 'React Query'],
    secondary: ['Recoil'],
  },
  metricIds: ['ezl-inquiry-api', 'ezl-crash-free', 'ezl-mau'],
  depth: 'supporting',
  kind: 'improvement',
  narrative: {
    problem:
      '이즐충전소 앱의 이즐워크(걸음 수를 코인으로 전환) 페이지에서 일일·연속 미션 조회 API가 한 번 들어갈 때 4번씩 호출됐고, 연속 미션 보상 받기 버튼을 연달아 누르면 에러 메시지가 떴다',
    insight:
      '조회 API를 useMutation으로 호출하고 있어서 상태가 바뀔 때마다 같은 요청이 다시 나갔고, 결과도 캐시에 남지 않았다',
    decision: {
      chosen:
        '호출 위치와 필요 여부를 정리한 뒤 미션 조회를 useQuery로 바꿔 캐시로 공유하고, 연속 미션 보상 받기 버튼은 첫 클릭만 처리하고 이후 클릭은 막는다',
      rejected: [],
      constraint: '없음',
    },
    action: [
      'React Query Devtools로 페이지 진입 시 API 호출 흐름 확인',
      'API를 호출하는 위치와 각 호출이 필요한지 정리',
      'useMutation으로 부르던 미션 조회를 useQuery로 바꿔 캐시로 공유',
      '보상 받기 버튼이 혜택 화면과 상세 팝업 두 곳에 있고 팝업은 열 때 넘긴 값이 고정돼서, 눌림 상태를 Recoil atom으로 두고 두 버튼이 같은 값으로 비활성화되게 처리',
      '보상 요청 중에는 로딩 스피너로 화면 입력을 막고, 성공하면 포인트와 연속 미션을 다시 조회한 뒤 스피너를 내림',
      '불필요한 호출 코드 삭제',
    ],
    beforeAfter: {
      before:
        '이즐워크 페이지 진입 1회당 미션 조회 API 4회 호출, 연속 미션 보상 받기 버튼 연속 클릭 시 에러 메시지 노출',
      after: '진입 1회당 미션 조회 API 1회 호출, 연속 클릭 시 에러 메시지 노출되지 않음',
    },
    result:
      '페이지 진입당 미션 조회 API 호출을 4회에서 1회로 줄이고, 보상 버튼 연속 클릭 에러를 없애고, 불필요한 호출 코드를 삭제',
    learning:
      'API를 쓰기 전에 조회인지 변경인지부터 구분해야, 요청 시점을 직접 관리하지 않고 캐시에 맡길 수 있다는 걸 배웠다',
  },
}
