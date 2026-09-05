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
    label: '조회 로직 캐싱 최적화',
    kind: 'tech',
    evidence: 'TBD',
    businessImpact: 'TBD',
  },
  {
    id: 'ezl-crash-free',
    value: '+3%p',
    label: 'Crash Free Rate 향상',
    kind: 'tech',
    evidence: 'TBD',
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
    value: '1,281줄 제거',
    label: '수동 스트리밍 파서',
    kind: 'tech',
    evidence: 'TBD',
    businessImpact: 'TBD',
  },
  {
    id: 'ezl-mau',
    value: 'MAU 30만',
    label: '이즐충전소 월간 활성 사용자',
    kind: 'business',
    evidence: 'TBD',
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
export const resumeMetricIds = ['ezl-inquiry-api', 'ezl-crash-free', 'zero-to-one', 'web-app-scope']
