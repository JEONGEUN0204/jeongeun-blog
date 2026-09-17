import { ReactNode } from 'react'
import Label, { type LabelKind } from './Label'

const defaultLabel: Record<LabelKind, string> = {
  problem: 'PROBLEM',
  approach: 'APPROACH',
  result: 'RESULT',
  neutral: '',
}

/**
 * 컬러 라벨 칩 + 본문을 한 덩어리로 묶는다.
 *
 * `label`을 주면 PDF에 실제로 등장하는 변형("APPROACH — 새 SSE 프로토콜 설계",
 * "결제 검증 PROBLEM" 등)도 그대로 표현할 수 있다.
 */
export default function Block({
  kind,
  label,
  children,
}: {
  kind: LabelKind
  label?: string
  children: ReactNode
}) {
  return (
    <div className="my-5 break-inside-avoid-page">
      <Label kind={kind}>{label ?? defaultLabel[kind]}</Label>
      <div className="mt-2 [&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </div>
  )
}
