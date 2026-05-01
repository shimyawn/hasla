'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Zone } from '@/lib/types'
import { useLang } from '@/i18n/LanguageContext'
import { localizeZone } from '@/i18n/zones'
import type { Lang, LocalizedZone } from '@/i18n/types'
import ContactBlock from '@/components/ContactBlock'

// useLayoutEffect on client (no flash before paint) / no-op on server
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

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
  // Fade-in overlay when arriving from the splash CTA — continues the white
  // dissolve from splash and fades out to reveal the map smoothly.
  const [fadeIn, setFadeIn] = useState(false)
  useIsoLayoutEffect(() => {
    try {
      if (sessionStorage.getItem('hasla-from-splash') === '1') {
        sessionStorage.removeItem('hasla-from-splash')
        setFadeIn(true)
      }
    } catch {}
  }, [])

  const selectedZone = selectedId ? zones.find((z) => z.id === selectedId) : null
  const selectedIdx = selectedId ? zones.findIndex((z) => z.id === selectedId) : -1
  const selectedL = selectedZone ? localized(selectedZone, lang) : null

  return (
    <main className="min-h-dvh bg-black pb-28 lg:pb-16">
      {/* White veil that fades out — only when arriving from the splash CTA */}
      {fadeIn && (
        <div
          aria-hidden
          className="splash-fade-out fixed inset-0 z-[100] bg-white"
          onAnimationEnd={() => setFadeIn(false)}
        />
      )}
      <section className="mx-auto mt-8 max-w-md px-4 lg:mt-10 lg:max-w-6xl lg:px-8 lg:flex lg:items-start lg:gap-10">
        {/* Map column — full width on mobile, fixed-width left column on PC */}
        <div className="lg:w-[600px] lg:shrink-0">
        {/* Map — outer wrapper has no overflow clip so zone-icon drop-shadows
            can bloom past the rounded edges; inner div clips just the
            background image to the rounded shape. Clicking the empty map
            area (anywhere except a zone icon) deselects the current zone
            so the whole map returns to its idle breathing state. */}
        <div
          className="relative aspect-[1600/1748] w-full cursor-pointer"
          onClick={() => setSelectedId(null)}
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border bg-card">
            <Image
              src="/images/map.jpg"
              alt={t.metaTitle}
              fill
              priority
              sizes="(max-width: 448px) 100vw, 448px"
              className="object-cover"
            />
          </div>
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
                  // Stop the click from bubbling up to the map-wrapper
                  // handler (which would otherwise immediately deselect).
                  e.stopPropagation()
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
                    style={isSelected || isDimmed ? undefined : { animationDelay: `${i * 0.4}s` }}
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

        {/* Below-map area — MOBILE only. PC uses the right-side panel
            outside this column. */}
        <div className="mt-3 flex min-h-[64px] items-center px-2 lg:hidden">
          {selectedZone && selectedL ? (
            <Link
              href={`/zone/${selectedZone.id}`}
              className="flex w-full items-center justify-between gap-3 rounded-xl py-2 transition-transform active:scale-[0.98]"
              style={{ ['--glow' as string]: selectedZone.accentColor }}
            >
              {/* Number + title — left side. flex-1 + min-w-0 so the title
                  gets all remaining horizontal space and only truncates at
                  the absolute edge. */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-medium text-black"
                  style={{
                    background: selectedZone.accentColor,
                    boxShadow: `0 0 12px ${selectedZone.accentColor}aa, 0 0 26px ${selectedZone.accentColor}55`,
                  }}
                >
                  {String(selectedIdx + 1).padStart(2, '0')}
                </span>
                <h2
                  className="font-display text-[32px] font-medium leading-[1.05]"
                  style={{
                    color: selectedZone.accentColor,
                    textShadow: `0 0 14px ${selectedZone.accentColor}cc, 0 0 30px ${selectedZone.accentColor}55`,
                  }}
                >
                  {selectedL.title}
                </h2>
              </div>
              {/* Hint — right side. Arrow-only so the title gets maximum room;
                  full text exposed via aria-label for screen readers. */}
              <span
                className="shrink-0 font-display text-[22px] leading-none text-white/55"
                aria-label={t.viewDetail}
              >
                →
              </span>
            </Link>
          ) : (
            <p className="w-full text-center font-clean text-[13.5px] leading-[1.65] text-white/60">
              {t.mapCaption}
            </p>
          )}
        </div>
        </div>

        {/* PC right panel — caption when nothing selected, full zone detail
            when a zone is picked. Hidden on mobile (mobile already has the
            below-map card). */}
        <aside className="hidden lg:block lg:flex-1 lg:min-w-0 lg:pt-2">
          {selectedZone && selectedL ? (
            <div className="flex flex-col gap-5">
              {/* Zone number + title */}
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-medium text-black"
                  style={{
                    background: selectedZone.accentColor,
                    boxShadow: `0 0 12px ${selectedZone.accentColor}aa, 0 0 26px ${selectedZone.accentColor}55`,
                  }}
                >
                  {String(selectedIdx + 1).padStart(2, '0')}
                </span>
                <h2
                  className="font-display text-[32px] font-medium leading-[1.1]"
                  style={{
                    color: selectedZone.accentColor,
                    textShadow: `0 0 14px ${selectedZone.accentColor}cc, 0 0 30px ${selectedZone.accentColor}55`,
                  }}
                >
                  {selectedL.title}
                </h2>
              </div>

              {selectedL.subtitle && (
                <p className="font-display text-[15px] leading-[1.5] text-white/65">
                  {selectedL.subtitle}
                </p>
              )}

              {selectedL.tagline && (
                <p
                  className="font-display text-[15.5px] italic leading-[1.7]"
                  style={{ color: selectedZone.accentColor }}
                >
                  &ldquo;{selectedL.tagline}&rdquo;
                </p>
              )}

              <div className="mt-1 inline-block h-px w-10" style={{ backgroundColor: selectedZone.accentColor }} aria-hidden />

              <p className="font-clean text-[14.5px] leading-[1.85] text-foreground/90">
                {selectedL.story}
              </p>

              {selectedL.description && (
                <p className="font-clean text-[14px] leading-[1.85] text-foreground/80">
                  {selectedL.description}
                </p>
              )}

              {selectedL.direction.length > 0 && (
                <ul className="mt-1 flex flex-col gap-2">
                  {selectedL.direction.map((d, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: selectedZone.accentColor }}
                      />
                      <p className="text-[13.5px] leading-[1.7] text-foreground/80">{d}</p>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={`/zone/${selectedZone.id}`}
                className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border px-5 py-2.5 font-display text-[13px] tracking-[0.05em] transition-colors"
                style={{
                  borderColor: `${selectedZone.accentColor}80`,
                  color: selectedZone.accentColor,
                }}
              >
                {t.viewDetail}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-8">
              <span className="font-display text-[10px] tracking-[0.45em] text-hasla-yellow/85">
                EXPLORE
              </span>
              <h2 className="font-display text-[26px] font-medium leading-[1.3] text-white/85">
                빛나는 영역을 클릭해보세요
              </h2>
              <p className="font-clean text-[14px] leading-[1.7] text-white/55">
                {t.mapCaption}
                <br />
                선택한 ZONE의 안내가 이곳에 표시됩니다.
              </p>
            </div>
          )}
        </aside>
      </section>

      {/* Contact info — venue / phone / address / Naver Place */}
      <section className="mx-auto mt-4 max-w-md px-6 lg:max-w-2xl">
        <ContactBlock />
      </section>
    </main>
  )
}
