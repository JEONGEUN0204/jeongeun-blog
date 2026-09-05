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
import { join, basename } from 'path'

import { companies } from '../content/companies'
import { metrics } from '../content/metrics'
import { projects } from '../content/projects'
import { summary, about, skills } from '../content/profile'
import { experiences } from '../content/experience'
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
const proseFiles: SourceFile[] = [
  ...readDir('content', '.ts'),
  ...readDir('data/careers', '.mdx'),
  ...readDir('data/projects', '.mdx'),
]

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
 * 4. 프로젝트 — 역할·팀·대안 검토
 * ------------------------------------------------------------------ */

const projectIds = new Set(projects.map((project) => project.id))
if (projectIds.size !== projects.length) error('content/projects 에 중복 id 가 있다')

const companyIds = new Set(companies.map((company) => company.id))

for (const project of projects) {
  const at = `content/projects/${project.id}.ts`

  if (!companyIds.has(project.companyId)) {
    error(`${at} companies.ts 에 없는 companyId '${project.companyId}'`)
  }

  if (!project.roleDetail.trim()) error(`${at} roleDetail 이 비어 있다`)
  if (project.role === TBD) todo(`${at} role 미확정 (담당/리드/설계 중 무엇인지)`)
  if (project.team === TBD) todo(`${at} 팀 구성·규모 미확보`)
  if (project.contribution === TBD) todo(`${at} 기여 범위 미확보`)

  if (project.stack.primary.length === 0) error(`${at} stack.primary 가 비어 있다`)

  for (const id of project.metricIds) {
    if (!metricIds.has(id)) error(`${at} metrics.ts 에 없는 metricId '${id}'`)
  }

  if (!project.narrative) {
    if (project.depth === 'flagship') {
      todo(`${at} flagship 인데 7단 서술이 아직 MDX 본문에 있다 (이관 필요)`)
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
  error('depth:flagship 프로젝트가 없다 — /portfolio 가 집중할 대상이 없다')
}
if (flagships.length > 1) {
  warn(`flagship 이 ${flagships.length}개다 — /portfolio 는 1개 집중이 원칙이다`)
}

if (!projects.some((project) => project.kind === 'operation')) {
  warn("kind:'operation' 프로젝트가 0건 — 운영 중 발생한 문제 대응 사례가 비어 있다")
}

/* ------------------------------------------------------------------ *
 * 5. 문서 간 역할 분리
 * ------------------------------------------------------------------ */

const sentences = (text: string) =>
  text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.replace(/\s+/g, ' ').trim())
    .filter((sentence) => sentence.length > 10)

const summarySentences = new Set(sentences(summary))
for (const sentence of sentences(about.join('\n'))) {
  if (summarySentences.has(sentence)) {
    error(`profile.summary 와 profile.about 이 같은 문장을 쓴다: '${sentence}'`)
  }
}

for (const group of skills) {
  if (group.primary.length === 0 && group.secondary.length === 0) {
    error(`profile.skills '${group.category}' 가 비어 있다`)
  }
}

/* ------------------------------------------------------------------ *
 * 6. 세 문서의 커버리지
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

// content/projects 와 data/projects/*.mdx 는 id 로 1:1 대응해야 한다.
const mdxIds = new Set(readDir('data/projects', '.mdx').map((file) => basename(file.path, '.mdx')))
for (const id of projectIds) {
  if (!mdxIds.has(id)) error(`content/projects '${id}' 에 대응하는 data/projects/${id}.mdx 가 없다`)
}
for (const id of mdxIds) {
  if (!projectIds.has(id)) error(`data/projects/${id}.mdx 에 대응하는 content/projects 항목이 없다`)
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
