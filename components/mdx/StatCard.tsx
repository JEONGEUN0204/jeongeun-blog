/**
 * 원본 포트폴리오 PDF의 다크 네이비 강조 카드.
 *
 * 대표 수치(value)를 티얼로 크게 띄우고, 그 아래 [라벨][설명] 행을 나열한다.
 * 라이트/다크 모드 모두 네이비로 고정한다 — PDF의 인상을 유지하기 위함이고,
 * print.css에 print-color-adjust: exact가 걸려 있어 인쇄에서도 배경이 보존된다.
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
    <div className="not-prose relative break-inside-avoid-page overflow-hidden rounded-2xl bg-slate-900 p-6 ring-1 ring-white/10">
      {/* PDF 우상단의 장식 원 */}
      <div className="bg-primary-500/10 pointer-events-none absolute -top-10 -right-10 size-40 rounded-full" />
      <div className="relative">
        <p className="text-primary-300 text-3xl leading-tight font-extrabold">{value}</p>
        {caption && <p className="mt-1 text-sm text-gray-400">{caption}</p>}
        {rows.length > 0 && (
          <dl className="mt-5 space-y-3">
            {rows.map(([label, detail]) => (
              <div key={label} className="flex gap-3">
                <dt className="text-primary-300 h-fit shrink-0 rounded bg-slate-800 px-2 py-1 text-[11px] font-bold">
                  {label}
                </dt>
                <dd className="m-0 text-sm leading-6 text-gray-200">{detail}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}
