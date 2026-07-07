# PROJECT-CONTEXT.md

> **For agents resuming work on this repo.** Read this first, then `AGENTS.md`.
> Last updated: 2026-05-12 (post-soft-open cleanup pass)

---

## 1. What this is

**HASLA — 경포 환상의 호수** (Gyeongpo Fantasy Lake)

A mobile-first leaflet web app for an immersive media art show in Gangneung, Korea. Visitors walk through 8 zones in a pine grove around Gyeongpo Lake (near Heo Nanseolheon Park) at night; the site is the digital companion — story, map, schedule, contact, feedback.

- **Production URL**: https://hasla-gangneung.vercel.app
- **GitHub**: https://github.com/shimyawn/hasla.git
- **Hosting**: Vercel (auto-deploy from `main`)
- **Soft open**: 2026-05-02 ✅ (today as of last update)
- **Grand opening**: 2026-07 mid

---

## 2. Stack

- **Next.js 16.2.4** App Router + Turbopack — *not* the Next.js you know from training data; see `AGENTS.md`
- **React 19.2**
- **Tailwind CSS v4** (`@theme inline` in `globals.css`)
- **TypeScript**
- **No framer-motion** — was removed (~50KB win). `FadeInSection` now uses IntersectionObserver + CSS class toggle.
- Custom i18n (KO default / EN toggle) via `LanguageContext`. Updates `<html lang>` on toggle.
- Custom fonts: `--font-yoon` (Yoon Meoli display, **served as WOFF1** — TTF source files had non-spec-compliant table directory + loca, see `scripts/repair-loca.py`) + `--font-noto` (Noto Sans KR, Google Fonts)
- Analytics: `@vercel/analytics` + `@vercel/speed-insights` + `@next/third-parties` (GA4, gated by `NEXT_PUBLIC_GA_ID`)

---

## 3. Repo map (the parts that matter)

```
src/
  app/
    layout.tsx                      ← root metadata, JSON-LD Event, analytics, body fixed wrapper, noscript
    page.tsx                        ← splash route entry
    SplashClient.tsx                ← moon-rise splash animation; timing constants at top
    (og image now a static file — see public/og.png)
    icon.tsx                        ← 32x32 brand-gradient favicon (Next 16 file-based)
    apple-icon.tsx                  ← 180x180 iOS home-screen icon
    not-found.tsx                   ← branded 404 (소프트 펄스 → 지도로)
    error.tsx                       ← route-level error boundary with reset()
    loading.tsx                     ← branded loading dot fallback
    robots.ts                       ← Allow * + sitemap pointer
    sitemap.ts                      ← 5 core pages + 8 zone pages, stable LAST_REV dates
    (tabs)/
      layout.tsx                    ← HeaderBar + children + BottomTabs wrapper
      map/page.tsx + MapPageClient.tsx
      about/page.tsx + AboutPageClient.tsx
      show/page.tsx + ShowPageClient.tsx
      feedback/page.tsx + FeedbackPageClient.tsx
    zone/[id]/
      layout.tsx + page.tsx + ZonePageClient.tsx
  components/
    HeaderBar.tsx                   ← sticky top — mobile: home+logo+spacer, PC: logo+nav
    BottomTabs.tsx                  ← mobile-only (lg:hidden)
    LanguageButton.tsx              ← floats top-right on mobile, in HeaderBar on PC
    PreOpenBanner.tsx               ← white card with vertical gradient bar
    ContactBlock.tsx                ← phone + address + Naver Place + Instagram; uses BrandedSection
    BrandedSection.tsx              ← shared brand-yellow eyebrow + hairline wrapper
    zone/FadeInSection.tsx          ← IntersectionObserver-driven CSS fade (no framer-motion)
  data/
    zones.json                      ← 8 zones with mapPin {cx, cy, w, h} % coords
    schedule.ts                     ← showTimes single source (read by /show + /zone/zone6)
    links.ts                        ← LINKS.naverPlace / .instagram / .reviewForm (env-overrideable)
  i18n/
    LanguageContext.tsx             ← provider + useLang() hook + html lang sync
    types.ts                        ← UI string contract + LocalizedZone shape + AboutCopy shape
    ui.ts                           ← KO + EN UI strings
    zones.ts                        ← KO + EN per-zone copy + localizeZone helper
    about.ts                        ← KO + EN About-page narrative (ABOUT_COPY)
  lib/zones.ts                      ← getZone / getAllZones / getNextZone / getPrevZone / localized()
  fonts/                            ← yoon-meoli-{light,ultralight}.woff (served) + .ttf (source)
scripts/
  repair-loca.py                    ← font-surgery script — clamps non-monotonic loca offsets
                                      and re-serializes as WOFF1. Re-run if TTFs change.

public/
  images/                           ← logo_full.png, logo_black.png, map.jpg, zone hero images
  icons/                            ← zone1.png … zone8.png (map icons)
  videos/teaser.mp4                 ← About page teaser (preload="none" — fetched only on play)
  googleb9db032ad24ffb6a.html       ← Google Search Console verification
  naverd72d7ba9cebe08b306b7134a1b8c7825.html ← Naver verification
```

---

## 4. Design decisions you should know before touching things

### Splash (`SplashClient.tsx`)
The current moon-rise effect is the **3rd iteration**. Don't "simplify" it without understanding what it is:
- Black silhouette logo sits in **front** (z-index 1) and slides DOWN out of frame
- Color logo sits **behind** (z-index 0) and slides UP from below into the same position
- Both translate at same duration with `cubic-bezier(0.25, 0.1, 0.25, 1)`; they cross **below the wrapper's bottom edge** (overflow-hidden masks the overlap)
- Slow first-time fade (4200ms), fast taps after (`TRANSITION_MS = 1500`)
- `flareKey` state replays the `.moon-flare-logo-tap` flare on every tap
- Sets `sessionStorage.setItem('hasla-from-splash', '1')` before navigating to /map
- `<Image unoptimized>` is intentional — without it, dev preview tools couldn't render the logo (Content-Disposition issue from Next image optimizer)

### Map (`MapPageClient.tsx`)
- **Two-step zone selection**: first tap on zone icon = select (super-glow + dim others + show below-map info card on mobile / right panel on PC). Second tap on same zone = navigate. Tap empty map area = deselect.
- **`e.stopPropagation()`** on the Link's onClick is critical — without it the wrapper's `onClick={() => setSelectedId(null)}` immediately deselects.
- **PC split layout** (`lg:`): left = map (600px), right = zone detail panel (`flex-1`). Mobile keeps the below-map card.
- **Icon cascade ripple** uses `animationDelay: ${i * 0.15}s` for a 1→8 wave when nothing is selected (~1.05s total).
- **GPU layer pinning**: `.icon-glow` / `.icon-selected` / `.icon-dim` all use `will-change: filter, transform, opacity` + `translateZ(0)`. Without these the drop-shadow falls back to bounding-box and produces a square clip after the transition ends.

### iOS overscroll bounce fix
- `body.root-fixed` is `position: fixed` filling the viewport
- `.root-scroll` inside it does all the actual scrolling
- **Don't** add `body { min-height }` or `body { overflow-x }` — they break this pattern. Earlier attempts via `overscroll-behavior-y: none` did not work in Safari.

### SEO (server/client split)
Pages that need `export const metadata` must be **server components**. Where the page needs client hooks (`useLang`, `useState`), the pattern is:
```
page.tsx                  ← server, exports metadata, renders <FooClient />
FooPageClient.tsx         ← 'use client', the actual UI
```
This is in place for: `/map`, `/about`, `/show`, `/feedback`, `/zone/[id]`.

### OG image — now a static file
Previously generated at request time by `src/app/opengraph-image.tsx` (Node runtime + Yoon Meoli via `fs.readFile`). Extracted the rendered output and moved to `public/og.png`. `src/app/layout.tsx` openGraph metadata now points at `/og.png` explicitly. Drop-in replaceable by the designer without touching code.

### JSON-LD (`layout.tsx`)
schema.org **Event** type is in the root layout `<head>` so every page emits it. Lists soft open date, location, organizer, free admission. Don't move this into per-page heads — Google needs it once and consistent.

---

## 5. Conventions

- **Phone**: `0507-1322-4508` (was briefly changed to a personal mobile then reverted — keep the 0507 line)
- **Instagram**: `@hasla_5moons` → https://www.instagram.com/hasla_5moons/
- **Address**: 강릉 경포호 일원 (허난설헌공원 인근)
- **Soft open date**: 2026-05-02 (was originally 5-1, changed to 5-2)
- **Grand opening**: 2026-07 mid
- **Color/font usage**: `font-display` = Yoon Meoli (titles, accents). `font-clean` = Noto Sans KR (body, readable text).
- **Brand accent**: `text-hasla-yellow/85` for section labels, gradient bars
- **Container widths**: mobile `max-w-md`, PC `lg:max-w-2xl` for content, `lg:max-w-5xl` in HeaderBar, `lg:max-w-6xl` for Map split
- **No emojis in code/files** unless explicitly asked
- **`PreOpenBanner` placement**: top of /map /about /show /feedback /zone pages — keep this consistent if adding new pages
- **`ContactBlock` placement**: bottom of /about /map /feedback (and zone if relevant)

---

## 6. What's done

### Functional
- 5 routes: `/` (splash) → `/map` → `/about` → `/show` → `/feedback` → `/zone/[1-8]`
- KO/EN toggle (`LanguageButton`) — `<html lang>` mirrors active locale
- 8 zone pages with localized copy + main image + directions + prev/next nav
- Splash → Map fade-in transition (sessionStorage flag)
- iOS overscroll bounce fixed
- PC layouts: top nav (HeaderBar), Map split layout, wider containers throughout
- **Special routes**: not-found.tsx, error.tsx, loading.tsx, icon.tsx, apple-icon.tsx — all brand-styled
- **Accessibility**: sr-only h1 on every page, screen-reader hints on external links, prefers-reduced-motion respected, noscript fallback
- Yoon Meoli fonts repaired (loca offset surgery) and re-served as WOFF1 — see `scripts/repair-loca.py`

### SEO (Tier 1+2 complete)
- Comprehensive `metadata` in `layout.tsx` (title.template, 30+ keywords, alternates, openGraph, twitter, robots)
- Brand unified as `하슬라강릉이머시브아트쇼` across titles, descriptions, JSON-LD, alts, ContactBlock
- Target query priorities: `강릉` / `강릉가볼만한곳` / `강릉관광` (descriptions lead with these)
- Dynamic OG image with Korean wordmark
- `robots.ts` + `sitemap.ts` with stable LAST_REV dates
- JSON-LD Event schema with structured-data `keywords` field
- Per-page metadata via server/client split
- Image alts with brand + SEO keywords (Map, HeaderBar, Splash, Zone hero)
- Google Search Console + Naver Search Advisor verification files deployed
- Both indexed as of 2026-05-04 (Naver) / 2026-05-12 (Google partial)

### Performance
- framer-motion removed (~50KB win) — FadeInSection now IntersectionObserver + CSS
- Teaser video `preload="none"` — no metadata fetch unless user presses play
- HeaderBar logo no longer `priority` — saves preload signal for actual LCP candidates
- Map icon cascade tightened: 0.4s/icon → 0.15s/icon (1.05s total vs 2.8s)
- `@vercel/speed-insights` mounted — Core Web Vitals visible in dashboard

### Analytics
- `@vercel/analytics` (visitor counts, referrers, country, device)
- `@vercel/speed-insights` (Core Web Vitals — LCP/INP/CLS)
- GA4 wired up but **dormant** until `NEXT_PUBLIC_GA_ID` env var is set in Vercel

### Code organization
- `localized()` zone helper unified in `lib/zones.ts` (was duped in 2 components)
- `showTimes` single source in `data/schedule.ts` (was duplicated string arrays)
- External URLs centralized in `data/links.ts` (env-overrideable)
- About narrative extracted to `i18n/about.ts` (mirrors `i18n/zones.ts` pattern)
- `BrandedSection` shared component (was file-local in About + inline in ContactBlock)

---

## 7. What's pending (user-side only)

All code-level improvements have landed. Remaining items are platform/account actions outside the codebase:

- [ ] Google Search Console: submit sitemap.xml (verification HTML already deployed)
- [ ] Naver Search Advisor: submit sitemap (verification HTML already deployed) — note Naver requires full URL `https://hasla-gangneung.vercel.app/sitemap.xml`
- [ ] Test OG preview at https://www.opengraph.xyz/ to confirm the og image renders
- [ ] Test Rich Results: https://search.google.com/test/rich-results — verify the Event schema parses
- [ ] Create GA4 property → get `G-XXXXXXXXXX` ID → set `NEXT_PUBLIC_GA_ID` env var in Vercel → redeploy
- [ ] (optional) UTM-tagged QR codes for on-site visit attribution
- [ ] (optional) Custom domain → improves perceived authority for SEO

### Future code-side enhancements (not yet committed)
- **Custom events** in Vercel Analytics (Pro plan) — track zone selection, lang toggle
- **Magic-number purge** — extract more inline `text-[14.5px]`, etc. into utility classes
- **Press kit / news page** at `/press` — would use the now-shared `BrandedSection`

---

## 8. Things that were tried and removed (don't re-add without asking)

- **Notify form** (DB marketing for grand-open updates) — full Vercel API + Google Sheets pipeline was built (`/src/app/api/notify/route.ts`, `gas/`, `docs/notify-form-setup.md`, `googleapis` package, all i18n keys). Removed entirely on user request: "가오픈이라 일단 이 기능은 싹 빼줘 다시". Don't reintroduce without explicit ask.

- **Splash mask wipe** (1st iteration) — replaced
- **Splash rise + fade crossover** (2nd iteration) — replaced because color and silhouette felt coequal
- **`overscroll-behavior-y: none` for iOS bounce** — didn't work in Safari, replaced with body-fixed pattern

---

## 9. Workflow

```bash
# Dev
npm run dev                  # Turbopack, http://localhost:3000

# New package
npm i <pkg>

# Commit + auto-deploy
git add <files>
git commit -m "type(scope): subject"   # follow existing convention (feat/fix/content/chore/style)
git push                              # Vercel auto-deploys from main
```

**Commit style** (look at recent log):
- `feat(seo):`, `fix(map):`, `content(feedback):`, `chore(seo):`, `style(map):`
- Subject in English, sometimes mixed Korean for content commits
- Co-author trailer:
  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```

**User pattern**: usually says "커밋 부탁해" or "ㄱㄱ" to greenlight committing. Don't auto-commit — wait for the ask.

---

## 10. Gotchas / pitfalls

- **`AGENTS.md` says "This is NOT the Next.js you know"** — Next.js 16 has breaking API changes; if unsure about a Next API, check `node_modules/next/dist/docs/` before using it.
- **Don't import `useLang` into a server component** — that breaks the build. Use the `page.tsx` (server) + `FooClient.tsx` (client) split pattern.
- **`Image` with default optimization broke dev preview tools** — that's why Splash uses `unoptimized`. Production images (zones, map) are fine without it.
- **Korean text in OG image** requires `runtime: 'nodejs'` and font loaded via `fs.readFile`, not `fetch`.
- **GPU compositor releases on transition end** kills filter effects → always pin with `will-change` + `translateZ(0)` for any animated `filter:` or `drop-shadow:`.
- **Splash → Map fade-in** uses `sessionStorage('hasla-from-splash')` — it's set before splash navigates and consumed in MapPageClient via `useIsoLayoutEffect`. Don't break this contract.
- **Zone icon `alt=""`** is intentional accessibility — the wrapping `<Link aria-label={zone title}>` already announces the zone, so the image is decoration. Don't "improve" by adding alt text.
- **Splash silhouette `alt=""`** — same reasoning. The color logo right behind it has the SEO alt text.
- **CRLF line ending warnings** are normal on Windows (the repo is checked in as LF) — ignore them.
- **WOFF1 (not WOFF2) for Yoon Meoli** — the foundry's TTFs had a broken loca offset at glyph 17146 that WOFF2 conversion can't tolerate (it fully decompiles glyf/loca). `scripts/repair-loca.py` clamps the bad offset before re-serializing as WOFF1. If TTFs are ever replaced with cleaner sources, rerunning the script with `flavor='woff2'` would give an additional ~40% size win.
- **`<html lang>` is set by LanguageProvider, not SSR'd correctly** — server renders 'ko' always. A `useEffect` in `LanguageContext.tsx` updates the attribute after hydration to match the actual locale. Don't move this to the `<html>` element directly.
- **JSON-LD `keywords` on Event** — `keywords` is inherited from `Thing` (schema.org ≥ 3.9) so this is valid even though some older validators flag it. Don't remove based on stale validator output.

---

## 11. Recent commit history (for orientation)

```
076f7b5 polish: splash timing constants, noscript fallback, design tokens
b5f3ef2 refactor: dynamic html lang, stable sitemap dates, extract About + section + links
de82ac2 perf: replace framer-motion with IntersectionObserver + CSS
cdd4dbc perf+cleanup: video preload, icon cascade, dedup, sr-only hints
b14223f feat: add not-found / error / loading / icon route files
10c0ccd fix(a11y): i18n missing on Map PC panel, no h1 on splash/map, no reduced-motion
e63dd40 fix(font): patch loca's last bad offset before WOFF1 re-serialize
0899bba fix(font): re-serialize Yoon Meoli TTFs as WOFF1 — Chrome rejected originals
ac033c0 seo: rewrite titles & descriptions to read naturally in search snippets
ac22fbe seo: unify brand as 하슬라강릉이머시브아트쇼, target 강릉/강릉가볼만한곳/강릉관광
f119395 seo: lead every title with 강릉/하슬라, expand keyword set
9bffe76 docs: add PROJECT-CONTEXT.md for session handoff
03d7fb7 feat(perf): wire up Vercel Speed Insights
088b4d0 content(seo): add Visit info section + boost image alts
a82cea5 feat(seo): full SEO foundation — meta + OG + sitemap + robots + JSON-LD
```

---

## 12. Quick "where do I find…" cheat sheet

| Need to change… | Edit… |
|---|---|
| Site title / global meta | `src/app/layout.tsx` (metadata + eventJsonLd) |
| OG image | `public/og.png` (static file — replace to update) |
| Favicon | `src/app/icon.tsx` + `apple-icon.tsx` |
| Sitemap entries / per-page lastModified | `src/app/sitemap.ts` (LAST_REV bucket) |
| Splash text or animation | `src/app/SplashClient.tsx` (timing constants at top) + `globals.css` |
| Map background | `public/images/map.jpg` |
| Zone pin position | `src/data/zones.json` → `mapPin.cx/cy/w/h` |
| Zone copy (story, directions) | `src/i18n/zones.ts` |
| About narrative copy | `src/i18n/about.ts` (ABOUT_COPY[lang]) |
| UI strings (labels, hints) | `src/i18n/ui.ts` (+ types.ts contract) |
| Phone / address labels | `src/i18n/ui.ts` `contactPhone*` etc. |
| Naver Place / Instagram / Review URLs | `src/data/links.ts` (or env vars) |
| Show / zone6 timetable | `src/data/schedule.ts` (showTimes array) |
| Pre-open banner copy | `src/i18n/ui.ts` `infoNoticeParagraphs` |
| Header nav items | `src/components/HeaderBar.tsx` `navItems` |
| Bottom tab items | `src/components/BottomTabs.tsx` |
| About page structure (sections) | `src/app/(tabs)/about/AboutPageClient.tsx` |
| Shared section wrapper | `src/components/BrandedSection.tsx` |
| 404 / error / loading text | `src/app/{not-found,error,loading}.tsx` |
| Custom CSS animations / design tokens | `src/app/globals.css` (`:root` has `--track-*` vars) |
