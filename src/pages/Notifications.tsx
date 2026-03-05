import { useApp } from '../lib/store'

const TYPE_CONFIG: Record<string, { icon: string; iconColor: string; iconBg: string }> = {
  streak: { icon: 'local_fire_department', iconColor: 'text-orange-500', iconBg: 'bg-orange-100' },
  approval: { icon: 'check_circle', iconColor: 'text-green-600', iconBg: 'bg-green-100' },
  redemption: { icon: 'redeem', iconColor: 'text-[#D35400]', iconBg: 'bg-[#D35400]/10' },
  wishlist: { icon: 'favorite', iconColor: 'text-pink-500', iconBg: 'bg-pink-100' },
}

function timeAgo(iso: string) {
  const now = new Date()
  const date = new Date(iso)
  const diffMs = now.getTime() - date.getTime()
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHrs < 1) return 'Just now'
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp()
  const unreadCount = notifications.filter((n) => !n.read).length
  const today = new Date()
  const todayNotifs = notifications.filter((n) => isSameDay(new Date(n.timestamp), today))
  const earlierNotifs = notifications.filter((n) => !isSameDay(new Date(n.timestamp), today))

  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-10 bg-[#FFFAF5]/90 backdrop-blur-md px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#D35400]/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#D35400]">notifications</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Motivate Me</h2>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllNotificationsRead} className="text-[#D35400] text-sm font-semibold">
              Mark all read
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-[#D35400] text-white text-xs font-bold px-2.5 py-1 rounded-full">{unreadCount}</span>
          )}
        </div>
      </header>

      <main className="px-6 mt-2 pb-4 space-y-6">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-outlined text-5xl text-slate-300">notifications_off</span>
            <p className="text-slate-400 font-medium">No notifications yet</p>
          </div>
        )}

        {todayNotifs.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Today</h3>
            <div className="space-y-3">
              {todayNotifs.map((notif) => {
                const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.streak
                return (
                  <button key={notif.id} onClick={() => markNotificationRead(notif.id)}
                    className={`w-full text-left bg-white p-4 rounded-2xl border flex items-start gap-4 transition-all ${notif.read ? 'border-slate-100' : 'border-[#D35400]/20 bg-[#D35400]/[0.02]'}`}>
                    <div className={`size-10 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <span className={`material-symbols-outlined ${config.iconColor}`}>{config.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 font-medium leading-snug">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{timeAgo(notif.timestamp)}</p>
                    </div>
                    {!notif.read && <div className="size-2.5 rounded-full bg-[#D35400] flex-shrink-0 mt-2" />}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {earlierNotifs.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Earlier</h3>
            <div className="space-y-3">
              {earlierNotifs.map((notif) => {
                const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.streak
                return (
                  <button key={notif.id} onClick={() => markNotificationRead(notif.id)}
                    className={`w-full text-left bg-white p-4 rounded-2xl border flex items-start gap-4 transition-all ${notif.read ? 'border-slate-100' : 'border-[#D35400]/20 bg-[#D35400]/[0.02]'}`}>
                    <div className={`size-10 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <span className={`material-symbols-outlined ${config.iconColor}`}>{config.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 font-medium leading-snug">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{timeAgo(notif.timestamp)}</p>
                    </div>
                    {!notif.read && <div className="size-2.5 rounded-full bg-[#D35400] flex-shrink-0 mt-2" />}
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
