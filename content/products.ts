import type { CompanyId, Product } from './schema'

/**
 * 제품의 단일 원천 — 내가 한 작업이 놓였던 대상.
 *
 * 제품 이름은 예전에 세 곳에 각각 적혀 있었다. content/projects 의 껍데기 레코드('Codit 플랫폼',
 * role·contribution 전부 TBD), content/experience.ts 의 그룹 문자열, 그리고 회사 MDX 의
 * <ProductGroup product="..."> 문자열이다. 셋이 갈라지지 않도록 문자열 대조로 막고 있었는데,
 * 막는 대신 원천을 하나로 둔다.
 *
 * 배열 순서가 곧 /portfolio 의 회사 안 카드 순서다. 최신 제품을 앞에 둔다.
 * depth:'flagship' 작업을 가진 제품은 /portfolio 가 렌더 시점에 맨 앞으로 끌어올리므로
 * 여기서는 회사 안의 상대 순서만 지키면 된다.
 */
export const products: Product[] = [
  {
    id: 'codit-platform',
    companyId: 'codit',
    name: 'Codit 플랫폼',
    platform: 'Web',
  },
  {
    id: 'codit-chatcodit',
    companyId: 'codit',
    name: 'ChatCODIT',
    platform: 'Web',
  },
  {
    id: 'codit-chatcodit-app',
    companyId: 'codit',
    name: 'ChatCODIT App',
    platform: 'iOS · Android',
  },
  {
    id: 'codit-thecodit-app',
    companyId: 'codit',
    name: '더코딧 앱',
    platform: 'iOS · Android · WebView',
  },
  {
    id: 'ezl-charge',
    companyId: 'ezllabs',
    name: '이즐충전소',
    platform: 'React Native · 앱',
  },
  {
    id: 'ezl-backoffice',
    companyId: 'ezllabs',
    name: '백오피스',
    platform: 'React · 운영 웹',
  },
  {
    id: 'ezl-design-system',
    companyId: 'ezllabs',
    name: '디자인 시스템',
    platform: 'React Native · Storybook',
  },
  {
    id: 'ezl-ai',
    companyId: 'ezllabs',
    name: 'Jira/Confluence 검색 AI',
    platform: 'TypeScript · Genkit',
  },
]

export function getProduct(id: string): Product {
  const product = products.find((item) => item.id === id)
  if (!product) throw new Error(`products.ts 에 없는 productId: ${id}`)
  return product
}

/** 한 회사의 제품. 배열 순서를 그대로 따른다. */
export function productsOf(companyId: CompanyId): Product[] {
  return products.filter((product) => product.companyId === companyId)
}

/**
 * 'ChatCODIT App · iOS · Android'.
 *
 * /careers 의 구분선과 /resume 의 그룹 소제목이 같은 문자열을 쓴다 — 두 문서가 같은 묶음을
 * 말하고 있다는 것이 한눈에 보여야 한다.
 */
export function productLabel(product: Product): string {
  return `${product.name} · ${product.platform}`
}
