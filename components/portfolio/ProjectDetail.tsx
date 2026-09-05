import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { components } from '@/components/MDXComponents'
import ProjectHeader from './ProjectHeader'
import ProjectImages from './ProjectImages'
import type { Project } from '@/content/schema'
import type { Projects } from 'contentlayer/generated'

interface Props {
  project: Project
  doc: Projects
  /** 번호 배지에 들어갈 '01' 형태의 두 자리 문자열. 순서는 page.tsx 가 정한다. */
  no: string
}

/**
 * 프로젝트 한 건의 풀 전개 — 헤더 · 스크린샷 · MDX 본문.
 *
 * 8건이 같은 슬롯에서 렌더되므로 프로젝트마다 배지·제목 크기를 다르게 할 이유가 없다.
 * "대표는 더 자세하다"는 건 content/ 의 서술 분량이 정할 일이지 렌더가 정할 일이 아니다.
 *
 * 이 컴포넌트 안에는 Reveal 을 쓰지 않는다 — 선택되지 않은 패널은 display:none 인 채
 * 마운트되므로 IntersectionObserver 가 영영 교차를 보고하지 않는다.
 */
export default function ProjectDetail({ project, doc, no }: Props) {
  return (
    <div className="print:break-before-page">
      <ProjectHeader project={project} badge={no} platform={doc.platform} summary={doc.summary} />

      {doc.images.length > 0 && (
        <div className="mt-8">
          <ProjectImages
            images={doc.images}
            imageSize={doc.imageSize}
            imageFrame={doc.imageFrame}
            alt={project.name}
          />
        </div>
      )}

      <div className="prose dark:prose-invert prose-doc mt-8 max-w-none">
        <MDXLayoutRenderer code={doc.body.code} components={components} />
      </div>
    </div>
  )
}
