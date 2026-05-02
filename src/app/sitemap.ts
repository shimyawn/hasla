import type { MetadataRoute } from 'next'
import zonesData from '@/data/zones.json'

const SITE_URL = 'https://hasla-gangneung.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const corePages: { path: string; priority: number; freq: 'daily' | 'weekly' | 'monthly' }[] = [
    { path: '',          priority: 1.0, freq: 'weekly' },
    { path: '/map',      priority: 0.9, freq: 'weekly' },
    { path: '/about',    priority: 0.8, freq: 'monthly' },
    { path: '/show',     priority: 0.8, freq: 'weekly' },
    { path: '/feedback', priority: 0.6, freq: 'monthly' },
  ]

  const corePageEntries = corePages.map((p) => ({
    url: SITE_URL + p.path,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }))

  const zoneEntries = zonesData.zones.map((z) => ({
    url: `${SITE_URL}/zone/${z.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...corePageEntries, ...zoneEntries]
}
