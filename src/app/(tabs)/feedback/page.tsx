'use client'

import { useLang } from '@/i18n/LanguageContext'

const REVIEW_URL = 'https://works.do/FU3IvNs'

export default function FeedbackPage() {
  const { t } = useLang()
  return (
    <main className="min-h-dvh bg-black pb-32 pt-2">
      <div className="mx-auto max-w-md px-6">
        <h1 className="mt-8 font-display text-[26px] font-medium text-white">
          {t.reviewsPageTitle}
        </h1>

        <p className="mt-5 text-[14px] leading-[1.85] text-white/75">
          {t.reviewsIntro}
        </p>

        {/* Primary CTA — opens external review form */}
        <div className="mt-10 flex flex-col items-stretch gap-3">
          <a
            href={REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hasla-gradient flex items-center justify-center gap-2 rounded-full px-6 py-4 font-display text-[15px] font-medium text-black transition-transform active:scale-[0.98]"
          >
            {t.reviewsCta}
            <span aria-hidden>→</span>
          </a>
          <a
            href={REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-[12px] tracking-[0.05em] text-white/45 underline-offset-4 hover:text-white/75 hover:underline"
          >
            {t.reviewsOpenInNewTab} ↗
          </a>
        </div>
      </div>
    </main>
  )
}
