'use client'

import { useLang } from '@/i18n/LanguageContext'
import PreOpenBanner from '@/components/PreOpenBanner'

const REVIEW_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf-e7f5OBXj6X2vnboWs8Lj4PjaGC_vF8YVsnZLh5iywzFTqg/viewform?pli=1'

export default function FeedbackPage() {
  const { t } = useLang()
  return (
    <main className="min-h-dvh bg-black pb-32 pt-2 lg:pb-16">
      <div className="mx-auto max-w-md px-6 lg:max-w-2xl">
        <div className="mt-4">
          <PreOpenBanner />
        </div>

        <h1 className="mt-8 font-display text-[26px] font-medium text-white">
          {t.reviewsPageTitle}
        </h1>

        <p className="mt-5 whitespace-pre-line font-clean text-[14px] leading-[1.85] text-white/75">
          {t.reviewsIntro}
        </p>

        {/* Review CTA — opens external review form */}
        <div className="mt-8">
          <a
            href={REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hasla-gradient flex items-center justify-center gap-2 rounded-full px-6 py-4 font-display text-[15px] font-medium text-black transition-transform active:scale-[0.98]"
          >
            {t.reviewsCta}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </main>
  )
}
