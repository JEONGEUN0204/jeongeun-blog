import { allProjects } from 'contentlayer/generated'
import PortfolioBrowser from '@/components/portfolio/PortfolioBrowser'
import { projectBody } from '@/components/portfolio/ProjectDetail'
import { pad, type PortfolioCompany } from '@/components/portfolio/portfolio'
import { companies, formatPeriod } from '@/content/companies'
import { profile } from '@/content/profile'
import { formatProjectPeriod, portfolioName, topLevelProjects } from '@/content/projects'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Portfolio' })

/*
  /portfolio — 왼쪽 책갈피로 회사를 고르고, 그 회사의 프로젝트 카드를 누르면 아래에 본문이 펼쳐진다.

  사실(이름·기간·역할·스택)은 content/, 표현(요약·스크린샷·본문)은 data/projects/{id}.mdx 에 있다.
  파일명이 두 소스를 잇는 유일한 키다. 이 페이지는 둘을 회사별로 묶기만 한다.

  - 회사 순서는 content/companies.ts 순서(최신 회사 먼저)이고, 첫 회사가 처음 선택된다.
  - 회사 안에서는 대표(flagship)를 맨 앞으로 빼고 나머지를 content/projects 배열 순서대로 잇는다.
    번호는 회사마다 01 부터 센다. 'Flagship' 같은 등급 라벨은 달지 않는다 — 위계는 순서가 나타낸다.
  - parentId 가 있는 하위 프로젝트는 카드로 세지 않는다. 상위 프로젝트 본문의 마지막 섹션들로 붙는다.
*/
export default function Portfolio() {
  const groups: PortfolioCompany[] = companies.flatMap((company) => {
    const own = topLevelProjects.filter((project) => project.companyId === company.id)
    const ordered = [
      ...own.filter((project) => project.depth === 'flagship'),
      ...own.filter((project) => project.depth !== 'flagship'),
    ]
    const withDocs = ordered.flatMap((project) => {
      const doc = allProjects.find((item) => item.slug === project.id)
      return doc ? [{ project, doc }] : []
    })
    if (withDocs.length === 0) return []

    return [
      {
        id: company.id,
        name: company.name,
        period: formatPeriod(company.period),
        context: company.context,
        projects: withDocs.map(({ project, doc }, index) => {
          const no = pad(index + 1)
          return {
            id: project.id,
            no,
            name: portfolioName(project),
            platform: doc.platform,
            period: formatProjectPeriod(project),
            summary: doc.summary,
            stack: project.stack.primary,
            ...projectBody({ project, doc, no }),
          }
        }),
      },
    ]
  })

  return <PortfolioBrowser title={`${profile.name} · Portfolio`} companies={groups} />
}
