/**
 * 경력기술서 각 항목 머리의 "기술 / 역할" 메타 라인.
 *
 * Section 제목 바로 아래에 붙는 자리라 위 여백을 좁히고, 좌측 얇은 회색 바로
 * 본문과 구분한다 — 본문과 같은 흐름으로 읽히면 제목 직후의 밀도가 너무 높아진다.
 */
export default function Meta({ tech, role }: { tech?: string; role?: string }) {
  return (
    <dl className="not-prose mt-3 mb-6 break-inside-avoid-page space-y-1 border-l-2 border-gray-200 pl-3 dark:border-gray-700">
      {tech && <Row label="기술" value={tech} />}
      {role && <Row label="역할" value={role} />}
    </dl>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-xs leading-6">
      <dt className="text-primary-700 dark:text-primary-400 w-8 shrink-0 font-bold tracking-wider">
        {label}
      </dt>
      <dd className="m-0 max-w-[68ch] text-gray-600 dark:text-gray-400">{value}</dd>
    </div>
  )
}
