import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/** app/layout.tsx 가 모든 페이지를 한 번 감싼다. 레이아웃 안에서 또 감싸면 좌우 여백이 겹쳐 본문이 헤더보다 안쪽으로 밀린다. */
export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">{children}</section>
  )
}
