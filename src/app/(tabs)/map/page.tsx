import type { Metadata } from 'next'
import { getAllZones } from '@/lib/zones'
import MapPageClient from './MapPageClient'

export const metadata: Metadata = {
  title: '지도 · 8개 ZONE 산책 코스',
  description:
    '하슬라강릉이머시브아트쇼 8개 ZONE 지도 — 강릉 경포호 송림에서 펼쳐지는 야간 미디어아트 산책 코스. 강릉 가볼만한곳·강릉 관광·강릉 야간 명소 (허난설헌공원 인근).',
  alternates: { canonical: 'https://hasla-gangneung.vercel.app/map' },
  openGraph: {
    title: '하슬라강릉이머시브아트쇼 ZONE 지도 — 강릉 경포 환상의 호수',
    description:
      '강릉 경포호 송림에서 펼쳐지는 8개 ZONE 야간 미디어아트 산책 코스. 강릉 가볼만한곳·강릉 관광 (허난설헌공원 인근).',
    url: 'https://hasla-gangneung.vercel.app/map',
  },
}

export default function MapPage() {
  return <MapPageClient zones={getAllZones()} />
}
