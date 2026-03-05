import { Outlet } from 'react-router-dom'
import { useApp } from '../../lib/store'
import BottomNav from './BottomNav'

export default function AppShell() {
  const { loading } = useApp()

  return (
    <div className="max-w-md mx-auto min-h-dvh flex flex-col relative bg-[#FFFAF5]">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#D35400] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 pb-32">
          <Outlet />
        </div>
      )}
      <BottomNav />
    </div>
  )
}
