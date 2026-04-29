export type Lang = 'ko' | 'en'

export interface UIStrings {
  // Splash
  splashLabel: string
  splashSloganLine1: string
  splashSloganLine2: string
  splashHint: string
  splashCta: string
  copyrightSuffix: string
  // Header / nav
  navHome: string
  navMap: string
  navHomeKey: string
  // Map page
  toggleMap: string
  toggleList: string
  mapCaption: string
  // Zone detail
  sectionDirection: string
  sectionMedia: string
  navBackToMap: string
  navFinish: string
  navFirst: string
  zoneTotalSeparator: string
  // Misc
  viewDetail: string
  // Element labels (오행)
  elementWater: string
  elementWood: string
  elementEarth: string
  elementFire: string
  elementMetal: string
  // Meta
  metaTitle: string
  metaSubtitle: string
  metaFullTitle: string
  slogan: string
  concept: string
  // Language toggle
  langToggleLabel: string
  // Info / operating hours
  infoButtonLabel: string
  infoSheetTitle: string
  infoPreOpenLabel: string
  infoPreOpenLineShort: string
  infoNoticeLine1: string
  infoNoticeLine2: string
  infoSessionsHeading: string
  infoSessionsNote: string
  infoGrandOpenLabel: string
  infoGrandOpenWhen: string
  infoCloseLabel: string
  infoPerDayLabel: string
  splashStatusBanner: string
}

export interface LocalizedZone {
  title: string
  subtitle: string
  tagline: string
  story: string
  description: string
  direction: string[]
  media: string[]
  element: string
}
