'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLang } from '@/i18n/LanguageContext'

interface Props {
  year: number
}

const TRANSITION_MS = 2000
const NAV_TOTAL_MS = 2000
const DISSOLVE_MS = 600

export default function SplashClient({ year }: Props) {
  const router = useRouter()
  const { t } = useLang()
  const [revealed, setRevealed] = useState(false)
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    const onTap = (e: PointerEvent) => {
      if (navigating) return
      const target = e.target as HTMLElement | null
      if (target?.closest('a[data-cta]')) return
      if (target?.closest('button[data-lang]')) return
      setRevealed((prev) => !prev)
    }
    window.addEventListener('pointerdown', onTap)
    return () => window.removeEventListener('pointerdown', onTap)
  }, [navigating])

  useEffect(() => { router.prefetch('/map') }, [router])

  function handleEnter(e: React.MouseEvent) {
    e.preventDefault()
    if (navigating) return
    if (!revealed) setRevealed(true)
    setTimeout(() => setNavigating(true), NAV_TOTAL_MS - DISSOLVE_MS)
    setTimeout(() => router.push('/map'), NAV_TOTAL_MS)
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-between overflow-hidden bg-black pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2 h-[120vh] w-[120vh] -translate-x-1/2 -translate-y-1/2 rounded-full hasla-gradient hasla-rotate blur-3xl ease-out"
          style={{ opacity: revealed ? 0.25 : 0, transition: `opacity ${TRANSITION_MS}ms ease-out` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black" />
      </div>

      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-12">
        <p
          className="mb-8 font-display text-[12px] tracking-[0.45em] ease-out"
          style={{
            color: revealed ? 'rgba(255,208,106,0.85)' : 'rgba(255,255,255,0.4)',
            transition: `color ${TRANSITION_MS}ms ease-out`,
          }}
        >
          {t.splashLabel}
        </p>

        <div className="relative aspect-[3/1] w-[88%] max-w-[420px]">
          <Image
            src="/images/logo_black.png"
            alt="HASLA"
            fill
            priority
            sizes="(max-width: 640px) 88vw, 420px"
            className={`object-contain ease-out ${revealed ? '' : 'hasla-pulse'}`}
            style={{ opacity: revealed ? 0 : 1, transition: `opacity ${TRANSITION_MS}ms ease-out` }}
          />
          <Image
            src="/images/logo_full.png"
            alt="HASLA — Gangneung Immersive Art Show"
            fill
            priority
            sizes="(max-width: 640px) 88vw, 420px"
            className={`object-contain ease-out ${revealed ? 'hasla-pulse' : ''}`}
            style={{ opacity: revealed ? 1 : 0, transition: `opacity ${TRANSITION_MS}ms ease-out` }}
          />
        </div>

        <p
          className="mt-10 max-w-xs text-center font-display text-[14px] leading-relaxed ease-out"
          style={{ opacity: revealed ? 0.9 : 0.5, transition: `opacity ${TRANSITION_MS}ms ease-out` }}
        >
          {t.splashSloganLine1}
          <br />
          {t.splashSloganLine2}
        </p>

        <p
          aria-hidden
          className="mt-4 text-[11px] tracking-[0.3em] text-white/45"
          style={{ opacity: revealed ? 0 : 1, transition: `opacity ${TRANSITION_MS}ms ease-out` }}
        >
          {t.splashHint}
        </p>
      </div>

      <footer className="flex w-full max-w-md flex-col items-center gap-3 px-6">
        <a
          href="/map"
          data-cta
          onClick={handleEnter}
          aria-disabled={navigating}
          className={`block w-full rounded-full px-6 py-4 text-center font-display text-[15px] font-medium ${
            revealed
              ? 'hasla-button text-white shadow-[0_8px_28px_rgba(255,99,132,0.25)]'
              : 'border border-white/30 text-white/60'
          } ${navigating ? 'pointer-events-none' : ''}`}
          style={{ transition: `all ${TRANSITION_MS}ms ease-out` }}
        >
          {t.splashCta}
        </a>
        <p className="mt-2 text-center text-[11px] text-muted/80">© {year} HASLA · {t.copyrightSuffix}</p>
      </footer>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 bg-black ease-in"
        style={{ opacity: navigating ? 1 : 0, transition: `opacity ${DISSOLVE_MS}ms ease-in` }}
      />
    </main>
  )
}
