import HeaderBar from '@/components/HeaderBar'
import BottomTabs from '@/components/BottomTabs'

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderBar />
      {children}
      <BottomTabs />
    </>
  )
}
