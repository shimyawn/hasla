import FadeInSection from './zone/FadeInSection'

/**
 * Themed section wrapper with the brand-yellow hairline + tracking-out
 * eyebrow label. Extracted from AboutPageClient (was a file-local
 * Section helper) so /show, /feedback, /zone can adopt the same visual
 * rhythm without copy-pasting the markup.
 *
 * Eyebrow can be hidden by omitting `label`.
 */
export default function BrandedSection({
  label,
  className = 'mt-20',
  children,
}: {
  label?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={className}>
      {label && (
        <FadeInSection>
          <div className="mb-5 flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-hasla-yellow/60" />
            <span className="font-display text-[10.5px] tracking-[0.45em] text-hasla-yellow/85">
              {label}
            </span>
          </div>
        </FadeInSection>
      )}
      {children}
    </section>
  )
}
