'use client'

import { useLang } from '@/i18n/LanguageContext'
import { LINKS } from '@/data/links'
import { CONTACT } from '@/data/contact'
import FadeInSection from './zone/FadeInSection'
import BrandedSection from './BrandedSection'

/**
 * Contact information block — shared by /about and /map (main).
 * Renders eyebrow + venue name + phone + address + Naver Place CTA.
 */
export default function ContactBlock() {
  const { t, lang } = useLang()
  // Localized aria/sr-only suffix announcing that a link opens in a new tab.
  // Without this, screen readers say nothing about the context switch and
  // users get teleported to Naver / Instagram with no warning.
  const newTabHint =
    lang === 'en' ? '(opens in a new tab)' : '(새 탭으로 열림)'
  return (
    <BrandedSection label={t.contactSectionLabel}>
      <FadeInSection>
        <h2 className="font-display text-[18px] font-medium leading-[1.4] text-white">
          {t.contactName}
        </h2>
      </FadeInSection>

      <ul className="mt-6 flex flex-col gap-5">
        <FadeInSection delay={0.04}>
          <li>
            <div className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow/85">
              {t.contactPhoneLabel}
            </div>
            <a
              href={`tel:${CONTACT.phone}`}
              className="mt-1.5 inline-flex items-center gap-2 font-clean text-[16px] tracking-[0.02em] text-white transition-colors hover:text-hasla-yellow"
            >
              {CONTACT.phone}
            </a>
          </li>
        </FadeInSection>

        <FadeInSection delay={0.08}>
          <li>
            <div className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow/85">
              {t.contactAddressLabel}
            </div>
            <p className="mt-1.5 font-clean text-[14px] leading-[1.7] text-white/85">
              {CONTACT.address}
            </p>
          </li>
        </FadeInSection>

        <FadeInSection delay={0.12}>
          <li>
            <div className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow/85">
              {t.contactPlaceLabel}
            </div>
            <a
              href={LINKS.naverPlace}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-clean text-[14px] text-white/85 transition-colors hover:border-hasla-yellow/60 hover:text-white"
            >
              {t.contactPlaceCta}
              <span aria-hidden>↗</span>
              <span className="sr-only">{newTabHint}</span>
            </a>
          </li>
        </FadeInSection>

        <FadeInSection delay={0.16}>
          <li>
            <div className="font-display text-[10px] tracking-[0.4em] text-hasla-yellow/85">
              {t.contactInstagramLabel}
            </div>
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-clean text-[14px] text-white/85 transition-colors hover:border-hasla-yellow/60 hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
              {t.contactInstagramHandle}
              <span aria-hidden>↗</span>
              <span className="sr-only">{newTabHint}</span>
            </a>
          </li>
        </FadeInSection>
      </ul>
    </BrandedSection>
  )
}
