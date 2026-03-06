import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useApp } from '../lib/store'
import { fetchProfile } from '../lib/profile'
import { getAvatarText, AVATAR_COLORS } from '../lib/avatar'

const isTestMode = import.meta.env.MODE === 'test'

export default function Dashboard() {
  const { user } = useAuth()
  const { habits, pointBalance, isLoggedToday, getStreak, getBestStreak, getWeeklyCount, todayLogs, notifications, logAction } = useApp()

  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null)
  const [profileDisplayName, setProfileDisplayName] = useState<string | null>(null)

  useEffect(() => {
    if (!user || isTestMode) return
    let active = true
    fetchProfile(user.id).then((p) => {
      if (!active || !p) return
      setProfileAvatarUrl(p.avatarUrl)
      setProfileDisplayName(p.displayName)
    }).catch(() => {})
    return () => { active = false }
  }, [user])

  const avatarColor = user?.user_metadata?.avatar_color ?? AVATAR_COLORS[0]
  const displayName = profileDisplayName ?? user?.user_metadata?.display_name ?? null
  const avatarText = getAvatarText(displayName, user?.email)

  const activeHabits = habits.filter((h) => h.isActive)
  const todayDone = activeHabits.filter((h) => isLoggedToday(h.id))
  const allDone = activeHabits.length > 0 && todayDone.length === activeHabits.length
  const todayPoints = todayLogs.reduce((sum, l) => sum + l.pointsAwarded, 0)
  const bestStreak = getBestStreak()
  const completionPct = activeHabits.length > 0 ? Math.round((todayDone.length / activeHabits.length) * 100) : 0
  const unreadCount = notifications.filter((n) => !n.read).length

  // Inline logging state
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null)
  const [inlineNote, setInlineNote] = useState('')
  const [inlinePhoto, setInlinePhoto] = useState<string | null>(null)
  const [justLogged, setJustLogged] = useState<string | null>(null)

  function toggleExpand(habitId: string) {
    if (expandedHabitId === habitId) {
      setExpandedHabitId(null)
    } else {
      setExpandedHabitId(habitId)
      setInlineNote('')
      setInlinePhoto(null)
    }
  }

  function handleInlineLog(habitId: string) {
    logAction(habitId, inlineNote.trim() || undefined, inlinePhoto ?? undefined)
    setExpandedHabitId(null)
    setInlineNote('')
    setInlinePhoto(null)
    setJustLogged(habitId)
    setTimeout(() => setJustLogged(null), 1500)
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setInlinePhoto(URL.createObjectURL(file))
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          {profileAvatarUrl ? (
            <img src={profileAvatarUrl} alt="Avatar" className="size-12 rounded-2xl object-cover border-2 border-slate-100" />
          ) : (
            <div className="size-12 rounded-2xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: avatarColor }}>
              {avatarText}
            </div>
          )}
          <div>
            <p className="text-slate-500 text-xs font-medium">Welcome back,</p>
            <h1 className="text-lg font-bold">{displayName ?? 'Motivator'}</h1>
          </div>
        </div>
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="size-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 relative"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 bg-[#D35400] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>
      </header>

      <main className="flex-1 px-6 space-y-6">
        {/* Points Hero Card */}
        <section
          className="relative overflow-hidden rounded-2xl bg-[#D35400] p-8 text-white custom-shadow"
          aria-label="Point balance"
        >
          <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-10 -bottom-10 size-32 bg-[#FFB800]/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Total Balance</p>
                <h2 className="text-6xl font-bold mt-1 tracking-tight" aria-live="polite">
                  {pointBalance.toLocaleString()}
                </h2>
                {todayPoints > 0 && (
                  <p className="text-[#FFB800] text-sm font-semibold mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    +{todayPoints} pts today
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-white/70 text-xs">
                {todayDone.length} of {activeHabits.length} done today
              </div>
              <Link
                to="/rewards"
                className="bg-[#FFB800] text-slate-900 px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Claim Rewards
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100">
            <div className="size-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
              <span className="material-symbols-outlined">local_fire_department</span>
            </div>
            <p className="text-slate-500 text-xs font-medium">Best Streak</p>
            <p className="text-xl font-bold">{bestStreak} Days</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100">
            <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
            <p className="text-slate-500 text-xs font-medium">Today</p>
            <p className="text-xl font-bold">{completionPct}%</p>
          </div>
        </section>

        {/* Celebration Banner */}
        {allDone && (
          <div className="bg-green-500 text-white rounded-2xl p-4 text-center font-bold animate-pulse">
            All done today! +{todayPoints} pts earned
          </div>
        )}

        {/* Today's Habits */}
        <section className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">Today's Habits</h3>
            <Link to="/habits" className="text-[#D35400] text-sm font-semibold">
              View All
            </Link>
          </div>

          {activeHabits.length === 0 && (
            <div className="flex flex-col items-center py-12 gap-4">
              <span className="material-symbols-outlined text-5xl text-slate-200">bolt</span>
              <p className="text-slate-400 text-sm">No habits yet. Create your first one!</p>
              <Link
                to="/habits/new"
                className="bg-[#D35400] text-white px-6 py-3 rounded-full text-sm font-semibold"
              >
                Create Habit
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {activeHabits.map((habit) => {
              const done = isLoggedToday(habit.id)
              const streak = getStreak(habit.id)
              const weeklyTarget = habit.frequencyTarget === 'daily' ? 7 : habit.frequencyTarget === 'custom' ? (habit.frequencyCount ?? 0) : 0
              const weeklyDone = weeklyTarget > 0 ? getWeeklyCount(habit.id) : 0
              const weeklyPct = weeklyTarget > 0 ? Math.min(100, Math.round((weeklyDone / weeklyTarget) * 100)) : 0
              const isExpanded = expandedHabitId === habit.id
              const wasJustLogged = justLogged === habit.id
              const needsPhoto = habit.requiresPhoto
              const canSubmit = !needsPhoto || inlinePhoto

              return (
                <div
                  key={habit.id}
                  className={`bg-white rounded-2xl border transition-all ${
                    isExpanded ? 'border-[#D35400]/30 shadow-md' : 'border-slate-100 hover:border-[#D35400]/30'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      {done ? (
                        <div className="size-7 rounded-lg bg-[#D35400] flex items-center justify-center text-white flex-shrink-0">
                          <span className="material-symbols-outlined text-sm">check</span>
                        </div>
                      ) : (
                        <button
                          data-testid={`habit-check-${habit.id}`}
                          onClick={() => toggleExpand(habit.id)}
                          className={`size-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isExpanded ? 'border-[#D35400] bg-[#D35400]/10 text-[#D35400]' : 'border-slate-200 text-transparent hover:border-[#D35400]/40'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">check</span>
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold text-slate-800 truncate ${
                            done ? 'line-through opacity-50' : ''
                          }`}
                        >
                          {habit.name}
                        </h4>
                        <p className="text-xs text-slate-500">{habit.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {wasJustLogged ? (
                          <span className="text-[10px] font-bold text-green-600 px-2 py-0.5 bg-green-50 rounded-full animate-bounce">
                            +{habit.pointsPerCompletion} pts
                          </span>
                        ) : done ? (
                          <span className="material-symbols-outlined text-[#D35400] text-lg">verified</span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#FFB800] px-2 py-0.5 bg-[#FFB800]/10 rounded-full">
                            +{habit.pointsPerCompletion} pts
                          </span>
                        )}
                        {habit.requiresApproval && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5" title="Requires monitor approval">
                            <span className="material-symbols-outlined text-xs text-amber-500">lock</span>
                            Approval
                          </span>
                        )}
                        {streak > 0 && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs text-orange-400">local_fire_department</span>
                            {streak}d
                          </span>
                        )}
                      </div>
                    </div>
                    {weeklyTarget > 0 && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${weeklyPct >= 100 ? 'bg-green-500' : 'bg-[#D35400]'}`}
                            style={{ width: `${weeklyPct}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-semibold whitespace-nowrap ${weeklyPct >= 100 ? 'text-green-600' : 'text-slate-400'}`}>
                          {weeklyDone}/{weeklyTarget} this week
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Inline logging panel */}
                  {isExpanded && !done && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
                      {/* Photo upload (if required) */}
                      {needsPhoto && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Photo</span>
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
                          </div>
                          {inlinePhoto ? (
                            <div className="relative rounded-xl overflow-hidden">
                              <img src={inlinePhoto} alt="Upload preview" className="w-full h-32 object-cover" />
                              <button
                                onClick={() => setInlinePhoto(null)}
                                aria-label="Remove photo"
                                className="absolute top-2 right-2 size-7 rounded-full bg-black/50 text-white flex items-center justify-center"
                              >
                                <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 cursor-pointer hover:border-[#D35400]/30 transition-colors">
                              <span className="material-symbols-outlined text-slate-400">photo_camera</span>
                              <span className="text-sm font-medium text-slate-400">Add photo</span>
                              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" aria-label="Upload photo" />
                            </label>
                          )}
                        </div>
                      )}

                      {/* Note */}
                      <textarea
                        value={inlineNote}
                        onChange={(e) => setInlineNote(e.target.value)}
                        placeholder="How did it go?"
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D35400]/20 focus:border-[#D35400]/30 resize-none"
                      />

                      {/* Points + Submit */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#FFB800] text-lg">stars</span>
                          <span className="text-sm font-bold text-[#FFB800]">+{habit.pointsPerCompletion} pts</span>
                        </div>
                        <button
                          onClick={() => handleInlineLog(habit.id)}
                          disabled={!canSubmit}
                          className="px-6 py-2.5 bg-[#D35400] text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-[#B84700] active:scale-[0.97] transition-all flex items-center gap-1.5"
                          style={{ boxShadow: canSubmit ? '0 4px 12px rgba(211,84,0,0.3)' : 'none' }}
                        >
                          Log It
                          <span className="material-symbols-outlined text-base">check</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* History link */}
        <div className="pb-4">
          <Link
            to="/history"
            className="flex items-center justify-center gap-2 text-sm text-slate-400 font-medium py-3"
          >
            <span className="material-symbols-outlined text-lg">history</span>
            View Activity History
          </Link>
        </div>
      </main>
    </div>
  )
}
