/**
 * Route-level loading fallback. Streamed in by Next.js while server-
 * components further down the tree finish rendering. Keeps the page
 * dark with a single thin pulsing dot so transitions don't show a
 * blank black void on slower networks.
 */
export default function Loading() {
  return (
    <div
      aria-hidden
      className="flex min-h-dvh items-center justify-center bg-black"
    >
      <span className="hasla-loader inline-block h-2 w-2 rounded-full bg-hasla-yellow/80" />
    </div>
  )
}
