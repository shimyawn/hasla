import type { MetadataRoute } from 'next'
import zonesData from '@/data/zones.json'

const SITE_URL = 'https://hasla-gangneung.vercel.app'

// Stable per-bucket lastModified dates. Previously this used `new Date()`
// at request time, which made every crawler visit see a different
// timestamp — Google interprets that as "this page changed in the last
// minute" forever, which is noise. Hardcoded dates here represent the
// last *meaningful content* change for each bucket; bump them when the
// content actually moves.
const LAST_REV = {
  home: new Date('2026-05-12'),       // homepage + meta strings
  about: new Date('2026-05-02'),      // narrative + Visit info
  show: new Date('2026-05-02'),       // show schedule
  feedback: new Date('2026-05-02'),
  map: new Date('2026-05-02'),
  zones: new Date('2026-04-29'),      // zone content baseline
}

export default function sitemap(): MetadataRoute.Sitemap {
  const corePages: {
    path: string
    priority: number
    freq: 'daily' | 'weekly' | 'monthly'
    lastModified: Date
  }[] = [
    { path: '',          priority: 1.0, freq: 'weekly',  lastModified: LAST_REV.home },
    { path: '/map',      priority: 0.9, freq: 'weekly',  lastModified: LAST_REV.map },
    { path: '/about',    priority: 0.8, freq: 'monthly', lastModified: LAST_REV.about },
    { path: '/show',     priority: 0.8, freq: 'weekly',  lastModified: LAST_REV.show },
    { path: '/feedback', priority: 0.6, freq: 'monthly', lastModified: LAST_REV.feedback },
  ]

  const corePageEntries = corePages.map((p) => ({
    url: SITE_URL + p.path,
    lastModified: p.lastModified,
    changeFrequency: p.freq,
    priority: p.priority,
  }))

  const zoneEntries = zonesData.zones.map((z) => ({
    url: `${SITE_URL}/zone/${z.id}`,
    lastModified: LAST_REV.zones,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...corePageEntries, ...zoneEntries]
}
