'use client'

import { useLang } from '@/i18n/LanguageContext'

export default function LanguageButton({ position = 'fixed' }: { position?: 'fixed' | 'static' }) {
  const { lang, setLang } = useLang()
  const next = lang === 'ko' ? 'en' : 'ko'
  const wrapperClass =
    position === 'fixed'
      ? 'fixed right-4 top-3 z-30'
      : 'static'

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        data-lang
        onClick={() => setLang(next)}
        aria-label={`Switch to ${next === 'en' ? 'English' : 'Korean'}`}
        className="group flex items-center gap-1.5 rounded-full border border-white/25 bg-black/55 px-3 py-1.5 backdrop-blur-md transition-colors hover:border-white/50 hover:bg-black/70 active:scale-[0.97]"
      >
        <span
          className={`text-[11px] tracking-[0.18em] transition-colors ${
            lang === 'ko' ? 'text-hasla-yellow' : 'text-white/40'
          }`}
        >
          KO
        </span>
        <span aria-hidden className="text-[10px] text-white/35">·</span>
        <span
          className={`text-[11px] tracking-[0.18em] transition-colors ${
            lang === 'en' ? 'text-hasla-yellow' : 'text-white/40'
          }`}
        >
          EN
        </span>
      </button>
    </div>
  )
}
