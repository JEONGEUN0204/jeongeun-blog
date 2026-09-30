'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
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
          {/* JE 모노그램. 바탕은 currentColor, 획은 --logo-fg 라 다크모드에서 색이 함께 뒤집힌다 */}
          <div className="text-primary-700 dark:text-primary-400 mt-1 mr-2 [--logo-fg:#fff] dark:[--logo-fg:var(--color-gray-950)]">
            <Logo />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="text-primary-700 dark:text-primary-400 hidden h-6 text-2xl font-semibold sm:block">
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
