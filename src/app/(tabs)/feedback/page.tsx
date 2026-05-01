'use client'

import { FormEvent, useRef, useState } from 'react'
import { useLang } from '@/i18n/LanguageContext'

const REVIEW_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf-e7f5OBXj6X2vnboWs8Lj4PjaGC_vF8YVsnZLh5iywzFTqg/viewform?pli=1'
// Submits to our own /api/notify endpoint, which writes the row to
// Google Sheets via a service account. No CORS hacks needed.
const NOTIFY_ENDPOINT = '/api/notify'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function FeedbackPage() {
  const { t, lang } = useLang()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [showConsentDetail, setShowConsentDetail] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  // Honeypot — hidden from real users, but auto-fill bots will populate it.
  // Server treats any non-empty value as a bot submission.
  const [honeypot, setHoneypot] = useState('')
  // Min submit time — record when the form first becomes interactive so the
  // server can reject impossibly-fast submissions.
  const formStartedAt = useRef<number>(Date.now())

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
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch(NOTIFY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          phone: trimmedPhone,
          lang,
          consent: true,
          consentVersion: '2026-04-29',
          source: 'mobile-leaflet',
          honeypot,                       // bot trap (must be empty)
          formStartedAt: formStartedAt.current, // min-submit-time check
        }),
      })
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; error?: string }
        | null
      if (!res.ok || !data?.ok) {
        // sheets_env_missing → server isn't configured yet; show coming-soon
        if (data?.error === 'sheets_env_missing') {
          setStatus('error')
          setErrorMsg(t.notifyComingSoon)
          return
        }
        // Rate-limited — friendly message instead of generic error
        if (data?.error === 'rate_limited') {
          setStatus('error')
          setErrorMsg('너무 많은 요청이 감지되었습니다. 잠시 후 다시 시도해 주세요.')
          return
        }
        throw new Error(data?.error ?? `http_${res.status}`)
      }
      setStatus('success')
      setEmail('')
      setPhone('')
      setConsent(false)
      setHoneypot('')
      formStartedAt.current = Date.now() // reset so a quick re-submit is also valid
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
          <p className="mt-3 whitespace-pre-line font-clean text-[14.5px] leading-[1.8] text-white/65">
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
                <span className="font-clean text-[14.5px] leading-[1.7] text-white/80">
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3" noValidate>
            {/* Honeypot — visually hidden but reachable by autofill bots.
                Real users never see or interact with this. Server rejects
                any submission with a non-empty value. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}
            />
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
                <span className="font-clean text-[14px] leading-[1.6] text-white/85">
                  {t.notifyConsent}
                </span>
              </label>

              <button
                type="button"
                onClick={() => setShowConsentDetail((v) => !v)}
                className="mt-3 flex items-center gap-1.5 font-clean text-[12.5px] tracking-[0.05em] text-white/45 transition-colors hover:text-white/75"
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
                <div className="mt-3 whitespace-pre-line rounded-lg bg-white/[0.03] p-3 font-clean text-[12.5px] leading-[1.75] text-white/55">
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
                className="mt-2 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-clean text-[14px] leading-[1.65] text-emerald-200"
              >
                {t.notifySuccess}
              </div>
            )}
            {status === 'error' && (
              <div
                role="alert"
                className="mt-2 rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 font-clean text-[14px] leading-[1.65] text-rose-200"
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
