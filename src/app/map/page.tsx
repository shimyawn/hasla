import { getAllZones } from '@/lib/zones'
import MapPageClient from './MapPageClient'

export default function MapPage() {
  return <MapPageClient zones={getAllZones()} />
}
