# PROJECT-CONTEXT.md

> **For agents resuming work on this repo.** Read this first, then `AGENTS.md`.
> Last updated: 2026-05-02 (가오픈 D-day)

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
- **framer-motion** for `FadeInSection`
- Custom i18n (KO default / EN toggle) via `LanguageContext`
- Custom fonts: `--font-yoon` (Yoon Meoli display, local TTF) + `--font-noto` (Noto Sans KR, Google Fonts)
- Analytics: `@vercel/analytics` + `@vercel/speed-insights` + `@next/third-parties` (GA4, gated by `NEXT_PUBLIC_GA_ID`)

---

## 3. Repo map (the parts that matter)

```
src/
  app/
    layout.tsx                      ← root metadata, JSON-LD Event, analytics, body fixed wrapper
    page.tsx                        ← splash route entry
    SplashClient.tsx                ← moon-rise splash animation
    opengraph-image.tsx             ← dynamic 1200x630 PNG (Korean wordmark + Yoon Meoli)
    robots.ts                       ← Allow * + sitemap pointer
    sitemap.ts                      ← 5 core pages + 8 zone pages
    (tabs)/
      map/
        page.tsx                    ← server (metadata)
        MapPageClient.tsx           ← 8 zone icons over map.jpg, two-step selection, PC split
      about/
        page.tsx                    ← server (metadata)
        AboutPageClient.tsx         ← narrative + Visit info SEO block + teaser video
      show/
        page.tsx + ShowPageClient.tsx
      feedback/
        page.tsx + FeedbackPageClient.tsx  ← PreOpenBanner + Naver review CTA + ContactBlock
    zone/[id]/
      page.tsx                      ← server, generateMetadata per zone
      ZonePageClient.tsx            ← hero image, story, directions, prev/next
  components/
    HeaderBar.tsx                   ← sticky top — mobile: home+logo+spacer, PC: logo+nav
    BottomTabs.tsx                  ← mobile-only (lg:hidden)
    LanguageButton.tsx              ← floats top-right on mobile, in HeaderBar on PC
    PreOpenBanner.tsx               ← white card with vertical gradient bar; on /map /about /show /feedback /zone
    ContactBlock.tsx                ← phone (tel:), address, Naver Place pill, Instagram pill
    zone/FadeInSection.tsx          ← framer-motion in-view fade
  data/zones.json                   ← 8 zones with mapPin {cx, cy, w, h} % coords
  i18n/
    LanguageContext.tsx             ← provider + useLang() hook
    types.ts                        ← UI string contract
    ui.ts                           ← KO + EN UI strings
    zones.ts                        ← KO + EN per-zone copy
  lib/zones.ts                      ← getZone(id), getNextZone, getPrevZone, getAllZones
  fonts/                            ← yoon-meoli-light.ttf, yoon-meoli-ultralight.ttf

public/
  images/                           ← logo_full.png, logo_black.png, map.jpg, zone hero images
  icons/                            ← zone1.png … zone8.png (map icons)
  videos/teaser.mp4
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
- **Icon cascade ripple** uses `animationDelay: ${i * 0.4}s` for a 1→8 wave when nothing is selected.
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

### `opengraph-image.tsx`
Dynamic PNG. Loads Yoon Meoli font via `fs.readFile` so Korean wordmark renders correctly — therefore needs `export const runtime = 'nodejs'` (not `edge`).

### JSON-LD (`layout.tsx`)
schema.org **Event** type is in the root layout `<head>` so every page emits it. Lists soft open date, location, organizer, free admission. Don't move this into per-page heads — Google needs it once and consistent.

---

## 5. Conventions

- **Phone**: `0507-1322-4508` (was changed to `010-9819-0245` then reverted — keep as-is)
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
- KO/EN toggle (`LanguageButton`)
- 8 zone pages with localized copy + main image + directions + prev/next nav
- Splash → Map fade-in transition (sessionStorage flag)
- iOS overscroll bounce fixed
- PC layouts: top nav (HeaderBar), Map split layout, wider containers throughout

### SEO (Tier 1+2 complete)
- Comprehensive `metadata` in `layout.tsx` (title.template, 12 keywords, alternates, openGraph, twitter, robots)
- Dynamic OG image with Korean wordmark
- `robots.ts` + `sitemap.ts`
- JSON-LD Event schema
- Per-page metadata via server/client split
- Korean keyword-rich body copy (Visit info section in About)
- Image alts with SEO keywords (HeaderBar, Splash, Map, Zone hero)
- Google Search Console verification file deployed
- Naver Search Advisor verification file deployed

### Analytics
- `@vercel/analytics` (visitor counts, referrers, country, device)
- `@vercel/speed-insights` (Core Web Vitals — LCP/INP/CLS)
- GA4 wired up but **dormant** until `NEXT_PUBLIC_GA_ID` env var is set in Vercel

---

## 7. What's pending (user-side and code-side)

### User-side (Tier 3 SEO + analytics)
- [ ] Google Search Console: click "Verify" on the property, then **submit sitemap.xml**, then "URL inspection → Request indexing" for the homepage (faster crawl before grand open)
- [ ] Naver Search Advisor: same flow for Naver
- [ ] Test OG preview at https://www.opengraph.xyz/ to confirm the og image renders
- [ ] Test Rich Results: https://search.google.com/test/rich-results — verify the Event schema parses
- [ ] Create GA4 property → get `G-XXXXXXXXXX` ID → add `NEXT_PUBLIC_GA_ID` env var in Vercel → redeploy

### Code-side (potential improvements, not committed)
- [ ] **UTM-tagged QR codes** for on-site visit attribution. User declined for now (현장 QR 따로 안 만든 듯) but if soft-open foot traffic data becomes important: append `?utm_source=onsite_qr&utm_medium=qr&utm_campaign=soft_open` to QR URLs and they'll separate in Vercel Analytics' UTM tab.
- [ ] **Custom events** — Vercel Analytics supports custom events on Pro plan; could track zone selection, language toggle, etc. Currently free plan.

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

---

## 11. Recent commit history (for orientation)

```
03d7fb7 feat(perf): wire up Vercel Speed Insights
088b4d0 content(seo): add Visit info section + boost image alts
e21b186 chore(seo): add Naver Search Advisor verification file
6a8357e chore(seo): add Google Search Console verification file
a82cea5 feat(seo): full SEO foundation — meta + OG + sitemap + robots + JSON-LD
4dad128 feat: wire up Vercel Analytics + Google Analytics 4
7b3f2c0 content(feedback): add ContactBlock at bottom
f5efa59 content(contact): add Instagram (@hasla_5moons) to ContactBlock
19f695c content(contact): revert phone → 0507-1322-4508
1ee42df content(feedback): add PreOpenBanner at top
5082784 content + chore: zone4 description rewrite, drop notify signup
938d5b1 feat(pc): Phase 2 — top nav + Map split layout
395a13e feat(pc): Phase 1 — wider containers + larger splash logo
3984096 fix: smooth splash→map fade-in + kill iOS overscroll bounce for real
```

---

## 12. Quick "where do I find…" cheat sheet

| Need to change… | Edit… |
|---|---|
| Site title / global meta | `src/app/layout.tsx` (metadata + eventJsonLd) |
| OG image | `src/app/opengraph-image.tsx` |
| Sitemap entries | `src/app/sitemap.ts` |
| Splash text or animation | `src/app/SplashClient.tsx` + `globals.css` `.moon-rise` etc. |
| Map background | `public/images/map.jpg` |
| Zone pin position | `src/data/zones.json` → `mapPin.cx/cy/w/h` |
| Zone copy (story, directions) | `src/i18n/zones.ts` |
| UI strings (labels, hints) | `src/i18n/ui.ts` (+ types.ts contract) |
| Phone / address / Instagram | `src/components/ContactBlock.tsx` (+ ui.ts for labels) |
| Pre-open banner copy | `src/i18n/ui.ts` `infoNoticeParagraphs` |
| Header nav items | `src/components/HeaderBar.tsx` `navItems` |
| Bottom tab items | `src/components/BottomTabs.tsx` |
| About page sections | `src/app/(tabs)/about/AboutPageClient.tsx` |
| Custom CSS animations | `src/app/globals.css` |
