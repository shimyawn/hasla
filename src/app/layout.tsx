import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Noto_Sans_KR } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { LanguageProvider } from '@/i18n/LanguageContext'
import LanguageButton from '@/components/LanguageButton'
import { LINKS } from '@/data/links'

// Source TTFs from the foundry had non-spec-compliant table directory ordering
// + unsorted name records, which Chrome/Edge's OpenType Sanitizer rejected
// (iOS Safari is more lenient — that's why mobile rendered correctly while PC
// fell back to system fonts). We re-serialize them as WOFF1 via
// `scripts/reserialize-fonts.py` which fixes the directory ordering and
// re-sorts name records as a side effect of the round-trip.
const yoonMeoli = localFont({
  src: [
    { path: '../fonts/yoon-meoli-ultralight.woff', weight: '200', style: 'normal' },
    { path: '../fonts/yoon-meoli-light.woff',      weight: '300', style: 'normal' },
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
// Title — brand name + a single readable descriptor (no keyword stuffing).
// The descriptor itself naturally contains the SEO anchors (강릉, 소나무숲,
// 야간 미디어아트 쇼) so the snippet reads cleanly to humans while still
// matching the priority queries.
const SITE_TITLE = '하슬라강릉이머시브아트쇼 — 강릉 소나무숲의 야간 미디어아트 쇼'
const SITE_DESCRIPTION =
  '강릉 경포호 소나무숲에서 펼쳐지는 야간 미디어아트 쇼. 다섯 개의 달이 뜬 밤, 잠들어 있던 고대 하슬라의 숲이 깨어납니다. 허난설헌공원 인근, 강릉 가볼만한곳·강릉 관광·강릉 야간 명소·강릉 데이트 코스.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Every per-page title gets 강릉 + 하슬라 appended automatically, so even
    // sub-pages like '지도' surface as '지도 | 강릉 하슬라 — 경포 환상의 호수'
    // in Google results.
    // Shorter template so sub-page titles stay within Naver/Google's ~32-char
    // visible window (e.g. '지도 · 8개 ZONE 산책 코스 | 하슬라강릉이머시브아트쇼').
    template: '%s | 하슬라강릉이머시브아트쇼',
  },
  description: SITE_DESCRIPTION,
  applicationName: '하슬라강릉이머시브아트쇼',
  keywords: [
    // Brand — official full name (unspaced is canonical) + spaced fallback
    '하슬라강릉이머시브아트쇼',
    '하슬라 강릉 이머시브 아트쇼',
    '하슬라',
    'HASLA',
    '하슬라강릉',
    '하슬라 강릉',
    // Top-priority location queries (user-targeted)
    '강릉',
    '강릉가볼만한곳',
    '강릉 가볼만한곳',
    '강릉관광',
    '강릉 관광',
    '강릉관광지',
    '강릉 관광지',
    // Venue
    '강릉 경포호',
    '경포호',
    '경포 환상의 호수',
    '경포호 송림',
    '허난설헌공원',
    // Format / genre
    '강릉 미디어아트',
    '강릉 야간 미디어아트',
    '강릉 이머시브 아트쇼',
    '강릉 전시',
    '강릉 전시회',
    '강릉 라이트쇼',
    '미디어아트 산책',
    '이머시브 아트',
    '야간 미디어아트',
    // Visitor-intent long tail
    '강릉 야간 명소',
    '강릉 야간 데이트',
    '강릉 데이트 코스',
    '강릉 여행',
    '강릉 여행 코스',
    '강릉 가족여행',
    '강릉 주말',
    '강릉 야경',
    // Show-specific
    '다섯 개의 달',
    '인피니티 포레스트',
    '오행 미디어아트',
    // English
    'Hasla Gangneung Immersive Art Show',
    'HASLA Gangneung',
    'Gangneung tourism',
    'Gangneung must visit',
    'Gangneung Immersive Art Show',
    'Gyeongpo Fantasy Lake',
    'Gangneung night attraction',
    'Gangneung media art',
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
    siteName: '하슬라강릉이머시브아트쇼',
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
  name: '하슬라강릉이머시브아트쇼',
  alternateName: [
    '경포 환상의 호수',
    'Hasla Gangneung Immersive Art Show',
  ],
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  startDate: '2026-05-02',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  inLanguage: ['ko', 'en'],
  // schema.org accepts a `keywords` field on Event — comma-separated list
  // of phrases. Helps Naver's structured-data parser surface this as a
  // "이런 검색에 어울리는 곳" candidate for top-priority queries.
  keywords:
    '강릉, 강릉가볼만한곳, 강릉관광, 강릉 야간 명소, 강릉 미디어아트, 강릉 전시, 강릉 데이트, 하슬라강릉이머시브아트쇼, 경포 환상의 호수, 다섯 개의 달',
  organizer: {
    '@type': 'Organization',
    name: '하슬라강릉이머시브아트쇼',
    url: SITE_URL,
    sameAs: [LINKS.instagram],
  },
  location: {
    '@type': 'Place',
    name: '강릉 경포호 일원 (허난설헌공원 인근)',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '초당동 474-4',
      addressLocality: '강릉시',
      addressRegion: '강원특별자치도',
      addressCountry: 'KR',
    },
  },
  // Hint to crawlers that this is a free public exhibition (no ticket sale flow yet).
  isAccessibleForFree: true,
  performer: {
    '@type': 'Organization',
    name: '하슬라강릉이머시브아트쇼',
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
            is set so no broken script tag in dev/local.
            Speed Insights collects Core Web Vitals (LCP, INP, CLS) per route
            so we can spot perf regressions as we ship. */}
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
