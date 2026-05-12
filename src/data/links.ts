/**
 * Single source of truth for external URLs the site links to.
 * Centralizing them here:
 *  - makes it trivial to swap a URL (e.g. seasonal review form) without
 *    grepping the codebase
 *  - lets JSON-LD `sameAs` and visible link components stay in sync
 *  - documents what each link is for so a fresh contributor doesn't have
 *    to guess
 *
 * Each entry is overrideable via NEXT_PUBLIC_* env vars in Vercel — useful
 * for staging environments or campaign-specific A/B URLs.
 */

export const LINKS = {
  // Naver Place pin for the venue. ↗ button in ContactBlock + Naver
  // structured-data references.
  naverPlace:
    process.env.NEXT_PUBLIC_NAVER_PLACE_URL ??
    'https://naver.me/xy7JAsef',

  // Official Instagram. Linked in ContactBlock and surfaced in the
  // schema.org Event organizer.sameAs array for cross-platform identity.
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    'https://www.instagram.com/hasla_5moons/',

  // Visitor review form (Google Forms). Used by /feedback CTA.
  // Seasonal forms can be swapped via env var without redeploy.
  reviewForm:
    process.env.NEXT_PUBLIC_REVIEW_URL ??
    'https://docs.google.com/forms/d/e/1FAIpQLSf-e7f5OBXj6X2vnboWs8Lj4PjaGC_vF8YVsnZLh5iywzFTqg/viewform?pli=1',
} as const
