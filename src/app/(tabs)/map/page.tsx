import type { Metadata } from 'next'
import { getAllZones } from '@/lib/zones'
import MapPageClient from './MapPageClient'

export const metadata: Metadata = {
  title: '지도 · 8개 ZONE 산책 코스',
  description:
    '강릉 경포호 소나무숲에서 펼쳐지는 야간 미디어아트 쇼, 8개 ZONE 산책 코스 지도. 허난설헌공원 인근, 강릉 야간 명소로 추천드립니다.',
  alternates: { canonical: 'https://hasla-gangneung.vercel.app/map' },
  openGraph: {
    title: 'ZONE 지도 — 하슬라강릉이머시브아트쇼',
    description:
      '강릉 경포호 소나무숲에서 펼쳐지는 야간 미디어아트 쇼 — 8개 ZONE 산책 코스 지도. 허난설헌공원 인근.',
    url: 'https://hasla-gangneung.vercel.app/map',
  },
}

export default function MapPage() {
  return <MapPageClient zones={getAllZones()} />
}
