'use client'

import { useLang } from '@/i18n/LanguageContext'

export default function PreOpenBanner() {
  const { t } = useLang()
  return (
    <aside className="relative overflow-hidden rounded-2xl bg-white px-5 py-4 shadow-[0_2px_18px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
      {/* HASLA gradient hairline on the left edge — vertical variant */}
      <span aria-hidden className="absolute left-0 top-0 h-full w-[3px] hasla-gradient-v" />
      <div className="font-display text-[10px] tracking-[0.4em] text-neutral-500">
        {t.infoPreOpenLabel}
      </div>
      {t.infoNoticeParagraphs.map((p, i) => (
        <p
          key={i}
          className="mt-2.5 whitespace-pre-line font-clean text-[13px] leading-[1.7] text-neutral-800"
        >
          {p}
        </p>
      ))}
    </aside>
  )
}
