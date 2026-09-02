import { ReactNode } from 'react'

export type LabelKind = 'problem' | 'approach' | 'result' | 'neutral'

/**
 * 원본 포트폴리오 PDF의 컬러 라벨 칩.
 *
 * PDF는 PROBLEM(연노랑) / APPROACH(연파랑) / RESULT(연민트)로 구획을 나눠
 * 문서를 스캔 가능하게 만든다. 같은 색 대응을 사이트에도 그대로 가져왔다.
 */
const kindStyles: Record<LabelKind, string> = {
  problem: 'bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200',
  approach: 'bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-200',
  result: 'bg-primary-100 text-primary-800 dark:bg-primary-400/15 dark:text-primary-300',
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export default function Label({ kind, children }: { kind: LabelKind; children: ReactNode }) {
  return (
    <span
      className={`not-prose inline-flex rounded-md px-3 py-1 text-xs font-bold tracking-wider ${kindStyles[kind]}`}
    >
      {children}
    </span>
  )
}
