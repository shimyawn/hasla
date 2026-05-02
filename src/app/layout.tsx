import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Noto_Sans_KR } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { LanguageProvider } from '@/i18n/LanguageContext'
import LanguageButton from '@/components/LanguageButton'

const yoonMeoli = localFont({
  src: [
    { path: '../fonts/yoon-meoli-ultralight.ttf', weight: '200', style: 'normal' },
    { path: '../fonts/yoon-meoli-light.ttf',      weight: '300', style: 'normal' },
  ],
  variable: '--font-yoon',
  display: 'swap',
})

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
})

const SITE_URL = 'https://hasla-gangneung.vercel.app'
const SITE_TITLE = '경포 환상의 호수 — 고대 하슬라의 밤'
const SITE_DESCRIPTION =
  '다섯 개의 달이 뜬 밤, 강릉 경포의 호수에 고대 하슬라의 숲이 깨어난다. 빛과 소리로 만나는 미디어아트 산책.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | 경포 환상의 호수',
  },
  description: SITE_DESCRIPTION,
  applicationName: '경포 환상의 호수',
  keywords: [
    '강릉 미디어아트',
    '경포 환상의 호수',
    '하슬라',
    'HASLA',
    '강릉 이머시브 아트쇼',
    '강릉 야간 명소',
    '강릉 가볼만한곳',
    '경포 호수',
    '미디어아트 산책',
    '다섯 개의 달',
    '인피니티 포레스트',
    'Gangneung Immersive Art Show',
  ],
  authors: [{ name: 'HASLA' }],
  creator: 'HASLA',
  publisher: 'HASLA',
  alternates: {
    canonical: SITE_URL,
    languages: {
      ko: SITE_URL,
      en: `${SITE_URL}?lang=en`,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: '경포 환상의 호수',
    locale: 'ko_KR',
    type: 'website',
    // og:image is auto-populated by app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'culture',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

// JSON-LD structured data — describes the show as a schema.org Event so
// Google/Naver can surface it as a rich result (date, location, image, etc.)
// when someone searches '강릉 미디어아트' or similar.
const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: '경포 환상의 호수 — 고대 하슬라의 밤',
  alternateName: 'HASLA Gangneung Immersive Art Show',
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  startDate: '2026-05-02',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  inLanguage: ['ko', 'en'],
  organizer: {
    '@type': 'Organization',
    name: 'HASLA',
    url: SITE_URL,
    sameAs: ['https://www.instagram.com/hasla_5moons/'],
  },
  location: {
    '@type': 'Place',
    name: '경포호 일원 (강릉)',
    address: {
      '@type': 'PostalAddress',
      addressLocality: '강릉시',
      addressRegion: '강원특별자치도',
      addressCountry: 'KR',
    },
  },
  // Hint to crawlers that this is a free public exhibition (no ticket sale flow yet).
  isAccessibleForFree: true,
  performer: {
    '@type': 'Organization',
    name: 'HASLA',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${yoonMeoli.variable} ${notoSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
      </head>
      <body className="root-fixed bg-background text-foreground">
        {/* Inner scroll container — body itself is fixed (no rubber-band)
            and all scrolling happens here. Sticky headers inside child
            pages stick relative to this container; fixed elements still
            position to the viewport. */}
        <div className="root-scroll">
          <LanguageProvider>
            {/* Mobile: floats top-right. PC: hidden (HeaderBar has its own copy). */}
            <div className="fixed right-4 top-3 z-50 lg:hidden">
              <LanguageButton />
            </div>
            {children}
          </LanguageProvider>
        </div>
        {/* Analytics — Vercel for first-party visitor counts; GA4 layered on
            top for richer behavior data. GA4 only mounts when NEXT_PUBLIC_GA_ID
            is set so no broken script tag in dev/local. */}
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
