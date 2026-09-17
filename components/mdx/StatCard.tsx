/**
 * 본문 옆 지표 카드 (<Split aside> 자리).
 *
 * 대표 수치(value)를 accent 색으로 올리고, 그 아래 [라벨][설명] 행을 나열한다.
 * 원본 PDF 를 따라 네이비 면에 장식 원을 두었었는데, 본문 옆에서 본문보다 무게가 커서
 * 테두리만 있는 밝은 면으로 바꿨다. 수치 색은 팔레트 규칙(지표 숫자 = accent)을 따른다.
 * 인쇄에서는 dark: 가 꺼지고 print.css 의 print-color-adjust: exact 로 테두리·면이 그대로 남는다.
 */
export default function StatCard({
  value,
  caption,
  rows = [],
}: {
  value: string
  caption?: string
  rows?: [string, string][]
}) {
  return (
    <div className="not-prose break-inside-avoid-page rounded-xl border border-gray-200 bg-white/60 p-5 dark:border-gray-700 dark:bg-gray-900/40">
      <p className="text-accent-700 dark:text-accent-300 text-xl leading-snug font-bold">{value}</p>
      {caption && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{caption}</p>}
      {rows.length > 0 && (
        <dl className="mt-4 space-y-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
          {rows.map(([label, detail]) => (
            <div key={label} className="flex gap-3">
              <dt className="w-12 shrink-0 text-xs leading-6 font-semibold text-gray-500 dark:text-gray-400">
                {label}
              </dt>
              <dd className="m-0 min-w-0 text-sm leading-6 break-words text-gray-700 dark:text-gray-300">
                {detail}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
