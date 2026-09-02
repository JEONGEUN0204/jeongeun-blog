import { IoIosMail } from 'react-icons/io'
import { MdOutlinePhoneIphone } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'
import Link from '@/components/Link'
import Section from '@/components/mdx/Section'
import resumeData from '@/data/resumeData'

const {
  profile,
  summary,
  metrics,
  skills,
  education,
  certificates,
  experiences,
  collaborationIntro,
  collaborations,
  collaborationOutro,
} = resumeData

const sectionTitle =
  'mb-5 text-xs font-bold tracking-[0.2em] text-primary-700 uppercase dark:text-primary-400'

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-primary-100 text-primary-800 dark:bg-primary-400/15 dark:text-primary-300 mr-1 mb-1 inline-flex h-fit w-fit rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap">
    {children}
  </span>
)

interface Props {
  /** `/resume/full` 로 가는 링크 노출 여부 (통합 페이지에서는 숨김) */
  showFullLink?: boolean
}

export default function ResumeContent({ showFullLink = true }: Props) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* 헤더 */}
      <Section className="my-0! pt-8 pb-10">
        <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
          {profile.name}
        </h1>
        <p className="text-primary-700 dark:text-primary-400 mt-2 text-2xl font-semibold">
          {profile.title}
        </p>
        <p className="mt-4 max-w-3xl leading-7 text-gray-600 dark:text-gray-300">
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

      {/* Summary */}
      <Section title="Summary" titleClassName={sectionTitle} className="py-10">
        <p className="leading-8 text-gray-700 dark:text-gray-300">{summary}</p>
      </Section>

      {/* 성과 지표 */}
      <Section className="py-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="break-inside-avoid-page rounded-lg border border-gray-200 px-4 py-5 text-center dark:border-gray-700"
            >
              <div className="text-primary-700 dark:text-primary-400 text-xl font-extrabold">
                {metric.value}
              </div>
              <div className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-400">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills" titleClassName={sectionTitle} className="py-10">
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
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Education / Certificate */}
      <Section className="py-10">
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

      {/* Experience */}
      <Section title="Experience" titleClassName={sectionTitle} className="py-10">
        <div className="space-y-12">
          {experiences.map((experience) => (
            <div key={experience.company}>
              <div className="break-inside-avoid-page break-after-avoid-page">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {experience.company}
                  </h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {experience.role} · {experience.period}
                  </span>
                  <span className="bg-primary-100 text-primary-800 dark:bg-primary-400/15 dark:text-primary-300 rounded-md px-2 py-0.5 text-xs font-medium">
                    {experience.duration}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {experience.summary}
                </p>
              </div>

              <div className="mt-5 space-y-6">
                {experience.groups.map((group) => (
                  <div key={group.product} className="break-inside-avoid-page">
                    <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {group.product}
                    </h5>
                    <ul className="mt-2 space-y-2">
                      {group.highlights.map((highlight) => (
                        <li
                          key={highlight.title}
                          className="border-l-2 border-gray-200 pl-4 text-sm leading-6 dark:border-gray-700"
                        >
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {highlight.title}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {' '}
                            — {highlight.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Collaboration */}
      <Section title="Collaboration" titleClassName={sectionTitle} className="py-10">
        <p className="leading-7 text-gray-700 dark:text-gray-300">{collaborationIntro}</p>
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
        <p className="mt-6 leading-7 text-gray-700 dark:text-gray-300">{collaborationOutro}</p>
      </Section>
    </div>
  )
}
