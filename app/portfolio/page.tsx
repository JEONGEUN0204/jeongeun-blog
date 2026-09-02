import AuthorLayout from '@/layouts/AuthorLayout'
import { allProjects } from 'contentlayer/generated'
import Image from '@/components/Image'
import DeviceFrame from '@/components/DeviceFrame'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { components } from '@/components/MDXComponents'

const Portfolio = () => {
  const projects = allProjects.sort((a, b) => a.order - b.order)

  return (
    <AuthorLayout>
      {projects.map((project, index) => {
        return (
          <section
            key={project.name}
            className={
              index === 0
                ? ''
                : 'mt-20 border-t border-gray-200 pt-16 dark:border-gray-700 print:break-before-page'
            }
          >
            {/* 프로젝트 헤더 — 원본 PDF의 커버 구성(번호 배지 + 회사 · PROJECT + 제목) */}
            <header className="not-prose break-inside-avoid-page break-after-avoid-page">
              <div className="flex items-start gap-4">
                <div className="bg-primary-700 flex size-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase dark:text-gray-100">
                    {project.company && (
                      <span className="text-primary-700 dark:text-primary-400">
                        {project.company}{' '}
                      </span>
                    )}
                    · Project
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {project.name}
                  </h2>
                </div>
                <div className="hidden shrink-0 text-right text-sm text-gray-400 sm:block print:block">
                  {project.platform && <div>{project.platform}</div>}
                  {project.period && <div className="text-xs">{project.period}</div>}
                </div>
              </div>
              {/* 태그는 중립 회색으로 — 티얼은 성과 강조에만 쓴다 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium whitespace-nowrap text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {tag}
                  </div>
                ))}
              </div>
              {project.summary && (
                <p className="mt-5 leading-8 text-gray-600 dark:text-gray-400">{project.summary}</p>
              )}
            </header>

            {/*
              imageSize는 "표시 폭 × 표시 높이"다. 실제 높이는 h-auto로 원본 비율을 따르므로
              한 프로젝트 안에 비율이 다른 이미지가 섞여도 찌그러지지 않는다.
              폭은 A4 인쇄 시 컨텐츠 폭(약 640px = 인쇄 폭 688px - 좌우 패딩) 안에서 한 프로젝트의
              이미지가 gap-6(24px)을 포함해 한 줄에 모두 들어가도록 정한다. 예: 2장이면 폭 300.
            */}
            {project.images.length > 0 && (
              <div className="not-prose mt-8 flex flex-wrap items-start gap-6">
                {project.images.map((image, imageIndex) => {
                  const img = (
                    <Image
                      src={image.trimEnd()}
                      alt={`${project.name} 스크린샷 ${imageIndex + 1}`}
                      width={Number(project.imageSize[0])}
                      height={Number(project.imageSize[1])}
                      className="h-auto max-w-full rounded-md"
                    />
                  )
                  return (
                    <div key={image} className="break-inside-avoid-page">
                      {project.imageFrame ? (
                        <DeviceFrame variant={project.imageFrame as 'phone' | 'tablet'}>
                          {img}
                        </DeviceFrame>
                      ) : (
                        img
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div className="prose-doc mt-8 max-w-none">
              <MDXLayoutRenderer code={project.body.code} components={components} />
            </div>
          </section>
        )
      })}
    </AuthorLayout>
  )
}

export default Portfolio
