'use client'

import { useLang } from '@/i18n/LanguageContext'

export default function PreOpenBanner() {
  const { t } = useLang()
  return (
    <aside className="relative overflow-hidden rounded-2xl bg-white/[0.04] px-5 py-4 ring-1 ring-white/8">
      {/* HASLA gradient hairline on the left edge */}
      <span aria-hidden className="absolute left-0 top-0 h-full w-[2px] hasla-gradient" />
      <div className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow">
        {t.infoPreOpenLabel}
      </div>
      <p className="mt-2.5 text-[13px] leading-[1.7] text-white/85">
        {t.infoNoticeLine1}
      </p>
      <p className="mt-1.5 text-[13px] leading-[1.7] text-white/85">
        {t.infoNoticeLine2}
      </p>
    </aside>
  )
}
