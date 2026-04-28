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
  // Audio
  audioTitleDefault: string
  audioTapToPlay: string
  audioError: string
  ariaPlay: string
  ariaPause: string
  ariaSeek: string
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
