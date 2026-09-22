import type { Period, Project } from '../schema'
import { getCompany, formatPeriod } from '../companies'
import { coditCodit } from './codit-codit'
import { coditChatCodit } from './codit-chatcodit'
import { coditChatCoditApp } from './codit-chatcodit-app'
import { coditChatCoditAppInfra } from './codit-chatcodit-app-infra'
import { coditTheCoditApp } from './codit-thecodit-app'
import { coditDashboard } from './codit-dashboard'
import { coditAppShell } from './codit-appshell'
import { coditAgentsMd } from './codit-agents-md'
import { coditTailwindSkill } from './codit-tailwind-skill'
import { ezlCharge } from './ezl-charge'
import { ezlBackoffice } from './ezl-backoffice'
import { ezlDesignSystem } from './ezl-design-system'
import { ezlAi } from './ezl-ai'

/**
 * 배열 순서가 곧 /portfolio 노출 순서다.
 * 예전에는 MDX frontmatter 의 `order` 숫자가 순서를 정했는데, 사이에 하나를 끼우려면
 * 파일 여러 개를 동시에 고쳐야 했다. 순서도 사실의 일부라 여기서만 관리한다.
 *
 * 최신 회사를 앞에 둔다. depth:'flagship' 은 /portfolio 가 렌더 시점에 맨 앞으로
 * 끌어올리므로 이 배열에서는 회사 안의 상대 순서만 지키면 된다.
 * parentId 가 있는 하위 프로젝트는 카드로 세지 않고, 상위 프로젝트 안에서 이 배열 순서대로 붙는다.
 */
export const projects: Project[] = [
  coditCodit,
  coditChatCodit,
  coditChatCoditApp,
  coditChatCoditAppInfra,
  coditTheCoditApp,
  coditDashboard,
  coditAppShell,
  coditAgentsMd,
  coditTailwindSkill,
  ezlCharge,
  ezlBackoffice,
  ezlDesignSystem,
  ezlAi,
]

/** 다른 프로젝트에 속하지 않은 프로젝트. /portfolio 의 카드와 번호는 이 목록으로 센다. */
export const topLevelProjects = projects.filter((project) => !project.parentId)

/** parentId 로 이 프로젝트를 가리키는 하위 프로젝트. 배열 순서를 그대로 따른다. */
export function getSubprojects(parentId: string): Project[] {
  return projects.filter((project) => project.parentId === parentId)
}

/** /portfolio 가 쓰는 이름. cardName 이 없으면 name 이다. */
export function portfolioName(project: Project): string {
  return project.cardName ?? project.name
}

/** 프로젝트 기간. periodOverride 가 없으면 회사 재직 기간을 상속한다. */
function projectPeriod(project: Project): Period {
  return project.periodOverride ?? getCompany(project.companyId).period
}

export function formatProjectPeriod(project: Project): string {
  return formatPeriod(projectPeriod(project))
}
