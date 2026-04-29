'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Zone } from '@/lib/types'
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
  const { t, lang } = useLang()

  return (
    <main className="min-h-dvh bg-black pb-28">
      <section className="mx-auto mt-8 max-w-md px-4">
        {/* Caption block — sits above the map */}
        <p className="mb-4 px-1 text-center font-clean text-[12.5px] leading-[1.65] text-white/60">
          {t.mapCaption}
        </p>

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
                  {/* Inner Image: breathing animation (opacity + scale + glow) */}
                  <Image
                    src={`/icons/${z.id}.png`}
                    alt=""
                    fill
                    sizes="22vw"
                    className="icon-glow object-cover"
                    style={{ animationDelay: `${(i * 0.65) % 5.5}s` }}
                  />
                </div>
                {/* Bloom on hover/tap */}
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
      </section>
    </main>
  )
}
