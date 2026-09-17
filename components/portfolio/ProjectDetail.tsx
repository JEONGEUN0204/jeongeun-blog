import React, {
  Children,
  Fragment,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react'
import * as _jsx_runtime from 'react/jsx-runtime'
import type { MDXComponents } from 'mdx/types'
import { allProjects, type Projects } from 'contentlayer/generated'
import { components } from '@/components/MDXComponents'
import {
  NARRATIVE_STAGES,
  NarrativeCard,
  NarrativeFull,
  narrativeStageId,
} from '@/components/Narrative'
import ProjectHeader, { ProjectMeta, StackTags } from './ProjectHeader'
import ProjectImages from './ProjectImages'
import type { ProjectSection } from './portfolio'
import { formatProjectPeriod, getSubprojects, portfolioName } from '@/content/projects'
import type { Narrative, Project } from '@/content/schema'

type MDXContent = (props: { components?: MDXComponents }) => ReactElement<{ children?: ReactNode }>

/**
 * contentlayer 가 컴파일한 MDX 코드를 컴포넌트 함수로 되살린다.
 *
 * pliny 의 MDXLayoutRenderer 가 안에서 하는 일과 같다(node_modules/pliny/mdx-components.js).
 * 그쪽은 <Mdx /> 엘리먼트를 돌려줘서 렌더가 끝나기 전에는 최상위 노드를 나눌 수 없어 함수를 직접 얻는다.
 * pliny 는 스코프에 ReactDOM 도 넣지만 프로젝트 MDX 는 react-dom 을 import 하지 않아 뺐다.
 */
function evaluateMdx(code: string): MDXContent {
  const scope = { React, _jsx_runtime }
  const fn = new Function(...Object.keys(scope), code)
  return fn(...Object.values(scope)).default
}

/** MDX `###` 의 표식. 평범한 h3 로 렌더되고, 최상위 노드를 나눌 때 type 으로 알아본다. */
function SectionHeading({ children, ...props }: ComponentProps<'h3'>) {
  return <h3 {...props}>{children}</h3>
}

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

/** MDX 는 최상위 노드 사이에 줄바꿈 문자열을 끼운다. 그것만 남은 조각은 내용이 아니다. */
const hasContent = (nodes: ReactNode[]) =>
  nodes.some((node) => typeof node !== 'string' || node.trim() !== '')

/**
 * MDX 본문을 `###` 기준으로 나눈다. 첫 소제목 앞의 노드는 lead 로 따로 둔다.
 *
 * MDXContent 를 함수로 부르면(wrapper 가 없을 때) 최상위 노드가 둘 이상이면 그것들을 children 으로 가진
 * Fragment 가, 하나뿐이면 그 노드 자체가 나온다.
 * 컴파일된 MDX 는 훅을 쓰지 않아 서버 컴포넌트에서 불러도 된다.
 * rehype 플러그인으로 섹션을 감싸는 방법도 있지만, contentlayer 의 MDX 설정은 블로그·경력기술서와
 * 공유라 그쪽 DOM 까지 바뀐다.
 */
function splitMdx(code: string) {
  const root = evaluateMdx(code)({ components: { ...components, h3: SectionHeading } })
  // <Block> 하나뿐인 본문에서 children 을 펼치면 Block 의 껍데기(라벨 칩)가 사라진다. Fragment 일 때만 펼친다.
  const top = root?.type === Fragment ? root.props.children : root
  const lead: ReactNode[] = []
  const sections: { title: string; nodes: ReactNode[] }[] = []

  for (const node of Children.toArray(top)) {
    if (isValidElement(node) && node.type === SectionHeading) {
      sections.push({ title: textOf(node).replace(/\s+/g, ' ').trim(), nodes: [node] })
    } else {
      ;(sections[sections.length - 1]?.nodes ?? lead).push(node)
    }
  }

  return { lead, sections }
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="prose dark:prose-invert prose-doc max-w-none">{children}</div>
}

interface Props {
  project: Project
  doc: Projects
  /** 번호 배지에 들어갈 '01' 형태의 두 자리 문자열. 순서는 page.tsx 가 정한다. */
  no: string
}

/**
 * 프로젝트 한 건을 '개요 + 작업 섹션' 으로 나눈다 — /portfolio 본문·목차·카드 뒷면이 같은 단위를 쓴다.
 *
 * 섹션은 세 곳에서 오고 순서도 이대로다.
 *  1. flagship 의 7단 서술(narrative). 작업 하나라 섹션 하나로 두고, 칸(문제·관점…)은 목차의 하위 자리가 된다
 *  2. MDX 본문의 `###` 소제목
 *  3. parentId 로 이 프로젝트를 가리키는 하위 프로젝트 — 상위 안에서 렌더하고 카드로 세지 않는다
 *
 * 섹션 제목은 카드 뒷면에 '무슨 작업을 했나' 로 올라간다. 그래서 서술 섹션의 제목은 제품명(cardName)이 아니라
 * '제품 · 작업' 모양의 name 이다 — MDX 소제목('ChatCODIT App · 구축 & 결제 신뢰성')과 같은 모양이다.
 *
 * 섹션 본문은 제목(h3)을 스스로 담는다. 인쇄에서는 목차 없이 본문만 이어지기 때문이다.
 * id 는 목차가 가리키는 자리라 페이지 전체에서 겹치지 않도록 프로젝트 id 를 앞에 붙인다.
 *
 * 선택되지 않은 프로젝트는 display:none 인 채 마운트되므로 관찰자(IntersectionObserver) 기반 연출은 쓰지 않는다.
 */
export function projectBody({ project, doc, no }: Props): {
  overview: ReactNode
  sections: ProjectSection[]
} {
  const { lead, sections } = splitMdx(doc.body.code)
  const { narrative } = project

  return {
    /*
      개요·서술 섹션은 서버 컴포넌트 엘리먼트로 넘긴다. 같은 트리를 <div> 엘리먼트로 만들어 prop 으로 클라이언트
      컴포넌트에 넘겼을 때 dev 에서 "Each child in a list should have a unique key" 경고가 났다.
    */
    overview: <ProjectOverview project={project} doc={doc} no={no} lead={lead} />,
    sections: [
      ...(narrative && project.depth === 'flagship'
        ? [
            {
              id: `${project.id}-narrative`,
              title: project.name,
              items: NARRATIVE_STAGES.map(({ key, label }) => ({
                id: narrativeStageId(project.id, key),
                title: label,
              })),
              node: <NarrativeSection project={project} narrative={narrative} />,
            },
          ]
        : []),
      ...sections.map(({ title, nodes }, index) => ({
        id: `${project.id}-section-${index + 1}`,
        title,
        node: <Prose>{nodes}</Prose>,
      })),
      ...getSubprojects(project.id).map((subproject) => ({
        id: `${project.id}-${subproject.id}`,
        title: portfolioName(subproject),
        node: (
          <Prose>
            <Subproject
              project={subproject}
              doc={allProjects.find((item) => item.slug === subproject.id)}
            />
          </Prose>
        ),
      })),
    ],
  }
}

/** 개요 — 헤더 · 스크린샷 · supporting 서술 카드 · 첫 소제목 앞의 MDX. 본문 맨 앞에 온다. */
function ProjectOverview({ project, doc, no, lead }: Props & { lead: ReactNode[] }) {
  const { narrative } = project

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} badge={no} platform={doc.platform} summary={doc.summary} />
      {doc.images.length > 0 && (
        <ProjectImages
          images={doc.images}
          imageSize={doc.imageSize}
          imageFrame={doc.imageFrame}
          alt={portfolioName(project)}
        />
      )}
      {/* supporting 은 카드 1개 분량이라 섹션으로 쪼개지 않고 개요에 둔다 */}
      {narrative && project.depth !== 'flagship' && <NarrativeCard narrative={narrative} />}
      {hasContent(lead) && <Prose>{lead}</Prose>}
    </div>
  )
}

/** flagship 서술 섹션 — 작업 제목(h3) + 7단 풀 전개. h3 는 MDX 소제목과 같은 prose-doc 모양을 쓴다. */
function NarrativeSection({ project, narrative }: { project: Project; narrative: Narrative }) {
  return (
    <>
      <Prose>
        <h3>{project.name}</h3>
      </Prose>
      <div className="mt-6">
        <NarrativeFull narrative={narrative} idPrefix={project.id} />
      </div>
    </>
  )
}

/**
 * 하위 프로젝트 한 건 — 소제목 · 기간 · 역할 · 스택 · 요약 · 서술 카드.
 *
 * 기간을 따로 보여주는 이유: 하위 작업은 상위와 기간이 다를 수 있고(periodOverride),
 * 상위 헤더의 기간만 보이면 입사 직후부터 해 온 작업처럼 읽힌다.
 * 서술은 depth 와 무관하게 카드 1개 분량이다 — 하위 프로젝트는 flagship 이 될 수 없다.
 */
function Subproject({ project, doc }: { project: Project; doc?: Projects }) {
  return (
    <section>
      {/* 섹션 본문의 첫 요소라 prose 의 h3 위 여백을 뗀다 */}
      <h3 className="mt-0">{portfolioName(project)}</h3>
      <div className="not-prose space-y-3">
        <p className="flex flex-wrap gap-x-3 text-sm text-gray-500 dark:text-gray-400">
          {doc?.platform && <span>{doc.platform}</span>}
          <span>{formatProjectPeriod(project)}</span>
        </p>
        <ProjectMeta project={project} />
        <StackTags project={project} />
      </div>
      {doc?.summary && <p>{doc.summary}</p>}
      {project.narrative && (
        <div className="not-prose mt-4">
          <NarrativeCard narrative={project.narrative} />
        </div>
      )}
    </section>
  )
}
