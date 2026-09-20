import { experiences } from '@/content/experience'

/**
 * /careers 에서 같은 제품의 번호 섹션을 묶는 구분선. 'Codit 플랫폼 · Web' 라벨 + 가로선.
 *
 * 제품 이름을 여기서 한 번만 적고, 아래 섹션 제목에는 작업만 남긴다 — 제목마다
 * 'Codit 플랫폼 · …' 이 반복되면 작업 이름이 뒤로 밀려 안 읽힌다.
 * 번호 섹션(h3)보다 작게 둔다. 섹션 제목과 경쟁하지 않고 경계만 긋는 자리다.
 *
 * product 는 content/experience.ts 의 그룹 이름(/resume 의 제품 소제목)과 같은 문자열이어야 한다.
 * 두 문서가 같은 묶음을 쓰도록, 없는 이름이면 조용히 그리는 대신 빌드를 멈춘다.
 */
export default function ProductGroup({ product }: { product: string }) {
  const exists = experiences.some((experience) =>
    experience.groups.some((group) => group.product === product)
  )
  if (!exists) {
    throw new Error(`<ProductGroup product="${product}"> — content/experience.ts 에 없는 그룹이다`)
  }

  /* 'ChatCODIT App (iOS · Android)' → 'ChatCODIT App · iOS · Android' */
  const label = product.replace(/\s*\(([^)]+)\)$/, ' · $1')

  /*
    앞 섹션과는 멀리(mt-14), 뒤 섹션과는 섹션끼리의 간격만큼 둔다 — 뒤 섹션 제목(h3)의 prose 위 여백이
    섹션의 my-8 과 겹쳐 그 간격을 정한다. 그래서 라벨이 아래 섹션에 붙어 읽힌다.
    회사 본문 맨 앞이면 위 여백을 없애 회사 헤더와의 간격을 섹션과 같게 둔다.
    인쇄에서 라벨만 페이지 끝에 홀로 남지 않게 break-after-avoid-page 를 건다.
  */
  return (
    <div className="not-prose mt-14 flex break-inside-avoid-page break-after-avoid-page items-center gap-3 first:mt-0">
      <h2 className="text-primary-700 dark:text-primary-400 min-w-0 text-sm leading-5 font-bold tracking-[0.08em]">
        {label}
      </h2>
      <span aria-hidden className="h-px min-w-8 grow bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}
