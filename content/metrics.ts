import type { Metric } from './schema'

/**
 * 검증된 수치의 단일 원천. 이 목록 밖의 숫자는 문서에 쓰지 않는다.
 *
 * evidence 는 화면에 렌더하지 않는다. "그건 어떻게 측정하신 거죠?"에 답하기 위한
 * 자리이고, TBD 로 남은 항목은 `npm run verify` 가 매번 목록으로 보고한다.
 */
export const metrics: Metric[] = [
  {
    id: 'ezl-inquiry-api',
    value: 'API 75%↓',
    // label 은 입력 블록에 없어 기존 값을 유지한다.
    label: '조회 로직 캐싱 최적화',
    kind: 'tech',
    evidence:
      'React Query Devtools로 이즐워크 페이지 진입 1회당 일일·연속 미션 조회 API 호출 수 비교 (4회 → 1회)',
    businessImpact: 'TBD',
  },
  {
    id: 'ezl-crash-free',
    value: 'Crash Free Rate +3%p',
    // label 은 입력 블록에 없어 기존 값을 유지한다.
    // 전후 수치·비교 기간·기준이 기록돼 있지 않아 /resume 상단 카드(resumeMetricIds)에서는 뺐다.
    label: 'Crash Free Rate 향상',
    kind: 'tech',
    evidence:
      '재직 중 Sentry 대시보드에서 확인. 전후 수치·비교 기간·세션/사용자 기준은 기록 없음. Sentry는 기존에 도입돼 있었고, 이슈 확인·수정을 팀원과 나눠 맡았으며 발생 건수 위주로 대응. 재현되지 않는 이슈가 많았음',
    businessImpact: 'TBD',
  },
  {
    id: 'zero-to-one',
    value: '0 → 1',
    label: '웹·앱 신규 구축·운영',
    kind: 'scope',
    evidence: 'ChatCODIT Web React → Next.js 신규 구축, ChatCODIT App iOS·Android 1.0.0 출시',
  },
  {
    id: 'web-app-scope',
    value: 'Web · App',
    label: '웹·앱 전 영역 개발',
    kind: 'scope',
    evidence: '코딧 Web·App, 이즐랩스 앱·백오피스·디자인 시스템·내부 AI',
  },
  {
    id: 'sse-parser-lines',
    value: '수동 파싱 로직 파일 제거(1,281줄)',
    // label 은 입력 블록에 없어 기존 값을 유지한다.
    label: '수동 스트리밍 파서',
    kind: 'tech',
    evidence: 'git 커밋 이력, 제안 문서의 기존 파서 분석',
    businessImpact: 'TBD',
  },
  {
    id: 'sse-protocol-scope',
    value: '전송 규격 재설계 · 이벤트 9종',
    // label 은 입력 블록에 없어 TBD 다.
    label: 'TBD',
    kind: 'scope',
    evidence: '제안 문서의 이벤트 정의',
  },
  {
    id: 'ezl-mau',
    value: 'MAU 30만',
    label: '이즐충전소 월간 활성 사용자',
    // 입력 블록의 kind 는 TBD 였다. MetricKind 가 TBD 를 받지 않아 기존 값 business 를 유지한다.
    kind: 'business',
    evidence: '재직 중 Firebase 콘솔 Analytics 대시보드에서 확인. 기준 시점은 기록 없음',
  },
  // codit-tailwind-skill 지표 2건
  {
    id: 'tw-migration-backlog',
    value: 'styled-components 222개 파일 · .scss 60개',
    label: '남은 마이그레이션 대상',
    kind: 'scope',
    evidence: '저장소 검색 집계',
  },
  {
    id: 'tw-migration-check',
    value: '눈 확인 → 스타일 값 비교',
    label: '변환 결과 확인 방식',
    kind: 'tech',
    evidence: '문서에 명시한 완료 조건 4종',
    // 변환 소요 시간·문제 발생률 미측정. 사유를 값에 붙이면 verify 가 TBD 로 잡지 못해 주석으로 둔다.
    businessImpact: 'TBD',
  },
  // codit-appshell 지표 1건
  {
    id: 'codit-header-refetch',
    value: '헤더 API 전환당 2건 → 0건',
    // label 은 입력 블록에 없어 TBD 다.
    label: 'TBD',
    kind: 'tech',
    // 끝의 'StrictMode 여부: TBD' 는 문장 안에 있어 verify 가 잡지 못한다. 두 커밋 grep 결과를 받으면 교체한다.
    evidence:
      '적용 커밋 7e9d315658 vs 직전 커밋 7e3082e36 비교. staging 백엔드, 동일 계정, 언론↔대시보드 4회 전환, PerformanceResourceTiming으로 엔드포인트 전수 집계 (notice/new 4→0, shop/report 4→0, 그 외 콘텐츠 API는 동일). dev 빌드로 측정. 두 커밋의 StrictMode 여부: TBD',
    businessImpact: 'TBD',
  },
  // codit-dashboard 지표 2건. label 은 입력 블록에 없어 TBD 다.
  {
    id: 'codit-dashboard-lcp',
    value: 'LCP 66%↓',
    label: 'TBD',
    kind: 'tech',
    evidence:
      'dev 빌드(SSR 없음)·dev 백엔드·비로그인·데스크탑 1440×900, headless Chrome 캐시 없는 새 컨텍스트. 개편 전 / 개편 후에서 썸네일 대기만 되살린 변형(after-gate: useDashboardNewsList.ts 한 파일만 029f61c26 직전 내용으로 교체) / 개편 후 세 빌드를 번갈아 8회씩 측정, LCP 요소는 모두 뉴스 썸네일(IMG 210×120). 중앙값 개편 전 5,252ms → after-gate 1,804ms. 썸네일 대기 제거(029f61c26, 이 작업 범위 밖) 효과는 제외한 값. 개편 전과 after-gate 모두 데스크탑에서 썸네일 대기가 적용된 상태(after-gate는 useDashboardNewsList 안). 원인: 첫 응답 목록이 35건 → 9건으로 줄면서, 응답 속 모든 항목의 이미지를 받은 뒤 그리던 대기도 35장 → 9장으로 줄어 데이터 도착 → LCP 구간이 2,276ms → 785ms로 단축. 건수·썸네일 수는 bench/thumbs.js로 NOW_KOREA 응답을 가로채 셈(측정 직전 1회 캡처: 전체 35건 중 thumbnail 35, slide 0 9건 중 9, URL 모두 서로 다름). 벤치 도중 slide 0 응답 크기가 119.4KB(run 1~4) → 129.7KB(run 5~8)로 바뀌었고, 바뀐 뒤의 썸네일 수는 기록하지 않음. 뉴스 데이터 도착 시각 차이는 약 0.1초. 옆 슬라이드는 prefetch로 API JSON만 따로 받고 썸네일 대기는 걸리지 않음. 첫 진입 시 index 1 하나를 게이트 해제로 첫 슬라이드가 렌더된 직후 요청함(after-gate 8회 모두 slide 0 응답 종료 후 +552~+818ms, LCP 기록보다 19~31ms 앞). 그래서 전체 수신량은 줄지 않음(전송량 460KB → 463KB). dev 백엔드 응답 시간이 시간대마다 달라 같은 배치 안에서만 비교(이전 배치의 개편 전 값은 4,220ms). 모바일·로그인 맞춤형은 측정하지 않음',
    businessImpact: 'TBD',
  },
  {
    id: 'codit-dashboard-hooks',
    value: '쿼리 훅 33 → 7',
    label: 'TBD',
    kind: 'tech',
    evidence:
      'src/dashboard/apis/queries/ 파일 10개·훅 33개·758줄 → dashboard.query.ts 1개·훅 7개. 통합 후 공통 파라미터 추가 커밋 0ceb54664는 파일 3개 수정',
    businessImpact: 'TBD',
  },
]

export function getMetric(id: string): Metric {
  const metric = metrics.find((item) => item.id === id)
  if (!metric) throw new Error(`metrics.ts 에 없는 metricId: ${id}`)
  return metric
}

export function getMetrics(ids: string[]): Metric[] {
  return ids.map(getMetric)
}

/** /resume 상단 성과 카드. 순서가 곧 노출 순서다. */
export const resumeMetricIds = ['ezl-inquiry-api', 'zero-to-one', 'web-app-scope']
