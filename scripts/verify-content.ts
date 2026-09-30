/**
 * 콘텐츠 규칙 검사기.
 *
 * CLAUDE.md 의 "절대 규칙"을 사람이 지키는 대신 여기서 강제한다. 세 문서가 같은 사실을
 * 각자 들고 있던 시절에는 규칙을 문서로 아무리 적어도 불일치가 계속 재발했다.
 *
 *   npm run verify
 *
 * error 가 하나라도 있으면 종료 코드 1. warning 은 통과시키되 매번 목록으로 남긴다
 * (아직 확보하지 못한 사실을 지어내지 않고 TBD 로 두기 위한 장치다).
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

import { companies } from '../content/companies'
import { metrics } from '../content/metrics'
import { products } from '../content/products'
import { projects } from '../content/projects'
import { about, aboutLead, skills } from '../content/profile'
import { experiences } from '../content/experience'
import { highlightMetricIds, renderedHighlight } from '../content/highlight'
import { TBD } from '../content/schema'

const errors: string[] = []
const warnings: string[] = []
const todos: string[] = []

const error = (message: string) => errors.push(message)
const warn = (message: string) => warnings.push(message)
const todo = (message: string) => todos.push(message)

const ROOT = process.cwd()

/* ------------------------------------------------------------------ *
 * 파일 수집
 * ------------------------------------------------------------------ */

type SourceFile = { path: string; text: string }

function readDir(dir: string, ext: string): SourceFile[] {
  const full = join(ROOT, dir)
  if (!existsSync(full)) return []
  return readdirSync(full, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return readDir(path, ext)
    return entry.name.endsWith(ext) ? [{ path, text: readFileSync(join(ROOT, path), 'utf-8') }] : []
  })
}

/** 사람이 읽는 문구가 들어가는 곳. 금지 표현 검사 대상. */
const proseFiles: SourceFile[] = [...readDir('content', '.ts'), ...readDir('data/careers', '.mdx')]

/** 사실을 하드코딩하면 안 되는 곳. 렌더 로직만 있어야 한다. */
const renderFiles: SourceFile[] = [
  ...readDir('app', '.tsx'),
  ...readDir('components', '.tsx'),
  ...readDir('layouts', '.tsx'),
]

/* ------------------------------------------------------------------ *
 * 1. 금지 표현 (CLAUDE.md 절대 규칙 3 과 동기화 유지)
 * ------------------------------------------------------------------ */

const BANNED_WORDS = ['네이티브 앱', '진단', '사이클을 만들', '풀스택']

const BANNED_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /(?<=[A-Za-z가-힣)\]] )v\d+(\.\d+)?\b/, label: '버전 표기' },
  { pattern: /약 ?\d+ ?개월/, label: '갱신 필요 표기(약 N개월)' },
  { pattern: /\d+ ?년 ?\d+ ?개월/, label: '갱신 필요 표기(N년 N개월)' },
  { pattern: /총 ?경력 ?약/, label: '갱신 필요 표기(총 경력 약)' },
]

/**
 * 코드 주석은 화면에 나가지 않는다. 오히려 "예전에 '약 10개월' 로 갈라져 있었다" 처럼
 * 금지 표현이나 옛 날짜를 인용해 설명해야 할 때가 있으므로 검사에서 뺀다.
 * 줄 번호를 유지해야 하므로 블록 주석은 지우지 않고 공백으로 바꾼다.
 */
const codeLines = (text: string) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '))
    .split('\n')
    // `https://` 의 // 까지 잘라내면 뒤따르는 값이 검사에서 빠지므로 앞이 콜론이면 남긴다.
    .map((line) => line.replace(/(^|[^:])\/\/.*$/, '$1'))

/** MDX 는 전부 본문으로 본다. */
const proseLines = (file: SourceFile) =>
  file.path.endsWith('.mdx') ? file.text.split('\n') : codeLines(file.text)

for (const file of proseFiles) {
  proseLines(file).forEach((line, index) => {
    const at = `${file.path}:${index + 1}`
    for (const word of BANNED_WORDS) {
      if (line.includes(word)) error(`${at} 금지어 '${word}'`)
    }
    for (const { pattern, label } of BANNED_PATTERNS) {
      const matched = line.match(pattern)
      if (matched) error(`${at} ${label} '${matched[0].trim()}'`)
    }
  })
}

/* ------------------------------------------------------------------ *
 * 2. app/components/layouts 에 사실 하드코딩 금지
 * ------------------------------------------------------------------ */

const DATE_LITERAL = /(?<!\d)(20\d{2})[.-](0[1-9]|1[0-2])(?!\d)/
const DATE_LITERAL_G = new RegExp(DATE_LITERAL.source, 'g')

for (const file of renderFiles) {
  codeLines(file.text).forEach((line, index) => {
    const matched = line.match(DATE_LITERAL)
    if (matched) {
      error(`${file.path}:${index + 1} 날짜 하드코딩 '${matched[0]}' — content/ 에서 import 할 것`)
    }
  })
}

/* ------------------------------------------------------------------ *
 * 3. 지표 — evidence 없는 숫자는 방어할 수 없다
 * ------------------------------------------------------------------ */

const metricIds = new Set(metrics.map((metric) => metric.id))
if (metricIds.size !== metrics.length) error('metrics.ts 에 중복 id 가 있다')

for (const metric of metrics) {
  if (metric.label === TBD) todo(`metrics.ts '${metric.id}' (${metric.value}) — label 미확정`)

  if (!metric.evidence.trim()) {
    error(`metrics.ts '${metric.id}' evidence 가 비어 있다`)
  } else if (metric.evidence === TBD) {
    todo(`metrics.ts '${metric.id}' (${metric.value}) — evidence 미확보`)
  }

  if (metric.kind !== 'tech') continue

  if (!metric.businessImpact?.trim()) {
    error(`metrics.ts '${metric.id}' 는 기술 지표인데 businessImpact 가 없다`)
  } else if (metric.businessImpact === TBD) {
    todo(`metrics.ts '${metric.id}' (${metric.value}) — 연결할 사업 지표 미확보`)
  }
}

/* ------------------------------------------------------------------ *
 * 4. 제품 — 작업이 놓이는 자리
 * ------------------------------------------------------------------ */

const companyIds = new Set(companies.map((company) => company.id))

const productIds = new Set(products.map((product) => product.id))
if (productIds.size !== products.length) error('content/products.ts 에 중복 id 가 있다')

for (const product of products) {
  const at = `content/products.ts '${product.id}'`

  if (!companyIds.has(product.companyId)) {
    error(`${at} companies.ts 에 없는 companyId '${product.companyId}'`)
  }
  if (!product.name.trim()) error(`${at} name 이 비어 있다`)
  if (!product.platform.trim()) error(`${at} platform 이 비어 있다`)

  // 작업이 없는 제품은 /portfolio 카드만 있고 내용이 없다.
  if (!projects.some((project) => project.productId === product.id)) {
    error(`${at} 에 속한 작업이 없다 — content/projects 에서 productId 로 가리키는 파일이 없다`)
  }

  // /portfolio 카드 앞면이 제목·스택만 남는다. 지어내지 않고 TBD 로 두되 목록으로 남긴다.
  if (!product.summary?.trim()) todo(`${at} /portfolio 카드 요약(summary) 미확보`)

  /*
    스크린샷은 경로 문자열이라 오타가 나도 타입이 잡지 못한다. 빌드도 통과하고 화면에서만 깨지므로
    여기서 실제 파일을 확인한다 — 예전에는 MDX frontmatter 에 있어 검사 대상이 아니었다.
    imageSize 는 next/image 의 비율이라 이미지가 있으면 반드시 있어야 한다.
  */
  if (product.images?.length) {
    if (!product.imageSize) error(`${at} images 가 있는데 imageSize 가 없다`)
    for (const image of product.images) {
      if (!existsSync(join(ROOT, 'public', image))) {
        error(`${at} 스크린샷 파일이 없다: public${image}`)
      }
    }
  }
}

/* ------------------------------------------------------------------ *
 * 5. 작업 — 역할·대안 검토
 * ------------------------------------------------------------------ */

/**
 * /resume 한 줄 = 작업 하나의 highlight. 이력서는 압축형, 경력기술서는 서술형으로 갈라 쓴다.
 * 금지 표현(개월 수 등)은 1번 검사가 content/projects/*.ts 전체를 훑으며 함께 잡는다.
 */
const HIGHLIGHT_MAX = 110
/** `{m:}` 밖에 직접 적힌 수치. 날짜(2025.09)는 앞에서 지운 뒤 검사한다. */
const RAW_NUMBER = /\d[\d,.]*\s*(%|건|초|줄|회|종|장)/

function checkHighlight(project: (typeof projects)[number], at: string) {
  const highlight = project.highlight.trim()
  if (!highlight || highlight === TBD) {
    error(`${at} highlight 가 비어 있거나 TBD 다 — /resume 에 이 작업의 줄이 없다`)
    return
  }

  if (/(다\.?|함|됨|\.)$/.test(highlight)) {
    error(`${at} highlight 가 '다'·'함'·'됨'·마침표로 끝난다 — 명사로 끝낸다`)
  }

  const referenced = highlightMetricIds(highlight)
  for (const id of referenced) {
    if (!project.metricIds.includes(id)) {
      error(`${at} highlight 의 {m:${id}} 가 이 작업의 metricIds 에 없다`)
    }
  }
  // 없는 id 는 렌더 단계에서 getMetric 이 던진다. 위에서 이미 실패로 보고했으니 길이 검사는 건너뛴다.
  if (referenced.some((id) => !metricIds.has(id))) return

  const outside = highlight.replace(/\{m:[^}]+\}/g, '').replace(DATE_LITERAL_G, '')
  const raw = outside.match(RAW_NUMBER)
  if (raw) {
    warn(
      `${at} highlight 에 수치 '${raw[0]}' 가 직접 적혀 있다 — metrics.ts 에 등록하고 {m:id} 로 참조한다`
    )
  }

  const rendered = renderedHighlight(highlight)
  if (rendered.length > HIGHLIGHT_MAX) {
    warn(
      `${at} highlight 가 ${rendered.length}자다 — ${HIGHLIGHT_MAX}자를 넘으면 /resume 가 A4 1장을 넘기기 쉽다`
    )
  }

  if (project.narrative && rendered === project.narrative.result.trim()) {
    error(`${at} highlight 가 narrative.result 와 같다 — 이력서는 압축형으로 따로 쓴다`)
  }
}

const projectIds = new Set(projects.map((project) => project.id))
if (projectIds.size !== projects.length) error('content/projects 에 중복 id 가 있다')

for (const project of projects) {
  const at = `content/projects/${project.id}.ts`

  if (!companyIds.has(project.companyId)) {
    error(`${at} companies.ts 에 없는 companyId '${project.companyId}'`)
  }

  /*
    name 은 /resume 하이라이트 제목·/careers 섹션 제목·/portfolio 섹션 제목이 함께 쓴다.
    예전에는 TBD 를 보고만 했는데, 이력서 제목이 이 값을 그대로 찍으므로 실패로 올린다.
    '무엇이 바뀌었는지 보이는 이름인가' 는 사람이 판단한다 — 여기서는 끝맺음만 본다.
  */
  if (!project.name.trim() || project.name === TBD) {
    error(`${at} name 이 비어 있거나 TBD 다 — /resume 하이라이트 제목으로 그대로 나간다`)
  } else if (/(을|를|로|으로|에|의|다\.?)$/.test(project.name.trim())) {
    error(`${at} name '${project.name}' 이 조사나 '다' 로 끝난다 — 명사로 끝낸다`)
  }
  if (!project.roleDetail.trim()) error(`${at} roleDetail 이 비어 있다`)
  if (project.role === TBD) todo(`${at} role 미확정 (담당/리드/설계 중 무엇인지)`)
  if (project.contribution === TBD) todo(`${at} 기여 범위 미확보`)

  if (project.stack.primary.length === 0) error(`${at} stack.primary 가 비어 있다`)

  // 작업은 예외 없이 제품에 속한다. 가리키는 제품이 없으면 /portfolio 에 렌더될 자리가 없다.
  const product = products.find((item) => item.id === project.productId)
  if (!product) {
    error(`${at} content/products.ts 에 없는 productId '${project.productId}'`)
  } else if (product.companyId !== project.companyId) {
    error(`${at} 제품 '${product.id}' 와 companyId 가 다르다`)
  }

  // 제품 이름을 작업 이름 앞에 다시 적으면 /careers 제목과 카드 뒷면에 같은 말이 두 번 나온다.
  if (product && project.name.startsWith(`${product.name} · `)) {
    error(`${at} name 이 제품 이름('${product.name}')으로 시작한다 — 작업 이름만 둔다`)
  }

  for (const id of project.metricIds) {
    if (!metricIds.has(id)) error(`${at} metrics.ts 에 없는 metricId '${id}'`)
  }

  checkHighlight(project, at)

  // headline 은 /portfolio 제목이다. 수치 규칙은 highlight 와 같다 — 타이핑하지 않고 {m:id} 로 참조한다.
  if (project.headline !== undefined) {
    const headline = project.headline.trim()
    if (!headline || headline === TBD)
      error(`${at} headline 이 비어 있거나 TBD 다 — 없으면 필드를 지운다`)
    for (const id of highlightMetricIds(headline)) {
      if (!project.metricIds.includes(id)) {
        error(`${at} headline 의 {m:${id}} 가 이 작업의 metricIds 에 없다`)
      }
    }
    const raw = headline
      .replace(/\{m:[^}]+\}/g, '')
      .replace(DATE_LITERAL_G, '')
      .match(RAW_NUMBER)
    if (raw) {
      warn(`${at} headline 에 수치 '${raw[0]}' 가 직접 적혀 있다 — {m:id} 로 참조한다`)
    }
    if (product && headline.startsWith(`${product.name} · `)) {
      error(`${at} headline 이 제품 이름('${product.name}')으로 시작한다 — 카드 제목이 이미 적는다`)
    }
  }

  if (!project.narrative) {
    if (project.depth === 'flagship') {
      todo(`${at} flagship 인데 7단 서술(narrative)이 없다`)
    }
    continue
  }

  const rejected = project.narrative.decision.rejected
  if (project.depth === 'flagship' && rejected.length === 0) {
    error(`${at} flagship 은 decision.rejected(대안 검토)가 1건 이상 필요하다`)
  }
  if (rejected.some((option) => !option.reason.trim())) {
    error(`${at} decision.rejected 에 이유 없는 항목이 있다`)
  }
}

const flagships = projects.filter((project) => project.depth === 'flagship')
if (flagships.length === 0) {
  error('depth:flagship 작업이 없다 — /portfolio 가 집중할 대상이 없다')
}
if (flagships.length > 1) {
  warn(`flagship 이 ${flagships.length}개다 — /portfolio 는 1개 집중이 원칙이다`)
}

// 한 제품에 flagship 이 둘이면 /portfolio 가 풀 전개를 둘 다 펼쳐 카드 1장 분량을 넘긴다.
for (const product of products) {
  const leads = projects.filter(
    (project) => project.productId === product.id && project.depth === 'flagship'
  )
  if (leads.length > 1) {
    error(`content/products.ts '${product.id}' 에 flagship 작업이 ${leads.length}개다 — 1개만 둔다`)
  }
}

if (!projects.some((project) => project.kind === 'operation')) {
  warn("kind:'operation' 프로젝트가 0건 — 운영 중 발생한 문제 대응 사례가 비어 있다")
}

/* ------------------------------------------------------------------ *
 * 6. 문서 간 역할 분리
 * ------------------------------------------------------------------ */

const sentences = (text: string) =>
  text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.replace(/\s+/g, ' ').trim())
    .filter((sentence) => sentence.length > 10)

/*
  ABOUT — 예전 summary↔about 문장 중복 검사를 대신한다. profile.summary 를 없애고
  about 하나로 합쳤으므로 두 문서가 같은 말을 할 여지가 사라졌고, 대신 ABOUT 안에서
  제목과 본문이 같은 말을 반복하는 것을 막는다.
*/
if (!aboutLead.trim()) error('profile.aboutLead 가 비어 있다')
if (about.length === 0) error('profile.about 이 비어 있다')

const aboutTitles = new Set<string>()
for (const point of about) {
  if (!point.title.trim()) error('profile.about 에 제목(title)이 빈 항목이 있다')
  if (!point.body.trim()) error(`profile.about '${point.title}' 의 본문(body)이 비어 있다`)
  if (aboutTitles.has(point.title)) {
    error(`profile.about 에 제목이 겹치는 항목이 있다: '${point.title}'`)
  }
  aboutTitles.add(point.title)
  for (const sentence of sentences(point.body)) {
    if (sentence.replace(/[.!?]$/, '') === point.title) {
      error(`profile.about '${point.title}' 의 본문이 제목을 그대로 반복한다`)
    }
  }
}

for (const group of skills) {
  if (group.primary.length === 0 && group.secondary.length === 0) {
    error(`profile.skills '${group.category}' 가 비어 있다`)
  }
}

/* ------------------------------------------------------------------ *
 * 7. 세 문서의 커버리지
 * ------------------------------------------------------------------ */

// /careers 는 모든 회사를 렌더한다. 회사 하나가 빠지면 최신 경력이 통째로 사라진다.
for (const company of companies) {
  const path = join('data', 'careers', `${company.id}.mdx`)
  if (!existsSync(join(ROOT, path))) {
    error(`${company.name}(${company.id}) 의 경력기술서 ${path} 가 없다`)
  }
  if (!experiences.some((experience) => experience.companyId === company.id)) {
    error(`${company.name}(${company.id}) 가 content/experience.ts 에 없다 — /resume 에서 누락된다`)
  }
}

// 서술이 있는 작업은 회사 경력기술서에서 <ProjectNarrative> 로 자리를 잡아야 한다.
// 자리가 없으면 CareerList 가 회사 본문 끝에 붙여 같은 제품의 다른 작업과 멀리 떨어진다.
for (const project of projects) {
  if (!project.narrative) continue
  const path = join('data', 'careers', `${project.companyId}.mdx`)
  if (!existsSync(join(ROOT, path))) continue
  const placeholder = new RegExp(`<ProjectNarrative\\s[^>]*?\\bid="${project.id}"`)
  if (!placeholder.test(readFileSync(join(ROOT, path), 'utf-8'))) {
    warn(
      `content/projects/${project.id}.ts 의 서술이 ${path} 에 자리가 없다 — /careers 에서 회사 끝에 붙는다`
    )
  }
}

/* ------------------------------------------------------------------ *
 * 결과
 * ------------------------------------------------------------------ */

const section = (title: string, lines: string[], mark: string) => {
  if (lines.length === 0) return
  console.log(`\n${title} (${lines.length})`)
  for (const line of lines) console.log(`  ${mark} ${line}`)
}

section('ERROR', errors, '✗')
section('WARNING', warnings, '!')
section('TBD — 확보해야 할 사실', todos, '·')

if (errors.length > 0) {
  console.log(`\n실패: 규칙 위반 ${errors.length}건\n`)
  process.exit(1)
}

console.log(
  `\n통과. 경고 ${warnings.length}건 / TBD ${todos.length}건 (지어내지 말고 챗에서 확정해 전달할 것)\n`
)
