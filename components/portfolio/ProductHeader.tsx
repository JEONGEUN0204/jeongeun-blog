import { getCompany } from '@/content/companies'
import { productStack } from '@/content/projects'
import type { Product, Project } from '@/content/schema'
import { StackTags, WorkMeta } from './WorkMeta'

interface Props {
  product: Product
  /** 번호 배지에 들어갈 '01' 형태의 두 자리 문자열. */
  badge: string
  summary?: string
  /**
   * 제품에 작업이 하나뿐일 때 그 작업. 역할·기여 범위를 헤더에 바로 싣는다 —
   * 작업이 하나뿐이면 섹션을 따로 세워 봐야 제목만 한 번 더 반복된다.
   * 작업이 둘 이상이면 각 작업 섹션이 자기 역할을 적으므로 여기서는 비운다.
   */
  work?: Project
}

/**
 * 원본 PDF의 커버 구성(번호 배지 + 회사 · PROJECT + 제목)을 그대로 따른다.
 *
 * 제목은 제품 이름이다. 작업 이름은 아래 섹션 제목이 맡는다 — 예전에는 한 레코드가 제품과 작업을
 * 겸해서 name 에 'ChatCODIT App · 구축·결제' 처럼 둘을 붙여 적고 렌더에서 앞부분을 잘라 냈다.
 *
 * 스택은 제품에 속한 작업들의 합집합이다(content/projects 의 productStack).
 */
export default function ProductHeader({ product, badge, summary, work }: Props) {
  return (
    <header className="not-prose break-inside-avoid-page break-after-avoid-page">
      <div className="flex items-start gap-4">
        <div className="bg-primary-700 flex size-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white">
          {badge}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase dark:text-gray-100">
            <span className="text-primary-700 dark:text-primary-400">
              {getCompany(product.companyId).name}{' '}
            </span>
            · Project
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {product.name}
          </h2>
        </div>
        <div className="hidden shrink-0 text-right text-sm text-gray-400 sm:block print:block">
          <div>{product.platform}</div>
        </div>
      </div>

      {work && (
        <div className="mt-4">
          <WorkMeta work={work} />
        </div>
      )}
      <div className="mt-4">
        <StackTags stack={productStack(product.id)} />
      </div>
      {summary && (
        <p className="mt-4 max-w-[68ch] leading-7 text-gray-600 dark:text-gray-400">{summary}</p>
      )}
    </header>
  )
}
