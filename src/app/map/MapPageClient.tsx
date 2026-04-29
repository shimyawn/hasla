'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Zone } from '@/lib/types'
import FadeInSection from '@/components/zone/FadeInSection'
import { useLang } from '@/i18n/LanguageContext'
import { localizeZone } from '@/i18n/zones'
import type { Lang, LocalizedZone } from '@/i18n/types'

interface Props {
  zones: Zone[]
}

type View = 'map' | 'list'

function localized(z: Zone, lang: Lang): LocalizedZone {
  return (
    localizeZone(z.id, lang) ?? {
      title: z.title,
      subtitle: z.subtitle,
      tagline: z.tagline ?? '',
      story: z.story,
      description: z.description ?? '',
      direction: z.direction ?? [],
      media: z.media ?? [],
      element: z.element ?? '',
    }
  )
}

function readViewFromUrl(): View {
  if (typeof window === 'undefined') return 'map'
  return new URLSearchParams(window.location.search).get('view') === 'list' ? 'list' : 'map'
}

export default function MapPageClient({ zones }: Props) {
  const [view, setViewState] = useState<View>(readViewFromUrl)
  const { t, lang } = useLang()

  // Update URL when toggling so back-from-zone returns to the same view
  const setView = (v: View) => {
    setViewState(v)
    if (typeof window !== 'undefined') {
      const url = v === 'list' ? '/map?view=list' : '/map'
      // replaceState — doesn't add a history entry, just updates the URL
      window.history.replaceState(null, '', url)
    }
  }

  // When the user navigates back (popstate), sync state with URL
  useEffect(() => {
    const onPopState = () => setViewState(readViewFromUrl())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return (
    <main className="min-h-dvh bg-black pb-32">
      <header className="sticky top-0 z-10 border-b border-border bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
          <Link
            href="/"
            className="font-display text-[12px] tracking-[0.3em] text-muted hover:text-foreground"
          >
            {t.navHome}
          </Link>
          <Link href="/" className="relative h-8 w-24 shrink-0" aria-label={t.metaTitle}>
            <Image
              src="/images/logo_full.png"
              alt={t.metaTitle}
              fill
              priority
              sizes="96px"
              className="object-contain"
            />
          </Link>
          <span className="w-[60px]" />
        </div>
      </header>

      <section className="mx-auto mt-4 max-w-md px-4">
        <div className="relative grid grid-cols-2 overflow-hidden rounded-full border border-border bg-card/60 p-1">
          <span
            aria-hidden
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full hasla-button transition-transform duration-300 ease-out ${
              view === 'list' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
          <button
            type="button"
            onClick={() => setView('map')}
            className={`relative z-10 py-2 text-center font-display text-[13px] tracking-[0.15em] transition-colors ${
              view === 'map' ? 'text-white' : 'text-muted'
            }`}
          >
            {t.toggleMap}
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={`relative z-10 py-2 text-center font-display text-[13px] tracking-[0.15em] transition-colors ${
              view === 'list' ? 'text-white' : 'text-muted'
            }`}
          >
            {t.toggleList}
          </button>
        </div>
      </section>

      {view === 'map' ? <MapView zones={zones} lang={lang} t={t} /> : <ListView zones={zones} lang={lang} t={t} />}
    </main>
  )
}

function MapView({ zones, lang, t }: { zones: Zone[]; lang: Lang; t: ReturnType<typeof useLang>['t'] }) {
  return (
    <section className="mx-auto mt-4 max-w-md px-4">
      <div className="relative aspect-[1600/1749] w-full overflow-hidden rounded-2xl border border-border bg-card">
        <Image
          src="/images/map.jpg"
          alt={t.metaTitle}
          fill
          priority
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
        />
        {zones.map((z, i) => {
          const L = localized(z, lang)
          return (
            <Link
              key={z.id}
              href={`/zone/${z.id}`}
              aria-label={L.title}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: z.mapPin.cx,
                top: z.mapPin.cy,
                width: z.mapPin.w,
                height: z.mapPin.h,
                ['--glow' as string]: `${z.accentColor}cc`,
              }}
            >
              {/* Outer wrapper: hover scale (transition-only, no animation conflict) */}
              <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.07] group-active:scale-[1.07]">
                {/* Inner Image: breathing animation (opacity + scale + glow), uses --glow */}
                <Image
                  src={`/icons/${z.id}.png`}
                  alt=""
                  fill
                  sizes="22vw"
                  className="icon-glow object-cover"
                  style={{ animationDelay: `${(i * 0.65) % 5.5}s` }}
                />
              </div>
              {/* Bloom on hover/tap (separate element, doesn't share transform with breathing icon) */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[-15%] rounded-[40%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
                style={{
                  background: `radial-gradient(ellipse at center, ${z.accentColor}66 0%, transparent 65%)`,
                  mixBlendMode: 'screen',
                }}
              />
            </Link>
          )
        })}
      </div>
      <p className="mt-3 text-center text-[12px] text-muted">{t.mapCaption}</p>
    </section>
  )
}

function ListView({ zones, lang, t }: { zones: Zone[]; lang: Lang; t: ReturnType<typeof useLang>['t'] }) {
  return (
    <section className="mx-auto mt-6 max-w-md px-6 pb-16">
      <ul className="flex flex-col gap-12">
        {zones.map((z, idx) => {
          const L = localized(z, lang)
          const num = String(idx + 1).padStart(2, '0')
          return (
            <FadeInSection key={z.id}>
              <li>
                <Link
                  href={`/zone/${z.id}`}
                  className="group block overflow-hidden bg-black text-white"
                >
                  {/* Hero */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={z.assets.mainImage}
                      alt={L.title}
                      fill
                      sizes="(max-width: 448px) 100vw, 448px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                  </div>

                  {/* Slim content panel — only enough to entice the click */}
                  <div className="relative pt-6 pb-6">
                    {/* Hairline accent divider */}
                    <div
                      aria-hidden
                      className="absolute left-0 top-0 h-[2px] w-12"
                      style={{ background: z.accentColor }}
                    />

                    {/* Number + element row */}
                    <div className="mb-3.5 flex items-baseline justify-between gap-3 text-[10px] tracking-[0.4em]">
                      <span className="font-display" style={{ color: z.accentColor }}>
                        ZONE · {num}
                      </span>
                      {L.element && (
                        <span className="font-display text-white/35">{L.element}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-[26px] font-medium leading-[1.15] text-white">
                      {L.title}
                    </h3>
                    {L.subtitle && (
                      <p className="mt-1.5 font-display text-[13.5px] leading-snug text-white/55">
                        {L.subtitle}
                      </p>
                    )}

                    {/* Tagline only (one-line introduction) */}
                    {L.tagline && (
                      <p className="mt-4 font-display text-[14.5px] italic leading-[1.55] text-white/75 line-clamp-2">
                        {L.tagline}
                      </p>
                    )}

                    {/* CTA — encourages tap */}
                    <div className="mt-6 flex items-center gap-2 text-[12px] tracking-[0.2em]">
                      <span className="font-display" style={{ color: z.accentColor }}>
                        {t.viewDetail}
                      </span>
                      <span
                        aria-hidden
                        className="block h-px flex-1 transition-all duration-500 ease-out group-hover:flex-[1.6]"
                        style={{ background: `${z.accentColor}55` }}
                      />
                    </div>
                  </div>
                </Link>
              </li>
            </FadeInSection>
          )
        })}
      </ul>
    </section>
  )
}
