import type { CompanyId, Product } from './schema'

/**
 * 제품의 단일 원천 — 내가 한 작업이 놓였던 대상.
 *
 * 제품 이름은 예전에 세 곳에 각각 적혀 있었다. content/projects 의 껍데기 레코드('Codit 플랫폼',
 * role·contribution 전부 TBD), content/experience.ts 의 그룹 문자열, 그리고 회사 MDX 의
 * <ProductGroup product="..."> 문자열이다. 셋이 갈라지지 않도록 문자열 대조로 막고 있었는데,
 * 막는 대신 원천을 하나로 둔다.
 *
 * summary·images 도 여기 있다. 예전에는 제품마다 data/products/{id}.mdx 를 하나씩 두고
 * frontmatter 에 적었는데, 여덟 개 전부 본문이 없어 MDX 일 이유가 없었다. 파일이 나뉘어 있는
 * 동안에는 "제품 하나에 대응하는 MDX 가 반드시 있어야 한다" 는 규칙을 verify 가 따로 검사해야
 * 했고, 그 규칙은 한 파일에 모으니 사라졌다 — 타입이 대신 막는다.
 *
 * 배열 순서가 곧 /portfolio 의 회사 안 카드 순서다. 최신 제품을 앞에 둔다.
 * depth:'flagship' 작업을 가진 제품은 /portfolio 가 렌더 시점에 맨 앞으로 끌어올리므로
 * 여기서는 회사 안의 상대 순서만 지키면 된다.
 */
export const products: Product[] = [
  {
    id: 'codit-platform',
    companyId: 'codit',
    name: 'CODIT 플랫폼',
    platform: 'Web',
    // summary 는 아직 문구를 받지 못했다 — verify 가 목록으로 보고한다.
    images: ['/static/images/codit-dashboard-1.jpg', '/static/images/codit-dashboard-2.jpg'],
    imageSize: [300, 143],
  },
  {
    id: 'codit-chatcodit',
    companyId: 'codit',
    name: 'ChatCODIT',
    platform: 'Web',
    summary:
      '정책·규제 리서치를 위한 AI 챗봇. LLM 답변은 생성에 수십 초가 걸리기 때문에, 답변을 실시간으로 흘려보내는 스트리밍 경험이 서비스의 핵심입니다.',
    images: [
      '/static/images/codit-chatcodit-web-1.png',
      '/static/images/codit-chatcodit-web-2.png',
    ],
    imageSize: [300, 142],
  },
  {
    id: 'codit-chatcodit-app',
    companyId: 'codit',
    name: 'ChatCODIT App',
    platform: 'iOS · Android',
    summary:
      'React 모바일 웹으로만 운영하던 ChatCODIT 서비스를 iOS·Android 앱으로 확장하고, 두 스토어 모두 인앱 구독을 붙여 운영 중입니다.',
    images: [
      '/static/images/codit-chatcodit-app-3.png',
      '/static/images/codit-chatcodit-app-1.png',
      '/static/images/codit-chatcodit-app-2.png',
    ],
    imageSize: [165, 342],
    imageFrame: 'phone',
  },
  {
    id: 'codit-thecodit-app',
    companyId: 'codit',
    name: 'CODIT 플랫폼 앱',
    platform: 'iOS · Android · WebView',
    summary:
      '코딧 웹 서비스를 WebView로 래핑한 하이브리드 앱. 네이티브 셸과 웹 콘텐츠 간 브릿지(postMessage) 통신·모달 웹뷰 네비게이션이 핵심입니다.',
    images: ['/static/images/codit-thecodit-app-1.png', '/static/images/codit-thecodit-app-2.png'],
    imageSize: [165, 345],
    imageFrame: 'phone',
  },
  {
    id: 'ezl-charge',
    companyId: 'ezllabs',
    name: '이즐충전소',
    platform: 'React Native · 앱',
    summary:
      'MAU 30만 규모의 교통카드 충전·조회 서비스. 모바일 환경에서 안정적이고 직관적인 충전 경험을 제공하고, i18n으로 다국어를 지원했습니다.',
    images: [
      '/static/images/ezl-charge-1.png',
      '/static/images/ezl-charge-2.png',
      '/static/images/ezl-charge-3.png',
    ],
    imageSize: [165, 342],
    imageFrame: 'phone',
  },
  {
    id: 'ezl-backoffice',
    companyId: 'ezllabs',
    name: '백오피스',
    platform: 'React · 운영 웹',
    summary: '내부 관리자가 사용하는 앱 운영 관리 웹사이트입니다.',
    images: ['/static/images/ezl-backoffice-1.png'],
    imageSize: [520, 262],
  },
  {
    id: 'ezl-design-system',
    companyId: 'ezllabs',
    name: '디자인 시스템',
    platform: 'React Native · Storybook',
    summary: '이즐랩스의 모바일 앱을 위한 디자인 시스템을 구현한 프로젝트입니다.',
    images: ['/static/images/ezl-design-system-2.png', '/static/images/ezl-design-system-1.png'],
    imageSize: [210, 338],
    imageFrame: 'tablet',
  },
  {
    id: 'ezl-ai',
    companyId: 'ezllabs',
    name: 'Jira/Confluence 검색 AI',
    platform: 'TypeScript · Genkit',
    summary: '자연어 질의로 사내 Jira·Confluence 데이터를 검색하는 내부 도구입니다.',
    images: ['/static/images/ezl-ai.png'],
    imageSize: [350, 265],
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
