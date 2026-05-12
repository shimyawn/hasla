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
            schedule) for search engines. */}
        <BrandedSection label={lang === 'en' ? 'Visit' : '방문 안내'}>
          <FadeInSection>
            <p className="mb-4 font-clean text-[15px] leading-[1.85] text-white/85">
              {lang === 'en'
                ? 'Hasla Gangneung Immersive Art Show — a nightly immersive media-art walk along Gyeongpo Lake in Gangneung, set in the pine grove near Heo Nanseolheon Park. The 8 zones light up at dusk, weaving sound, light, and the legend of the five moons of ancient Hasla.'
                : '하슬라강릉이머시브아트쇼 — 강릉 경포호 일원에서 펼쳐지는 야간 미디어아트 산책. 허난설헌공원 인근 송림에서 8개의 ZONE이 빛과 사운드로 깨어나, 다섯 개의 달이 떠오르는 고대 하슬라의 전설로 안내합니다. 강릉 가볼만한곳·강릉 관광·강릉 야간 명소로 추천드립니다.'}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li className="flex items-baseline gap-3">
                <span className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow/85 shrink-0 w-14">
                  {lang === 'en' ? 'WHERE' : '위치'}
                </span>
                <span className="font-clean text-[14px] leading-[1.7] text-white/80">
                  {lang === 'en'
                    ? 'Gyeongpo Lake area, Gangneung (near Heo Nanseolheon Park)'
                    : '강릉 경포호 일원 (허난설헌공원 인근)'}
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow/85 shrink-0 w-14">
                  {lang === 'en' ? 'FORMAT' : '형식'}
                </span>
                <span className="font-clean text-[14px] leading-[1.7] text-white/80">
                  {lang === 'en'
                    ? 'Outdoor immersive art walk · 8 zones · light & sound'
                    : '야외 이머시브 아트 산책 · 8개 ZONE · 빛과 사운드'}
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow/85 shrink-0 w-14">
                  {lang === 'en' ? 'WHEN' : '시기'}
                </span>
                <span className="font-clean text-[14px] leading-[1.7] text-white/80">
                  {lang === 'en'
                    ? 'Soft open: May 2, 2026 · Grand opening: mid-July 2026'
                    : '가오픈 2026년 5월 2일 · 그랜드 오픈 2026년 7월 중순'}
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

