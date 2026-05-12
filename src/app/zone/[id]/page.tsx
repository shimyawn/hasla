import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllZones, getZone } from '@/lib/zones'
import ZonePageClient from './ZonePageClient'

export async function generateStaticParams() {
  return getAllZones().map((z) => ({ id: z.id }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const zone = getZone(id)
  if (!zone) return {}
  const num = id.replace('zone', '').padStart(2, '0')
  const url = `https://hasla-gangneung.vercel.app/zone/${id}`
  // Zone descriptions get prefixed with location keyword so each zone page
  // independently signals 강릉/하슬라 to crawlers — important since users may
  // land directly on a zone page from image search or shared links.
  const baseDesc = zone.tagline ?? zone.story.slice(0, 140)
  return {
    title: `ZONE ${num} · ${zone.title}`,
    description: `강릉 경포 환상의 호수 ZONE ${num} · ${zone.title}. ${baseDesc}`,
    alternates: { canonical: url },
    openGraph: {
      title: `ZONE ${num} · ${zone.title} — 강릉 하슬라 야간 미디어아트`,
      description: `강릉 경포호 송림 ZONE ${num} · ${zone.title}. ${baseDesc}`,
      url,
      type: 'article',
      images: [{ url: zone.assets.mainImage, width: 1200, height: 630, alt: `ZONE ${num} · ${zone.title} — 강릉 하슬라 이머시브 아트쇼` }],
    },
  }
}

export default async function ZonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const zone = getZone(id)
  if (!zone) notFound()
  return <ZonePageClient zone={zone} />
}
