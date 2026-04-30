'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLang } from '@/i18n/LanguageContext'

const TRANSITION_MS = 1500
const NAV_TOTAL_MS = 1500
const DISSOLVE_MS = 1100
// Smooth symmetric ease for buttery cross-fades
const EASE = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)'

export default function SplashClient() {
  const router = useRouter()
  const { t } = useLang()
  // Start revealed=false so the black logo shows briefly, then auto-reveal on mount
  // triggers the mask animation (moon rising). Subsequent taps still toggle freely.
  const [revealed, setRevealed] = useState(false)
  const [navigating, setNavigating] = useState(false)

  // Auto-reveal on first paint — kicks off the moon-rise mask animation in sync
  // with the existing opacity cross-fade.
  useEffect(() => {
    const id = window.setTimeout(() => setRevealed(true), 80)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const onTap = (e: PointerEvent) => {
      if (navigating) return
      const target = e.target as HTMLElement | null
      if (target?.closest('a[data-cta]')) return
      if (target?.closest('button[data-lang]')) return
      if (target?.closest('button[data-info]')) return
      // Also skip taps inside the info sheet (role=dialog)
      if (target?.closest('[role="dialog"]')) return
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
    // White dissolve fades in immediately on click — hold ~0.4s solid white before navigation
    setTimeout(() => setNavigating(true), 50)
    setTimeout(() => router.push('/map'), NAV_TOTAL_MS)
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-between overflow-hidden bg-black pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2 h-[120vh] w-[120vh] -translate-x-1/2 -translate-y-1/2 rounded-full hasla-gradient hasla-rotate blur-3xl"
          style={{ opacity: revealed ? 0.25 : 0, transition: `opacity ${TRANSITION_MS}ms ${EASE}` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black" />
      </div>

      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-12">
        <p
          className="mb-8 font-display text-[12px] tracking-[0.45em]"
          style={{
            color: revealed ? 'rgba(255,208,106,0.85)' : 'rgba(255,255,255,0.4)',
            transition: `color ${TRANSITION_MS}ms ${EASE}`,
          }}
        >
          {t.splashLabel}
        </p>

        {/* Black silhouette logo stays as the floor; color logo rises on top of
            it (translates up + mask dissolve), then a flare sweeps once. Tap
            toggles only the color logo's opacity so users can flip back to the
            silhouette state. */}
        <div className="relative aspect-[3/1] w-[88%] max-w-[420px] icon-breathe">
          <Image
            src="/images/logo_black.png"
            alt="HASLA"
            fill
            priority
            sizes="(max-width: 640px) 88vw, 420px"
            className="object-contain"
          />
          <Image
            src="/images/logo_full.png"
            alt="HASLA — Gangneung Immersive Art Show"
            fill
            priority
            sizes="(max-width: 640px) 88vw, 420px"
            className="moon-rise object-contain"
            style={{
              opacity: revealed ? 1 : 0,
              transition: `opacity ${TRANSITION_MS}ms ${EASE}`,
            }}
          />
          {/* Flare sweep — fires once after moon-rise completes */}
          <span aria-hidden className="moon-flare absolute inset-0" />
        </div>

        <p
          className="mt-10 max-w-xs text-center font-display text-[14px] leading-relaxed"
          style={{ opacity: revealed ? 0.9 : 0.5, transition: `opacity ${TRANSITION_MS}ms ${EASE}` }}
        >
          {t.splashSloganLine1}
          <br />
          {t.splashSloganLine2}
        </p>

        <p
          aria-hidden
          className="mt-4 inline-block text-[11px] tracking-[0.3em] text-white/45"
          style={{
            opacity: revealed ? 0 : 1,
            transform: revealed ? 'translateY(6px)' : 'translateY(0)',
            transition: `opacity ${TRANSITION_MS}ms ${EASE}, transform ${TRANSITION_MS}ms ${EASE}`,
            willChange: 'opacity, transform',
            isolation: 'isolate',
            backfaceVisibility: 'hidden',
          }}
        >
          {t.splashHint}
        </p>
      </div>

      <footer className="flex w-full max-w-md flex-col items-center gap-3 px-6">
        {/* Pre-open status banner — 2 lines (Noto Sans for readability) */}
        <div
          className="mb-1 max-w-xs text-center font-clean text-[11.5px] leading-[1.7] text-white/45"
          style={{ opacity: navigating ? 0 : 1, transition: `opacity ${TRANSITION_MS}ms ${EASE}` }}
        >
          <p>{t.infoPreOpenLineShort}.</p>
          <p>{t.infoGrandOpenLabel} · {t.infoGrandOpenWhen}</p>
        </div>

        {/* CTA — border stays put as a constant frame; the gradient fill
            sweeps up from inside (mask-revealed) like the moon settling on
            the path. Text stays white on top throughout. */}
        <a
          href="/map"
          data-cta
          onClick={handleEnter}
          aria-disabled={navigating}
          className={`relative isolate block w-full overflow-hidden rounded-full border px-6 py-4 text-center font-display text-[15px] font-medium ${
            navigating
              ? 'border-white bg-white text-black pointer-events-none'
              : 'border-white/45 text-white shadow-[0_8px_28px_rgba(255,99,132,0.18)]'
          }`}
          style={{
            transition: `color ${DISSOLVE_MS}ms ${EASE}, background-color ${DISSOLVE_MS}ms ${EASE}, border-color ${TRANSITION_MS}ms ${EASE}`,
          }}
        >
          {/* Gradient fill layer — mask-revealed bottom→top on first paint */}
          <span
            aria-hidden
            className="hasla-button moon-mask absolute inset-0 -z-10 rounded-full"
            style={{
              opacity: navigating ? 0 : 1,
              transition: `opacity ${DISSOLVE_MS}ms ${EASE}`,
            }}
          />
          <span className="relative">{t.splashCta}</span>
        </a>
      </footer>

      {/* White dissolve overlay — fades in on CTA click */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 bg-white"
        style={{
          opacity: navigating ? 1 : 0,
          transition: `opacity ${DISSOLVE_MS}ms ${EASE}`,
        }}
      />
    </main>
  )
}
