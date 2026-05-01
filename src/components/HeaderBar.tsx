'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLang } from '@/i18n/LanguageContext'
import LanguageButton from './LanguageButton'

export default function HeaderBar() {
  const { t } = useLang()
  const pathname = usePathname() ?? ''

  const navItems = [
    { path: '/map',      label: t.tabHome },
    { path: '/about',    label: t.tabAbout },
    { path: '/show',     label: t.tabShow },
    { path: '/feedback', label: t.tabReviews },
  ]

  return (
    <header className="sticky top-0 z-20 border-b border-white/8 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3 lg:max-w-5xl lg:py-4">
        {/* Mobile: home icon (left) — hidden on PC, replaced by inline nav */}
        <Link
          href="/map"
          aria-label="Main"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px]"
            aria-hidden
          >
            <path d="M3 11l9-8 9 8" />
            <path d="M5 10v10h5v-6h4v6h5V10" />
          </svg>
        </Link>

        {/* Logo — centered on mobile, left-aligned on PC */}
        <Link
          href="/"
          aria-label={`${t.metaTitle} — Home`}
          className="relative h-8 w-24 shrink-0 transition-opacity duration-200 hover:opacity-90 lg:h-9 lg:w-28"
        >
          <Image
            src="/images/logo_full.png"
            alt={t.metaTitle}
            fill
            priority
            sizes="(min-width: 1024px) 112px, 96px"
            className="object-contain"
          />
        </Link>

        {/* Mobile: right spacer (LanguageButton floats fixed top-right) */}
        <span aria-hidden className="h-8 w-8 shrink-0 lg:hidden" />

        {/* PC: inline nav + language button */}
        <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-7">
          {navItems.map((item) => {
            const active =
              item.path === '/map'
                ? pathname === '/map'
                : pathname === item.path || pathname.startsWith(item.path + '/')
            return (
              <Link
                key={item.path}
                href={item.path}
                aria-current={active ? 'page' : undefined}
                className={`font-display text-[14px] tracking-tight transition-colors ${
                  active ? 'text-white' : 'text-white/55 hover:text-white/90'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="ml-2">
            <LanguageButton />
          </div>
        </nav>
      </div>
    </header>
  )
}
