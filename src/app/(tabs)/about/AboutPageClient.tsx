'use client'

import { useLang } from '@/i18n/LanguageContext'
import { ABOUT_COPY } from '@/i18n/about'
import FadeInSection from '@/components/zone/FadeInSection'
import BrandedSection from '@/components/BrandedSection'
import PreOpenBanner from '@/components/PreOpenBanner'
import ContactBlock from '@/components/ContactBlock'

export default function AboutPageClient() {
  const { lang, t } = useLang()
  const c = ABOUT_COPY[lang]

  return (
    <main className="min-h-dvh bg-black pb-32 pt-2 lg:pb-16">
      <div className="mx-auto max-w-md px-6 lg:max-w-2xl">
        <div className="mt-4">
          <PreOpenBanner />
        </div>

        {/* HERO */}
        <FadeInSection>
          <header className="mt-16 text-center">
            <h1 className="whitespace-pre-line font-display text-[23px] font-medium italic leading-[1.5] text-white">
              {c.heroTitle}
            </h1>
          </header>
        </FadeInSection>

        {/* Body — narrative paragraphs (Noto Sans KR for readability) */}
        <section className="mt-16 space-y-10">
          {c.body.map((para, i) => (
            <FadeInSection key={i} delay={0.06 * i}>
              <p className="whitespace-pre-line font-clean text-[15px] leading-[1.9] text-white/85">
                {para}
              </p>
            </FadeInSection>
          ))}
        </section>

        {/* Section — Five moons grid */}
        <BrandedSection label={c.s3Label}>
          <FadeInSection>
            <p className="mb-7 whitespace-pre-line font-display text-[16.5px] leading-[1.85] text-white/85">
              {c.s3Intro}
            </p>
          </FadeInSection>
          <ul className="flex flex-col divide-y divide-white/10">
            {c.s3Moons.map((moon, i) => (
              <FadeInSection key={moon.element} delay={0.05 * i}>
                <li className="py-4">
                  <span className="font-display text-[12.5px] tracking-[0.32em] text-hasla-yellow/85">
                    {moon.element}
                  </span>
                  <p className="mt-1.5 font-clean text-[14px] leading-[1.7] text-white/65">
                    {moon.desc}
                  </p>
                </li>
              </FadeInSection>
            ))}
          </ul>
          <FadeInSection delay={0.1}>
            <p className="mt-7 font-display text-[15px] italic leading-[1.95] text-white/85">
              {c.s3Outro}
            </p>
          </FadeInSection>
        </BrandedSection>

        {/* Section — invitation */}
        <BrandedSection label={c.s4Label}>
          {c.s4.map((line, i) => (
            <FadeInSection key={i} delay={0.06 * i}>
              <p className="mb-4 last:mb-0 whitespace-pre-line font-clean text-[15px] leading-[1.85] text-white/85">
                {line}
              </p>
            </FadeInSection>
          ))}
        </BrandedSection>

        {/* Visit info — keyword-rich block, also serves as a quick orientation
            for first-time visitors. Doubles as SEO context (location, format,
            schedule) for search engines. All copy lives in i18n/about.ts so
            the handoff guide can point non-devs at a single file. */}
        <BrandedSection label={c.visitLabel}>
          <FadeInSection>
            <p className="mb-4 font-clean text-[15px] leading-[1.85] text-white/85">
              {c.visitBody}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li className="flex items-baseline gap-3">
                <span className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow/85 shrink-0 w-14">
                  {c.visitWhereLabel}
                </span>
                <span className="font-clean text-[14px] leading-[1.7] text-white/80">
                  {c.visitWhereValue}
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow/85 shrink-0 w-14">
                  {c.visitFormatLabel}
                </span>
                <span className="font-clean text-[14px] leading-[1.7] text-white/80">
                  {c.visitFormatValue}
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow/85 shrink-0 w-14">
                  {c.visitWhenLabel}
                </span>
                <span className="font-clean text-[14px] leading-[1.7] text-white/80">
                  {c.visitWhenValue}
                </span>
              </li>
            </ul>
          </FadeInSection>
        </BrandedSection>

        {/* Teaser — vertical video */}
        <BrandedSection label={t.aboutTeaserLabel}>
          <FadeInSection>
            <p className="mb-5 font-display text-[15px] leading-[1.85] text-white/85">
              {t.aboutTeaserHeading}
            </p>
          </FadeInSection>
          <FadeInSection delay={0.06}>
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/8 bg-black">
              <video
                src="/videos/teaser.mp4"
                controls
                playsInline
                // preload="none" — don't fetch teaser metadata on every
                // About-page view. Visitor pays nothing until they hit
                // the ▶ button. Saves several hundred KB on mobile data
                // and keeps the page's perceived load fast.
                preload="none"
                className="h-full w-full object-cover"
              />
            </div>
          </FadeInSection>
        </BrandedSection>

        <ContactBlock />
      </div>
    </main>
  )
}

