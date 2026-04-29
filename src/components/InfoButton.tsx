'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/i18n/LanguageContext'

export default function InfoButton() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        data-info
        onClick={() => setOpen(true)}
        aria-label={t.infoButtonLabel}
        className="rounded-full border border-white/25 bg-black/55 px-3.5 py-1.5 font-display text-[11px] tracking-[0.18em] text-white/85 backdrop-blur-md transition-colors hover:border-white/55 hover:bg-black/70 hover:text-white active:scale-[0.97]"
      >
        {t.infoButtonLabel}
      </button>

      {/* Backdrop + slide-up sheet */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.infoSheetTitle}
          className={`absolute bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 rounded-t-3xl border-t border-white/10 bg-black px-6 pb-10 pt-7 transition-transform duration-400 ease-out ${
            open ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Drag handle */}
          <div className="mx-auto mb-4 h-[3px] w-10 rounded-full bg-white/25" aria-hidden />

          {/* Title */}
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-[18px] font-medium text-white">
              {t.infoSheetTitle}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-display text-[11px] tracking-[0.25em] text-white/55 hover:text-white"
            >
              {t.infoCloseLabel}
            </button>
          </div>

          {/* PRE-OPEN status */}
          <div className="border-t border-white/8 pt-5">
            <div className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow">
              {t.infoPreOpenLabel}
            </div>
            <p className="mt-3 font-display text-[15px] leading-relaxed text-white/85">
              {t.infoPreOpenLineShort}
            </p>
          </div>

          {/* Show times */}
          <div className="mt-7 border-t border-white/8 pt-5">
            <div className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow">
              {t.infoSessionsHeading}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {['19:30', '20:00', '20:30', '21:00'].map((time) => (
                <div
                  key={time}
                  className="rounded-md border border-white/15 py-2.5 text-center font-display text-[14px] text-white"
                >
                  {time}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-white/55">
              {t.infoSessionsNote}
            </p>
          </div>

          {/* Grand opening */}
          <div className="mt-7 border-t border-white/8 pt-5">
            <div className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow">
              {t.infoGrandOpenLabel}
            </div>
            <p className="mt-3 font-display text-[15px] text-white/85">
              {t.infoGrandOpenWhen}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
