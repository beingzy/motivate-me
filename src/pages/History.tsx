import { useApp } from '../lib/store'

const STATUS_CONFIG = {
  self_approved: { label: 'Self Approved', color: 'text-blue-600 bg-blue-50' },
  approved: { label: 'Approved', color: 'text-green-600 bg-green-50' },
  pending_approval: { label: 'Pending', color: 'text-amber-600 bg-amber-50' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function History() {
  const { actionLogs, habits } = useApp()

  const habitMap = new Map(habits.map((h) => [h.id, h]))

  // Group by date
  const grouped: Record<string, typeof actionLogs> = {}
  for (const log of actionLogs) {
    const key = formatDate(log.loggedAt)
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(log)
  }

  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-10 bg-[#FFFAF5]/90 backdrop-blur-md px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#D35400]/10 p-2 rounded-lg">
            <span className="material-symbols-outlined text-[#D35400]">history</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">Motivate Me</h2>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Activity</h1>
      </header>

      <main className="px-6 mt-2 pb-4 space-y-6">
        {actionLogs.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-4">
            <span className="material-symbols-outlined text-5xl text-slate-200">history</span>
            <p className="text-slate-400 text-sm">No activity yet. Log a habit to get started!</p>
          </div>
        )}

        {Object.entries(grouped).map(([date, entries]) => (
          <section key={date}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">{date}</h3>
            <div className="space-y-3">
              {entries.map((entry) => {
                const habit = habitMap.get(entry.habitId)
                const status = STATUS_CONFIG[entry.status]
                return (
                  <div key={entry.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-[#D35400]/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#D35400]">bolt</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-sm truncate">{habit?.name ?? 'Unknown Habit'}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{formatTime(entry.loggedAt)}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${status.color}`}>{status.label}</span>
                      </div>
                      {entry.note && <p className="text-xs text-slate-400 mt-1 truncate">{entry.note}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {entry.pointsAwarded > 0 ? (
                        <span className="text-sm font-bold text-[#FFB800] flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-sm">stars</span>+{entry.pointsAwarded}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">--</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
