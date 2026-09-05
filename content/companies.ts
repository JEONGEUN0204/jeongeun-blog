import type { Company, CompanyId, Period } from './schema'

/**
 * 회사·재직기간의 단일 원천.
 *
 * 세 문서가 각자 기간 문자열을 들고 있던 탓에 /resume 는 '약 8개월',
 * /careers 는 '약 10개월' 로 갈라져 있었다. 기간은 여기서만 정의한다.
 */
export const companies: Company[] = [
  {
    id: 'codit',
    name: '코딧 (Codit)',
    period: { start: '2025.11', end: 'present' },
    context: '정책·입법 데이터 플랫폼 「Codit」과 분리 서비스 「ChatCODIT」',
  },
  {
    id: 'ezllabs',
    name: '이즐랩스',
    period: { start: '2024.06', end: '2025.10' },
    context: 'MAU 30만 교통카드 충전·조회 서비스 「이즐충전소」',
  },
]

export function getCompany(id: CompanyId): Company {
  const company = companies.find((item) => item.id === id)
  if (!company) throw new Error(`companies.ts 에 없는 companyId: ${id}`)
  return company
}

/**
 * '2024.06 ~ 2025.10' / '2025.11 ~ 현재'.
 *
 * 개월 수는 계산하지도 표기하지도 않는다. 재직 개월 수는 매월 값이 바뀌어
 * 문서를 다시 손대게 만들고, 세 문서의 갱신 시점이 어긋나면 그대로 불일치가 된다.
 */
export function formatPeriod(period: Period): string {
  return `${period.start} ~ ${period.end === 'present' ? '현재' : period.end}`
}
