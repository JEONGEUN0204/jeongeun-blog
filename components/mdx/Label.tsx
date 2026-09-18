import { ReactNode } from 'react'

export type LabelKind = 'problem' | 'approach' | 'result' | 'neutral'

/**
 * 원본 포트폴리오 PDF의 컬러 라벨 칩.
 *
 * PDF는 PROBLEM / APPROACH / RESULT 를 칩 색으로 구획해 문서를 스캔 가능하게 만든다.
 * 구획 방식은 그대로 두고 색만 사이트 팔레트로 옮겼다 — 문제는 스카이 블루(accent),
 * 접근은 라이트 그레이(sand), 결과는 슬레이트 네이비(primary).
 */
const kindStyles: Record<LabelKind, string> = {
  problem: 'bg-accent-100 text-accent-900 dark:bg-accent-400/15 dark:text-accent-200',
  approach: 'bg-sand-200 text-sand-900 dark:bg-sand-400/15 dark:text-sand-200',
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
