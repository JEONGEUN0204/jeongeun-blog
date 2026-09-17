import type { ReactNode } from 'react'
import Label, { type LabelKind } from '@/components/mdx/Label'
import Meta from '@/components/mdx/Meta'
import Section from '@/components/mdx/Section'
import { projects } from '@/content/projects'
import type { Narrative, Project } from '@/content/schema'

/*
  content/projects/{id}.ts 의 narrative(7단 서술)를 문서별 압축률로 렌더한다.

  여기서는 문구를 만들지 않는다. '문제'·'선택' 같은 라벨은 칸 이름일 뿐이고 본문은 전부
  narrative 필드를 그대로 꺼낸다. narrative 가 있는 프로젝트의 서술을 MDX 에 다시 옮겨 적으면
  두 곳이 갈라지므로, 그 프로젝트의 서술은 이 파일만 렌더한다.

  칸 이름은 세 렌더러가 같은 말을 쓴다. 같은 스키마를 문서마다 다르게 부르면
  압축률만 다른 같은 사실이라는 게 읽히지 않는다.
*/

type Row = {
  label: string
  kind: LabelKind
  content: ReactNode
  /** 결과 행만 배경으로 올린다. 행이 모두 같은 무게면 어디가 결과인지 안 읽힌다. */
  emphasis?: boolean
}

/** 라벨 컬럼 + 본문. MDX 의 <Steps> 와 같은 모양이라 손으로 쓴 섹션 옆에 놓여도 어긋나지 않는다. */
function Rows({ rows }: { rows: Row[] }) {
  return (
    <div className="not-prose space-y-1">
      {rows.map((row) => (
        <div
          key={row.label}
          className={`flex break-inside-avoid-page gap-3 rounded-md px-3 py-1.5 ${
            row.emphasis ? 'bg-primary-50 dark:bg-primary-400/10' : ''
          }`}
        >
          <span className="w-16 shrink-0">
            <Label kind={row.kind}>{row.label}</Label>
          </span>
          <div
            className={`min-w-0 text-sm leading-7 ${
              row.emphasis
                ? 'font-medium text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {row.content}
          </div>
        </div>
      ))}
    </div>
  )
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1 pl-4">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

/**
 * /portfolio 의 depth:'supporting' — 카드 1개 분량.
 *
 * 포트폴리오는 판단 근거를 보여주는 문서라 문제 → 관점 → 선택 → 결과 네 칸을 고른다.
 * 대안 검토·실행·전후 비교는 /careers 요약에 있고, 여기까지 넣으면 카드 1개를 넘는다.
 */
export function NarrativeCard({ narrative }: { narrative: Narrative }) {
  return (
    <div className="break-inside-avoid-page rounded-xl border border-gray-200 p-2 dark:border-gray-700">
      <Rows
        rows={[
          { label: '문제', kind: 'problem', content: narrative.problem },
          { label: '관점', kind: 'neutral', content: narrative.insight },
          { label: '선택', kind: 'approach', content: narrative.decision.chosen },
          { label: '결과', kind: 'result', content: narrative.result, emphasis: true },
        ]}
      />
    </div>
  )
}

/** 풀 전개의 한 칸. 라벨 칩을 위, 본문을 아래에 둔다 — 포트폴리오 MDX 의 <Block> 과 같은 모양이다. */
function Stage({
  label,
  kind,
  emphasis,
  children,
}: {
  label: string
  kind: LabelKind
  emphasis?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`break-inside-avoid-page ${
        emphasis ? 'bg-primary-50 dark:bg-primary-400/10 rounded-lg p-4' : ''
      }`}
    >
      <Label kind={kind}>{label}</Label>
      <div
        className={`mt-2 max-w-[68ch] leading-7 ${
          emphasis
            ? 'font-medium text-gray-900 dark:text-gray-100'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

const STAGE_LABEL = {
  problem: '문제',
  insight: '관점',
  decision: '선택',
  action: '실행',
  'before-after': '이전 · 이후',
  result: '결과',
  learning: '배움',
} as const

export type NarrativeStageKey = keyof typeof STAGE_LABEL

/** 풀 전개의 칸 순서와 이름. 본문 라벨 칩과 /portfolio 목차가 같은 목록을 쓴다. */
export const NARRATIVE_STAGES = (Object.keys(STAGE_LABEL) as NarrativeStageKey[]).map((key) => ({
  key,
  label: STAGE_LABEL[key],
}))

/** 풀 전개 한 칸의 id. 한 페이지에 프로젝트가 여럿 놓이므로 프로젝트 id 를 앞에 붙인다. */
export const narrativeStageId = (idPrefix: string, key: NarrativeStageKey) => `${idPrefix}-${key}`

/**
 * /portfolio 의 depth:'flagship' — 7단 풀 전개 + decision.rejected.
 *
 * 칸은 한 흐름으로 이어진다. 칸마다 id 를 달아 목차가 그 자리로 이동하고, 이동 뒤 포커스를 받도록
 * tabIndex=-1 을 둔다. 대안·제약은 선택의 근거라 따로 떼지 않고 '선택' 칸 안에 둔다 —
 * "왜 이걸 안 했나"가 선택 바로 아래에서 읽혀야 한다.
 *
 * 카드·요약과 달리 라벨 컬럼을 두지 않는다. 문단이 길어서 라벨 컬럼에 폭을 떼 주면
 * 한 줄이 짧아지고 문단이 세로로 늘어진다. 각 칸은 라벨 칩을 스스로 달아 인쇄에서도 칩이 제목 역할을 한다.
 */
export function NarrativeFull({ narrative, idPrefix }: { narrative: Narrative; idPrefix: string }) {
  const { decision, beforeAfter } = narrative
  const anchor = (key: NarrativeStageKey) => ({ id: narrativeStageId(idPrefix, key), tabIndex: -1 })

  /*
    prose 컨테이너 안에 놓일 수 있어 not-prose 로 감싼다.
    인쇄에서는 칸 간격을 줄인다 — 화면 간격 그대로면 마지막 칸(배움) 두 줄이 다음 장으로 넘어가 한 장을 비운다.
  */
  return (
    <div className="not-prose space-y-10 print:space-y-6">
      <div {...anchor('problem')} className="outline-none">
        <Stage label={STAGE_LABEL.problem} kind="problem">
          <p>{narrative.problem}</p>
        </Stage>
      </div>
      <div {...anchor('insight')} className="outline-none">
        <Stage label={STAGE_LABEL.insight} kind="neutral">
          <p>{narrative.insight}</p>
        </Stage>
      </div>
      <div {...anchor('decision')} className="space-y-7 outline-none">
        <Stage label={STAGE_LABEL.decision} kind="approach">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{decision.chosen}</p>
        </Stage>
        {/* 대안은 버린 안을 굵게 세우고 이유를 그 아래에 둔다 — "왜 이걸 안 했나"가 이 문서의 요점이다. */}
        {decision.rejected.length > 0 && (
          <Stage label="대안" kind="neutral">
            <ul className="space-y-4">
              {decision.rejected.map(({ option, reason }) => (
                <li
                  key={option}
                  className="break-inside-avoid-page border-l-2 border-gray-200 pl-4 dark:border-gray-700"
                >
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{option}</p>
                  <p className="mt-1 text-sm leading-7">{reason}</p>
                </li>
              ))}
            </ul>
          </Stage>
        )}
        <Stage label="제약" kind="neutral">
          <p>{decision.constraint}</p>
        </Stage>
      </div>
      <div {...anchor('action')} className="outline-none">
        <Stage label={STAGE_LABEL.action} kind="approach">
          <List items={narrative.action} />
        </Stage>
      </div>
      <div {...anchor('before-after')} className="grid gap-4 outline-none sm:grid-cols-2">
        <div className="break-inside-avoid-page rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <Label kind="neutral">이전</Label>
          <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
            {beforeAfter.before}
          </p>
        </div>
        <div className="break-inside-avoid-page rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <Label kind="neutral">이후</Label>
          <p className="mt-2 text-sm leading-7 text-gray-900 dark:text-gray-100">
            {beforeAfter.after}
          </p>
        </div>
      </div>
      <div {...anchor('result')} className="outline-none">
        <Stage label={STAGE_LABEL.result} kind="result" emphasis>
          <p>{narrative.result}</p>
        </Stage>
      </div>
      <div {...anchor('learning')} className="outline-none">
        <Stage label={STAGE_LABEL.learning} kind="neutral">
          <p>{narrative.learning}</p>
        </Stage>
      </div>
    </div>
  )
}

/**
 * /careers — 7단 전체 요약.
 *
 * decision.rejected 도 싣는다. supporting 은 /portfolio 에서 카드 1개로 줄어 대안 검토가
 * 빠지므로, 여기서마저 빼면 어느 문서에도 남지 않는다.
 */
export function NarrativeSummary({
  project,
  narrative,
  no,
  suffix,
  children,
}: {
  project: Project
  narrative: Narrative
  /** '09' 형태. Section 이 'NN. 제목' 을 번호 배지로 승격한다. */
  no: string
  /** 'Web · 핵심' 형태. Section 이 제목 끝 괄호를 칩으로 뗀다. */
  suffix?: string
  /** narrative 밖의 내용. 같은 섹션 끝에 붙는다. */
  children?: ReactNode
}) {
  const rows: Row[] = [
    { label: '문제', kind: 'problem', content: narrative.problem },
    { label: '관점', kind: 'neutral', content: narrative.insight },
    { label: '선택', kind: 'approach', content: narrative.decision.chosen },
  ]
  if (narrative.decision.rejected.length > 0) {
    rows.push({
      label: '대안',
      kind: 'neutral',
      content: (
        <List
          items={narrative.decision.rejected.map(({ option, reason }) => (
            <>
              <span className="font-medium text-gray-900 dark:text-gray-100">{option}</span> —{' '}
              {reason}
            </>
          ))}
        />
      ),
    })
  }
  rows.push(
    { label: '제약', kind: 'neutral', content: narrative.decision.constraint },
    { label: '실행', kind: 'neutral', content: <List items={narrative.action} /> },
    { label: '이전', kind: 'neutral', content: narrative.beforeAfter.before },
    { label: '이후', kind: 'neutral', content: narrative.beforeAfter.after },
    { label: '결과', kind: 'result', content: narrative.result, emphasis: true },
    { label: '배움', kind: 'neutral', content: narrative.learning }
  )

  /*
    하위 프로젝트(parentId)는 상위 이름을 앞에 붙인다. 손으로 쓴 섹션의
    'ChatCODIT App · 구축·결제' 와 같은 '제품 · 작업' 모양이어야 같은 제품의 작업으로 묶여 읽힌다.
  */
  const parent = project.parentId
    ? projects.find((item) => item.id === project.parentId)
    : undefined
  const title = parent ? `${parent.name} · ${project.name}` : project.name

  return (
    <Section title={`${no}. ${title}${suffix ? ` (${suffix})` : ''}`}>
      <Meta
        tech={[...project.stack.primary, ...project.stack.secondary].join(' · ')}
        role={project.roleDetail}
      />
      <Rows rows={rows} />
      {children && <div className="mt-6">{children}</div>}
    </Section>
  )
}

/**
 * MDX 용 자리 표시. 회사 MDX 가 번호 섹션 사이 원하는 자리에 narrative 요약을 둘 때 쓴다.
 *
 * 서술은 id 로 content/projects 에서 찾는다. 자리를 잡지 않은 narrative 프로젝트는
 * CareerList 가 본문 끝에 붙인다. id 가 틀리면 조용히 비는 대신 빌드를 멈춘다.
 */
export function ProjectNarrative({
  id,
  no,
  suffix,
  children,
}: {
  id: string
  no: string
  suffix?: string
  children?: ReactNode
}) {
  const project = projects.find((item) => item.id === id)
  if (!project?.narrative) {
    throw new Error(
      `<ProjectNarrative id="${id}"> — narrative 가 있는 content/projects 항목이 없다`
    )
  }

  return (
    <NarrativeSummary project={project} narrative={project.narrative} no={no} suffix={suffix}>
      {children}
    </NarrativeSummary>
  )
}
