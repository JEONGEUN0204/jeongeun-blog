import { allCareers } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import Image from '@/components/Image'
import { components } from '@/components/MDXComponents'
import { companies, formatPeriod } from '@/content/companies'

export default function CareerList() {
  /*
    회사 목록과 순서는 content/companies.ts 가 정한다. MDX 파일 순서에 맡기면
    회사가 하나 빠져도(실제로 코딧이 /careers 에서 통째로 빠져 있던 적이 있다)
    아무도 눈치채지 못한다. 여기서는 짝이 없으면 렌더가 비고, verify 가 실패한다.
  */
  return (
    <div className="prose dark:prose-invert prose-doc max-w-none pt-15 pb-8">
      {companies.map((company) => {
        const career = allCareers.find((item) => item.companyId === company.id)
        if (!career) return null

        return (
          <div key={company.id} className="mb-20">
            {/*
              예전에는 220x220 로고가 좌측 컬럼을 고정 점유해 본문 폭을 그만큼 깎았다.
              로고는 회사를 알아보게 하는 표식일 뿐 읽을 내용이 아니므로, 가로 배너로
              눕히고 폭 전체를 본문에 돌려준다. 배너 전체를 break-inside-avoid-page 로
              감싸 인쇄 시 로고와 회사명이 페이지 경계에서 갈라지지 않게 한다.
            */}
            <header className="not-prose break-inside-avoid-page break-after-avoid-page">
              <div className="flex items-center gap-4">
                {/*
                  로고 비율이 제각각이라 채우는 방식은 logoFit 으로 나눈다.
                  가로형은 contain 으로 여백을 두고, 정사각은 cover 로 박스를 꽉 채운다.
                */}
                <div className="flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <Image
                    src={career.logo}
                    width={career.logoSize[0]}
                    height={career.logoSize[1]}
                    alt={company.name}
                    className={
                      career.logoFit === 'cover'
                        ? 'my-0 size-full object-cover'
                        : 'my-0 size-full object-contain p-2'
                    }
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {company.name}
                  </h1>
                  {/* 개월 수는 표기하지 않는다 — 매월 갱신해야 하고, 놓치는 순간 문서 간 불일치가 된다. */}
                  <p className="text-primary-700 dark:text-primary-400 mt-1 text-sm font-semibold">
                    {formatPeriod(company.period)}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-[68ch] leading-7 text-gray-600 dark:text-gray-400">
                {career.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {career.tags.map(
                  (tag, index) =>
                    tag && (
                      <span
                        key={index}
                        className="flex h-fit w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium whitespace-nowrap text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    )
                )}
              </div>
            </header>

            <div className="mt-10">
              <MDXLayoutRenderer code={career.body.code} components={components} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
