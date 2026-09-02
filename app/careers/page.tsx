import CareerList from '@/components/CareerList'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Career' })

const Career = () => {
  return <CareerList />
}

export default Career
