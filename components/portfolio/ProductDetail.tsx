import type { ReactNode } from 'react'
import {
  NARRATIVE_STAGES,
  NarrativeCard,
  NarrativeFull,
  narrativeStageId,
} from '@/components/Narrative'
import ProductHeader from './ProductHeader'
import Screenshots from './Screenshots'
import { StackTags, WorkMeta } from './WorkMeta'
import type { DetailSection } from './portfolio'
import { worksOf } from '@/content/projects'
import type { Narrative, Product, Project } from '@/content/schema'

function Prose({ children }: { children: ReactNode }) {
  return <div className="prose dark:prose-invert prose-doc max-w-none">{children}</div>
}

interface Props {
  product: Product
  /** 번호 배지에 들어갈 '01' 형태의 두 자리 문자열. 순서는 page.tsx 가 정한다. */
  no: string
}

/**
 * 제품 한 건을 '개요 + 작업 섹션' 으로 나눈다 — /portfolio 본문·목차·카드 뒷면이 같은 단위를 쓴다.
 *
 * 섹션은 이 순서로 온다.
 *  1. flagship 작업의 7단 서술. 칸(문제·관점…)은 목차의 하위 자리가 된다
 *  2. 나머지 작업 — 작업마다 역할·스택·서술 카드 한 벌
 *
 * 작업이 하나뿐인 제품은 그 작업을 섹션으로 세우지 않는다. 제품 이름과 작업 이름이 같은 자리를
 * 두 번 차지하기 때문이다 — 역할·서술은 개요(ProductHeader)가 맡는다.
 *
 * 예전에는 제품·작업마다 MDX 본문을 두고 그 `###` 소제목을 섹션으로 쪼개 이 목록에 끼웠다.
 * 컴파일된 MDX 를 함수로 되살려 최상위 노드를 가르는 코드가 필요했는데, 정작 본문을 쓴 MDX 가
 * 하나도 없었다. 사실은 content/ 에 있고 표현은 이 컴포넌트들이 만든다.
 *
 * 섹션 본문은 제목(h3)을 스스로 담는다. 인쇄에서는 목차 없이 본문만 이어지기 때문이다.
 * id 는 목차가 가리키는 자리라 페이지 전체에서 겹치지 않도록 제품·작업 id 를 앞에 붙인다.
 *
 * 선택되지 않은 제품은 display:none 인 채 마운트되므로 관찰자(IntersectionObserver) 기반 연출은 쓰지 않는다.
 */
export function productBody({ product, no }: Props): {
  overview: ReactNode
  sections: DetailSection[]
} {
  const works = worksOf(product.id)
  const single = works.length === 1 ? works[0] : undefined
  const flagship = works.find((work) => work.depth === 'flagship' && work.narrative)

  return {
    /*
      개요·서술 섹션은 서버 컴포넌트 엘리먼트로 넘긴다. 같은 트리를 <div> 엘리먼트로 만들어 prop 으로 클라이언트
      컴포넌트에 넘겼을 때 dev 에서 "Each child in a list should have a unique key" 경고가 났다.
    */
    overview: <ProductOverview product={product} no={no} single={single} />,
    sections: [
      ...(flagship?.narrative
        ? [
            {
              id: `${flagship.id}-narrative`,
              title: flagship.name,
              items: NARRATIVE_STAGES.map(({ key, label }) => ({
                id: narrativeStageId(flagship.id, key),
                title: label,
              })),
              node: <NarrativeSection work={flagship} narrative={flagship.narrative} />,
            },
          ]
        : []),
      ...works.flatMap((work) =>
        work === single || work === flagship
          ? []
          : [
              {
                id: `${product.id}-${work.id}`,
                title: work.name,
                node: (
                  <Prose>
                    <WorkSection work={work} />
                  </Prose>
                ),
              },
            ]
      ),
    ],
  }
}

/** 개요 — 헤더 · 스크린샷 · (작업이 하나뿐이면) 그 작업의 서술 카드. 본문 맨 앞에 온다. */
function ProductOverview({ product, no, single }: Props & { single?: Project }) {
  return (
    <div className="space-y-6">
      <ProductHeader product={product} badge={no} summary={product.summary} work={single} />
      {product.images && product.imageSize && (
        <Screenshots
          images={product.images}
          imageSize={product.imageSize}
          imageFrame={product.imageFrame}
          alt={product.name}
        />
      )}
      {/* flagship 은 7단 풀 전개를 따로 받는다. 그 밖의 단일 작업은 카드 1개 분량이라 개요에 둔다. */}
      {single?.narrative && single.depth !== 'flagship' && (
        <NarrativeCard narrative={single.narrative} />
      )}
    </div>
  )
}

/** flagship 서술 섹션 — 작업 제목(h3) + 7단 풀 전개. h3 는 소제목과 같은 prose-doc 모양을 쓴다. */
function NarrativeSection({ work, narrative }: { work: Project; narrative: Narrative }) {
  return (
    <>
      <Prose>
        <h3>{work.name}</h3>
      </Prose>
      <div className="mt-6">
        <NarrativeFull narrative={narrative} idPrefix={work.id} />
      </div>
    </>
  )
}

/**
 * 작업 한 건 — 소제목 · 역할 · 스택 · 서술 카드.
 *
 * 서술은 카드 1개 분량이다. 풀 전개는 제품마다 flagship 하나만 받는다.
 */
function WorkSection({ work }: { work: Project }) {
  return (
    <section>
      {/* 섹션 본문의 첫 요소라 prose 의 h3 위 여백을 뗀다 */}
      <h3 className="mt-0">{work.name}</h3>
      <div className="not-prose space-y-3">
        <WorkMeta work={work} />
        <StackTags stack={work.stack} />
      </div>
      {work.narrative && (
        <div className="not-prose mt-4">
          <NarrativeCard narrative={work.narrative} />
        </div>
      )}
    </section>
  )
}
