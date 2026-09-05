import Label, { type LabelKind } from './Label'

/**
 * 경력기술서의 "문제 → 개선 → 성과" 3단을 포트폴리오와 같은 컬러 라벨로 렌더한다.
 *
 * 기존 MDX의 `- 문제: / - 개선: / - 성과:` 불릿 묶음을 한 줄로 대체한다.
 * 세 행이 같은 무게면 어디가 성과인지 구분되지 않으므로 성과 행만 배경으로 승격한다.
 * 패딩은 세 행 모두에 똑같이 걸어 라벨 컬럼이 어긋나지 않게 한다.
 */
const rows: [keyof StepsProps, LabelKind, string, boolean][] = [
  ['problem', 'problem', '문제', false],
  ['improve', 'approach', '개선', false],
  ['result', 'result', '성과', true],
]

interface StepsProps {
  problem?: string
  improve?: string
  result?: string
}

export default function Steps(props: StepsProps) {
  return (
    <div className="not-prose my-4 break-inside-avoid-page space-y-2">
      {rows.map(([key, kind, label, emphasis]) => {
        const text = props[key]
        if (!text) return null
        return (
          <div
            key={key}
            className={`flex gap-3 rounded-md px-3 py-2 ${
              emphasis ? 'bg-primary-50 dark:bg-primary-400/10' : ''
            }`}
          >
            <span className="w-16 shrink-0">
              <Label kind={kind}>{label}</Label>
            </span>
            <span
              className={
                emphasis
                  ? 'text-sm leading-7 font-medium text-gray-900 dark:text-gray-100'
                  : 'text-sm leading-7 text-gray-700 dark:text-gray-300'
              }
            >
              {text}
            </span>
          </div>
        )
      })}
    </div>
  )
}
