'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useAudioStore } from '@/store/audioStore'
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
  const { t, lang } = useLang()
  const loadZone = useAudioStore((s) => s.loadZone)
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
  const prevL = prev ? localizeZone(prev.id, lang) : null
  const nextL = next ? localizeZone(next.id, lang) : null

  useEffect(() => {
    loadZone(zone.id, zone.assets.audioUrl, L.title)
  }, [zone.id, zone.assets.audioUrl, L.title, loadZone])

  return (
    <main className="min-h-dvh bg-black pb-40">
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
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-5 pt-5">
          <Link href="/map" className="rounded-full bg-black/50 px-3 py-1.5 text-[12px] text-white backdrop-blur-sm">
            {t.navMap}
          </Link>
          {L.element && (
            <div className="rounded-full bg-black/50 px-3 py-1.5 text-[11px] tracking-[0.25em] text-white backdrop-blur-sm">
              {L.element}
            </div>
          )}
        </div>
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

      {L.tagline && (
        <section className="mx-auto max-w-md px-6 pt-6">
          <FadeInSection>
            <p className="font-display text-[16px] leading-[1.7]" style={{ color: zone.accentColor }}>
              “{L.tagline}”
            </p>
          </FadeInSection>
        </section>
      )}

      <section className="mx-auto max-w-md px-6 pt-6">
        <FadeInSection>
          <div className="mb-3 inline-block h-px w-10" style={{ backgroundColor: zone.accentColor }} aria-hidden />
          <p className="text-[15px] leading-[1.85] text-foreground/90">{L.story}</p>
        </FadeInSection>
      </section>

      {L.description && (
        <section className="mx-auto max-w-md px-6 pt-5">
          <FadeInSection>
            <p className="text-[15px] leading-[1.85] text-foreground/85">{L.description}</p>
          </FadeInSection>
        </section>
      )}

      {L.direction.length > 0 && (
        <section className="mx-auto max-w-md px-6 pt-9">
          <FadeInSection>
            <h2 className="font-display text-[12px] tracking-[0.35em] text-hasla-yellow/85">{t.sectionDirection}</h2>
          </FadeInSection>
          <ul className="mt-3 flex flex-col gap-2.5">
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

      {L.media.length > 0 && (
        <section className="mx-auto max-w-md px-6 pt-8">
          <FadeInSection>
            <h2 className="font-display text-[12px] tracking-[0.35em] text-hasla-yellow/85">{t.sectionMedia}</h2>
          </FadeInSection>
          <FadeInSection delay={0.04}>
            <div className="mt-3 flex flex-wrap gap-2">
              {L.media.map((m, i) => (
                <span key={i} className="rounded-full border px-3 py-1 text-[12px]" style={{ borderColor: `${zone.accentColor}80`, color: zone.accentColor }}>
                  {m}
                </span>
              ))}
            </div>
          </FadeInSection>
        </section>
      )}

      <nav className="mx-auto mt-12 max-w-md px-6">
        <div className="mb-3 flex items-center justify-between text-[10px] tracking-[0.3em] text-muted">
          <span>{idx + 1} {t.zoneTotalSeparator} {all.length}</span>
          <Link href="/map" className="hover:text-foreground">MAP</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {prev ? (
            <Link href={`/zone/${prev.id}`} className="group relative overflow-hidden rounded-xl border border-border bg-card/50 px-4 py-3.5 transition-colors active:bg-card">
              <span aria-hidden className="absolute left-0 top-0 h-full w-[3px]" style={{ backgroundColor: prev.accentColor }} />
              <div className="flex items-center gap-2 text-[10px] tracking-[0.3em]" style={{ color: prev.accentColor }}>
                ← ZONE {zoneNumber(prev.id)}
              </div>
              <div className="mt-1 truncate font-display text-[14px] text-foreground/90">
                {prevL?.title ?? prev.title}
              </div>
            </Link>
          ) : (
            <Link href="/" className="group relative overflow-hidden rounded-xl border border-border bg-card/50 px-4 py-3.5 transition-colors active:bg-card">
              <div className="text-[10px] tracking-[0.3em] text-muted">{t.navHome}</div>
              <div className="mt-1 font-display text-[14px] text-foreground/80">{t.navFirst}</div>
            </Link>
          )}

          {next ? (
            <Link href={`/zone/${next.id}`} className="group relative overflow-hidden rounded-xl px-4 py-3.5 text-right text-black transition-transform active:scale-[0.99]" style={{ backgroundColor: next.accentColor }}>
              <div className="text-[10px] tracking-[0.3em] opacity-85">ZONE {zoneNumber(next.id)} →</div>
              <div className="mt-1 truncate font-display text-[14px]">{nextL?.title ?? next.title}</div>
            </Link>
          ) : (
            <Link href="/map" className="hasla-gradient relative block rounded-xl px-4 py-3.5 text-right text-black transition-transform active:scale-[0.99]">
              <div className="text-[10px] tracking-[0.3em]">{t.navFinish}</div>
              <div className="mt-1 font-display text-[14px]">{t.navBackToMap}</div>
            </Link>
          )}
        </div>
      </nav>
    </main>
  )
}
