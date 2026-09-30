'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import LogoMark from './LogoMark'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()

  let headerClass =
    'flex items-center w-full bg-sand-50 dark:bg-gray-950 justify-between py-10 print:hidden'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          {/* JE 모노그램 — accent-400 → 700 그라데이션이라 라이트·다크 모두 그대로 쓴다 */}
          <div className="mr-2">
            <LogoMark className="block" />
          </div>
          {/* 줄 높이를 글자 크기에 맞춰야 로고와 가운데가 맞는다. 높이를 고정하면 글자가 칸 아래로 삐져나와 로고가 떠 보인다 */}
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="text-accent-700 dark:text-accent-300 hidden text-2xl leading-none font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.title}
                href={link.href}
                className={`hover:text-primary-600 dark:hover:text-primary-400 font-extrabold ${isActive ? 'text-accent-700 dark:text-accent-300 font-bold' : 'font-medium text-gray-900 dark:text-gray-100'} m-1 text-lg`}
              >
                <div>{link.title}</div>
              </Link>
            )
          })}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
