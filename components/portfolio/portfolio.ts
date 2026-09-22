import type { ReactNode } from 'react'

/*
  /portfolio 가 주고받는 모양.

  서버(app/portfolio/page.tsx)가 content/ 와 data/projects/*.mdx 를 이 모양으로 묶어 넘기고,
  클라이언트 컴포넌트(PortfolioBrowser · ProjectCard · ProjectBody)는 렌더만 한다.
  사실 문자열은 전부 서버가 채워 온다. 여기에는 표기 규칙만 둔다.
*/

/** 목차 한 줄. id 는 본문에서 그 자리를 가리키는 요소의 id 다. */
export type IndexItem = {
  id: string
  title: string
}

export type ProjectSection = IndexItem & {
  /** 서버에서 렌더한 섹션 본문. 제목(h3)을 스스로 담고 있어 인쇄에서도 그대로 읽힌다. */
  node: ReactNode
  /** 섹션 안에서 목차가 더 가리킬 자리. flagship 서술의 칸(문제·관점…)이 온다. */
  items?: IndexItem[]
}

/** 타일에 까는 스크린샷 한 장. MDX frontmatter 의 images 첫 장과 imageSize·imageFrame 을 옮겨 담는다. */
export type ProjectCover = {
  src: string
  /** next/image 에 넘길 비율. 실제 표시 크기는 타일이 정한다. */
  width: number
  height: number
  /** 기기 화면이면 타일 아래에서 올라오게 놓는다. 없으면 웹 가로 화면이다. */
  frame?: 'phone' | 'tablet'
}

export type PortfolioProject = {
  id: string
  /** 회사 안 번호 '01'. 대표(flagship)가 맨 앞이다. */
  no: string
  name: string
  platform?: string
  summary?: string
  /** 주력 스택. lead 타일은 전부, wide 타일은 앞의 두 개를 앞면에 올린다. */
  stack: string[]
  /** 타일 스크린샷. 이미지가 없는 프로젝트는 글자만 싣는다. */
  cover?: ProjectCover
  /** 헤더·스크린샷·요약. 본문 맨 앞에 온다. */
  overview: ReactNode
  /** 작업 단위 섹션. 제목이 카드 뒷면과 목차에 그대로 올라간다. */
  sections: ProjectSection[]
}

export type PortfolioCompany = {
  id: string
  name: string
  period: string
  context: string
  projects: PortfolioProject[]
}

/** 두 자리 번호. '01', '04'. */
export const pad = (value: number) => String(value).padStart(2, '0')

export type TileSize = 'lead' | 'wide' | 'small'

/**
 * 벤토 타일 크기. 번호처럼 회사 안 순서로만 정한다 — 위계는 순서가 나타낸다.
 * 첫 타일은 2×2(lead), 둘째는 가로 2칸(wide), 나머지는 한 칸이다. 프로젝트가 넷이면 4열 2행이 빈칸 없이 찬다.
 */
export const tileSize = (index: number): TileSize =>
  index === 0 ? 'lead' : index === 1 ? 'wide' : 'small'

export const cardId = (projectId: string) => `card-${projectId}`
export const detailId = (projectId: string) => `detail-${projectId}`
/** 본문 맨 앞(개요) 자리. 목차의 첫 줄이 가리킨다. */
export const overviewId = (projectId: string) => `${projectId}-overview`

/** 'auto' 가 아니라 'instant' 다. html 에 scroll-smooth 가 걸려 있어 'auto' 는 CSS 를 따라 부드럽게 스크롤한다. */
export const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
