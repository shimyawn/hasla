'use client'

import Link from 'next/link'
import { useLang } from '@/i18n/LanguageContext'

/**
 * 404 body — extracted to a client component so the copy can flow
 * through the same i18n pipeline as every other page (ko/en toggle
 * hydrates on mount). The server `not-found.tsx` keeps its metadata
 * export and just renders this.
 */
export default function NotFoundClient() {
  const { t } = useLang()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 text-center">
      <p className="font-display text-[11px] tracking-[0.45em] text-hasla-yellow/85">
        {t.notFoundEyebrow}
      </p>
      <h1 className="mt-6 font-display text-[26px] font-medium leading-[1.4] text-white">
        {t.notFoundTitle}
      </h1>
      <p className="mt-4 max-w-xs whitespace-pre-line font-clean text-[14px] leading-[1.7] text-white/60">
        {t.notFoundDescription}
      </p>
      <Link
        href="/map"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-display text-[14px] tracking-[0.08em] text-white transition-colors hover:border-white/70 hover:bg-white/5"
      >
        {t.notFoundBackButton}
        <span aria-hidden>→</span>
      </Link>
    </main>
  )
}
