import { Authors, allAuthors } from 'contentlayer/generated'
import AuthorLayout from '@/layouts/AuthorLayout'
import { MDXLayoutRenderer } from 'pliny/mdx-components'

export default function Home() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors

  return (
    <>
      <AuthorLayout>
        <div className="w-full border-b-2 border-b-pink-600 pb-2">
          <h1 className="mb-0 text-3xl text-pink-600">About Me</h1>
        </div>
        <MDXLayoutRenderer code={author.body.code} />
        <div className="flex w-full space-x-10">
          <div className="w-full">
            <div className="mb-4 w-full border-b-2 border-b-pink-600 pb-2">
              <h1 className="mt-8 mb-0 text-3xl text-pink-600">Education</h1>
            </div>
            <div className="space-y-2">
              <div className="text-md flex space-x-5 font-semibold">
                <div>2015.03 ~ 2018.02</div> <div>삼성고등학교</div>
              </div>
              <div className="text-md flex space-x-5 font-semibold">
                <div>2019.03 ~ 2024.02</div> <div>숙명여자대학교</div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="mb-4 w-full border-b-2 border-b-pink-600 pb-2">
              <h1 className="mt-8 mb-0 text-3xl text-pink-600">Certificate</h1>
            </div>
            <div className="text-md flex space-x-5 font-semibold">
              <div>2022.06.17</div> <div>정보처리기사</div>
            </div>
          </div>
        </div>
      </AuthorLayout>
    </>
  )
}
