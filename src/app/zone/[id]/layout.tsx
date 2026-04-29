import HeaderBar from '@/components/HeaderBar'

export default function ZoneLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderBar />
      {children}
    </>
  )
}
