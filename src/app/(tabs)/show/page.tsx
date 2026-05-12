import type { Metadata } from 'next'
import ShowPageClient from './ShowPageClient'

export const metadata: Metadata = {
  title: '상영시간표 · 매일 4회 야간 송출',
  description:
    '인피니티 포레스트 조명쇼 타임테이블 — 매일 19:30 ~ 21:30, 30분 간격 4회. 운영 시간은 계절·일몰에 따라 탄력적으로 변경될 수 있습니다.',
  alternates: { canonical: 'https://hasla-gangneung.vercel.app/show' },
  openGraph: {
    title: '상영시간표 — 매일 4회 송출',
    description:
      '강릉 경포호 소나무숲 인피니티 포레스트 조명쇼 — 매일 19:30 ~ 21:30, 30분 간격 4회.',
    url: 'https://hasla-gangneung.vercel.app/show',
  },
}

export default function ShowPage() {
  return <ShowPageClient />
}
