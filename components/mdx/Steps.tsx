import Label, { type LabelKind } from './Label'

/**
 * 경력기술서의 "문제 → 개선 → 성과" 3단을 포트폴리오와 같은 컬러 라벨로 렌더한다.
 *
 * 기존 MDX의 `- 문제: / - 개선: / - 성과:` 불릿 묶음을 한 줄로 대체한다.
 */
const rows: [keyof StepsProps, LabelKind, string][] = [
  ['problem', 'problem', '문제'],
  ['improve', 'approach', '개선'],
  ['result', 'result', '성과'],
]

interface StepsProps {
  problem?: string
  improve?: string
  result?: string
}

export default function Steps(props: StepsProps) {
  return (
    <div className="not-prose my-4 break-inside-avoid-page space-y-2">
      {rows.map(([key, kind, label]) => {
        const text = props[key]
        if (!text) return null
        return (
          <div key={key} className="flex gap-3">
            <span className="w-14 shrink-0">
              <Label kind={kind}>{label}</Label>
            </span>
            <span className="text-sm leading-7 text-gray-700 dark:text-gray-300">{text}</span>
          </div>
        )
      })}
    </div>
  )
}
