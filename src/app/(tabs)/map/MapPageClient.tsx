'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Zone } from '@/lib/types'
import { useLang } from '@/i18n/LanguageContext'
import { localizeZone } from '@/i18n/zones'
import type { Lang, LocalizedZone } from '@/i18n/types'
import ContactBlock from '@/components/ContactBlock'

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
  const { t, lang } = useLang()
  // Two-step zone interaction: first tap selects a zone (icon glows brighter,
  // others dim, info shows below the map). Second tap on the same icon — or
  // a tap on the title displayed below — navigates to the zone detail page.
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedZone = selectedId ? zones.find((z) => z.id === selectedId) : null
  const selectedIdx = selectedId ? zones.findIndex((z) => z.id === selectedId) : -1
  const selectedL = selectedZone ? localized(selectedZone, lang) : null

  return (
    <main className="min-h-dvh bg-black pb-28">
      <section className="mx-auto mt-8 max-w-md px-4">
        {/* Map */}
        <div className="relative aspect-[1600/1748] w-full overflow-hidden rounded-2xl border border-border bg-card">
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
            const isSelected = selectedId === z.id
            const isDimmed = selectedId !== null && selectedId !== z.id
            const iconClass = isSelected
              ? 'icon-selected object-cover'
              : isDimmed
                ? 'icon-dim object-cover'
                : 'icon-glow object-cover'
            return (
              <Link
                key={z.id}
                href={`/zone/${z.id}`}
                aria-label={L.title}
                aria-current={isSelected ? 'true' : undefined}
                onClick={(e) => {
                  // First tap: prevent navigation, select the zone.
                  // Tap on already-selected zone: let the Link navigate.
                  if (selectedId !== z.id) {
                    e.preventDefault()
                    setSelectedId(z.id)
                  }
                }}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: z.mapPin.cx,
                  top: z.mapPin.cy,
                  width: z.mapPin.w,
                  height: z.mapPin.h,
                  ['--glow' as string]: `${z.accentColor}cc`,
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={`/icons/${z.id}.png`}
                    alt=""
                    fill
                    sizes="22vw"
                    className={iconClass}
                    style={isSelected || isDimmed ? undefined : { animationDelay: `${(i * 0.65) % 5.5}s` }}
                  />
                </div>
                {/* Bloom on hover/tap (always-on for selected) */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-[-15%] rounded-[40%] transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-active:opacity-100'
                  }`}
                  style={{
                    background: `radial-gradient(ellipse at center, ${z.accentColor}66 0%, transparent 65%)`,
                    mixBlendMode: 'screen',
                  }}
                />
              </Link>
            )
          })}
        </div>

        {/* Below-map area: caption when nothing selected, glowing zone display otherwise */}
        <div className="mt-5 flex min-h-[120px] flex-col items-center justify-center px-1">
          {selectedZone && selectedL ? (
            <Link
              href={`/zone/${selectedZone.id}`}
              className="flex flex-col items-center gap-3 rounded-2xl px-4 py-3 transition-transform active:scale-[0.98]"
              style={{ ['--glow' as string]: selectedZone.accentColor }}
            >
              {/* Zone number in a glowing circle */}
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full font-display text-[13px] font-medium text-black"
                style={{
                  background: selectedZone.accentColor,
                  boxShadow: `0 0 14px ${selectedZone.accentColor}aa, 0 0 28px ${selectedZone.accentColor}55`,
                }}
              >
                {String(selectedIdx + 1).padStart(2, '0')}
              </div>
              <h2
                className="font-display text-[24px] font-medium leading-tight"
                style={{
                  color: selectedZone.accentColor,
                  textShadow: `0 0 14px ${selectedZone.accentColor}cc, 0 0 32px ${selectedZone.accentColor}66`,
                }}
              >
                {selectedL.title}
              </h2>
              <span
                className="font-clean text-[12px] tracking-[0.05em] text-white/55"
                aria-hidden
              >
                {t.viewDetail}
              </span>
            </Link>
          ) : (
            <p className="text-center font-clean text-[13.5px] leading-[1.65] text-white/60">
              {t.mapCaption}
            </p>
          )}
        </div>
      </section>

      {/* Contact info — venue / phone / address / Naver Place */}
      <section className="mx-auto mt-4 max-w-md px-6">
        <ContactBlock />
      </section>
    </main>
  )
}
