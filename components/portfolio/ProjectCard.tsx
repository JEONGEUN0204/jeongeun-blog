'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { deviceRadii } from '@/components/DeviceFrame'
import Image from '@/components/Image'
import {
  cardId,
  detailId,
  type PortfolioProject,
  type ProjectCover,
  type TileSize,
} from './portfolio'

interface Props {
  project: PortfolioProject
  /** 그리드에 놓인 순서. 등장 지연과 small 타일의 면 색에 쓴다. */
  index: number
  /** 타일 크기. PortfolioBrowser 가 같은 값으로 그리드 칸을 잡는다. */
  size: TileSize
  selected: boolean
  onSelect: () => void
}

type Tone = {
  face: string
  ring: string
  eyebrow: string
  name: string
  meta: string
  chip: string
}

/**
 * 앞면 색. lead 는 어두운 면(ink), wide 는 밝은 면(paper), small 은 스카이 블루 그라데이션(sky)·그레이(sand)를 번갈아 깐다.
 * 바탕과 색이 같아지는 면은 다크모드에서 옅은 테두리로 구분한다. 그레이는 다크모드에서 sand-900 으로 내려
 * 스카이와 번갈아 깔린 게 계속 보이게 한다. 스카이는 두 모드에서 같은 색이라 다크모드에서도 글자를 어둡게 둔다.
 * 작은 글자는 css/tailwind.css 의 대비표를 따른다 — 그레이 면 위에서는 accent 가 4.5 에 못 미쳐 sand-800 을 쓴다.
 */
const tones = {
  ink: {
    face: 'bg-gray-950',
    ring: 'ring-transparent dark:ring-gray-700',
    eyebrow: 'text-sand-300',
    name: 'text-sand-50',
    meta: 'text-sand-300',
    chip: 'bg-sand-50/10 text-sand-100',
  },
  paper: {
    face: 'bg-gray-50 dark:bg-gray-900',
    ring: 'ring-sand-300 dark:ring-gray-700',
    eyebrow: 'text-accent-700 dark:text-accent-300',
    name: 'text-gray-900 dark:text-gray-100',
    meta: 'text-gray-600 dark:text-gray-400',
    chip: 'bg-primary-100 text-primary-800 dark:bg-primary-400/15 dark:text-primary-300',
  },
  sky: {
    face: 'bg-linear-to-b from-accent-100 to-accent-200',
    ring: 'ring-transparent',
    eyebrow: 'text-primary-700',
    name: 'text-gray-900',
    meta: 'text-primary-800',
    chip: 'bg-white/55 text-primary-800',
  },
  sand: {
    face: 'bg-sand-200 dark:bg-sand-900',
    ring: 'ring-transparent dark:ring-gray-700',
    eyebrow: 'text-sand-800 dark:text-sand-300',
    name: 'text-gray-900 dark:text-gray-100',
    meta: 'text-sand-800 dark:text-sand-300',
    chip: 'bg-sand-50/60 text-sand-900 dark:bg-sand-50/10 dark:text-sand-100',
  },
} satisfies Record<string, Tone>

/**
 * 프로젝트 타일 한 장. 벤토 그리드의 한 칸이고, 올려 두면 그 자리에서 뒤집혀 뒷면에 미리보기가 드러난다.
 *
 * 앞면은 타일이 클수록 많이 싣는다. lead 는 요약·주력 스택 전부·기간, wide 는 스택 두 개·기간,
 * small 은 번호·플랫폼·이름뿐이다 — small 에서 빠진 기간은 뒷면 머리에 있다.
 * 스크린샷은 MDX images 의 첫 장이다. 웹 화면은 타일 밖으로 흘려 잘라내고, 기기 화면은 아래에서 올라오게 놓는다.
 * 스크린샷은 장식이라 alt 를 비운다. 무엇의 화면인지는 버튼 텍스트(이름)가 이미 말한다.
 *
 * 뒷면은 무엇을 했는지를 작업 제목으로 답한다 — 제목은 본문 섹션 제목(MDX 소제목·서술 섹션의 name·하위 프로젝트 이름)을
 * 그대로 올린 것이라 문구를 새로 짓지 않는다. 섹션이 없는 프로젝트는 뒷면에 요약을 싣는다.
 * 넘치는 제목은 아래쪽을 흐리게 잘라낸다.
 *
 * 마우스 올리기와 키보드 포커스(:focus-visible)로 뒤집고, 넓은 화면(lg)에서만 뒤집는다. 좁은 타일에는
 * 뒷면 내용이 들어가지 않고 터치에는 올려 두기가 없다 — 그 경우엔 누르면 바로 본문으로 간다.
 * 스크린리더는 aria-describedby 로 뒷면을 읽는다.
 *
 * 버튼 안이라 요소는 전부 span 이다. 기기 프레임도 DeviceFrame(div) 대신 같은 라운드 값으로 span 을 짠다.
 */
export default function ProjectCard({ project, index, size, selected, onSelect }: Props) {
  const [flipped, setFlipped] = useState(false)
  const previewId = `preview-${project.id}`
  const titles = project.sections.map((section) => section.title)
  const tone =
    size === 'lead'
      ? tones.ink
      : size === 'wide'
        ? tones.paper
        : index % 2 === 0
          ? tones.sky
          : tones.sand
  // 앞면은 면 색에 맞춘 테두리, 뒷면은 흰 면이라 옅은 회색 테두리를 쓴다. 선택 테두리는 밝은 바탕에서 옅은 300 이다.
  const face = (ring: string) =>
    `absolute inset-0 overflow-hidden rounded-2xl backface-hidden md:rounded-3xl ${
      selected
        ? 'ring-accent-300 shadow-accent-500/20 shadow-xl ring-2 dark:ring-accent-600'
        : `${ring} group-hover:ring-accent-500 shadow-lg ring-1 shadow-gray-950/10`
    }`

  return (
    <button
      type="button"
      id={cardId(project.id)}
      onClick={onSelect}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setFlipped(true)
      }}
      onPointerLeave={() => setFlipped(false)}
      onFocus={(event) => {
        // 마우스로 누를 때 생기는 포커스로는 뒤집지 않는다. 올려 둔 동안은 pointerenter 가 이미 뒤집었다.
        if (event.currentTarget.matches(':focus-visible')) setFlipped(true)
      }}
      onBlur={() => setFlipped(false)}
      aria-pressed={selected}
      aria-controls={detailId(project.id)}
      aria-describedby={previewId}
      className={`group block h-full w-full rounded-2xl text-left transition-[translate] duration-300 motion-reduce:transition-none md:rounded-3xl ${
        selected ? '-translate-y-1.5' : 'hover:-translate-y-1'
      }`}
    >
      {/* 등장(translate 키프레임)과 뒤집기(transform)를 다른 요소에 둔다 — 한 요소에 두면 fill-mode 가 뒤집기를 덮는다. */}
      <span
        className="stagger-in block h-full perspective-distant"
        style={{ '--stagger-index': index } as CSSProperties}
      >
        <span
          className={`relative block h-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform-3d motion-reduce:transition-none ${
            flipped ? 'lg:[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* 앞면 */}
          <span className={`${face(tone.ring)} ${tone.face}`}>
            {size === 'lead' && <LeadFront project={project} tone={tone} />}
            {size === 'wide' && <WideFront project={project} tone={tone} />}
            {size === 'small' && <SmallFront project={project} tone={tone} />}
          </span>

          {/* 뒷면 — 미리보기 */}
          <span
            id={previewId}
            className={`${face('ring-gray-200 dark:ring-gray-700')} flex [transform:rotateY(180deg)] flex-col bg-white text-left dark:bg-gray-900 ${
              size === 'lead' ? 'p-5 sm:p-7' : 'p-3 sm:p-4'
            }`}
          >
            <span className="text-accent-700 dark:text-accent-300 block truncate text-[11px] tabular-nums">
              {project.platform}
            </span>
            <span
              className={`mt-1 block leading-snug font-bold break-keep text-gray-900 dark:text-gray-100 ${
                size === 'lead' ? 'text-2xl' : 'text-sm'
              }`}
            >
              {project.name}
            </span>

            {/*
              lead 는 요약을 제목 목록 앞에 둔다. 목록을 앞에 두면 섹션이 하나뿐인 프로젝트에서 목록과 요약 사이가
              통째로 비었다. 목록은 남은 높이를 채우고 넘치면 아래쪽을 흐린다 — 흐림이 빈 여백에 걸리도록 목록이 마지막이다.
              나머지 타일은 높이가 작아 목록만 싣는다.
            */}
            {size === 'lead' && titles.length > 0 && project.summary && (
              <span className="mt-3 line-clamp-4 text-[15px] leading-7 text-gray-700 dark:text-gray-300">
                {project.summary}
              </span>
            )}
            {titles.length > 0 ? (
              <span
                className={`block min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_1.5rem),transparent)] ${
                  size === 'lead'
                    ? 'mt-5 space-y-2 border-t border-gray-200 pt-5 dark:border-gray-700'
                    : 'mt-3 space-y-1.5'
                }`}
              >
                {titles.map((title) => (
                  <span
                    key={title}
                    className={`flex gap-2 leading-snug text-gray-800 dark:text-gray-200 ${
                      size === 'lead' ? 'text-[15px]' : 'text-xs'
                    }`}
                  >
                    <span
                      aria-hidden
                      className="bg-accent-500 mt-[0.45em] size-1 shrink-0 rounded-full"
                    />
                    <span className="line-clamp-2">{title}</span>
                  </span>
                ))}
              </span>
            ) : (
              project.summary && (
                <span
                  className={`mt-3 text-gray-700 dark:text-gray-300 ${
                    size === 'lead'
                      ? 'line-clamp-10 text-[15px] leading-7'
                      : 'line-clamp-5 text-xs leading-5'
                  }`}
                >
                  {project.summary}
                </span>
              )
            )}
          </span>
        </span>
      </span>
    </button>
  )
}

type FrontProps = { project: PortfolioProject; tone: Tone }

/** 2×2 대표 타일. 웹 화면은 위쪽에 크게 깔고 아래를 면 색으로 덮어 글자를 올린다. 기기 화면은 오른쪽에 세운다. */
function LeadFront({ project, tone }: FrontProps) {
  const { cover } = project
  const device = Boolean(cover?.frame)

  return (
    <>
      {cover && device && (
        <span className="absolute top-5 right-5 w-[34%] sm:top-7 sm:right-7">
          <Cover cover={cover} sizes="(min-width: 1280px) 172px, (min-width: 768px) 128px, 34vw" />
        </span>
      )}
      {cover && !device && (
        <>
          <span className="absolute top-5 left-5 w-[125%] sm:top-7 sm:left-7">
            <Cover
              cover={cover}
              sizes="(min-width: 1280px) 630px, (min-width: 768px) 470px, 125vw"
            />
          </span>
          {/* lead 는 늘 ink 면이라 덮개도 gray-950 이다 */}
          <span
            aria-hidden
            className="absolute inset-0 bg-linear-to-b from-gray-950/0 from-30% via-gray-950/95 via-55% to-gray-950 to-70%"
          />
        </>
      )}
      <span
        className={`absolute bottom-5 left-5 flex flex-col sm:bottom-7 sm:left-7 ${
          device ? 'right-[42%]' : 'right-5 sm:right-7'
        }`}
      >
        <Eyebrow project={project} tone={tone} />
        <span
          className={`mt-1.5 text-2xl leading-tight font-extrabold tracking-tight break-keep sm:text-4xl ${tone.name}`}
        >
          {project.name}
        </span>
        {project.summary && (
          <span className={`mt-2 line-clamp-2 text-sm leading-6 max-sm:hidden ${tone.meta}`}>
            {project.summary}
          </span>
        )}
        <span className="mt-4 flex flex-wrap items-center gap-1.5">
          {project.stack.map((tag) => (
            <Chip key={tag} tone={tone}>
              {tag}
            </Chip>
          ))}
        </span>
      </span>
    </>
  )
}

/**
 * 가로 2칸 타일. 글자는 왼쪽, 스크린샷은 오른쪽에서 타일 밖으로 흘린다.
 * 컨테이너가 1024px 이 되는 xl 전에는 타일 폭이 350px 안팎이라 글자 칸을 넓히고 스택 칩을 뺀다.
 */
function WideFront({ project, tone }: FrontProps) {
  const { cover } = project

  return (
    <>
      {cover && (
        <span
          className={`absolute ${
            cover.frame
              ? 'top-5 right-6 w-[24%] sm:top-6 sm:right-8'
              : 'top-6 left-[58%] w-[64%] xl:top-8 xl:left-[46%] xl:w-[68%]'
          }`}
        >
          <Cover
            cover={cover}
            sizes={
              cover.frame
                ? '(min-width: 1280px) 121px, (min-width: 768px) 90px, 24vw'
                : '(min-width: 1280px) 343px, (min-width: 768px) 241px, 64vw'
            }
          />
        </span>
      )}
      <span
        className={`relative flex h-full flex-col items-start p-4 xl:p-6 ${
          cover ? 'w-[56%] xl:w-[46%]' : ''
        }`}
      >
        <Eyebrow project={project} tone={tone} />
        <span
          className={`mt-1 text-lg leading-snug font-extrabold tracking-tight break-keep xl:text-2xl ${tone.name}`}
        >
          {project.name}
        </span>
        <span className="mt-auto hidden flex-wrap gap-1 pt-3 xl:flex">
          {project.stack.slice(0, 2).map((tag) => (
            <Chip key={tag} tone={tone}>
              {tag}
            </Chip>
          ))}
        </span>
      </span>
    </>
  )
}

/** 한 칸 타일. 이름 아래로 스크린샷 윗부분이 올라와 보인다. */
function SmallFront({ project, tone }: FrontProps) {
  const { cover } = project

  return (
    <>
      {cover && (
        <span
          className={`absolute top-[52%] md:top-1/2 ${
            cover.frame ? 'left-1/2 w-[54%] -translate-x-1/2' : 'left-4 w-[150%] sm:left-5'
          }`}
        >
          <Cover
            cover={cover}
            sizes={
              cover.frame
                ? '(min-width: 1280px) 132px, (min-width: 768px) 97px, 27vw'
                : '(min-width: 1280px) 366px, (min-width: 768px) 270px, 75vw'
            }
          />
        </span>
      )}
      <span className="relative flex flex-col items-start p-3 sm:p-5 md:p-4 xl:p-5">
        <Eyebrow project={project} tone={tone} compact />
        {/* 4열이 되는 md 부터 xl 전까지는 타일이 170px 안팎이라 글자를 한 단 내린다 */}
        <span
          className={`mt-1 line-clamp-3 text-[15px] leading-snug font-extrabold tracking-tight break-keep sm:text-lg md:text-base xl:text-lg ${tone.name}`}
        >
          {project.name}
        </span>
      </span>
    </>
  )
}

/**
 * '01 · Web · 핵심'. 한 줄로 자른다 — 두 줄로 늘어나면 아래 스크린샷과 겹친다. 전체 플랫폼 이름은 뒷면 머리에 있다.
 * compact(small 타일)는 가장 좁은 화면에서 번호만 남긴다.
 */
function Eyebrow({ project, tone, compact }: FrontProps & { compact?: boolean }) {
  return (
    <span
      className={`block max-w-full truncate text-[10px] font-bold tracking-[0.12em] uppercase sm:text-[11px] ${tone.eyebrow}`}
    >
      <span className="tabular-nums">{project.no}</span>
      {project.platform && (
        <span className={compact ? 'max-sm:hidden' : ''}> · {project.platform}</span>
      )}
    </span>
  )
}

function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap sm:text-[11px] ${tone.chip}`}
    >
      {children}
    </span>
  )
}

/**
 * 웹 화면은 둥근 모서리와 그림자, 기기 화면은 DeviceFrame 과 같은 얇은 베젤을 두른다.
 *
 * sizes 는 타일 안에서 이미지가 실제로 차지하는 폭이다(컨테이너 1024·768px, 4열·2열 기준으로 계산).
 * 없으면 next/image 가 width(MDX imageSize, 본문 표시 폭 300 안팎)의 1x·2x 만 만들어
 * 630px 로 그려지는 lead 타일에 640px 짜리가 올라가 흐려졌다. 정적 export(UNOPTIMIZED)에서는 원본이 그대로 나간다.
 */
function Cover({ cover, sizes }: { cover: ProjectCover; sizes: string }) {
  const image = (
    <Image
      src={cover.src}
      alt=""
      width={cover.width}
      height={cover.height}
      sizes={sizes}
      className="block h-auto w-full"
    />
  )

  if (cover.frame) {
    const { outer, inner } = deviceRadii[cover.frame]
    return (
      <span
        className={`block bg-gray-900 p-[3px] shadow-xl ring-1 shadow-gray-950/30 ring-white/10 ${outer}`}
      >
        <span className={`block overflow-hidden ${inner}`}>{image}</span>
      </span>
    )
  }

  return (
    <span className="block overflow-hidden rounded-lg shadow-xl ring-1 shadow-gray-950/25 ring-gray-950/10 md:rounded-xl dark:ring-white/10">
      {image}
    </span>
  )
}
