import ResumeContent from '@/components/ResumeContent'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Resume' })

export default function Resume() {
  return <ResumeContent />
}
