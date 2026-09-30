import { projects } from '@/content/projects'
import { TBD } from '@/content/schema'

/**
 * 경력기술서 각 항목 머리의 "기술 / 역할" 메타 라인.
 *
 * Section 제목 바로 아래에 붙는 자리라 위 여백을 좁히고, 좌측 얇은 회색 바로
 * 본문과 구분한다 — 본문과 같은 흐름으로 읽히면 제목 직후의 밀도가 너무 높아진다.
 *
 * 작업 id 를 주면 기술·역할을 content/projects 에서 읽는다. 스택·역할은 사실이라
 * 원천이 거기고, MDX 에 다시 적으면 갈라진다 — 실제로 codit.mdx 09 의 tech 는
 * 같은 값을 손으로 옮기면서 앞 두 항목의 순서가 어긋나 있었다.
 * 아직 작업으로 옮기지 못한 섹션만 tech·role 을 직접 받는다.
 */
export default function Meta({ id, tech, role }: { id?: string; tech?: string; role?: string }) {
  const project = id ? projects.find((item) => item.id === id) : undefined
  if (id && !project) {
    throw new Error(`<Meta id="${id}"> — content/projects 에 없는 작업이다`)
  }

  /*
    기술 문자열은 여기서만 만든다. stack 에 적은 순서가 곧 읽는 순서다.
    /careers 의 모든 메타 라인이 이 함수를 지나므로 섹션마다 순서가 달라질 자리가 없다.
  */
  const techText = tech ?? project?.stack.join(' · ')
  const roleText = role ?? project?.roleDetail

  return (
    <dl className="not-prose mt-2 mb-4 break-inside-avoid-page space-y-1 border-l-2 border-gray-200 pl-3 dark:border-gray-700">
      {techText && <Row label="기술" value={techText} />}
      {roleText && roleText !== TBD && <Row label="역할" value={roleText} />}
    </dl>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-xs leading-6">
      <dt className="text-primary-700 dark:text-primary-400 w-8 shrink-0 font-bold">{label}</dt>
      <dd className="m-0 max-w-[68ch] text-gray-600 dark:text-gray-400">{value}</dd>
    </div>
  )
}
