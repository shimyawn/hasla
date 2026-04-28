'use client'

import { useState } from 'react'
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

export default function MapPageClient({ zones }: Props) {
  const [view, setView] = useState<'map' | 'list'>('map')
  const { t, lang } = useLang()

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
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-card">
        <Image
          src="/images/map.jpg"
          alt={t.metaTitle}
          fill
          priority
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
        />
        {zones.map((z) => {
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
              }}
            >
              {/* Icon overlay covers the existing illustration */}
              <Image
                src={`/icons/${z.id}.png`}
                alt=""
                fill
                sizes="22vw"
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05] group-active:scale-[1.05]"
                style={{
                  filter: `drop-shadow(0 0 8px ${z.accentColor}aa)`,
                }}
              />
              {/* Subtle bloom on hover/tap only */}
              <span
                aria-hidden
                className="absolute inset-[-12%] rounded-[40%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
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
    <section className="mx-auto mt-6 max-w-md px-4 pb-12">
      <ul className="flex flex-col gap-10">
        {zones.map((z, idx) => {
          const L = localized(z, lang)
          const num = String(idx + 1).padStart(2, '0')
          return (
            <FadeInSection key={z.id}>
              <li>
                <Link
                  href={`/zone/${z.id}`}
                  className="block overflow-hidden rounded-2xl border border-white/10 bg-white text-neutral-900 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform active:scale-[0.99]"
                  style={{ borderLeftColor: z.accentColor, borderLeftWidth: 4 }}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={z.assets.mainImage}
                      alt={L.title}
                      fill
                      sizes="(max-width: 448px) 100vw, 448px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                      <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-white/85">
                        <span style={{ color: z.accentColor }}>ZONE {num}</span>
                        <span>· {L.element}</span>
                      </div>
                      <h3 className="mt-1 font-display text-2xl font-medium text-white">{L.title}</h3>
                      {L.subtitle && (
                        <p className="mt-0.5 font-display text-[13px] text-white/75">{L.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    {L.tagline && (
                      <p className="mb-3 font-display text-[14px] leading-snug" style={{ color: z.accentColor }}>
                        “{L.tagline}”
                      </p>
                    )}
                    <p className="text-[13.5px] leading-[1.85] text-neutral-800">{L.story}</p>
                    {L.description && (
                      <p className="mt-3 text-[13px] leading-[1.8] text-neutral-700">{L.description}</p>
                    )}
                    {L.media?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {L.media.map((m, i) => (
                          <span key={i} className="rounded-full border px-2.5 py-0.5 text-[11px]" style={{ borderColor: `${z.accentColor}80`, color: z.accentColor, backgroundColor: `${z.accentColor}10` }}>
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-end gap-1 text-[12px] font-medium" style={{ color: z.accentColor }}>
                      {t.viewDetail}
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
