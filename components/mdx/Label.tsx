import { ReactNode } from 'react'

export type LabelKind = 'problem' | 'approach' | 'result' | 'neutral'

/**
 * 칸 이름 라벨(문제·선택·결과…).
 *
 * 원본 PDF 는 칸마다 색 칩을 깔아 문서를 구획했는데, 경력기술서처럼 칸이 수십 개 이어지면
 * 칩 면이 본문보다 먼저 눈에 걸렸다. 면을 걷고 굵은 글자와 앞의 작은 점으로 구획한다.
 * 점 색이 칸의 종류다 — 문제는 스카이 블루(accent), 선택·실행은 슬레이트 네이비(primary),
 * 결과는 채운 스카이 블루, 나머지(관점·제약·배움)는 점 없이 회색 글자.
 */
const kindStyles: Record<LabelKind, { text: string; dot?: string }> = {
  problem: {
    text: 'text-accent-800 dark:text-accent-300',
    dot: 'bg-accent-500',
  },
  approach: {
    text: 'text-primary-700 dark:text-primary-300',
    dot: 'bg-primary-600 dark:bg-primary-400',
  },
  result: {
    text: 'text-accent-800 dark:text-accent-200',
    dot: 'bg-accent-500 ring-2 ring-accent-200 dark:ring-accent-800',
  },
  neutral: { text: 'text-gray-600 dark:text-gray-400' },
}

export default function Label({ kind, children }: { kind: LabelKind; children: ReactNode }) {
  const style = kindStyles[kind]
  return (
    <span
      className={`not-prose inline-flex items-center gap-1.5 text-[13px] leading-6 font-bold ${style.text}`}
    >
      {style.dot && <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${style.dot}`} />}
      {children}
    </span>
  )
}
