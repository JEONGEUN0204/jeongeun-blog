import { ReactNode } from 'react'

/**
 * 본문 옆에 강조 카드를 세우는 2단 레이아웃 (원본 PDF의 성과 페이지 구성).
 *
 * 좁은 화면에서는 aside가 본문 아래로 스택된다.
 * 인쇄는 A4 본문 폭(약 688px)에 맞춰 더 좁은 aside로 2단을 유지한다.
 */
export default function Split({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <div className="my-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] print:grid-cols-[minmax(0,1fr)_14rem] print:gap-6">
      <div className="min-w-0 [&>:first-child]:mt-0">{children}</div>
      <div className="min-w-0">{aside}</div>
    </div>
  )
}
