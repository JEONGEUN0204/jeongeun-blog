'use client'

import { useRef, useState } from 'react'
import ProjectBody, { ProjectIndex } from './ProjectBody'
import ProjectCard from './ProjectCard'
import { detailId, scrollBehavior, type PortfolioCompany } from './portfolio'

interface Props {
  /** 화면에는 보이지 않는 페이지 제목(h1). 눈에 보이는 제목은 회사 제목과 프로젝트 헤더가 맡는다. */
  title: string
  companies: PortfolioCompany[]
}

/**
 * /portfolio 화면.
 *
 * 흐름: 책갈피로 회사를 고른다(처음엔 첫 회사) → 그 회사의 프로젝트 카드가 깔린다 → 카드를 고르면
 * 아래에 그 프로젝트 본문이 펼쳐진다(처음엔 첫 프로젝트). 본문은 한 번에 전부 보이고 목차는 위치 이동만 한다.
 *
 * 책갈피와 목차는 왼쪽 여백 레일에 둔다. 컨테이너가 xl 에서 1024px 이라 레일(w-40 + mr-6)이 여백에
 * 들어가는 1440px(min-[90rem])부터 레일을 쓰고, 그보다 좁으면 책갈피는 카드 위 가로 탭, 목차는 본문 위 가로 줄로 온다.
 *
 * 본문(article)은 두 회사의 모든 프로젝트를 항상 DOM 에 둔다. 화면에서는 고른 하나만 보이고
 * 인쇄·JS 없는 환경에서는 전부 펼쳐진다 — 이 페이지의 인쇄물은 포트폴리오 전체다.
 * 숨김에 `hidden` 속성 대신 클래스를 쓴다. Tailwind v4 preflight 의 `[hidden]{display:none!important}` 는
 * @layer base 의 important 선언이라 utilities 의 print:block 으로 이길 수 없다.
 */
export default function PortfolioBrowser({ title, companies }: Props) {
  const [companyId, setCompanyId] = useState<string | undefined>(companies[0]?.id)
  const [projectId, setProjectId] = useState<string | undefined>(companies[0]?.projects[0]?.id)
  const gridRef = useRef<HTMLElement>(null)

  const company = companies.find((item) => item.id === companyId)
  const project = company?.projects.find((item) => item.id === projectId)

  const pickCompany = (id: string) => {
    setCompanyId(id)
    setProjectId(companies.find((item) => item.id === id)?.projects[0]?.id)
    // 스크롤을 내린 채 바꿨을 때만 카드 위치로 올린다. 맨 위에서 바꿀 때 사이트 헤더를 밀어 올리지 않는다.
    requestAnimationFrame(() => {
      const grid = gridRef.current
      if (grid && grid.getBoundingClientRect().top < 0) {
        grid.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
      }
    })
  }

  const selectProject = (id: string) => {
    setProjectId(id)
    // 클릭 핸들러의 setState 는 동기로 커밋된다. 다음 프레임에는 본문이 이미 보인다.
    requestAnimationFrame(() =>
      document
        .getElementById(detailId(id))
        ?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
    )
  }

  return (
    <div className="relative">
      <h1 className="sr-only">{title}</h1>

      {company && (
        <aside className="absolute top-0 right-full mr-6 hidden h-full w-40 min-[90rem]:block print:hidden noscript:hidden">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pt-2 pb-6">
            <CompanyBookmarks
              companies={companies}
              activeId={company.id}
              onPick={pickCompany}
              layout="rail"
            />
            {project && <ProjectIndex project={project} layout="rail" className="mt-10" />}
          </div>
        </aside>
      )}

      {company && (
        <div className="print:hidden noscript:hidden">
          <CompanyBookmarks
            companies={companies}
            activeId={company.id}
            onPick={pickCompany}
            layout="bar"
            className="mb-6 min-[90rem]:hidden"
          />

          <section ref={gridRef} aria-labelledby="company-title" className="scroll-mt-6 pt-2">
            <h2
              id="company-title"
              className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
            >
              {company.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="tabular-nums">{company.period}</span> · {company.context}
            </p>

            <ul key={company.id} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
              {company.projects.map((item, index) => (
                <li key={item.id}>
                  <ProjectCard
                    project={item}
                    index={index}
                    selected={item.id === project?.id}
                    onSelect={() => selectProject(item.id)}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {companies.map((item, companyIndex) => (
        <div
          key={item.id}
          className={`${item.id === company?.id ? 'block' : 'hidden'} print:block noscript:block ${
            companyIndex > 0 ? 'print:break-before-page noscript:mt-20' : ''
          }`}
        >
          {/* 인쇄·JS 없는 환경 전용 회사 머리. 화면에서는 카드 위 회사 제목이 같은 일을 한다. */}
          <header className="hidden break-after-avoid-page print:block noscript:block">
            <p className="text-primary-700 dark:text-primary-400 text-xs font-bold tracking-[0.2em] uppercase">
              Portfolio
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {item.period} · {item.context}
            </p>
          </header>

          {item.projects.map((entry, projectIndex) => (
            <article
              key={entry.id}
              id={detailId(entry.id)}
              className={`scroll-mt-6 [&_[id]]:scroll-mt-20 min-[90rem]:[&_[id]]:scroll-mt-8 ${
                entry.id === project?.id
                  ? 'mt-12 block border-t border-gray-200 pt-6 min-[90rem]:pt-10 dark:border-gray-700'
                  : 'hidden'
              } print:mt-8 print:block print:border-0 print:pt-0 noscript:mt-12 noscript:block ${
                projectIndex > 0 ? 'print:break-before-page' : ''
              }`}
            >
              {/* 가로 목차는 article 의 직계 자식이어야 한다. 감싸면 sticky 가 감싼 요소 높이 안에 갇힌다. */}
              <ProjectIndex
                project={entry}
                layout="bar"
                className="mb-8 min-[90rem]:hidden print:hidden noscript:hidden"
              />
              <ProjectBody project={entry} />
            </article>
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * 회사 책갈피. 레일에서는 세로로 서고 선택한 회사에 accent 띠가 붙는다.
 * 좁은 화면에서는 카드 위 가로 탭이 된다.
 */
function CompanyBookmarks({
  companies,
  activeId,
  onPick,
  layout,
  className = '',
}: {
  companies: PortfolioCompany[]
  activeId: string
  onPick: (id: string) => void
  layout: 'rail' | 'bar'
  className?: string
}) {
  return (
    <nav aria-label="회사" className={className}>
      <ul
        className={
          layout === 'rail'
            ? 'space-y-1'
            : 'flex gap-1 border-b border-gray-200 dark:border-gray-700'
        }
      >
        {companies.map((item) => {
          const active = item.id === activeId

          if (layout === 'rail') {
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onPick(item.id)}
                  className={`relative block w-full rounded-r-md py-2 pr-2 pl-4 text-left transition-colors motion-reduce:transition-none ${
                    active
                      ? 'bg-primary-900/5 dark:bg-sand-50/5'
                      : 'hover:bg-primary-900/5 dark:hover:bg-sand-50/5'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-1 rounded-r-sm ${
                      active ? 'bg-accent-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                  <span
                    className={`block text-sm leading-snug ${
                      active
                        ? 'font-bold text-gray-900 dark:text-gray-100'
                        : 'font-medium text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-gray-500 tabular-nums dark:text-gray-400">
                    {item.period}
                  </span>
                </button>
              </li>
            )
          }

          return (
            <li key={item.id} className="-mb-px">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onPick(item.id)}
                className={`border-b-2 px-3 py-2 text-sm transition-colors motion-reduce:transition-none ${
                  active
                    ? 'border-accent-600 font-bold text-gray-900 dark:text-gray-100'
                    : 'border-transparent font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                {item.name}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
