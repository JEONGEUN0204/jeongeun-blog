'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  /** 스태거용 지연(ms). 60ms 단위로 최대 3단계까지만 준다 — 그 이상은 기다림이 된다. */
  delay?: number
  className?: string
  children: ReactNode
}

/**
 * 스크롤 등장 애니메이션. 라이브러리 없이 IntersectionObserver + CSS transition 으로만 만든다.
 *
 * 초기 숨김(opacity:0)은 css/tailwind.css 의 `@media (scripting: enabled)` 안에만 있다.
 * 여기서 인라인 스타일로 숨기면 JS 가 실행되지 않는 환경에서 내용이 영영 보이지 않는다.
 * prefers-reduced-motion 도 CSS 가 처리한다 — 관찰자는 그대로 돌고 트랜지션만 무력화된다.
 */
export default function Reveal({ delay = 0, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // 관찰자를 못 만드는 환경에서는 그냥 보여준다.
    if (typeof IntersectionObserver === 'undefined') {
      element.dataset.visible = ''
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting)
            continue
            // 한 번만 — 스크롤을 되돌릴 때 다시 사라지면 읽기를 방해한다.
          ;(entry.target as HTMLElement).dataset.visible = ''
          observer.unobserve(entry.target)
        }
      },
      // 뷰포트에 조금 들어오기 전에 미리 시작해야 등장이 늦게 느껴지지 않는다.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
