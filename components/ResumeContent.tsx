import { IoIosMail } from 'react-icons/io'
import { MdOutlinePhoneIphone } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'
import Link from '@/components/Link'
import Section from '@/components/mdx/Section'
import { formatPeriod, getCompany } from '@/content/companies'
import { experiences } from '@/content/experience'
import { getMetrics, resumeMetricIds } from '@/content/metrics'
import {
  certificates,
  collaborationIntro,
  collaborationOutro,
  collaborations,
  education,
  profile,
  skills,
  summarySentences,
} from '@/content/profile'

const sectionTitle =
  'mb-5 text-xs font-bold tracking-[0.2em] text-primary-700 uppercase dark:text-primary-400'

/** 문서형 본문의 measure. 한 줄이 한글 90자를 넘으면 눈이 다음 줄의 첫 글자를 놓친다. */
const measure = 'max-w-[68ch]'

const Badge = ({ children, muted }: { children: React.ReactNode; muted?: boolean }) => (
  <span
    className={`mr-1 mb-1 inline-flex h-fit w-fit rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap ${
      muted
        ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
        : 'bg-primary-100 text-primary-800 dark:bg-primary-400/15 dark:text-primary-300'
    }`}
  >
    {children}
  </span>
)

interface Props {
  /** `/resume/full` 로 가는 링크 노출 여부 (통합 페이지에서는 숨김) */
  showFullLink?: boolean
}

export default function ResumeContent({ showFullLink = true }: Props) {
  const metrics = getMetrics(resumeMetricIds)

  /*
    섹션 구분은 divide-y 대신 여백과 티얼 소제목이 맡는다. 가로선이 매 섹션마다 들어가면
    정작 강조해야 할 지표 카드·하이라이트 제목과 시각적 무게가 비슷해진다.
  */
  return (
    <div>
      {/* 헤더 */}
      <Section className="my-0! pt-8 pb-8">
        <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
          {profile.name}
        </h1>
        <p className="text-primary-700 dark:text-primary-400 mt-2 text-2xl font-semibold">
          {profile.title}
        </p>
        <p className={`mt-4 leading-7 text-gray-600 dark:text-gray-300 ${measure}`}>
          {profile.tagline}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
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
        {showFullLink && (
          <Link
            href="/resume/full"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-6 inline-block text-sm font-medium print:hidden"
          >
            이력서 + 경력기술서 통합 보기 &rarr;
          </Link>
        )}
      </Section>

      {/*
        성과 지표 — 값·라벨은 content/metrics.ts 가 원천이고, evidence는 렌더하지 않는다.
        Summary 앞에 둔다. "숫자 중심 압축" 문서라면 스캔의 첫 착지점(인쇄물 첫 페이지 상단)이
        문단이 아니라 수치여야 한다.
      */}
      <Section className="py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-primary-50 dark:bg-primary-400/10 break-inside-avoid-page rounded-lg px-4 py-5 text-center"
            >
              <div className="text-primary-800 dark:text-primary-300 text-2xl leading-tight font-extrabold">
                {metric.value}
              </div>
              <div className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-400">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/*
        Summary — content/profile.ts 의 단일 문자열을 문장 단위로 끊어 문단으로 나눈다.
        문구는 그대로다. 첫 문장(정체성)과 마지막 문장(태도)만 진하게 두고 가운데 근거 문장은
        한 톤 낮춰, 벽처럼 보이던 한 문단에 위아래 경계를 만든다.
        문장이 하나뿐이면 첫 문장 분기만 타므로 예전과 같은 한 문단이 된다.
      */}
      <Section title="Summary" titleClassName={sectionTitle} className="py-8">
        <div className={`space-y-4 ${measure}`}>
          {summarySentences.map((sentence, index) => (
            <p
              key={sentence}
              className={
                index === 0
                  ? 'text-lg leading-8 text-gray-900 dark:text-gray-100'
                  : index === summarySentences.length - 1
                    ? 'leading-8 text-gray-900 dark:text-gray-100'
                    : 'leading-8 text-gray-600 dark:text-gray-400'
              }
            >
              {sentence}
            </p>
          ))}
        </div>
      </Section>

      {/* Skills — 나열만 하면 무엇이 주력인지 알 수 없어 두 단으로 나눈다 */}
      <Section title="Skills" titleClassName={sectionTitle} className="py-8">
        <dl className="space-y-4">
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
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          진한 배지는 주력, 옅은 배지는 보조입니다.
        </p>
      </Section>

      {/* Education / Certificate */}
      <Section className="py-8">
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="break-inside-avoid-page">
            <h3 className={sectionTitle}>Education</h3>
            <ul className="space-y-3">
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
                  <div className="text-sm text-gray-500 dark:text-gray-400">{item.period}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="break-inside-avoid-page">
            <h3 className={sectionTitle}>Certificate</h3>
            <ul className="space-y-3">
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
        </div>
      </Section>

      {/* Experience — 회사명·기간은 content/companies.ts 에서 온다 */}
      <Section title="Experience" titleClassName={sectionTitle} className="py-8">
        <div className="space-y-12">
          {experiences.map((experience) => {
            const company = getCompany(experience.companyId)

            return (
              <div key={company.id}>
                <div className="break-inside-avoid-page break-after-avoid-page">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {company.name}
                    </h4>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {experience.role} · {formatPeriod(company.period)}
                    </span>
                  </div>
                  <p
                    className={`mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400 ${measure}`}
                  >
                    {experience.summary}
                  </p>
                </div>

                <div className="mt-7 space-y-7">
                  {experience.groups.map((group) => (
                    <div key={group.product} className="break-inside-avoid-page">
                      <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {group.product}
                      </h5>
                      {/*
                        화면에서는 title 을 독립 줄로 세워 부연(detail)에 묻히지 않게 하고,
                        인쇄에서는 print:inline 으로 'title — detail' 한 줄로 되돌린다.
                        A4 분량이 늘어나는 것을 막기 위한 분기다.
                      */}
                      <ul className="mt-3 space-y-3">
                        {group.highlights.map((highlight) => (
                          <li
                            key={highlight.title}
                            className="break-inside-avoid-page border-l-2 border-gray-200 pl-4 text-sm leading-6 dark:border-gray-700"
                          >
                            <span className="block font-semibold text-gray-900 dark:text-gray-100 print:inline">
                              {highlight.title}
                            </span>
                            <span className="hidden print:inline"> — </span>
                            <span className="mt-0.5 block text-gray-600 dark:text-gray-400 print:inline print:text-inherit">
                              {highlight.detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Collaboration */}
      <Section title="Collaboration" titleClassName={sectionTitle} className="py-8">
        <p className={`leading-7 text-gray-700 dark:text-gray-300 ${measure}`}>
          {collaborationIntro}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {collaborations.map((item) => (
            <div
              key={item.audience}
              className="break-inside-avoid-page rounded-lg border border-gray-200 p-5 dark:border-gray-700"
            >
              <div className="text-primary-700 dark:text-primary-400 text-xs font-bold tracking-widest">
                {item.audience}
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">{item.body}</p>
              <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
                예: {item.example}
              </p>
            </div>
          ))}
        </div>
        <p className={`mt-6 leading-7 text-gray-700 dark:text-gray-300 ${measure}`}>
          {collaborationOutro}
        </p>
      </Section>
    </div>
  )
}
