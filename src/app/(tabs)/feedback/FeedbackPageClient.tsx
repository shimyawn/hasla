'use client'

import { useLang } from '@/i18n/LanguageContext'
import { LINKS } from '@/data/links'
import PreOpenBanner from '@/components/PreOpenBanner'
import ContactBlock from '@/components/ContactBlock'

export default function FeedbackPageClient() {
  const { t, lang } = useLang()
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
            href={LINKS.reviewForm}
            target="_blank"
            rel="noopener noreferrer"
            className="hasla-gradient flex items-center justify-center gap-2 rounded-full px-6 py-4 font-display text-[15px] font-medium text-black transition-transform active:scale-[0.98]"
          >
            {t.reviewsCta}
            <span aria-hidden>→</span>
            {/* Screen-reader hint: announces that activating this link will
                open a new tab (Google Forms in this case). Without it,
                blind users land on an unexpected site with no context. */}
            <span className="sr-only">
              {lang === 'en' ? '(opens Google Forms in a new tab)' : '(새 탭으로 Google Forms 열림)'}
            </span>
          </a>
        </div>

        <ContactBlock />
      </div>
    </main>
  )
}
