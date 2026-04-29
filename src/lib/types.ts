export interface MapBox {
  cx: string
  cy: string
  w: string
  h: string
}

export interface ZoneAssets {
  mainImage: string
}

export interface Zone {
  id: string
  slug: string
  title: string
  subtitle: string
  tagline?: string
  accentColor: string
  element?: string
  mapPin: MapBox
  assets: ZoneAssets
  story: string
  description?: string
  direction?: string[]
  media?: string[]
}

export interface ZoneMeta {
  title: string
  subtitle: string
  fullTitle: string
  slogan: string
  concept: string
  year: number
}

export interface ZonesData {
  meta: ZoneMeta
  zones: Zone[]
}
