'use client'

import { useState, type CSSProperties } from 'react'
import { cardId, detailId, type PortfolioProject } from './portfolio'

interface Props {
  project: PortfolioProject
  /** 그리드에 놓인 순서. 등장 지연에 쓴다. */
  index: number
  selected: boolean
  onSelect: () => void
}

/**
 * 프로젝트 카드 한 장. 올려 두면 그 자리에서 뒤집혀 뒷면에 미리보기가 드러난다.
 *
 * 앞면은 번호·플랫폼·이름·주력 스택 두 개·기간만 싣는다. 무엇을 했는지는 뒷면의 작업 제목이 답한다 —
 * 제목은 본문 섹션 제목(MDX 소제목·서술 섹션의 name·하위 프로젝트 이름)을 그대로 올린 것이라 문구를 새로 짓지 않는다.
 * 섹션이 없는 프로젝트는 뒷면에 요약을 싣는다.
 *
 * 미리보기를 카드 옆 창이 아니라 뒷면에 둔다. 옆 창은 항목 수에 따라 높이가, 카드 열에 따라 좌우 위치가
 * 달라졌다. 뒷면은 카드와 크기·자리가 같다. 넘치는 제목은 아래쪽을 흐리게 잘라낸다.
 *
 * 마우스 올리기와 키보드 포커스(:focus-visible)로 뒤집고, 넓은 화면(lg)에서만 뒤집는다. 좁은 카드에는
 * 뒷면 내용이 들어가지 않고 터치에는 올려 두기가 없다 — 그 경우엔 누르면 바로 본문으로 간다.
 * 스크린리더는 aria-describedby 로 뒷면을 읽는다.
 */
export default function ProjectCard({ project, index, selected, onSelect }: Props) {
  const [flipped, setFlipped] = useState(false)
  const previewId = `preview-${project.id}`
  const titles = project.sections.map((section) => section.title)

  return (
    <button
      type="button"
      id={cardId(project.id)}
      onClick={onSelect}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setFlipped(true)
      }}
      onPointerLeave={() => setFlipped(false)}
      onFocus={(event) => {
        // 마우스로 누를 때 생기는 포커스로는 뒤집지 않는다. 올려 둔 동안은 pointerenter 가 이미 뒤집었다.
        if (event.currentTarget.matches(':focus-visible')) setFlipped(true)
      }}
      onBlur={() => setFlipped(false)}
      aria-pressed={selected}
      aria-controls={detailId(project.id)}
      aria-describedby={previewId}
      className={`group block w-full text-left transition-[translate] duration-300 motion-reduce:transition-none ${
        selected ? '-translate-y-1.5' : 'hover:-translate-y-1'
      }`}
    >
      {/* 등장(translate 키프레임)과 뒤집기(transform)를 다른 요소에 둔다 — 한 요소에 두면 fill-mode 가 뒤집기를 덮는다. */}
      <span
        className="stagger-in block perspective-distant"
        style={{ '--stagger-index': index } as CSSProperties}
      >
        <span
          className={`relative block aspect-[5/7] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform-3d motion-reduce:transition-none ${
            flipped ? 'lg:[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* 앞면 */}
          <span
            className={`absolute inset-0 flex flex-col rounded-2xl bg-gray-50 p-3 backface-hidden sm:p-4 dark:bg-gray-900 ${
              selected
                ? 'ring-accent-600 shadow-accent-700/25 shadow-xl ring-2'
                : 'ring-sand-300 group-hover:ring-accent-500 shadow-lg ring-1 shadow-gray-950/10 dark:ring-gray-700'
            }`}
          >
            <span className="text-primary-700 dark:text-primary-300 text-xs font-bold tabular-nums">
              {project.no}
            </span>

            <span className="mt-auto">
              {project.platform && (
                <span className="text-accent-700 dark:text-accent-300 block text-[10px] font-bold tracking-[0.12em] uppercase sm:text-[11px]">
                  {project.platform}
                </span>
              )}
              <span className="mt-1 block text-[15px] leading-snug font-extrabold tracking-tight text-gray-900 sm:text-lg dark:text-gray-100">
                {project.name}
              </span>
            </span>

            <span className="mt-auto flex flex-col gap-2 pt-3">
              <span className="hidden flex-wrap gap-1 sm:flex">
                {project.stack.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-100 text-primary-800 dark:bg-primary-400/15 dark:text-primary-300 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </span>
              <span className="border-sand-200 border-t pt-2 text-[10px] text-gray-600 tabular-nums sm:text-[11px] dark:border-gray-800 dark:text-gray-400">
                {project.period}
              </span>
            </span>
          </span>

          {/* 뒷면 — 미리보기 */}
          <span
            id={previewId}
            className={`bg-primary-900 absolute inset-0 flex [transform:rotateY(180deg)] flex-col overflow-hidden rounded-2xl p-3 text-left backface-hidden sm:p-4 ${
              selected
                ? 'ring-accent-500 shadow-xl ring-2'
                : 'ring-primary-950/40 shadow-lg ring-1 dark:ring-gray-700'
            }`}
          >
            <span className="text-sand-300 block truncate text-[11px] tabular-nums">
              {[project.platform, project.period].filter(Boolean).join(' · ')}
            </span>
            <span className="text-sand-50 mt-1 block text-sm leading-snug font-bold">
              {project.name}
            </span>

            {titles.length > 0 ? (
              <>
                <span className="mt-3 block min-h-0 flex-1 space-y-1.5 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_1.5rem),transparent)]">
                  {titles.map((title) => (
                    <span key={title} className="text-sand-100 flex gap-2 text-xs leading-snug">
                      <span
                        aria-hidden
                        className="bg-accent-400 mt-[0.45em] size-1 shrink-0 rounded-full"
                      />
                      <span className="line-clamp-2">{title}</span>
                    </span>
                  ))}
                </span>
                {project.summary && (
                  <span className="border-sand-300/20 text-sand-300 mt-3 hidden border-t pt-3 text-[11px] leading-4 xl:block">
                    <span className="line-clamp-3">{project.summary}</span>
                  </span>
                )}
              </>
            ) : (
              project.summary && (
                <span className="text-sand-200 mt-3 line-clamp-6 text-xs leading-5">
                  {project.summary}
                </span>
              )
            )}
          </span>
        </span>
      </span>
    </button>
  )
}
