import { ReactNode } from 'react'

interface Props {
  title?: string
  /** section 요소에 덧붙일 클래스 */
  className?: string
  /** 제목 요소에 덧붙일 클래스 (prose 밖에서 쓸 때 유용) */
  titleClassName?: string
  children: ReactNode
}

/**
 * 인쇄(Ctrl+P) 시 페이지 경계에서 블록이 잘리지 않도록 감싸는 래퍼.
 *
 * - `break-inside-avoid-page`: 섹션 내부에서 페이지가 갈라지지 않게 한다.
 * - `break-after-avoid-page`: 제목만 페이지 하단에 홀로 남는 것을 막는다.
 */
export default function Section({ title, className, titleClassName, children }: Props) {
  return (
    <section className={`break-inside-avoid-page my-8${className ? ` ${className}` : ''}`}>
      {title && (
        <h3 className={`break-after-avoid-page${titleClassName ? ` ${titleClassName}` : ''}`}>
          {title}
        </h3>
      )}
      {children}
    </section>
  )
}
