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

export const metadata: Metadata = {
  title: '경포 환상의 호수 — 고대 하슬라의 밤',
  description: '다섯 개의 달이 뜬 밤, 강릉 경포의 호수에 고대 하슬라의 숲이 깨어난다. 빛과 소리로 만나는 미디어아트 산책.',
  applicationName: '경포 환상의 호수',
  openGraph: {
    title: '경포 환상의 호수 — 고대 하슬라의 밤',
    description: '다섯 개의 달이 뜬 밤, 고대 하슬라가 깨어난다.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${yoonMeoli.variable} ${notoSans.variable} h-full antialiased`}>
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
