import zonesData from '@/data/zones.json'
import type { Zone, ZonesData } from './types'
import { localizeZone } from '@/i18n/zones'
import type { Lang, LocalizedZone } from '@/i18n/types'

const data = zonesData as ZonesData

export function getAllZones(): Zone[] {
  return data.zones
}

export function getZone(id: string): Zone | undefined {
  return data.zones.find((z) => z.id === id)
}

export function getMeta() {
  return data.meta
}

export function getNextZone(id: string): Zone | undefined {
  const idx = data.zones.findIndex((z) => z.id === id)
  if (idx === -1 || idx === data.zones.length - 1) return undefined
  return data.zones[idx + 1]
}

export function getPrevZone(id: string): Zone | undefined {
  const idx = data.zones.findIndex((z) => z.id === id)
  if (idx <= 0) return undefined
  return data.zones[idx - 1]
}

/**
 * Pick the localized copy for a zone, falling back to the raw fields from
 * zones.json if the locale dictionary doesn't cover this id. Used by
 * MapPageClient and ZonePageClient — previously each defined its own
 * near-identical helper.
 */
export function localized(z: Zone, lang: Lang): LocalizedZone {
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
