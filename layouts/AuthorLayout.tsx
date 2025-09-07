import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import { IoIosMail } from 'react-icons/io'
import { MdOutlinePhoneIphone } from 'react-icons/md'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, phone } = content

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
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
                  <div className="text-gray-800 dark:text-gray-400">{email}</div>
                </div>
                <div className="space--2 flex items-center space-x-2">
                  <MdOutlinePhoneIphone />
                  <div>{phone}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-15 pb-8 xl:col-span-4">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
