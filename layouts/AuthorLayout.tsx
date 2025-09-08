import { ReactNode } from 'react'
import { allAuthors, type Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import { IoIosMail } from 'react-icons/io'
import { MdOutlinePhoneIphone } from 'react-icons/md'
import { coreContent } from 'pliny/utils/contentlayer'

interface Props {
  children: ReactNode
}

export default function AuthorLayout({ children }: Props) {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const { name, avatar, occupation, company, email, phone } = coreContent(author)

  return (
    <>
      <div>
        <div className="items-start space-y-2 xl:grid">
          <div className="flex items-center space-x-6 pt-8">
            {avatar && (
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className="h-50 w-40 rounded-xl"
              />
            )}
            <div>
              <h2 className="pt-4 pb-2 text-4xl leading-8 font-bold tracking-tight">{name}</h2>
              <h3 className="text-2xl">{occupation}</h3>
              <div className="text-gray-500 dark:text-gray-400">{company}</div>
              <div className="flex flex-col space-x-3 pt-6">
                <div className="space--2 flex items-center space-x-2">
                  <IoIosMail />
                  <div>{email}</div>
                </div>
                <div className="space--2 flex items-center space-x-2">
                  <MdOutlinePhoneIphone />
                  <div>{phone}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-15 pb-8">{children}</div>
        </div>
      </div>
    </>
  )
}
