'use client'

import { useLang } from '@/i18n/LanguageContext'
import PreOpenBanner from '@/components/PreOpenBanner'

export default function ShowPage() {
  const { t } = useLang()
  return (
    <main className="min-h-dvh bg-black pb-32 pt-2">
      <div className="mx-auto max-w-md px-6">
        <div className="mt-4">
          <PreOpenBanner />
        </div>

        <h1 className="mt-8 font-display text-[26px] font-medium text-white">
          {t.showPageTitle}
        </h1>

        <section className="mt-7">
          <div className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow">
            {t.infoSessionsHeading}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {['19:30', '20:00', '20:30', '21:00'].map((time) => (
              <div
                key={time}
                className="rounded-md border border-white/15 py-3 text-center font-display text-[14px] text-white"
              >
                {time}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-white/55">
            {t.infoSessionsNote}
          </p>
        </section>
      </div>
    </main>
  )
}
