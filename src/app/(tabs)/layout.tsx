'use client'

import Link from 'next/link'
import Image from 'next/image'
import BottomTabs from '@/components/BottomTabs'
import { useLang } from '@/i18n/LanguageContext'

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  return (
    <>
      {/* Sticky logo header — tap returns to splash (/) */}
      <header className="sticky top-0 z-20 border-b border-white/8 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-center px-5 py-3">
          <Link
            href="/"
            className="relative h-8 w-24 shrink-0 transition-opacity duration-200 hover:opacity-90"
            aria-label={`${t.metaTitle} — Home`}
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
        </div>
      </header>

      {children}

      <BottomTabs />
    </>
  )
}
