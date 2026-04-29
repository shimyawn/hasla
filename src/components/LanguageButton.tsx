'use client'

import { useLang } from '@/i18n/LanguageContext'

export default function LanguageButton() {
  const { lang, setLang } = useLang()
  const next = lang === 'ko' ? 'en' : 'ko'
  // Show the label of the language you can SWITCH TO
  const label = lang === 'ko' ? 'ENGLISH' : '한국어'

  return (
    <button
      type="button"
      data-lang
      onClick={() => setLang(next)}
      aria-label={`Switch to ${next === 'en' ? 'English' : 'Korean'}`}
      className="rounded-full border border-white/25 bg-black/55 px-3.5 py-1.5 font-display text-[11px] tracking-[0.18em] text-white/85 backdrop-blur-md transition-colors hover:border-white/55 hover:bg-black/70 hover:text-white active:scale-[0.97]"
    >
      {label}
    </button>
  )
}
