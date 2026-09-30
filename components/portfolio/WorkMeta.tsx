import { TBD, type Project } from '@/content/schema'

/**
 * 역할·기여 범위.
 *
 * "이 사람이 입사해서 어떤 역할을 맡을지 감이 안 온다"는 피드백에 대한 자리다.
 * 아직 확보하지 못한 값(TBD)은 지어내지 않고 비워 둔다.
 *
 * 작업 단위다 — 같은 제품 안에서도 작업마다 역할이 다르다(대시보드는 '설계·구현 리드',
 * AppShell 은 '기획·구현'). 제품 헤더가 대표로 하나를 고르면 그 순간 나머지가 틀린 말이 된다.
 */
export function WorkMeta({ work }: { work: Project }) {
  return (
    <dl className="not-prose space-y-1 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex gap-2">
        <dt className="shrink-0 font-semibold text-gray-900 dark:text-gray-100">역할</dt>
        <dd>
          {work.role !== TBD && <span className="mr-1">{work.role} —</span>}
          {work.roleDetail}
        </dd>
      </div>
      {work.contribution !== TBD && (
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold text-gray-900 dark:text-gray-100">기여 범위</dt>
          <dd>{work.contribution}</dd>
        </div>
      )}
    </dl>
  )
}

/**
 * 스택 태그. 작업 스택은 주력·보조를 나누지 않는다(schema.ts 의 stack 참고).
 *
 * 작업의 스택과 제품의 스택(작업들의 합집합)이 같은 모양으로 나와야 해서 배열을 직접 받는다.
 */
export function StackTags({ stack }: { stack: string[] }) {
  return (
    <div className="not-prose flex flex-wrap gap-2">
      {stack.map((tag) => (
        <span
          key={tag}
          className="bg-primary-100 text-primary-800 dark:bg-primary-400/15 dark:text-primary-300 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
