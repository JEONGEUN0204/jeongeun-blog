import { allProducts } from 'contentlayer/generated'
import PortfolioBrowser from '@/components/portfolio/PortfolioBrowser'
import { productBody } from '@/components/portfolio/ProductDetail'
import { pad, type PortfolioCompany } from '@/components/portfolio/portfolio'
import { companies, formatPeriod } from '@/content/companies'
import { productsOf } from '@/content/products'
import { profile } from '@/content/profile'
import { productStack, worksOf } from '@/content/projects'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Portfolio' })

/*
  /portfolio — 왼쪽 책갈피로 회사를 고르고, 그 회사의 제품 카드를 누르면 아래에 본문이 펼쳐진다.

  카드 한 장은 제품 하나다. 그 안의 작업은 본문 섹션으로 들어간다 — 예전에는 제품과 작업이
  같은 목록에 섞여 있어서 어떤 것은 카드가 되고 어떤 것은 되지 않았다.

  사실(제품·작업 이름·역할·스택)은 content/, 표현(요약·스크린샷·본문)은 MDX 에 있다.
  제품은 data/products/{id}.mdx, 작업은 data/projects/{id}.mdx 이고 파일명이 두 소스를 잇는 키다.

  - 회사 순서는 content/companies.ts 순서(최신 회사 먼저)이고, 첫 회사가 처음 선택된다.
  - 회사 안에서는 flagship 작업을 가진 제품을 맨 앞으로 빼고 나머지를 content/products 순서대로 잇는다.
    번호는 회사마다 01 부터 센다. 'Flagship' 같은 등급 라벨은 달지 않는다 — 위계는 순서가 나타낸다.
*/
export default function Portfolio() {
  const leads = (productId: string) => worksOf(productId).some((work) => work.depth === 'flagship')

  const groups: PortfolioCompany[] = companies.flatMap((company) => {
    const own = productsOf(company.id)
    const ordered = [
      ...own.filter((product) => leads(product.id)),
      ...own.filter((product) => !leads(product.id)),
    ]
    const withDocs = ordered.flatMap((product) => {
      const doc = allProducts.find((item) => item.slug === product.id)
      return doc ? [{ product, doc }] : []
    })
    if (withDocs.length === 0) return []

    return [
      {
        id: company.id,
        name: company.name,
        period: formatPeriod(company.period),
        context: company.context,
        products: withDocs.map(({ product, doc }, index) => {
          const no = pad(index + 1)
          const cover = doc.images[0]?.trimEnd()
          return {
            id: product.id,
            no,
            name: product.name,
            platform: product.platform,
            summary: doc.summary,
            stack: productStack(product.id).primary,
            cover: cover
              ? {
                  src: cover,
                  width: Number(doc.imageSize[0]),
                  height: Number(doc.imageSize[1]),
                  frame:
                    doc.imageFrame === 'phone' || doc.imageFrame === 'tablet'
                      ? doc.imageFrame
                      : undefined,
                }
              : undefined,
            ...productBody({ product, doc, no }),
          }
        }),
      },
    ]
  })

  return <PortfolioBrowser title={`${profile.name} · Portfolio`} companies={groups} />
}
