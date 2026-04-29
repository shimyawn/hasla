'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/i18n/LanguageContext'
import type { UIStrings } from '@/i18n/types'

type TabKey = keyof Pick<UIStrings, 'tabHome' | 'tabAbout' | 'tabShow' | 'tabReviews'>
interface Tab { path: string; labelKey: TabKey; icon: 'home' | 'about' | 'show' | 'reviews' }

const TABS: Tab[] = [
  { path: '/map',      labelKey: 'tabHome',    icon: 'home' },
  { path: '/about',    labelKey: 'tabAbout',   icon: 'about' },
  { path: '/show',     labelKey: 'tabShow',    icon: 'show' },
  { path: '/feedback', labelKey: 'tabReviews', icon: 'reviews' },
]

function Icon({ name, active }: { name: Tab['icon']; active: boolean }) {
  const sw = active ? 1.7 : 1.4
  const cls = 'h-[22px] w-[22px]'
  switch (name) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M3 11.5L12 4l9 7.5" />
          <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
        </svg>
      )
    case 'about':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M3 5h6a3 3 0 013 3v11M21 5h-6a3 3 0 00-3 3v11" />
        </svg>
      )
    case 'show':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      )
    case 'reviews':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-3-.46l-4 1.46 1.4-3.74A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
  }
}

export default function BottomTabs() {
  const pathname = usePathname()
  const { t } = useLang()

  return (
    <nav
      aria-label="primary"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Top hairline — HASLA pastel gradient */}
      <div aria-hidden className="h-[2px] hasla-gradient" />

      <ul className="grid grid-cols-4">
        {TABS.map((tab) => {
          const active =
            tab.path === '/map'
              ? pathname === '/map' || pathname === '/map/'
              : pathname?.startsWith(tab.path) ?? false
          return (
            <li key={tab.path}>
              <Link
                href={tab.path}
                aria-current={active ? 'page' : undefined}
                className={`group flex flex-col items-center gap-0.5 px-2 py-2.5 transition-colors ${
                  active ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <Icon name={tab.icon} active={active} />
                <span
                  className={`whitespace-nowrap text-center font-display text-[10.5px] tracking-tight ${
                    active ? 'font-medium text-neutral-900' : 'font-normal text-neutral-500'
                  }`}
                >
                  {t[tab.labelKey]}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
