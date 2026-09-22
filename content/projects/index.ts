import type { Project } from '../schema'
import { coditDashboard } from './codit-dashboard'
import { coditAppShell } from './codit-appshell'
import { coditAgentsMd } from './codit-agents-md'
import { coditTailwindSkill } from './codit-tailwind-skill'
import { coditChatCoditStreaming } from './codit-chatcodit-streaming'
import { coditChatCoditAppBuild } from './codit-chatcodit-app-build'
import { coditChatCoditAppInfra } from './codit-chatcodit-app-infra'
import { coditTheCoditApp } from './codit-thecodit-app'
import { ezlCharge } from './ezl-charge'
import { ezlBackoffice } from './ezl-backoffice'
import { ezlDesignSystem } from './ezl-design-system'
import { ezlAi } from './ezl-ai'

/**
 * 작업 하나가 파일 하나다. 예외는 없다 — 제품은 content/products.ts 가 따로 들고 있다.
 *
 * 배열 순서가 곧 제품 안에서의 작업 순서다. 예전에는 MDX frontmatter 의 `order` 숫자가 순서를
 * 정했는데, 사이에 하나를 끼우려면 파일 여러 개를 동시에 고쳐야 했다. 순서도 사실의 일부라
 * 여기서만 관리한다.
 *
 * 제품끼리의 순서는 content/products.ts 가 정한다. 여기서는 같은 제품 안의 상대 순서만
 * 지키면 되고, 읽기 쉽게 제품별로 모아 둔다.
 */
export const projects: Project[] = [
  coditDashboard,
  coditAppShell,
  coditAgentsMd,
  coditTailwindSkill,
  coditChatCoditStreaming,
  coditChatCoditAppBuild,
  coditChatCoditAppInfra,
  coditTheCoditApp,
  ezlCharge,
  ezlBackoffice,
  ezlDesignSystem,
  ezlAi,
]

/** 한 제품에 속한 작업. 배열 순서를 그대로 따른다. */
export function worksOf(productId: string): Project[] {
  return projects.filter((project) => project.productId === productId)
}

/**
 * 제품의 스택 — 그 제품에 속한 작업들의 스택을 배열 순서대로 합치고 중복을 없앤다.
 *
 * 제품에 스택을 따로 적지 않는 이유는, 적는 순간 작업 쪽 스택과 갈라지기 때문이다.
 * 어느 한 작업에서 주력인 기술은 제품 단위에서도 주력으로 본다(보조 목록에서 뺀다).
 */
export function productStack(productId: string): { primary: string[]; secondary: string[] } {
  const works = worksOf(productId)
  const primary = [...new Set(works.flatMap((work) => work.stack.primary))]
  const secondary = [...new Set(works.flatMap((work) => work.stack.secondary))].filter(
    (tag) => !primary.includes(tag)
  )
  return { primary, secondary }
}
