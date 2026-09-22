'use client'

import type { MouseEvent } from 'react'
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
 * - bar: 그보다 좁으면 본문 맨 위에 가로 줄로 붙어 스크롤을 따라온다. 하위 자리는 옅은 톤으로 잇는다.
 */
export function ProductIndex({
  product,
  layout,
  className = '',
}: {
  product: PortfolioProduct
  layout: 'rail' | 'bar'
  className?: string
}) {
  const entries = entriesOf(product)
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

  return (
    <nav
      aria-label={label}
      className={`bg-sand-50/95 sticky top-0 z-20 border-b border-gray-200 backdrop-blur dark:border-gray-700 dark:bg-gray-950/95 ${className}`}
    >
      <ol className="no-scrollbar flex items-center gap-1 overflow-x-auto py-2.5">
        {entries.map((entry) => (
          <li key={entry.id} className="shrink-0">
            <a
              href={`#${entry.id}`}
              onClick={(event) => jump(event, entry.id)}
              className={`block rounded-full px-3 py-1 text-xs whitespace-nowrap transition-colors motion-reduce:transition-none ${
                entry.sub
                  ? 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                  : 'hover:border-accent-600 hover:text-accent-700 dark:hover:border-accent-400 dark:hover:text-accent-300 border border-gray-300 font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300'
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
