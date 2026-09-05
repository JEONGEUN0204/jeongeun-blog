import AuthorLayout from '@/layouts/AuthorLayout'
import { about, certificates, education } from '@/content/profile'

const heading = 'text-primary-700 dark:text-primary-400 mt-8 mb-0 text-3xl'

export default function Home() {
  /*
    학력·자격증 날짜는 content/profile.ts 가 원천이다. 예전에는 이 페이지가 값을 직접
    들고 있어서 /resume 와 어긋났다(자격증이 여기서는 2022.06.17, 이력서에서는 2022.06).
  */
  return (
    <>
      <AuthorLayout>
        <div className="border-b-primary-600 w-full border-b-2 pb-2">
          <h1 className="text-primary-700 dark:text-primary-400 mb-0 text-3xl">About Me</h1>
        </div>
        {about.map((line) => (
          <h4 key={line}>{line}</h4>
        ))}
        <div className="flex w-full space-x-10">
          <div className="w-full">
            <div className="border-b-primary-600 mb-4 w-full border-b-2 pb-2">
              <h1 className={heading}>Education</h1>
            </div>
            <div className="space-y-2">
              {education.map((item) => (
                <div key={item.school} className="text-md flex space-x-5 font-semibold">
                  <div>{item.period}</div> <div>{item.school}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full">
            <div className="border-b-primary-600 mb-4 w-full border-b-2 pb-2">
              <h1 className={heading}>Certificate</h1>
            </div>
            <div className="space-y-2">
              {certificates.map((item) => (
                <div key={item.name} className="text-md flex space-x-5 font-semibold">
                  <div>{item.date}</div> <div>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AuthorLayout>
    </>
  )
}
