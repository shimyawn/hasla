import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'HASLA 소개',
  description:
    '강릉의 옛 이름 하슬라(HASLA). 다섯 개의 달이 뜨는 밤, 잠들어 있던 고대 하슬라의 숲이 깨어납니다. 오행으로 풀어내는 다섯 빛의 순환 — 빛과 사운드로 만나는 미디어아트 산책.',
  alternates: { canonical: 'https://hasla-gangneung.vercel.app/about' },
  openGraph: {
    title: 'HASLA 소개 | 경포 환상의 호수',
    description:
      '하슬라, 강릉의 옛 이름. 다섯 개의 달이 뜨는 밤, 고대 하슬라의 숲이 깨어납니다.',
    url: 'https://hasla-gangneung.vercel.app/about',
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
