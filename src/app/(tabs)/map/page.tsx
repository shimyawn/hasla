import type { Metadata } from 'next'
import { getAllZones } from '@/lib/zones'
import MapPageClient from './MapPageClient'

export const metadata: Metadata = {
  title: '지도 · 8개 ZONE 산책 코스',
  description:
    '강릉 경포호 송림 야간 미디어아트 산책 지도. 8개 ZONE — 하슬라 포털, 그루터기의 숨결, 거울 연못, 다섯 개의 달, 달의 초상, 인피니티 포레스트, 달의 잔상, 빛의 파동. 허난설헌공원 인근.',
  alternates: { canonical: 'https://hasla-gangneung.vercel.app/map' },
  openGraph: {
    title: '강릉 경포 환상의 호수 ZONE 지도 — 하슬라 야간 미디어아트',
    description:
      '강릉 경포호 송림에서 펼쳐지는 8개 ZONE 야간 미디어아트 산책 코스. 허난설헌공원 인근.',
    url: 'https://hasla-gangneung.vercel.app/map',
  },
}

export default function MapPage() {
  return <MapPageClient zones={getAllZones()} />
}
