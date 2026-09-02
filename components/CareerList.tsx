import { allCareers } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import dayjs from 'dayjs'
import Image from '@/components/Image'
import { components } from '@/components/MDXComponents'

export default function CareerList() {
  return (
    <div className="prose dark:prose-invert prose-doc max-w-none pt-15 pb-8">
      {allCareers.map((career, index) => {
        return (
          <div key={index} className="mb-20 flex items-start gap-10">
            {/*
              not-prose로 prose 타이포그래피 여백에서 빼낸다. 예전에는 이 컬럼이 prose 안에
              있어서 h1의 기본 여백을 음수 마진으로 상쇄했고, 그 음수 마진이 날짜를
              로고 박스 테두리 위로 끌어올려 겹치게 만들었다.
            */}
            <div className="not-prose shrink-0 break-inside-avoid-page">
              {/*
                회사마다 로고 박스를 220x220 정사각으로 통일한다. 다만 로고 비율이 제각각이라
                채우는 방식은 logoFit으로 나눈다. 가로형(코딧 384x93)은 contain으로 여백을 두고
                가운데 정렬하고, 정사각(이즐랩스 512x512)은 cover로 박스를 꽉 채운다.
              */}
              <div className="flex size-[220px] items-center justify-center overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <Image
                  src={career.logo}
                  width={career.logoSize[0]}
                  height={career.logoSize[1]}
                  alt={career.company}
                  className={
                    career.logoFit === 'cover'
                      ? 'my-0 size-full object-cover'
                      : 'my-0 size-full object-contain p-6'
                  }
                />
              </div>
              <p className="mt-3 text-xl font-bold">
                {dayjs(career.date).format('YYYY.MM')}~
                {career.endDate ? dayjs(career.endDate).format('YYYY.MM') : ''}
              </p>
              <div className="bg-primary-100 text-primary-800 dark:bg-primary-400/15 dark:text-primary-300 mt-2 h-fit w-fit rounded-md px-2 py-1 text-sm font-medium">
                {career.duration}
              </div>
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex break-inside-avoid-page break-after-avoid-page flex-col space-y-2">
                <h1>{career.company}</h1>
                <div className="text-gray-500">{career.description}</div>
                <div className="flex flex-wrap gap-2">
                  {career.tags.map(
                    (tag, index) =>
                      tag && (
                        <div
                          key={index}
                          className="flex h-fit w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium whitespace-nowrap text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {tag}
                        </div>
                      )
                  )}
                </div>
              </div>
              <div className="mt-5 max-w-none">
                <MDXLayoutRenderer code={career.body.code} components={components} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
