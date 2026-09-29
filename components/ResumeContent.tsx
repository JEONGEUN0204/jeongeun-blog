import { Fragment } from 'react'
import { allAuthors } from 'contentlayer/generated'
import { IoIosMail } from 'react-icons/io'
import { MdOutlinePhoneIphone } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'
import Image from '@/components/Image'
import Section from '@/components/mdx/Section'
import { formatPeriod, getCompany } from '@/content/companies'
import { productLabel } from '@/content/products'
import { experiences } from '@/content/experience'
import { highlightParts, highlightTitle, resumeGroups } from '@/content/highlight'
import { getMetrics, resumeMetricIds } from '@/content/metrics'
import { TBD, type Metric } from '@/content/schema'
import {
  about,
  aboutLead,
  certificates,
  collaborationIntro,
  collaborations,
  education,
  profile,
  skills,
} from '@/content/profile'

/*
  섹션 제목은 본문과 같은 대소문자의 굵은 제목이다. 예전의 자간 넓힌 대문자 소제목(ABOUT·SKILLS)은
  모든 섹션 위에 같은 장식처럼 붙어 있어 제목이 무엇인지보다 장식이 먼저 읽혔다.
*/
const sectionTitle =
  'mb-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 print:mb-3'

/**
 * 섹션 사이 여백. Section 의 기본 my-8 을 끄고 패딩만 남긴다 —
 * 마진과 위아래 패딩이 겹쳐 섹션 사이가 96px 까지 벌어져 있었다.
 */
const sectionSpacing = 'my-0! py-8 print:py-4'

/** 문서형 본문의 measure. 한 줄이 한글 90자를 넘으면 눈이 다음 줄의 첫 글자를 놓친다. */
const measure = 'max-w-[68ch]'

const Badge = ({ children, muted }: { children: React.ReactNode; muted?: boolean }) => (
  <span
    className={`mr-1 mb-1 inline-flex h-fit w-fit rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap print:py-0.5 ${
      muted
        ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
        : 'bg-primary-100 text-primary-800 dark:bg-primary-400/15 dark:text-primary-300'
    }`}
  >
    {children}
  </span>
)

export default function ResumeContent() {
  const metrics = getMetrics(resumeMetricIds)
  /* 사진 경로만 authors/default.mdx 에서 가져온다. /blog 작성자 정보와 같은 원천이다. */
  const avatar = allAuthors.find((author) => author.slug === 'default')?.avatar

  return (
    <div>
      {/*
        머리 — 사진·이름·직함을 한 줄로 작게 두고 연락처를 오른쪽 끝에 붙인다.
        첫 화면의 주인공은 그 아래 한 줄 정체성(aboutLead)이다. 이름은 h1 로 남겨 문서 제목 역할을 한다.
        좁은 화면에서는 연락처가 이름 아래로 내려간다.
      */}
      <Section className="my-0! pt-2 pb-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {avatar && (
              <Image
                src={avatar}
                alt={`${profile.name} 프로필 사진`}
                width={240}
                height={320}
                className="size-16 shrink-0 rounded-full object-cover object-top"
              />
            )}
            <div className="min-w-0">
              <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                {profile.name}
              </h1>
              <p className="mt-0.5 text-gray-600 dark:text-gray-400">{profile.title}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm text-gray-600 sm:items-end dark:text-gray-400">
            <span className="flex items-center gap-2">
              <IoIosMail aria-hidden />
              {profile.email}
            </span>
            <span className="flex items-center gap-2">
              <MdOutlinePhoneIphone aria-hidden />
              {profile.phone}
            </span>
            <span className="flex items-center gap-2">
              <FaGithub aria-hidden />
              {profile.github}
            </span>
          </div>
        </div>
        <p className="mt-10 mb-10 max-w-[22em] text-3xl leading-snug font-bold tracking-tight text-balance break-keep text-gray-900 sm:text-4xl sm:leading-[1.3] dark:text-gray-100 print:mt-4 print:mb-4 print:text-2xl">
          {aboutLead}
        </p>
      </Section>

      {/*
        성과 지표 — 값·라벨은 content/metrics.ts 가 원천이고, evidence는 렌더하지 않는다.
        "숫자 중심 압축" 문서라 스캔의 첫 착지점이 문단이 아니라 수치여야 한다.
        전후를 비교하는 값은 실제 비율의 막대로 그린다(compareOf). 막대는 값 문자열에서 읽을 수 있는
        숫자만 쓴다 — 비교가 아닌 값('0 → 1')은 막대 없이 글자로 둔다.
      */}
      <Section className="my-0! pb-4 print:pb-2">
        <div className="rounded-2xl bg-white px-5 py-2 sm:px-8 dark:bg-gray-900 print:border print:border-gray-200">
          {metrics.map((metric) => (
            <MetricRow key={metric.id} metric={metric} />
          ))}
        </div>
      </Section>

      {/*
        About — 일하는 방식 네 가지. 한 줄 정체성(aboutLead)은 위 머리가 싣는다.
        제목만 훑어도 무엇을 하는 사람인지 읽히고, body 는 그 제목의 근거다.
        수치는 여기 없다 — 위 성과와 아래 Experience 가 맡는다.
      */}
      <Section title="About" titleClassName={sectionTitle} className={sectionSpacing}>
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 print:gap-y-4">
          {about.map((point) => (
            <div key={point.title} className="break-inside-avoid-page">
              <dt className="text-lg font-semibold break-keep text-gray-900 dark:text-gray-100">
                {point.title}
              </dt>
              <dd className="mt-1 leading-7 text-gray-600 dark:text-gray-400 print:leading-6">
                {point.body}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Skills — 나열만 하면 무엇이 주력인지 알 수 없어 두 단으로 나눈다 */}
      <Section title="Skills" titleClassName={sectionTitle} className={sectionSpacing}>
        <dl className="space-y-3 print:space-y-1.5">
          {skills.map((group) => (
            <div
              key={group.category}
              className="break-inside-avoid-page sm:flex sm:items-baseline sm:gap-6"
            >
              <dt className="mb-2 shrink-0 text-sm font-semibold text-gray-900 sm:mb-0 sm:w-40 dark:text-gray-100">
                {group.category}
              </dt>
              <dd className="flex flex-wrap">
                {group.primary.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
                {group.secondary.map((item) => (
                  <Badge key={item} muted>
                    {item}
                  </Badge>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          진한 배지는 주력, 옅은 배지는 보조입니다.
        </p>
      </Section>

      {/*
        Experience — 회사명·기간은 content/companies.ts 에서 온다.
        회사들은 세로 줄기 하나에 점으로 매달린다. 두 회사가 한 경력으로 이어져 읽히고,
        하이라이트마다 달던 왼쪽 선은 이 줄기가 대신한다.
      */}
      <Section title="Experience" titleClassName={sectionTitle} className={sectionSpacing}>
        <div className="relative space-y-12 pl-8 before:absolute before:top-2 before:bottom-0 before:left-[7px] before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800 print:space-y-8">
          {experiences.map((experience) => {
            const company = getCompany(experience.companyId)

            return (
              <div key={company.id} className="relative">
                <span
                  aria-hidden
                  className="bg-accent-500 ring-sand-50 absolute top-2 -left-8 size-4 rounded-full ring-4 dark:ring-gray-950 print:ring-white"
                />
                <div className="break-inside-avoid-page break-after-avoid-page">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {company.name}
                    </h4>
                    <span className="text-sm text-gray-600 tabular-nums dark:text-gray-400">
                      {experience.role} · {formatPeriod(company.period)}
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400 ${measure}`}
                  >
                    {experience.summary}
                  </p>
                </div>

                <div className="mt-6 space-y-6 print:mt-4 print:space-y-4">
                  {resumeGroups(company.id).map(({ product, works }) => {
                    const badge = (work: (typeof works)[number], className: string) =>
                      work.role !== TBD && (
                        <span
                          className={`rounded bg-gray-100 px-1.5 py-px text-xs font-medium whitespace-nowrap text-gray-700 dark:bg-gray-800 dark:text-gray-300 ${className}`}
                        >
                          {work.role}
                        </span>
                      )
                    return (
                      <div key={product.id} className="break-inside-avoid-page">
                        <h5 className="text-primary-700 dark:text-primary-400 text-sm font-bold">
                          {productLabel(product)}
                          {works
                            .filter((work) => !highlightTitle(work, product))
                            .map((work) => (
                              <Fragment key={work.id}>{badge(work, 'ml-2 align-[1px]')}</Fragment>
                            ))}
                        </h5>
                        {/*
                        작업 하나 = 항목 하나. 제목은 name 이고 role 배지를 그 옆에 붙인다. 그 아래
                        highlight 를 라벨 없이 그대로 싣는다 — 이력서 쪽에 따로 적는 문장은 없다.
                        역할 범위(맡은 영역·제안·직접 발견)는 highlight 문장 안에 들어 있어 roleDetail 줄을
                        따로 두지 않는다. 역할 이름은 배지가 맡는다.
                        제목이 제품 이름과 같으면 소제목과 겹쳐 highlight 만 싣고(highlightTitle),
                        배지는 제품 소제목 옆에 붙인다.
                      */}
                        <ul className={`mt-2 space-y-4 print:space-y-2.5 ${measure}`}>
                          {works.map((work) => {
                            const title = highlightTitle(work, product)
                            return (
                              <li
                                key={work.id}
                                className="break-inside-avoid-page text-sm leading-6"
                              >
                                {title && (
                                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                                    {title}
                                    {badge(work, 'ml-2 align-[1px]')}
                                  </p>
                                )}
                                <p className="mt-0.5 text-gray-600 dark:text-gray-400 print:mt-0.5 print:leading-5">
                                  {renderHighlight(work.highlight)}
                                </p>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Collaboration */}
      <Section title="Collaboration" titleClassName={sectionTitle} className={sectionSpacing}>
        <p
          className={`leading-7 text-pretty break-keep text-gray-700 dark:text-gray-300 ${measure}`}
        >
          {collaborationIntro}
        </p>
        {/*
          인쇄는 md 폭에 못 미쳐 항상 1단이다. 1단 카드는 상자 여백만큼 길어져 아래 학력·자격을
          다음 쪽으로 밀어냈다 — 인쇄에서는 상자를 걷고 항목 사이 가는 선으로만 나눈다.
        */}
        <div className="mt-5 grid gap-4 md:grid-cols-3 print:mt-4 print:gap-0">
          {collaborations.map((item) => (
            <div
              key={item.audience}
              className="break-inside-avoid-page rounded-2xl bg-white p-5 dark:bg-gray-900 print:rounded-none print:border-t print:border-gray-200 print:px-0 print:py-2.5 print:first:border-t-0 print:first:pt-0"
            >
              <div className="text-primary-700 dark:text-primary-400 text-sm font-bold">
                {item.audience}
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/*
        학력·자격 — 예전에는 머리 오른쪽 칸에 있었다. 머리를 한 줄 정체성에 내주면서 문서 끝으로 옮겼다.
        두 목록을 나란히 둔다. 좁은 화면에서는 쌓인다.
      */}
      <Section className="my-0! grid gap-8 py-8 sm:grid-cols-2 print:pt-2 print:pb-0">
        <div>
          <h2 className={sectionTitle}>Education</h2>
          <ul className="space-y-3 print:space-y-2">
            {education.map((item) => (
              <li key={item.school}>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.school}
                  {item.detail && (
                    <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                      {item.detail}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 tabular-nums dark:text-gray-400">
                  {item.period}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={sectionTitle}>Certificate</h2>
          <ul className="space-y-3 print:space-y-2">
            {certificates.map((item) => (
              <li key={item.name}>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.issuer} · ({item.date})
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  )
}

type Compare = {
  before: string
  after: string
  /** 이후 / 이전. 0 이상 1 미만 — 줄어든 비교만 막대로 그린다. */
  ratio: number
}

const toNumber = (text: string) => Number(text.replace(/,/g, ''))

/**
 * 지표 값에서 전후 비교를 읽는다. 문구를 새로 만들지 않고 값 문자열 안의 숫자만 쓴다.
 *
 * - 'LCP 5.3초 → 1.8초' → 5.3초 / 1.8초
 * - 'API 호출 75%↓'     → 이전 / 이후, 이후 막대는 이전의 25%
 * - '0 → 1' 처럼 늘어난 값, 숫자가 없는 값은 비교로 보지 않는다(null).
 */
function compareOf(value: string): Compare | null {
  const arrow = value.match(/([\d.,]+)\s*([^\d\s→]*)\s*→\s*([\d.,]+)\s*([^\d\s]*)\s*$/)
  if (arrow) {
    const before = toNumber(arrow[1])
    const after = toNumber(arrow[3])
    if (before > 0 && after >= 0 && after < before) {
      return {
        before: `${arrow[1]}${arrow[2]}`,
        after: `${arrow[3]}${arrow[4]}`,
        ratio: after / before,
      }
    }
    return null
  }
  const drop = value.match(/([\d.]+)%\s*↓/)
  if (drop) {
    const percent = toNumber(drop[1])
    if (percent > 0 && percent <= 100) {
      return { before: '이전', after: '이후', ratio: 1 - percent / 100 }
    }
  }
  return null
}

/**
 * 성과 한 줄. 왼쪽에 값·라벨, 오른쪽에 전후 막대.
 *
 * 이전 막대가 막대 칸의 80% 를 차지하고, 이후 막대는 그 길이에 비율을 곱한다 — 남은 20% 는
 * 막대 끝에 붙는 값 글자 자리다. 비교가 아닌 값은 막대 자리에 값을 크게 적고 왼쪽엔 라벨만 둔다.
 */
function MetricRow({ metric }: { metric: Metric }) {
  const compare = compareOf(metric.value)
  const full = 80

  return (
    <div className="grid break-inside-avoid-page gap-3 border-t border-gray-200 py-5 first:border-t-0 sm:grid-cols-[14rem_minmax(0,1fr)] sm:items-center sm:gap-8 dark:border-gray-800 print:py-2.5">
      <div>
        {compare && (
          <p className="font-bold break-keep text-gray-900 dark:text-gray-100">{metric.value}</p>
        )}
        <p
          className={
            compare
              ? 'mt-0.5 text-sm break-keep text-gray-500 dark:text-gray-400'
              : 'font-bold break-keep text-gray-900 dark:text-gray-100'
          }
        >
          {metric.label}
        </p>
      </div>
      {compare ? (
        <div className="space-y-1.5 text-sm tabular-nums" aria-hidden>
          <div className="flex items-center gap-3">
            <span
              className="h-3.5 rounded-sm bg-gray-300 dark:bg-gray-700"
              style={{ width: `${full}%` }}
            />
            <span className="text-gray-500 dark:text-gray-400">{compare.before}</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="bg-accent-500 h-3.5 min-w-1 rounded-sm"
              style={{ width: `${full * compare.ratio}%` }}
            />
            <span className="text-accent-700 dark:text-accent-300 text-base font-bold">
              {compare.after}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-accent-700 dark:text-accent-300 text-3xl font-extrabold tracking-tight">
          {metric.value}
        </p>
      )}
    </div>
  )
}

/** highlight 의 `{m:id}` 를 metrics.ts 의 값으로 바꾸고 굵게 그린다. 그 밖의 글자는 그대로 둔다. */
function renderHighlight(highlight: string) {
  return highlightParts(highlight).map((part, index) =>
    part.metric ? (
      <strong
        key={index}
        className="text-accent-700 dark:text-accent-300 font-bold tabular-nums print:text-gray-900"
      >
        {part.text}
      </strong>
    ) : (
      part.text
    )
  )
}
