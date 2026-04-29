'use client'

import { useLang } from '@/i18n/LanguageContext'
import PreOpenBanner from '@/components/PreOpenBanner'

export default function AboutPage() {
  const { t } = useLang()
  return (
    <main className="min-h-dvh bg-black pb-32 pt-2">
      <div className="mx-auto max-w-md px-6">
        <div className="mt-4">
          <PreOpenBanner />
        </div>

        <h1 className="mt-8 font-display text-[26px] font-medium text-white">
          {t.aboutPageTitle}
        </h1>

        {/* Coming-soon placeholder — will host brand story + teaser embed */}
        <section className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] py-14">
          <span className="font-display text-[10px] tracking-[0.5em] text-hasla-yellow/85">
            {t.comingSoonLabel}
          </span>
          <p className="text-[13px] text-white/55">{t.comingSoonNote}</p>
        </section>
      </div>
    </main>
  )
}
