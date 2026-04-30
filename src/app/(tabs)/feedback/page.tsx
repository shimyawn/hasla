'use client'

import { FormEvent, useState } from 'react'
import { useLang } from '@/i18n/LanguageContext'

const REVIEW_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf-e7f5OBXj6X2vnboWs8Lj4PjaGC_vF8YVsnZLh5iywzFTqg/viewform?pli=1'
const NOTIFY_ENDPOINT = process.env.NEXT_PUBLIC_NOTIFY_ENDPOINT ?? ''

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function FeedbackPage() {
  const { t, lang } = useLang()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [showConsentDetail, setShowConsentDetail] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()
    if (!trimmedEmail && !trimmedPhone) {
      setStatus('error')
      setErrorMsg(t.notifyValidation)
      return
    }
    if (!consent) {
      setStatus('error')
      setErrorMsg(t.notifyConsentRequired)
      return
    }
    if (!NOTIFY_ENDPOINT) {
      setStatus('error')
      setErrorMsg(t.notifyComingSoon)
      return
    }
    setStatus('submitting')
    setErrorMsg('')
    try {
      // text/plain body avoids CORS preflight; Apps Script parses JSON server-side.
      // mode:'no-cors' yields an opaque response — we treat any non-throw as success.
      await fetch(NOTIFY_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          email: trimmedEmail,
          phone: trimmedPhone,
          lang,
          consent: true,
          consentVersion: '2026-04-29',
          timestamp: new Date().toISOString(),
          source: 'mobile-leaflet',
        }),
      })
      setStatus('success')
      setEmail('')
      setPhone('')
      setConsent(false)
    } catch {
      setStatus('error')
      setErrorMsg(t.notifyError)
    }
  }

  const resetIfNeeded = () => {
    if (status !== 'submitting') setStatus('idle')
  }

  return (
    <main className="min-h-dvh bg-black pb-32 pt-2">
      <div className="mx-auto max-w-md px-6">
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

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-white/8" aria-hidden />

        {/* Notify form — grand-open + benefits signup */}
        <section className="mt-12">
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-hasla-yellow/60" />
            <span className="font-display text-[10.5px] tracking-[0.45em] text-hasla-yellow/85">
              {t.notifySectionLabel}
            </span>
          </div>

          <h2 className="mt-5 whitespace-pre-line font-display text-[22px] font-medium leading-[1.4] text-white">
            {t.notifyHeading}
          </h2>
          <p className="mt-3 whitespace-pre-line font-clean text-[13.5px] leading-[1.8] text-white/65">
            {t.notifyIntro}
          </p>

          {/* Benefits list */}
          <ul className="mt-5 flex flex-col gap-2">
            {t.notifyBenefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-hasla-yellow/85"
                />
                <span className="font-clean text-[13.5px] leading-[1.7] text-white/80">
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3" noValidate>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                resetIfNeeded()
              }}
              placeholder={t.notifyEmailPlaceholder}
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 font-clean text-[14px] text-white placeholder-white/35 outline-none transition-colors focus:border-hasla-yellow/60 focus:bg-white/[0.06]"
            />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                resetIfNeeded()
              }}
              placeholder={t.notifyPhonePlaceholder}
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 font-clean text-[14px] text-white placeholder-white/35 outline-none transition-colors focus:border-hasla-yellow/60 focus:bg-white/[0.06]"
            />

            {/* Consent block — PIPA 4-item disclosure */}
            <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked)
                    resetIfNeeded()
                  }}
                  className="mt-[3px] h-4 w-4 shrink-0 cursor-pointer accent-hasla-yellow"
                  aria-required="true"
                />
                <span className="font-clean text-[13px] leading-[1.6] text-white/85">
                  {t.notifyConsent}
                </span>
              </label>

              <button
                type="button"
                onClick={() => setShowConsentDetail((v) => !v)}
                className="mt-3 flex items-center gap-1.5 font-clean text-[11.5px] tracking-[0.05em] text-white/45 transition-colors hover:text-white/75"
                aria-expanded={showConsentDetail}
              >
                {showConsentDetail ? '자세히 닫기' : '자세히 보기'}
                <span
                  aria-hidden
                  className={`inline-block transition-transform duration-200 ${
                    showConsentDetail ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </button>

              {showConsentDetail && (
                <div className="mt-3 whitespace-pre-line rounded-lg bg-white/[0.03] p-3 font-clean text-[11.5px] leading-[1.75] text-white/55">
                  {t.notifyConsentDetail}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="hasla-gradient mt-3 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-display text-[14.5px] font-medium text-black transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? t.notifySubmitting : t.notifySubmit}
              {status !== 'submitting' && <span aria-hidden>→</span>}
            </button>

            {/* Status messages */}
            {status === 'success' && (
              <div
                role="status"
                className="mt-2 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-clean text-[13px] leading-[1.65] text-emerald-200"
              >
                {t.notifySuccess}
              </div>
            )}
            {status === 'error' && (
              <div
                role="alert"
                className="mt-2 rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 font-clean text-[13px] leading-[1.65] text-rose-200"
              >
                {errorMsg || t.notifyError}
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  )
}
