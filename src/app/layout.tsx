import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/i18n/LanguageContext'
import LanguageButton from '@/components/LanguageButton'
import InfoButton from '@/components/InfoButton'

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
  variable: '--font-body',
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
      <body className="min-h-dvh bg-background text-foreground">
        <LanguageProvider>
          <div className="fixed right-4 top-3 z-30 flex items-center gap-2">
            <LanguageButton />
            <InfoButton />
          </div>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
