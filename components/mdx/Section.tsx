import { ReactNode } from 'react'
import Label from './Label'

interface Props {
  title?: string
  /** section 요소에 덧붙일 클래스 */
  className?: string
  /** 제목 요소에 덧붙일 클래스 (prose 밖에서 쓸 때 유용) */
  titleClassName?: string
  children: ReactNode
}

/**
 * "01. Codit 플랫폼 · 대시보드 (Web · 대표 성과)" 를
 * 번호 배지 / 제목 / 접미 칩으로 분해한다.
 *
 * MDX 파일을 고치지 않고 렌더 시점에만 승격하는 방식이다. 숫자 접두어가 없는 제목
 * (ResumeContent 의 "Summary"·"Skills" 등)은 NUMBERED 에 미매치라 기존 경로를 그대로 탄다.
 */
const NUMBERED = /^(\d{1,2})\.\s+(.*)$/
/** 마지막 괄호만 접미로 본다. `$` 앵커 덕분에 제목 안의 괄호("초안 작성(Draft)")는 보존된다. */
const SUFFIX = /^(.*?)\s*\(([^)]+)\)$/
/** 강조 칩으로 떼어낼 토큰. 나머지는 하나로 합쳐 중립 칩 1개로 만든다. */
const EMPHASIS = /^(대표 성과|핵심)$/

type Parsed = {
  no: string
  title: string
  /** 'Web', 'iOS · Android · WebView' — 토큰마다 칩을 만들면 오히려 시끄러워진다 */
  neutral?: string
  emphasis: string[]
}

function parseTitle(title: string): Parsed | null {
  const numbered = title.match(NUMBERED)
  if (!numbered) return null

  const [, no, rest] = numbered
  const suffixed = rest.match(SUFFIX)
  if (!suffixed) return { no, title: rest, emphasis: [] }

  const [, head, suffix] = suffixed
  const tokens = suffix.split('·').map((token) => token.trim())
  const emphasis = tokens.filter((token) => EMPHASIS.test(token))
  const neutral = tokens.filter((token) => !EMPHASIS.test(token))

  return {
    no,
    title: head,
    neutral: neutral.length > 0 ? neutral.join(' · ') : undefined,
    emphasis,
  }
}

/**
 * 인쇄(Ctrl+P) 시 페이지 경계에서 블록이 잘리지 않도록 감싸는 래퍼.
 *
 * - `break-inside-avoid-page`: 섹션 내부에서 페이지가 갈라지지 않게 한다.
 * - `break-after-avoid-page`: 제목만 페이지 하단에 홀로 남는 것을 막는다.
 */
export default function Section({ title, className, titleClassName, children }: Props) {
  const parsed = title ? parseTitle(title) : null

  return (
    <section className={`break-inside-avoid-page my-8${className ? ` ${className}` : ''}`}>
      {title &&
        (parsed ? (
          /* section-head 는 .prose-doc h3 의 좌측 색 바를 끈다 — 번호 배지가 그 역할을 대신한다 */
          <h3
            className={`section-head flex break-after-avoid-page flex-wrap items-center gap-x-3 gap-y-2${
              titleClassName ? ` ${titleClassName}` : ''
            }`}
          >
            <span className="bg-primary-700 not-prose inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white">
              {parsed.no}
            </span>
            <span className="min-w-0">{parsed.title}</span>
            {(parsed.neutral || parsed.emphasis.length > 0) && (
              <span className="flex flex-wrap items-center gap-1.5">
                {parsed.neutral && <Label kind="neutral">{parsed.neutral}</Label>}
                {parsed.emphasis.map((token) => (
                  <Label key={token} kind="result">
                    {token}
                  </Label>
                ))}
              </span>
            )}
          </h3>
        ) : (
          <h3 className={`break-after-avoid-page${titleClassName ? ` ${titleClassName}` : ''}`}>
            {title}
          </h3>
        ))}
      {children}
    </section>
  )
}
