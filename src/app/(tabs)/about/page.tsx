import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'HASLA 소개 · 강릉의 옛 이름, 하슬라',
  description:
    '하슬라강릉이머시브아트쇼 소개 — 강릉의 옛 이름 하슬라(HASLA). 강릉 경포호 송림에서 펼쳐지는 야간 미디어아트 이머시브 전시. 다섯 개의 달이 뜨는 밤, 잠들어 있던 고대 하슬라의 숲이 깨어납니다. 강릉 가볼만한곳·강릉 관광 추천.',
  alternates: { canonical: 'https://hasla-gangneung.vercel.app/about' },
  openGraph: {
    title: 'HASLA 소개 — 하슬라강릉이머시브아트쇼, 강릉 경포 환상의 호수',
    description:
      '하슬라, 강릉의 옛 이름. 강릉 경포호 송림에서 펼쳐지는 야간 미디어아트 이머시브 전시 — 다섯 개의 달이 뜨는 밤, 고대 하슬라의 숲이 깨어납니다.',
    url: 'https://hasla-gangneung.vercel.app/about',
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
