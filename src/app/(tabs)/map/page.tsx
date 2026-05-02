import type { Metadata } from 'next'
import { getAllZones } from '@/lib/zones'
import MapPageClient from './MapPageClient'

export const metadata: Metadata = {
  title: '지도',
  description:
    '경포 환상의 호수 8개 ZONE 지도 — 하슬라 포털, 그루터기의 숨결, 거울 연못, 다섯 개의 달, 달의 초상, 인피니티 포레스트, 달의 잔상, 빛의 파동.',
  alternates: { canonical: 'https://hasla-gangneung.vercel.app/map' },
  openGraph: {
    title: '지도 | 경포 환상의 호수',
    description: '8개 ZONE이 안내하는 고대 하슬라의 밤 산책 코스.',
    url: 'https://hasla-gangneung.vercel.app/map',
  },
}

export default function MapPage() {
  return <MapPageClient zones={getAllZones()} />
}
