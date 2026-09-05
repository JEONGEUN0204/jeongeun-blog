/**
 * 세 문서(/resume · /careers · /portfolio)가 공유하는 사실의 타입 정의.
 *
 * 목적은 "규칙을 타입으로 강제"하는 것이다. 서류 피드백에서 반복 지적된 항목
 * (역할·팀 구성 누락, 근거 없는 수치, 대안 검토 부재)을 옵셔널이 아닌 필수 필드로
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

export type TeamComposition = {
  fe: number
  be: number
  pm: number
  design: number
  qa: number
}

/** flagship 만 /portfolio 에서 풀 전개한다. supporting 은 카드 1개 분량. */
export type ProjectDepth = 'flagship' | 'supporting'

/** operation = 운영 중 발생한 문제 대응 사례. 비어 있으면 verify가 경고한다. */
export type ProjectKind = 'improvement' | 'build' | 'operation'

export type Project = {
  /** data/projects/{id}.mdx 파일명과 반드시 같다. 두 소스를 잇는 유일한 키. */
  id: string
  companyId: CompanyId
  name: string
  /** 회사 재직 기간과 다를 때만 명시. 없으면 회사 기간을 상속한다. */
  periodOverride?: Period
  role: ProjectRole
  /** 역할을 한 줄로 구체화. 예: 'SSE 프로토콜 초안 설계 및 프론트 파서 전면 교체' */
  roleDetail: string
  team: TeamComposition | Tbd
  /** 실제 수행 + 의사결정 기여 범위 */
  contribution: string | Tbd
  /** 버전 표기 금지. primary = 주력, secondary = 보조. */
  stack: { primary: string[]; secondary: string[] }
  metricIds: string[]
  depth: ProjectDepth
  kind: ProjectKind
  /**
   * 7단 서술. 현재는 본문이 data/projects/{id}.mdx 에 있고 이쪽으로 이관 예정이다.
   * 이관이 끝나기 전까지 undefined 이며, verify가 미이관 목록으로 보고한다.
   */
  narrative?: Narrative
}

/** /resume 의 회사별 압축 하이라이트. 7단 이관이 끝나면 narrative 에서 파생된다. */
export type ExperienceHighlight = {
  title: string
  detail: string
}

export type ExperienceGroup = {
  /** 예: 'ChatCODIT (Web)' */
  product: string
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
