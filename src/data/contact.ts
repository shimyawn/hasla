/**
 * Single source of truth for the venue's phone and street address.
 *
 * Kept out of i18n on purpose — the values themselves (a phone number,
 * a street address) don't change between languages; only their *labels*
 * ("대표 전화" vs "Phone") live in i18n/ui.ts.
 *
 * Read by:
 *  - components/ContactBlock.tsx  → visible phone + address + tel: link
 *  - app/layout.tsx (noscript)    → JS-disabled fallback contact line
 *
 * Each field is overrideable via NEXT_PUBLIC_* env vars in Vercel so
 * staging environments can point elsewhere without a redeploy.
 *
 * Note: layout.tsx's JSON-LD structured address (streetAddress /
 * addressLocality / addressRegion) is intentionally NOT sourced from
 * here — it's the SEO/schema payload and has its own component parts.
 * Keep them in sync manually if the venue ever relocates.
 */
export const CONTACT = {
  phone:
    process.env.NEXT_PUBLIC_CONTACT_PHONE ??
    '0507-1322-4508',

  address:
    process.env.NEXT_PUBLIC_CONTACT_ADDRESS ??
    '강원 강릉시 초당동 474-4',
} as const
