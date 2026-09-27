/**
 * 세 문서(/resume · /careers · /portfolio)가 공유하는 사실의 타입 정의.
 *
 * 목적은 "규칙을 타입으로 강제"하는 것이다. 서류 피드백에서 반복 지적된 항목
 * (역할 누락, 근거 없는 수치, 대안 검토 부재)을 옵셔널이 아닌 필수 필드로
 * 두어, 비어 있으면 타입 또는 `npm run verify`에서 드러나게 한다.
 */

/** 아직 확보하지 못한 사실. 지어내는 대신 이 값을 넣으면 verify가 목록으로 보고한다. */
export const TBD = 'TBD'
export type Tbd = typeof TBD

/**
 * 'YYYY.MM'. 개월 수는 어떤 형태로도 저장하지 않는다 —
 * 매월 갱신이 필요해지고, 갱신을 놓치는 순간 문서 간 불일치가 된다.
 */
export type YearMonth = `${number}.${number}`

export type Period = {
  start: YearMonth
  end: YearMonth | 'present'
}

export type CompanyId = 'codit' | 'ezllabs'

export type Company = {
  id: CompanyId
  /** 화면에 그대로 노출되는 회사명 */
  name: string
  period: Period
  /** 회사·서비스 규모 등 기간 옆에 붙는 맥락 한 줄 */
  context: string
}

/**
 * 검증된 수치만 등록한다. evidence 없이 화면에 뜨는 숫자는 면접에서 방어할 수 없다.
 * - tech: 기술 지표. businessImpact 로 사업 지표까지 연결해야 완성이다.
 * - business: 사업 지표 그 자체.
 * - scope: 숫자가 아닌 범위 표기(예: '0 → 1'). 연결할 사업 지표가 없다.
 */
export type MetricKind = 'tech' | 'business' | 'scope'

export type Metric = {
  id: string
  /** 화면에 크게 노출되는 값. 예: 'API 75%↓' */
  value: string
  /** 값 아래 라벨 */
  label: string
  kind: MetricKind
  /** 측정 방법·출처. 화면에 렌더하지 않는다. 면접 대비용. */
  evidence: string | Tbd
  /** kind:'tech' 에서만 필수. 연결할 사업 지표가 아직 없으면 TBD. */
  businessImpact?: string | Tbd
}

/** 대안 검토 — "그 성과가 우리 회사에서도 재현됩니까?"에 답하는 자리. */
export type Decision = {
  chosen: string
  rejected: { option: string; reason: string }[]
  /** 그때의 제약(일정·팀·레거시). 선택 근거는 제약과 함께 읽혀야 한다. */
  constraint: string
}

export type Narrative = {
  problem: string
  insight: string
  decision: Decision
  action: string[]
  beforeAfter: { before: string; after: string }
  result: string
  learning: string
}

/** 담당/리드/설계가 섞여 있으면 어떤 역할로 뽑을지 판단이 서지 않는다. 하나만 고른다. */
export type ProjectRole = '단독 담당' | '설계·구현 리드' | '기능 담당' | '일부 참여' | Tbd

/** flagship 만 /portfolio 에서 풀 전개한다. supporting 은 카드 1개 분량. */
export type ProjectDepth = 'flagship' | 'supporting'

/** operation = 운영 중 발생한 문제 대응 사례. 비어 있으면 verify가 경고한다. */
export type ProjectKind = 'improvement' | 'build' | 'operation'

/**
 * 제품 — 내가 한 '작업'이 놓였던 대상. Project 와 층이 다르다.
 *
 * 예전에는 제품도 Project 로 표현해서, 'Codit 플랫폼' 처럼 작업이 없는 레코드가
 * role·roleDetail·contribution 을 전부 TBD 로 채운 채 남아 있었다. 채울 값이 없어서가 아니라
 * 그 레코드가 작업이 아니어서 채울 것이 없었다. 제품을 따로 두면 그 빈칸이 사라진다.
 *
 * 세 문서가 이 이름을 공유한다 — /portfolio 카드 제목, /careers 의 <ProductGroup> 구분선,
 * /resume 의 그룹 소제목. 문자열을 세 곳에 각각 적던 자리다.
 */
export type Product = {
  id: string
  companyId: CompanyId
  /** 화면에 그대로 노출되는 제품명. 예: 'ChatCODIT App' */
  name: string
  /** 제품이 놓인 자리. 예: 'iOS · Android'. 라벨은 `이름 · platform` 으로 만든다. */
  platform: string
  /** /portfolio 카드 앞면과 제품 개요의 한 줄 소개. 아직 문구를 확정하지 못했으면 비운다. */
  summary?: string
  /** 대표 스크린샷. 첫 장이 카드 타일에 깔린다. 비면 카드는 글자만 싣는다. */
  images?: string[]
  /**
   * 스크린샷 [표시 폭, 표시 높이]. images 가 있으면 반드시 있어야 한다(verify 가 검사).
   *
   * 폭은 A4 인쇄 폭(약 640px 콘텐츠 폭) 안에서 한 제품의 이미지가 gap 포함 한 줄에
   * 들어가도록 정한다(2장이면 300 등). 높이는 h-auto 라 원본 비율을 따른다.
   */
  imageSize?: [number, number]
  imageFrame?: ImageFrame
}

/** 스크린샷을 감쌀 기기 프레임. 비율만으로는 세로형 데스크톱 캡처와 구분되지 않아 명시한다. */
export type ImageFrame = 'phone' | 'tablet'

export type Project = {
  /** content/projects/{id}.ts 파일명과 같다. /careers 의 <ProjectNarrative id="..."> 가 가리키는 키다. */
  id: string
  companyId: CompanyId
  /**
   * 이 작업이 놓인 제품. content/products.ts 의 Product['id'] 와 같아야 한다(verify 가 검사).
   *
   * 예외 없이 모든 작업이 제품에 속한다 — 제품에 작업이 하나뿐이어도 마찬가지다.
   * '제품에 속한 작업'과 '그렇지 않은 작업'이 갈라져 있던 자리라, 한쪽에만 적용되는 규칙이
   * 계속 생겼다.
   */
  productId: string
  /**
   * 작업 이름. 제품 이름을 앞에 붙이지 않는다 — 제품은 카드 제목과 <ProductGroup> 구분선이 적는다.
   * 예: 'ChatCODIT App · 구축·결제' 가 아니라 '구축·결제'.
   */
  name: string
  role: ProjectRole
  /** 역할을 한 줄로 구체화. 예: 'SSE 프로토콜 초안 설계 및 프론트 파서 전면 교체' */
  roleDetail: string
  /** 실제 수행 + 의사결정 기여 범위 */
  contribution: string | Tbd
  /** 버전 표기 금지. primary = 주력, secondary = 보조. */
  stack: { primary: string[]; secondary: string[] }
  metricIds: string[]
  depth: ProjectDepth
  kind: ProjectKind
  /**
   * 7단 서술. 아직 블록을 받지 못한 작업만 undefined 이고, verify 가 목록으로 보고한다.
   * 서술이 없는 작업은 /careers 회사 MDX 에 손으로 쓴 <Section> 이 대신한다.
   */
  narrative?: Narrative
}

/** /resume 의 회사별 압축 하이라이트. 7단 이관이 끝나면 narrative 에서 파생된다. */
export type ExperienceHighlight = {
  title: string
  detail: string
}

export type ExperienceGroup = {
  /** content/products.ts 의 Product['id']. 소제목 문자열은 제품에서 만든다. */
  productId: string
  highlights: ExperienceHighlight[]
}

export type Experience = {
  companyId: CompanyId
  role: string
  summary: string
  groups: ExperienceGroup[]
}

/** 나열만 하면 주력/보조를 알 수 없다는 지적에 따라 두 단으로 나눈다. */
export type SkillGroup = {
  category: string
  primary: string[]
  secondary: string[]
}

export type Education = {
  school: string
  detail?: string
  period: string
}

export type Certificate = {
  name: string
  issuer: string
  date: string
}

export type Collaboration = {
  audience: string
  body: string
  example: string
}

export type ProfileBasic = {
  name: string
  title: string
  tagline: string
  email: string
  phone: string
  github: string
}
