import { getMetric } from './metrics'
import { products } from './products'
import { projects } from './projects'
import type { CompanyId, Product, Project } from './schema'

/**
 * /resume 의 Experience 하이라이트를 작업 데이터에서 만든다.
 * 제목은 Project.name, 설명은 Project.highlight — 이력서 쪽에 따로 적는 문장은 없다.
 */

export type HighlightPart = { text: string; metric: boolean }

const METRIC_TOKEN = /\{m:([^}]+)\}/g

/** highlight 안의 `{m:id}` id 목록. verify 가 metricIds 와 대조한다. */
export function highlightMetricIds(highlight: string): string[] {
  return [...highlight.matchAll(METRIC_TOKEN)].map((match) => match[1])
}

/** `{m:id}` 를 metrics.ts 의 문장용 표기(inline ?? value)로 바꿔 조각으로 나눈다. 수치 조각은 굵게 그린다. */
export function highlightParts(highlight: string): HighlightPart[] {
  return highlight.split(/\{m:([^}]+)\}/).map((part, index) => {
    if (index % 2 === 0) return { text: part, metric: false }
    const metric = getMetric(part)
    return { text: metric.inline ?? metric.value, metric: true }
  })
}

/** 화면에 찍히는 글자 그대로. verify 의 길이 검사용. */
export function renderedHighlight(highlight: string): string {
  return highlightParts(highlight)
    .map((part) => part.text)
    .join('')
}

/**
 * 하이라이트 제목. 작업 이름이 제품 이름과 같으면 소제목과 같은 말이 바로 아래 반복되므로 없앤다 —
 * /portfolio 가 작업 하나뿐인 제품에 섹션을 세우지 않는 것과 같은 이유다.
 */
export function highlightTitle(project: Project, product: Product): string | null {
  return project.name === product.name ? null : project.name
}

/** /portfolio 의 작업 제목 원문. headline 이 없으면 name 이다. `{m:id}` 는 아직 풀지 않았다. */
export function portfolioHeadline(project: Project): string {
  return project.headline ?? project.name
}

/** /portfolio 목차·카드 뒷면에 찍히는 작업 제목. 수치까지 글자로 푼다. */
export function portfolioTitle(project: Project): string {
  return renderedHighlight(portfolioHeadline(project))
}

export type ResumeGroup = { product: Product; works: Project[] }

/** 회사의 제품(products.ts 순서)과 각 제품의 작업(projects 배열 순서). */
export function resumeGroups(companyId: CompanyId): ResumeGroup[] {
  return products
    .filter((product) => product.companyId === companyId)
    .map((product) => ({
      product,
      works: projects.filter((project) => project.productId === product.id),
    }))
    .filter((group) => group.works.length > 0)
}
