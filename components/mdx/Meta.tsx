/**
 * 경력기술서 각 항목 머리의 "기술 / 역할" 메타 라인.
 */
export default function Meta({ tech, role }: { tech?: string; role?: string }) {
  return (
    <dl className="not-prose my-4 break-inside-avoid-page space-y-1">
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
      <dd className="m-0 text-gray-600 dark:text-gray-400">{value}</dd>
    </div>
  )
}
