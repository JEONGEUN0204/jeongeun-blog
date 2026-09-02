import CareerList from '@/components/CareerList'
import ResumeContent from '@/components/ResumeContent'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: '이력서 + 경력기술서' })

/**
 * 이력서와 경력기술서를 하나의 문서로 요구하는 회사를 위한 통합 인쇄용 페이지.
 * 별도 버튼 없이 이 페이지를 방문해 Ctrl+P 로 PDF 저장한다.
 */
export default function ResumeFull() {
  return (
    <>
      <ResumeContent showFullLink={false} />
      <section className="break-before-page border-t border-gray-200 pt-10 dark:border-gray-700">
        <h2 className="text-primary-700 dark:text-primary-400 break-after-avoid-page text-xs font-bold tracking-[0.2em] uppercase">
          Career Description
        </h2>
        <CareerList />
      </section>
    </>
  )
}
