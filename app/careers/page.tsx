import AuthorLayout from '@/layouts/AuthorLayout'
import { allCareers } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import Image from '@/components/Image'
import dayjs from 'dayjs'

const Career = () => {
  return (
    <AuthorLayout>
      {allCareers.map((career, index) => {
        const tags = career.tags.split('-')

        return (
          <div key={index} className="flex items-start space-x-20">
            <div className="flex flex-col space-y-1">
              <Image
                src={career.logo}
                width={200}
                height={200}
                alt=""
                className="mt-0 rounded-lg"
              />
              <div className="text-4xl font-bold text-black">
                {dayjs(career.date).format('YYYY.MM.DD')}~{career.endDate}
              </div>
              <div className="h-fit w-fit rounded-md bg-pink-600 px-2 py-1 text-sm text-white">
                {career.duration}
              </div>
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex flex-col space-y-2">
                <div className="text-4xl font-bold text-black">{career.company}</div>
                <div className="text-gray-500">{career.description}</div>
                <div className="flex flex-wrap space-x-1">
                  {tags.map(
                    (tag, index) =>
                      tag && (
                        <div
                          key={index}
                          className="mb-1 flex h-fit w-fit rounded-md bg-pink-600 px-2 py-1 text-sm whitespace-nowrap text-white"
                        >
                          {tag}
                        </div>
                      )
                  )}
                </div>
              </div>
              <div className="prose dark:prose-invert mt-5 max-w-none">
                <MDXLayoutRenderer code={career.body.code} />
              </div>
            </div>
          </div>
        )
      })}
    </AuthorLayout>
  )
}

export default Career
