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
  return {
    title: `ZONE ${num} · ${zone.title}`,
    description: zone.tagline ?? zone.story.slice(0, 160),
    alternates: { canonical: url },
    openGraph: {
      title: `ZONE ${num} · ${zone.title} | 경포 환상의 호수`,
      description: zone.tagline ?? zone.subtitle ?? zone.story.slice(0, 160),
      url,
      type: 'article',
      images: [{ url: zone.assets.mainImage, width: 1200, height: 630, alt: zone.title }],
    },
  }
}

export default async function ZonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const zone = getZone(id)
  if (!zone) notFound()
  return <ZonePageClient zone={zone} />
}
