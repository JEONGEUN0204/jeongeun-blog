import { useId } from 'react'

/**
 * JE 모노그램 — J 의 세로 줄기를 E 가 같이 쓴다. 바탕은 accent-400 → 700 그라데이션.
 *
 * 예전에는 data/logo.svg 를 svgr 로 불러왔는데, 그라데이션 id 가 고정이라 한 페이지에 로고가 둘이면
 * (헤더 + 포트폴리오 인쇄 표지) 둘 다 첫 번째 정의를 가리켰다. 인쇄에서는 헤더가 display:none 이라
 * 그 정의가 그려지지 않아 표지 로고가 통째로 빠졌다. id 를 useId 로 인스턴스마다 따로 만든다.
 *
 * 파비콘(public/static/favicons)·logo.png 는 같은 모양을 PNG 로 구운 것이다. 모양을 바꾸면 함께 다시 만든다.
 * 굽기는 Chrome 스크린샷(투명 배경)으로 한다 — PyMuPDF 는 SVG 그라데이션을 못 그려 바탕이 검정으로 나온다.
 */
export default function LogoMark({ className }: { className?: string }) {
  const gradientId = `logo-gradient-${useId().replace(/:/g, '')}`
  return (
    <svg
      viewBox="0 0 28 28"
      width="28"
      height="28"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop style={{ stopColor: 'var(--color-accent-400, #72b8e9)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-accent-700, #2b70a2)' }} />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="7" fill={`url(#${gradientId})`} />
      <g transform="translate(0.75 0)" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
        <path d="M12 7V17.5a3.5 3.5 0 0 1-7 0" />
        <path d="M12 7H21.5M12 12.25H18.5M12 17.5H21.5" />
      </g>
    </svg>
  )
}
