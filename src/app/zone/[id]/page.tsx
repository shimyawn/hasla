import { notFound } from 'next/navigation'
import { getAllZones, getZone } from '@/lib/zones'
import ZonePageClient from './ZonePageClient'

export async function generateStaticParams() {
  return getAllZones().map((z) => ({ id: z.id }))
}

export const dynamicParams = false

export default async function ZonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const zone = getZone(id)
  if (!zone) notFound()
  return <ZonePageClient zone={zone} />
}
