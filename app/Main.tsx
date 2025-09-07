import { Authors, allAuthors } from 'contentlayer/generated'
import { coreContent } from 'pliny/utils/contentlayer'
import AuthorLayout from '@/layouts/AuthorLayout'
import { MDXLayoutRenderer } from 'pliny/mdx-components'

export default function Home() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <h1 className="text-pink-600">About Me</h1>
        <MDXLayoutRenderer code={author.body.code} />
        <h1 className="mt-8 text-pink-600">Education</h1>
        <div className="space-y-2">
          <div className="flex space-x-5 text-2xl font-bold">
            <div>2015.03 ~ 2018.02</div> <div>삼성고등학교</div>
          </div>
          <div className="flex space-x-5 text-2xl font-bold">
            <div>2019.03 ~ 2024.02</div> <div>숙명여자대학교</div>
          </div>
        </div>
        <h1 className="mt-8 text-pink-600">Certificate</h1>
        <div className="flex space-x-5 text-2xl font-bold">
          <div>2022.06.17</div> <div>정보처리기사</div>
        </div>
      </AuthorLayout>
    </>
  )
}
