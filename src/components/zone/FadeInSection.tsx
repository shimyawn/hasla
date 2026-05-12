'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

interface Props {
  delay?: number
  className?: string
  children: ReactNode
}

/**
 * Reveal-on-scroll wrapper. Was originally a framer-motion `motion.div`
 * with `whileInView` — the whole framer-motion package (~50 KB gzipped)
 * was pulled into every page just for this one effect. Replaced with a
 * plain IntersectionObserver + CSS class toggle: zero extra JS bundle,
 * identical visual outcome.
 *
 * - Initial state: opacity 0, translateY(16px)
 * - When 20% of the element enters viewport: .is-visible class added,
 *   triggering the CSS transition declared in globals.css (.fade-in-section)
 * - Fire-once (observer disconnects after first reveal) — matches the
 *   `viewport={{ once: true }}` semantics of the framer-motion version.
 *
 * The `delay` prop maps to a CSS custom property (--reveal-delay) so
 * staggered FadeInSection siblings still cascade exactly the same way.
 */
export default function FadeInSection({ delay = 0, className = '', children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already in view on mount (above-the-fold) — reveal immediately
    // without spending an observer cycle.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style = { '--reveal-delay': `${delay}s` } as CSSProperties

  return (
    <div
      ref={ref}
      className={`fade-in-section ${visible ? 'is-visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
