'use client'

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import Reveal from '@/components/motion/Reveal'
import ProjectCard, { type CardSurface } from './ProjectCard'

export interface ShowcaseItem extends CardSurface {
  /** 서버에서 렌더한 상세(헤더·스크린샷·MDX 본문). 클라이언트로 MDX 를 끌어오지 않기 위해서다. */
  detail: ReactNode
}

/**
 * 인덱스 스트립(위) + 전폭 상세 패널(아래). 항상 하나가 선택돼 있다.
 *
 * 상세를 카드 밖 전폭으로 빼는 게 이 구조의 핵심이다. 카드 안에서는 MDX 의 <Split> 이
 * 뷰포트 기준 브레이크포인트(lg:)로 2단을 켜기 때문에, 넓은 화면에서 좁은 카드에 갇히면
 * 본문 컬럼이 aside 272px 에 밀려 찌부러진다.
 *
 * 스트립이 패널 바로 위에 있으므로 선택 시 스크롤하지 않는다 — 선택지와 결과가 이미 붙어 있다.
 * 닫기 개념도 없다. 하나는 늘 열려 있어 빈 화면이 남을 수 없다.
 *
 * 패널 8건은 전부 항상 DOM 에 둔다. 화면에서는 선택된 하나만 보이고 인쇄에서는 전부 펼쳐진다.
 * 숨김에 `hidden` 속성을 쓰지 않는 이유: Tailwind v4 preflight 가
 * `[hidden]{display:none!important}` 를 @layer base 에 선언해서, important 선언끼리는
 * 레이어 순서가 역전돼 utilities 의 print:block 이 이길 수 없다 — 인쇄에서 7건이 사라진다.
 * 클래스 `hidden` 은 같은 utilities 레이어의 normal 선언이라 print:block 이 정상적으로 이긴다.
 */
export default function ProjectShowcase({ items }: { items: ShowcaseItem[] }) {
  const [selected, setSelected] = useState(items[0]?.id ?? '')
  const listRef = useRef<HTMLDivElement>(null)

  /** 선택이 포커스를 따라가는 자동 활성화. 패널이 전부 미리 렌더돼 있어 전환은 display 토글뿐이다. */
  const move = (to: number) => {
    const next = items[(to + items.length) % items.length]
    if (!next) return
    setSelected(next.id)
    document.getElementById(`project-tab-${next.id}`)?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const current = items.findIndex((item) => item.id === selected)
    const moves: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: items.length - 1,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    move(moves[event.key])
  }

  const backToList = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    listRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    document.getElementById(`project-tab-${selected}`)?.focus({ preventScroll: true })
  }

  return (
    <>
      {/* 스트립은 한 번만 Reveal 로 감싼다 — 카드마다 스태거하면 탭바가 어른거린다. */}
      <Reveal>
        <div
          ref={listRef}
          role="tablist"
          aria-label="프로젝트"
          className="-mx-4 flex snap-x snap-mandatory scroll-mt-24 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 print:hidden"
        >
          {items.map((item) => (
            <ProjectCard
              key={item.id}
              item={item}
              selected={selected === item.id}
              panelId={`project-panel-${item.id}`}
              onSelect={() => setSelected(item.id)}
              onKeyDown={onKeyDown}
            />
          ))}
        </div>
      </Reveal>

      {items.map((item) => (
        <section
          key={item.id}
          role="tabpanel"
          id={`project-panel-${item.id}`}
          aria-labelledby={`project-tab-${item.id}`}
          tabIndex={0}
          className={`outline-none print:block ${
            selected === item.id
              ? 'panel-in mt-10 block border-t border-gray-200 pt-10 dark:border-gray-700'
              : 'hidden'
          }`}
        >
          {item.detail}

          <div className="mt-10 print:hidden">
            <button
              type="button"
              onClick={backToList}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-900 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-100"
            >
              목록으로 <span aria-hidden>↑</span>
            </button>
          </div>
        </section>
      ))}
    </>
  )
}
