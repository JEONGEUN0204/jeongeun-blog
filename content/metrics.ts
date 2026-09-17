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
