import { FaGithub } from 'react-icons/fa'
import { FiLink } from 'react-icons/fi'
import { IoIosMail } from 'react-icons/io'
import { MdOutlinePhoneIphone } from 'react-icons/md'
import LogoMark from '@/components/LogoMark'
import siteMetadata from '@/data/siteMetadata'
import { profile } from '@/content/profile'

/**
 * 문서형 페이지(/, /portfolio)의 인쇄 표지 — 인쇄에서만 보이는 A4 한 쪽.
 *
 * 본문 첫 쪽에 곧바로 회사·제품이 나오면 문서가 냅다 시작되는 느낌이라, 이름과 웹 주소만 담은 표지를 앞에 둔다.
 * 높이는 A4(297mm)에서 print.css 의 위아래 여백(16mm × 2)을 뺀 265mm 보다 1mm 작게 잡는다 —
 * 딱 맞추면 반올림으로 빈 쪽이 하나 더 생길 수 있다.
 *
 * 웹 주소는 그 문서의 웹 페이지다. PDF 는 스크린샷이 작아 읽기 어려우니 웹에서 크게 보도록 넘긴다.
 * 연도는 빌드 시점 연도다. 정적 export 라 배포할 때마다 다시 계산된다.
 *
 * 표지 쪽에는 쪽 번호를 달지 않는다. print.css 의 `@page cover` 가 이 section 이 놓인 쪽의 하단 칸을 비운다.
 */
export default function PrintCover({
  label,
  path,
  phone,
}: {
  /** 'Portfolio' 형태. 연도 앞에 대문자로 싣는다. */
  label: string
  /** 표지에 싣는 웹 페이지 경로. 홈이면 '' */
  path: string
  /** 휴대폰 번호도 싣는다. 이력서는 인쇄에서 본문 머리의 연락처를 빼고 표지가 맡는다. */
  phone?: boolean
}) {
  const webUrl = `${siteMetadata.siteUrl}${path}`
  return (
    <section
      aria-label="표지"
      className="hidden break-after-page flex-col print:flex print:h-[264mm] print:[page:cover] noscript:hidden"
    >
      <LogoMark className="block size-12" />

      {/* 큰 이름 글자는 왼쪽 여백(사이드 베어링)이 커서 잉크가 안쪽에서 시작한다. 위아래 작은 줄을 그만큼 들여 맞춘다 */}
      <div className="mt-auto">
        <p className="text-accent-700 pl-1.5 text-lg font-bold tracking-[0.08em] uppercase">
          {label} · {new Date().getFullYear()}
        </p>
        <p className="mt-4 text-7xl leading-none font-extrabold tracking-tight text-gray-900">
          {profile.name}
        </p>
        <p className="mt-5 pl-0.5 text-3xl leading-none text-gray-600">{profile.title}</p>
      </div>

      {/* 링크·연락처를 아이콘 칸 하나로 세로로 쌓는다 — 좌우로 갈라 두면 왼쪽 정렬선이 둘이 되어 흩어져 보였다 */}
      <ul className="mt-auto space-y-2 border-t border-gray-200 pt-6 text-lg text-gray-600">
        <li>
          <a href={webUrl} className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <FiLink aria-hidden className="shrink-0" />
            {webUrl.replace(/^https?:\/\//, '')}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <IoIosMail aria-hidden className="shrink-0" />
          {profile.email}
        </li>
        {phone && (
          <li className="flex items-center gap-3">
            <MdOutlinePhoneIphone aria-hidden className="shrink-0" />
            {profile.phone}
          </li>
        )}
        <li className="flex items-center gap-3">
          <FaGithub aria-hidden className="shrink-0" />
          {profile.github}
        </li>
      </ul>
    </section>
  )
}
