'use client'

import type { KeyboardEvent } from 'react'

export interface CardSurface {
  id: string
  /** '01' 형태의 두 자리 번호. 배열 순서가 곧 번호다. */
  no: string
  company: string
  name: string
  /**
   * MDX 본문의 `###` 소제목(contentlayer 의 toc).
   *
   * 프로젝트명과 기술 표기만으로는 "무슨 작업을 했는지"가 안 읽힌다. 소제목은 이미
   * 그 답을 담고 있으므로 문구를 새로 짓지 않고 원문 그대로 스트립에 올린다.
   * 잘라내지 않는다 — 잘리면 어차피 판단 근거가 안 된다.
   * MDX 에 `###` 이 없는 프로젝트는 빈 배열이라 이 영역이 렌더되지 않는다.
   */
  topics: string[]
}

interface Props {
  item: CardSurface
  selected: boolean
  panelId: string
  onSelect: () => void
  /** 화살표·Home·End 로 탭을 이동한다. 핸들러는 tablist 가 아니라 포커스를 받는 탭에 붙는다. */
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
}

/**
 * 인덱스 스트립의 탭 하나.
 *
 * 스트립은 인덱스지 요약이 아니다. summary 전문이나 지표·스택 칩을 얹으면 카드가 높아지고
 * 그만큼 아래 상세가 화면 밖으로 밀린다 — 선택지와 결과가 한 화면에 같이 보이는 게
 * 이 구도의 전부다. 그래서 번호·회사·이름과 소제목 목록만 남긴다.
 *
 * 위계는 번호와 순서가 나타낸다. 대표는 '맨 앞이고 기본으로 선택된 것'일 뿐
 * 별표나 등급 라벨을 달지 않는다.
 */
export default function ProjectCard({ item, selected, panelId, onSelect, onKeyDown }: Props) {
  return (
    <button
      type="button"
      role="tab"
      id={`project-tab-${item.id}`}
      aria-selected={selected}
      aria-controls={panelId}
      /* 로빙 탭인덱스 — Tab 한 번으로 스트립에 들어오고, 그 안은 화살표로 이동한다. */
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={`flex w-60 shrink-0 snap-start flex-col items-start gap-2 rounded-xl border p-4 text-left transition duration-200 motion-reduce:transition-none sm:w-auto sm:shrink ${
        selected
          ? 'border-primary-600 ring-primary-600 dark:border-primary-500 dark:ring-primary-500 bg-white ring-2 dark:bg-transparent'
          : 'border-gray-200 hover:border-gray-400 hover:shadow-md dark:border-gray-700 dark:hover:border-gray-500'
      }`}
    >
      <div className="flex w-full items-center gap-2">
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
            selected ? 'bg-primary-700 text-white' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {item.no}
        </span>
        <span className="text-primary-700 dark:text-primary-400 truncate text-xs font-bold tracking-[0.15em] uppercase">
          {item.company}
        </span>
      </div>

      <span className="text-base leading-snug font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {item.name}
      </span>

      {item.topics.length > 0 && (
        <span className="mt-0.5 flex flex-col gap-1">
          {item.topics.map((topic) => (
            <span
              key={topic}
              className="flex gap-1.5 text-xs leading-5 text-gray-500 dark:text-gray-400"
            >
              <span aria-hidden className="text-gray-300 dark:text-gray-600">
                —
              </span>
              <span>{topic}</span>
            </span>
          ))}
        </span>
      )}
    </button>
  )
}
