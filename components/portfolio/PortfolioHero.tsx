import { allAuthors, type Authors } from 'contentlayer/generated'
import { IoIosMail } from 'react-icons/io'
import { MdOutlinePhoneIphone } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'
import Image from '@/components/Image'
import Reveal from '@/components/motion/Reveal'
import { about, profile } from '@/content/profile'
import { getMetrics, resumeMetricIds } from '@/content/metrics'

/**
 * /portfolio 의 첫 화면.
 *
 * layouts/AuthorLayout 을 쓰지 않는다. 그 레이아웃은 홈(app/Main.tsx)이 함께 쓰고 있어서
 * 포트폴리오에 맞춰 고치면 홈까지 따라 바뀐다. 아바타만 예전과 같은 곳(authors/default.mdx)에서
 * 가져오고, 이름·직함·연락처는 content/profile.ts 가 원천이다.
 */
export default function PortfolioHero() {
  const author = allAuthors.find((item) => item.slug === 'default') as Authors
  const avatar = author?.avatar
  /*
    지표는 /resume 상단과 같은 목록을 쓴다. 두 문서가 각자 대표 수치를 고르면
    "이 사람의 대표 성과"가 문서마다 달라진다 — 고르는 일도 사실의 일부다.
  */
  const metrics = getMetrics(resumeMetricIds)

  return (
    <section className="break-inside-avoid-page pt-8">
      <div className="flex flex-wrap items-center gap-8">
        {avatar && (
          <Image
            src={avatar}
            alt="avatar"
            width={192}
            height={192}
            className="h-50 w-40 rounded-xl"
          />
        )}
        <div className="min-w-0">
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
            {profile.name}
          </h1>
          <p className="text-primary-700 dark:text-primary-400 mt-2 text-2xl font-semibold">
            {profile.title}
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
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
      </div>

      <p className="mt-8 max-w-[68ch] text-lg leading-8 text-gray-900 dark:text-gray-100">
        {profile.tagline}
      </p>

      {/* 지표 스트립 — 순차 등장. 60ms 단위, 마지막 카드까지 180ms 안에 끝난다. */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((metric, index) => (
          <Reveal key={metric.id} delay={Math.min(index, 3) * 60}>
            <div className="bg-primary-50 dark:bg-primary-400/10 h-full break-inside-avoid-page rounded-lg px-4 py-5 text-center">
              <div className="text-primary-800 dark:text-primary-300 text-2xl leading-tight font-extrabold">
                {metric.value}
              </div>
              <div className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-400">
                {metric.label}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ABOUT — /resume 의 SUMMARY 와 문장이 겹치면 verify 가 실패한다 */}
      <Reveal className="mt-14">
        <p className="text-primary-700 dark:text-primary-400 text-xs font-bold tracking-[0.2em] uppercase">
          About
        </p>
        <div className="mt-3 max-w-[68ch] space-y-2">
          {about.map((line) => (
            <p key={line} className="leading-8 text-gray-700 dark:text-gray-300">
              {line}
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
