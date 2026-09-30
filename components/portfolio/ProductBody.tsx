'use client'

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { overviewId, scrollBehavior, type PortfolioProduct } from './portfolio'

/**
 * 고른 제품의 본문 — 개요와 작업 섹션을 순서대로 한 번에 펼친다.
 *
 * 섹션마다 id 와 tabIndex=-1 을 단다. 목차가 그 자리로 스크롤한 뒤 포커스를 옮겨,
 * 키보드 사용자의 다음 Tab 이 목차가 아니라 읽던 자리에서 이어지게 한다.
 */
export default function ProductBody({ product }: { product: PortfolioProduct }) {
  return (
    <>
      <div id={overviewId(product.id)} tabIndex={-1} className="outline-none">
        {product.overview}
      </div>
      {product.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          tabIndex={-1}
          className="mt-14 border-t border-gray-200 pt-12 outline-none dark:border-gray-700 print:mt-10 print:border-0 print:pt-0"
        >
          {section.node}
        </section>
      ))}
    </>
  )
}

type Entry = { id: string; title: string; sub: boolean }

/** 개요 → 섹션 → 섹션 안 하위 자리 순서로 편다. */
function entriesOf(product: PortfolioProduct): Entry[] {
  return [
    { id: overviewId(product.id), title: '개요', sub: false },
    ...product.sections.flatMap((section) => [
      { id: section.id, title: section.title, sub: false },
      ...(section.items ?? []).map((item) => ({ ...item, sub: true })),
    ]),
  ]
}

function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id)
  if (!target) return
  event.preventDefault()
  target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
  target.focus({ preventScroll: true })
}

/**
 * 본문 목차. 위치 이동만 한다 — 누른 자리로 스크롤할 뿐 본문을 열고 닫지 않는다.
 *
 * - rail: 1440px 이상에서 왼쪽 여백 레일(PortfolioBrowser) 안에 세로로 선다.
 * - floating: 그보다 좁으면 화면 오른쪽에 떠 있는 버튼으로 연다(FloatingIndex).
 */
export function ProductIndex({
  product,
  layout,
  className = '',
}: {
  product: PortfolioProduct
  layout: 'rail' | 'floating'
  className?: string
}) {
  const entries = useMemo(() => entriesOf(product), [product])
  const label = `${product.name} 목차`

  if (layout === 'rail') {
    return (
      <nav aria-label={label} className={className}>
        <p className="pl-3 text-xs font-bold text-gray-900 dark:text-gray-100">{product.name}</p>
        <ol className="mt-2 border-l border-gray-200 dark:border-gray-700">
          {entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                onClick={(event) => jump(event, entry.id)}
                className={`hover:border-accent-600 dark:hover:border-accent-400 -ml-px block border-l-2 border-transparent py-1 text-xs leading-snug transition-colors hover:text-gray-900 motion-reduce:transition-none dark:hover:text-gray-100 ${
                  entry.sub
                    ? 'pl-6 text-gray-500 dark:text-gray-400'
                    : 'pl-3 font-medium text-gray-700 dark:text-gray-300'
                }`}
              >
                {entry.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  return <FloatingIndex entries={entries} label={label} className={className} />
}

const FLOATING_IDLE =
  'bg-white text-gray-600 ring-gray-200 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700 dark:hover:text-gray-100'
const FLOATING_BUTTON = `flex size-10 items-center justify-center rounded-full shadow-md ring-1 transition-colors motion-reduce:transition-none ${FLOATING_IDLE}`

/**
 * 떠 있는 목차 + 맨 위로 버튼. 화면 오른쪽 가운데의 둥근 버튼을 누르면 그 왼쪽에 전체 목차가 펼쳐진다.
 *
 * 가로 줄 목차는 항목 수(1~9개)와 제목 길이가 제품마다 달라 모양이 들쭉날쭉했다. 세로 목록은
 * 항목이 몇 개든 같은 모양이고 긴 제목도 줄바꿈으로 다 보인다. 버튼은 본문이 화면에 들어왔을 때만 뜬다.
 * 맨 위로 버튼은 목차 아래에 붙어 모든 폭에서 뜬다 — 넓은 화면에서는 목차 버튼만 숨고 레일 목차가 대신한다.
 *
 * 지금 읽는 자리: 화면 위쪽 1/4 선을 지난 마지막 자리. 페이지 끝에 닿으면 마지막 칸들은 그 선을
 * 영영 넘지 못하므로, 끝에서는 화면 안에 머리가 들어온 마지막 자리로 정한다.
 */
function FloatingIndex({
  entries,
  label,
  className,
}: {
  entries: Entry[]
  label: string
  className: string
}) {
  const rootRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const article = rootRef.current?.parentElement
      if (!article) return
      const box = article.getBoundingClientRect()
      setVisible(box.top < window.innerHeight / 2 && box.bottom > window.innerHeight / 2)

      const atEnd =
        Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2
      const line = atEnd ? window.innerHeight : window.innerHeight / 4
      let current = entries[0]?.id ?? null
      for (const entry of entries) {
        const target = document.getElementById(entry.id)
        if (target && target.getBoundingClientRect().top <= line) current = entry.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [entries])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const shown = visible || open

  return (
    <nav
      ref={rootRef}
      aria-label={label}
      className={`fixed top-1/2 right-4 z-30 flex -translate-y-1/2 flex-col gap-2 transition-opacity motion-reduce:transition-none sm:right-8 ${
        shown ? 'opacity-100' : 'pointer-events-none opacity-0'
      } ${className}`}
    >
      {/* 개요 한 줄뿐이면 옮겨 갈 자리가 없다. 넓은 화면은 왼쪽 레일 목차가 같은 일을 한다. */}
      {entries.length > 1 && (
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? '목차 닫기' : '목차 열기'}
          onClick={() => setOpen((value) => !value)}
          className={`flex size-10 items-center justify-center rounded-full shadow-md ring-1 transition-colors motion-reduce:transition-none min-[90rem]:hidden ${
            open ? 'bg-accent-600 ring-accent-600 text-white' : FLOATING_IDLE
          }`}
        >
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            className="size-5"
          >
            <path d="M7 5.5h9M7 10h9M7 14.5h9" />
            <circle cx="3.75" cy="5.5" r=".9" fill="currentColor" stroke="none" />
            <circle cx="3.75" cy="10" r=".9" fill="currentColor" stroke="none" />
            <circle cx="3.75" cy="14.5" r=".9" fill="currentColor" stroke="none" />
          </svg>
        </button>
      )}

      <button
        type="button"
        aria-label="맨 위로"
        onClick={() => {
          setOpen(false)
          window.scrollTo({ top: 0, behavior: scrollBehavior() })
        }}
        className={FLOATING_BUTTON}
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M10 16V4.5M5 9.5l5-5 5 5" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-1/2 right-full mr-3 max-h-[70vh] w-64 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
          <ol>
            {entries.map((entry) => {
              const isActive = entry.id === active
              return (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={(event) => {
                      jump(event, entry.id)
                      setOpen(false)
                    }}
                    className={`block rounded-md py-1.5 pr-2 text-[13px] leading-snug transition-colors motion-reduce:transition-none ${
                      entry.sub ? 'pl-6' : 'pl-2.5 font-medium'
                    } ${
                      isActive
                        ? 'bg-accent-50 text-accent-700 dark:bg-accent-400/10 dark:text-accent-300'
                        : entry.sub
                          ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                          : 'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    {entry.title}
                  </a>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </nav>
  )
}
