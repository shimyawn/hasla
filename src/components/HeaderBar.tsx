'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/i18n/LanguageContext'

export default function HeaderBar() {
  const { t } = useLang()
  return (
    <header className="sticky top-0 z-20 border-b border-white/8 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
        {/* Home icon (left) — jumps to main map/list */}
        <Link
          href="/map"
          aria-label="Main"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
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

        {/* Logo (center) — taps return to splash */}
        <Link
          href="/"
          aria-label={`${t.metaTitle} — Home`}
          className="relative h-8 w-24 shrink-0 transition-opacity duration-200 hover:opacity-90"
        >
          <Image
            src="/images/logo_full.png"
            alt={t.metaTitle}
            fill
            priority
            sizes="96px"
            className="object-contain"
          />
        </Link>

        {/* Right spacer — visual balance for the home icon (LanguageButton floats fixed top-right) */}
        <span aria-hidden className="h-8 w-8 shrink-0" />
      </div>
    </header>
  )
}
