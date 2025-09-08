import AuthorLayout from '@/layouts/AuthorLayout'
import { allProjects } from 'contentlayer/generated'
import Image from '@/components/Image'
import { MDXLayoutRenderer } from 'pliny/mdx-components'

const Portfolio = () => {
  const projects = allProjects.sort((a, b) => a.order - b.order)

  return (
    <AuthorLayout>
      {projects.map((project, index) => {
        return (
          <div key={index}>
            <h2 className="flex items-center gap-2">
              {index + 1}. {project.name}{' '}
              <span className="text-base font-normal">( {project.date} ~ )</span>
            </h2>
            <div className="flex flex-wrap space-x-1">
              {project.tags.map((tag, index) => (
                <div
                  key={index}
                  className="mb-1 flex h-fit w-fit rounded-md bg-pink-600 px-2 py-1 text-xs whitespace-nowrap text-white"
                >
                  {tag}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap space-x-4">
              {project.images.map((image, index) => {
                return (
                  <Image
                    key={index}
                    src={image.trimEnd()}
                    alt=""
                    width={Number(project.imageSize[0])}
                    height={Number(project.imageSize[1])}
                    className="rounded-md"
                  />
                )
              })}
            </div>
            <div className="prose dark:prose-invert mt-5 max-w-none">
              <MDXLayoutRenderer code={project.body.code} />
            </div>
          </div>
        )
      })}
    </AuthorLayout>
  )
}

export default Portfolio
