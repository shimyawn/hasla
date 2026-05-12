import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '잘못된 경로',
  robots: { index: false, follow: false },
}

/**
 * 404 — branded fallback for unknown routes (e.g. /zone/zone99).
 * Stays consistent with the splash's typographic mood: thin display
 * font, dim slogan, single CTA back to /map.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 text-center">
      <p className="font-display text-[11px] tracking-[0.45em] text-hasla-yellow/85">
        404
      </p>
      <h1 className="mt-6 font-display text-[26px] font-medium leading-[1.4] text-white">
        달이 잘못 떴습니다
      </h1>
      <p className="mt-4 max-w-xs font-clean text-[14px] leading-[1.7] text-white/60">
        찾으시는 페이지가 사라졌거나 주소가 잘못된 것 같습니다.
        <br />
        지도로 돌아가 다른 ZONE을 둘러봐주세요.
      </p>
      <Link
        href="/map"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-display text-[14px] tracking-[0.08em] text-white transition-colors hover:border-white/70 hover:bg-white/5"
      >
        지도로 돌아가기
        <span aria-hidden>→</span>
      </Link>
    </main>
  )
}
