import type { Metadata } from 'next'
import NotFoundClient from './NotFoundClient'

export const metadata: Metadata = {
  title: '잘못된 경로',
  robots: { index: false, follow: false },
}

/**
 * 404 — branded fallback for unknown routes (e.g. /zone/zone99).
 * Metadata stays here (server component); actual UI lives in
 * NotFoundClient so all copy runs through i18n like every other page.
 */
export default function NotFound() {
  return <NotFoundClient />
}
