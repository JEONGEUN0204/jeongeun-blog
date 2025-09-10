import AuthorLayout from '@/layouts/AuthorLayout'
import { allCareers } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import Image from '@/components/Image'
import dayjs from 'dayjs'

const Career = () => {
  return (
    <AuthorLayout>
      {allCareers.map((career, index) => {
        return (
          <div key={index} className="flex items-start space-x-10">
            <div className="flex flex-col">
              <Image
                src={career.logo}
                width={150}
                height={150}
                alt=""
                className="mt-0 rounded-lg"
              />
              <h1 className="-mt-5 text-2xl">
                {dayjs(career.date).format('YYYY.MM.DD')}~{career.endDate}
              </h1>
              <div className="-mt-3 h-fit w-fit rounded-md bg-pink-600 px-2 py-1 text-sm text-white">
                {career.duration}
              </div>
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex flex-col space-y-2">
                <h1>{career.company}</h1>
                <div className="text-gray-500">{career.description}</div>
                <div className="flex flex-wrap space-x-1">
                  {career.tags.map(
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
              <div className="mt-5 max-w-none">
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
