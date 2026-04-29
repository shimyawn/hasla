'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import FadeInSection from '@/components/zone/FadeInSection'
import { getAllZones, getNextZone, getPrevZone } from '@/lib/zones'
import type { Zone } from '@/lib/types'
import { useLang } from '@/i18n/LanguageContext'
import { localizeZone } from '@/i18n/zones'

interface Props { zone: Zone }

function zoneNumber(id: string) {
  return id.replace('zone', '').padStart(2, '0')
}

export default function ZonePageClient({ zone }: Props) {
  const router = useRouter()
  const { lang, t } = useLang()
  const prev = getPrevZone(zone.id)
  const next = getNextZone(zone.id)
  const all = getAllZones()
  const idx = all.findIndex((z) => z.id === zone.id)

  const L = localizeZone(zone.id, lang) ?? {
    title: zone.title,
    subtitle: zone.subtitle,
    tagline: zone.tagline ?? '',
    story: zone.story,
    description: zone.description ?? '',
    direction: zone.direction ?? [],
    media: zone.media ?? [],
    element: zone.element ?? '',
  }

  // Smart back: history.back if available, fallback to /map
  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/map')
    }
  }, [router])

  return (
    <main className="min-h-dvh bg-black pb-24">
      {/* Hero */}
      <div className="relative h-[58vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src={zone.assets.mainImage}
          alt={L.title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />

        {/* Smart back button — uses history when possible */}
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition-colors hover:bg-black/75"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.3em] text-black" style={{ backgroundColor: zone.accentColor }}>
            ZONE {zoneNumber(zone.id)}
          </div>
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-white">{L.title}</h1>
          {L.subtitle && (
            <p className="mt-1 font-display text-base text-white/75">{L.subtitle}</p>
          )}
        </div>
      </div>

      {/* Tagline */}
      {L.tagline && (
        <section className="mx-auto max-w-md px-6 pt-6">
          <FadeInSection>
            <p className="font-display text-[16px] leading-[1.7]" style={{ color: zone.accentColor }}>
              “{L.tagline}”
            </p>
          </FadeInSection>
        </section>
      )}

      {/* Story */}
      <section className="mx-auto max-w-md px-6 pt-6">
        <FadeInSection>
          <div className="mb-3 inline-block h-px w-10" style={{ backgroundColor: zone.accentColor }} aria-hidden />
          <p className="text-[15px] leading-[1.85] text-foreground/90">{L.story}</p>
        </FadeInSection>
      </section>

      {/* Description */}
      {L.description && (
        <section className="mx-auto max-w-md px-6 pt-5">
          <FadeInSection>
            <p className="text-[15px] leading-[1.85] text-foreground/85">{L.description}</p>
          </FadeInSection>
        </section>
      )}

      {/* Direction list */}
      {L.direction.length > 0 && (
        <section className="mx-auto max-w-md px-6 pt-9">
          <ul className="flex flex-col gap-2.5">
            {L.direction.map((d, i) => (
              <FadeInSection key={i} delay={0.04 * i}>
                <li className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: zone.accentColor }} aria-hidden />
                  <p className="text-[13.5px] leading-[1.75] text-foreground/85">{d}</p>
                </li>
              </FadeInSection>
            ))}
          </ul>
        </section>
      )}

      {/* Timetable — only for Infinity Forest (zone6) */}
      {zone.id === 'zone6' && (
        <section className="mx-auto max-w-md px-6 pt-12">
          <FadeInSection>
            <div className="mb-3 flex items-center gap-3">
              <span aria-hidden className="h-px w-8" style={{ backgroundColor: zone.accentColor }} />
              <span className="font-display text-[10px] tracking-[0.4em]" style={{ color: zone.accentColor }}>
                {t.infoSessionsHeading}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['19:30', '20:00', '20:30', '21:00'].map((time) => (
                <div
                  key={time}
                  className="rounded-md border border-white/15 py-3 text-center font-display text-[14px] text-white"
                >
                  {time}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-white/55">
              {t.infoSessionsNote}
            </p>
          </FadeInSection>
        </section>
      )}

      {/* Floating prev arrow — only when there's a previous zone */}
      {prev && (
        <Link
          href={`/zone/${prev.id}`}
          aria-label="Previous zone"
          className="fixed left-1.5 top-[60%] z-30 flex h-14 w-9 -translate-y-1/2 items-center justify-center rounded-r-2xl bg-black/40 text-white opacity-40 backdrop-blur-md transition-opacity duration-300 hover:opacity-100 active:opacity-100"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      )}

      {/* Floating next arrow — only when there's a next zone */}
      {next && (
        <Link
          href={`/zone/${next.id}`}
          aria-label="Next zone"
          className="fixed right-1.5 top-[60%] z-30 flex h-14 w-9 -translate-y-1/2 items-center justify-center rounded-l-2xl bg-black/40 text-white opacity-40 backdrop-blur-md transition-opacity duration-300 hover:opacity-100 active:opacity-100"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      )}

      {/* Progress indicator — bottom-center */}
      <div
        aria-hidden
        className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 font-display text-[10px] tracking-[0.4em] text-white/65 backdrop-blur-md"
      >
        {String(idx + 1).padStart(2, '0')} / {String(all.length).padStart(2, '0')}
      </div>
    </main>
  )
}
