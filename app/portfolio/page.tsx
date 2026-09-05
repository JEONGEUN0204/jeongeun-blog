import { allProjects } from 'contentlayer/generated'
import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import PortfolioHero from '@/components/portfolio/PortfolioHero'
import ProjectDetail from '@/components/portfolio/ProjectDetail'
import ProjectShowcase from '@/components/portfolio/ProjectShowcase'
import { getCompany } from '@/content/companies'
import { projects } from '@/content/projects'

/*
  사실(이름·기간·역할·팀·스택)은 content/projects/{id}.ts, 표현(요약·스크린샷·본문)은
  data/projects/{id}.mdx 에 있다. 파일명이 두 소스를 잇는 유일한 키다.

  위계는 라벨이 아니라 순서가 나타낸다. depth 는 스키마에 그대로 남아 있지만 화면에서
  'Flagship' / 'Supporting' 이라는 단어를 보여주지는 않는다 — supporting 으로 묶인
  프로젝트도 전부 실무 프로젝트이고 "덜 중요한 것"으로 읽힐 이유가 없다.
  대표는 인덱스 맨 앞이고 기본으로 선택돼 있다는 것으로만 구분된다.
*/
const flagships = projects.filter((project) => project.depth === 'flagship')
const rest = projects.filter((project) => project.depth !== 'flagship')

/** 노출 순서가 곧 번호다. 대표를 맨 앞으로 빼고 나머지를 배열 순서대로 잇는다. */
const ordered = [...flagships, ...rest]
const numberOf = (id: string) => String(ordered.findIndex((p) => p.id === id) + 1).padStart(2, '0')

/**
 * MDX 본문의 `###` 소제목만 뽑는다. contentlayer 의 toc 는 json 필드라 타입이 없어
 * 여기서 한 번만 좁힌다. 스트립 카드가 "무슨 작업을 했는지"를 이 목록으로 보여준다.
 */
type TocHeading = { value: string; depth: number }
const subheadings = (toc: unknown) =>
  (toc as TocHeading[]).filter((heading) => heading.depth === 3).map((heading) => heading.value)

const Portfolio = () => {
  return (
    <>
      <ScrollProgress />
      <PortfolioHero />

      <section className="mt-24">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase dark:text-gray-400">
            Projects
          </p>
          <div className="mt-4 mb-10 border-t border-gray-200 dark:border-gray-700" />
        </Reveal>

        <ProjectShowcase
          items={ordered.flatMap((project) => {
            const doc = allProjects.find((item) => item.slug === project.id)
            if (!doc) return []
            const no = numberOf(project.id)
            return [
              {
                id: project.id,
                no,
                company: getCompany(project.companyId).name,
                name: project.name,
                topics: subheadings(doc.toc),
                detail: <ProjectDetail project={project} doc={doc} no={no} />,
              },
            ]
          })}
        />
      </section>
    </>
  )
}

export default Portfolio
