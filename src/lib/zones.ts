import zonesData from '@/data/zones.json'
import type { Zone, ZonesData } from './types'

const data = zonesData as ZonesData

export function getAllZones(): Zone[] {
  return data.zones
}

export function getZone(id: string): Zone | undefined {
  return data.zones.find((z) => z.id === id)
}

export function getMeta() {
  return data.meta
}

export function getNextZone(id: string): Zone | undefined {
  const idx = data.zones.findIndex((z) => z.id === id)
  if (idx === -1 || idx === data.zones.length - 1) return undefined
  return data.zones[idx + 1]
}

export function getPrevZone(id: string): Zone | undefined {
  const idx = data.zones.findIndex((z) => z.id === id)
  if (idx <= 0) return undefined
  return data.zones[idx - 1]
}
