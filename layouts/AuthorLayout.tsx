import { ReactNode } from 'react'
import { allAuthors, type Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import { IoIosMail } from 'react-icons/io'
import { MdOutlinePhoneIphone } from 'react-icons/md'
import { profile } from '@/content/profile'

interface Props {
  children: ReactNode
}

export default function AuthorLayout({ children }: Props) {
  /*
    이름·직함·연락처는 content/profile.ts 가 원천이다. 예전에는 authors/default.mdx 의
    frontmatter 가 또 하나의 원천이어서, /resume 만 고치면 홈과 포트폴리오는 옛 값이 남았다.
    아바타 경로만 MDX 에서 가져온다.
  */
  const author = allAuthors.find((item) => item.slug === 'default') as Authors
  const avatar = author?.avatar

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
              <h2 className="pt-4 pb-2 text-4xl leading-8 font-bold tracking-tight">
                {profile.name}
              </h2>
              <h3 className="text-2xl">{profile.title}</h3>
              <div className="flex flex-col space-x-3 pt-6">
                <div className="space--2 flex items-center space-x-2">
                  <IoIosMail />
                  <div>{profile.email}</div>
                </div>
                <div className="space--2 flex items-center space-x-2">
                  <MdOutlinePhoneIphone />
                  <div>{profile.phone}</div>
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
