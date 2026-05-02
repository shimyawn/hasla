import type { Metadata } from 'next'
import FeedbackPageClient from './FeedbackPageClient'

export const metadata: Metadata = {
  title: '관람객 참여',
  description:
    '경포 환상의 호수 — 관람 후기를 들려주세요. 여러분의 한 마디가 강릉을 지키는 다섯 개의 달에 빛을 더합니다.',
  alternates: { canonical: 'https://hasla-gangneung.vercel.app/feedback' },
  openGraph: {
    title: '관람객 참여 | 경포 환상의 호수',
    description: '관람 후기 작성 + 공식 인스타그램 (@hasla_5moons) + 문의',
    url: 'https://hasla-gangneung.vercel.app/feedback',
  },
}

export default function FeedbackPage() {
  return <FeedbackPageClient />
}
