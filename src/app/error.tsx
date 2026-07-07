'use client'

import { useEffect } from 'react'
import { useLang } from '@/i18n/LanguageContext'

/**
 * Route-level error boundary. Next.js renders this whenever any
 * server-component or client-component in the tree throws. The `reset`
 * prop re-runs the failed render — handy for transient failures
 * (network glitch, hydration race). Keeps the brand mood instead of
 * the bare Next default error page.
 *
 * Copy flows through i18n like every other page. If LanguageProvider
 * itself is the thing that threw, this component's useLang will also
 * throw and Next falls back to the framework default error UI —
 * acceptable for that edge case.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useLang()

  useEffect(() => {
    // Surface to console + Analytics (Vercel Analytics auto-captures
    // unhandled errors elsewhere, but a logged digest helps trace
    // server-component failures back to a specific render).
    // eslint-disable-next-line no-console
    console.error('[hasla] render error:', error)
  }, [error])

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 text-center">
      <p className="font-display text-[11px] tracking-[0.45em] text-hasla-yellow/85">
        {t.errorEyebrow}
      </p>
      <h1 className="mt-6 font-display text-[24px] font-medium leading-[1.4] text-white">
        {t.errorTitle}
      </h1>
      <p className="mt-4 max-w-xs whitespace-pre-line font-clean text-[14px] leading-[1.7] text-white/60">
        {t.errorDescription}
      </p>
      {error.digest && (
        <p className="mt-3 font-clean text-[11px] tracking-[0.05em] text-white/30">
          ref · {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-display text-[14px] tracking-[0.08em] text-white transition-colors hover:border-white/70 hover:bg-white/5"
      >
        {t.errorRetryButton}
        <span aria-hidden>↻</span>
      </button>
    </main>
  )
}
