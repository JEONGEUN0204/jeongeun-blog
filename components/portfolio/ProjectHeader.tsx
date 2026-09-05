import { TBD, type Project } from '@/content/schema'
import { getCompany } from '@/content/companies'
import { formatProjectPeriod } from '@/content/projects'

/** 'FE 2 · BE 3 · PM 1 · 디자이너 1 · QA 1'. 미확보(TBD)면 아무것도 렌더하지 않는다. */
export function formatTeam(team: Project['team']): string | null {
  if (team === TBD) return null
  const parts = [
    ['FE', team.fe],
    ['BE', team.be],
    ['PM', team.pm],
    ['디자이너', team.design],
    ['QA', team.qa],
  ] as const
  return parts
    .filter(([, count]) => count > 0)
    .map(([label, count]) => `${label} ${count}`)
    .join(' · ')
}

/**
 * 역할·팀 규모·기여 범위.
 *
 * "이 사람이 입사해서 어떤 역할을 맡을지 감이 안 온다"는 피드백에 대한 자리다.
 * 아직 확보하지 못한 값(TBD)은 지어내지 않고 비워 둔다.
 * 대표 프로젝트와 상세 패널이 같은 컴포넌트를 쓴다.
 */
export function ProjectMeta({ project }: { project: Project }) {
  const team = formatTeam(project.team)

  return (
    <dl className="not-prose space-y-1 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex gap-2">
        <dt className="shrink-0 font-semibold text-gray-900 dark:text-gray-100">역할</dt>
        <dd>
          {project.role !== TBD && <span className="mr-1">{project.role} —</span>}
          {project.roleDetail}
        </dd>
      </div>
      {team && (
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold text-gray-900 dark:text-gray-100">팀</dt>
          <dd>{team}</dd>
        </div>
      )}
      {project.contribution !== TBD && (
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold text-gray-900 dark:text-gray-100">기여 범위</dt>
          <dd>{project.contribution}</dd>
        </div>
      )}
    </dl>
  )
}

/** 주력 스택은 진하게, 보조는 옅게 — 나열만으로는 숙련도를 구분할 수 없다 */
export function StackTags({ project }: { project: Project }) {
  return (
    <div className="not-prose flex flex-wrap gap-2">
      {project.stack.primary.map((tag) => (
        <span
          key={tag}
          className="bg-primary-100 text-primary-800 dark:bg-primary-400/15 dark:text-primary-300 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap"
        >
          {tag}
        </span>
      ))}
      {project.stack.secondary.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium whitespace-nowrap text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

interface Props {
  project: Project
  /** 번호 배지에 들어갈 '01' 형태의 두 자리 문자열. */
  badge: string
  platform?: string
  summary?: string
}

/** 원본 PDF의 커버 구성(번호 배지 + 회사 · PROJECT + 제목)을 그대로 따른다. */
export default function ProjectHeader({ project, badge, platform, summary }: Props) {
  return (
    <header className="not-prose break-inside-avoid-page break-after-avoid-page">
      <div className="flex items-start gap-4">
        <div className="bg-primary-700 flex size-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white">
          {badge}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase dark:text-gray-100">
            <span className="text-primary-700 dark:text-primary-400">
              {getCompany(project.companyId).name}{' '}
            </span>
            · Project
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {project.name}
          </h2>
        </div>
        <div className="hidden shrink-0 text-right text-sm text-gray-400 sm:block print:block">
          {platform && <div>{platform}</div>}
          <div className="text-xs">{formatProjectPeriod(project)}</div>
        </div>
      </div>

      <div className="mt-4">
        <ProjectMeta project={project} />
      </div>
      <div className="mt-4">
        <StackTags project={project} />
      </div>
      {summary && (
        <p className="mt-5 max-w-[68ch] leading-8 text-gray-600 dark:text-gray-400">{summary}</p>
      )}
    </header>
  )
}
