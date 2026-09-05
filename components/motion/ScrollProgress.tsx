'use client'

import { useEffect, useState } from 'react'

/**
 * 상단 2px 스크롤 진행바.
 *
 * /portfolio 는 flagship 풀 전개 때문에 한 페이지가 길다. 남은 분량을 알려주는 것 외에
 * 다른 일은 하지 않으므로 aria-hidden 이고, 인쇄에서는 사이트 UI 와 함께 숨긴다.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
    }

    // 스크롤마다 setState 하면 리렌더가 프레임을 넘어선다. rAF 로 프레임당 1회로 묶는다.
    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-70 h-0.5 print:hidden" aria-hidden>
      <div
        className="bg-primary-600 dark:bg-primary-400 h-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
