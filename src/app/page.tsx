import { getMeta } from '@/lib/zones'
import SplashClient from './SplashClient'

export default function SplashPage() {
  return <SplashClient year={getMeta().year} />
}
