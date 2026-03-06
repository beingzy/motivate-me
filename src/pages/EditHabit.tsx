import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useApp } from '../lib/store'
import { getMyMonitors } from '../lib/monitors'
import type { MonitorConnection } from '../types'

const isTestMode = import.meta.env.MODE === 'test'

export default function EditHabit() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { habits, updateHabit, archiveHabit } = useApp()
  const habit = habits.find((h) => h.id === id)

  const [name, setName] = useState(habit?.name ?? '')
  const [description, setDescription] = useState(habit?.description ?? '')
  const [points, setPoints] = useState(habit?.pointsPerCompletion ?? 10)
  const [requiresPhoto, setRequiresPhoto] = useState(habit?.requiresPhoto ?? false)
  const [requiresApproval, setRequiresApproval] = useState(habit?.requiresApproval ?? false)
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
  const [monitors, setMonitors] = useState<MonitorConnection[]>([])
  const [selectedMonitorIds, setSelectedMonitorIds] = useState<string[]>(habit?.approverMonitorIds ?? [])

  useEffect(() => {
    if (!user || isTestMode) return
    let active = true
    getMyMonitors(user.id).then((m) => {
      if (active) setMonitors(m)
    }).catch(() => {})
    return () => { active = false }
  }, [user])

  const hasMonitors = monitors.length > 0

  function toggleMonitorSelection(monitorId: string) {
    setSelectedMonitorIds((prev) =>
      prev.includes(monitorId) ? prev.filter((id2) => id2 !== monitorId) : [...prev, monitorId]
    )
  }

  function handleApprovalToggle(checked: boolean) {
    setRequiresApproval(checked)
    if (checked && monitors.length === 1) {
      setSelectedMonitorIds([monitors[0].monitorUserId])
    } else if (!checked) {
      setSelectedMonitorIds([])
    }
  }

  if (!habit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-4 px-6">
        <span className="material-symbols-outlined text-5xl text-slate-300">error</span>
        <p className="text-slate-500 font-medium">Habit not found</p>
        <button
          onClick={() => navigate('/habits')}
          className="bg-[#D35400] text-white px-6 py-3 rounded-full text-sm font-semibold"
        >
          Back to Habits
        </button>
      </div>
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    updateHabit(habit.id, {
      name: name.trim(),
      description: description.trim() || undefined,
      pointsPerCompletion: points,
      requiresPhoto,
      requiresApproval: hasMonitors ? requiresApproval : habit.requiresApproval,
      approverMonitorIds: requiresApproval && selectedMonitorIds.length > 0 ? selectedMonitorIds : undefined,
    })
    navigate('/habits')
  }

  const handleArchive = () => {
    archiveHabit(habit.id)
    navigate('/habits')
  }

  return (
    <div className="relative w-full min-h-dvh bg-slate-200 flex flex-col justify-end">
      <div className="absolute inset-0 p-6 opacity-40 pointer-events-none">
        <div className="space-y-4 mt-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full rounded-xl bg-white/80" />
          ))}
        </div>
      </div>

      <div className="relative w-full bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.12)] flex flex-col pt-2 pb-10">
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-slate-200" />
        </div>

        <div className="px-8 pt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[#D35400] font-semibold text-sm tracking-wider uppercase">
              Motivate Me
            </span>
            <button
              onClick={() => navigate(-1)}
              aria-label="Close"
              className="text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <h2 className="text-slate-900 text-3xl font-bold tracking-tight">Edit Habit</h2>
        </div>

        <form onSubmit={handleSave} className="px-8 mt-8 space-y-8">
          <div className="space-y-2">
            <label htmlFor="habit-name" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Habit Title
            </label>
            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Morning Run"
              className="w-full bg-transparent border-none p-0 text-3xl font-bold text-slate-900 placeholder:text-slate-200 focus:ring-0 focus:outline-none"
            />
            <div className="h-px w-full bg-slate-100" />
          </div>

          <div className="space-y-2">
            <label htmlFor="habit-desc" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Description (optional)
            </label>
            <textarea
              id="habit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D35400]/20 focus:border-[#D35400]/30 resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-5 bg-[#FFFAF5] rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="size-12 flex items-center justify-center bg-[#D35400]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#D35400] text-2xl">stars</span>
              </div>
              <div>
                <p className="text-slate-900 font-bold">Goal Points</p>
                <p className="text-slate-500 text-sm">Reward per completion</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPoints((p) => Math.max(1, p - 1))}
                aria-label="Decrease points"
                className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-xl">remove</span>
              </button>
              <input
                type="text"
                inputMode="numeric"
                aria-live="polite"
                aria-label="Points per completion"
                value={points}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10)
                  if (!isNaN(v) && v >= 1) setPoints(v)
                  else if (e.target.value === '') setPoints(1)
                }}
                onFocus={(e) => e.target.select()}
                className="w-16 text-center text-2xl font-bold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setPoints((p) => p + 1)}
                aria-label="Increase points"
                className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-xl">add</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <Toggle id="requires-photo" icon="photo_camera" label="Requires Photo Proof" checked={requiresPhoto} onChange={setRequiresPhoto} />
            <div>
              <Toggle
                id="requires-approval"
                icon="how_to_reg"
                label="Requires Monitor Approval"
                checked={requiresApproval}
                onChange={handleApprovalToggle}
                disabled={!hasMonitors && !requiresApproval}
              />
            </div>

            {/* Monitor Picker — shown when approval is on and >1 monitor */}
            {requiresApproval && monitors.length > 1 && (
              <div className="ml-14 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Approvers</p>
                <div className="space-y-2">
                  {monitors.map((mon) => {
                    const selected = selectedMonitorIds.includes(mon.monitorUserId)
                    const label = mon.monitorEmail ?? mon.monitorUserId.slice(0, 8)
                    return (
                      <button
                        key={mon.id}
                        type="button"
                        onClick={() => toggleMonitorSelection(mon.monitorUserId)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          selected ? 'border-[#D35400] bg-[#D35400]/5' : 'border-slate-100 bg-white'
                        }`}
                      >
                        <div className={`size-6 rounded-md flex items-center justify-center ${
                          selected ? 'bg-[#D35400] text-white' : 'bg-slate-100'
                        }`}>
                          {selected && <span className="material-symbols-outlined text-sm">check</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${selected ? 'text-[#D35400]' : 'text-slate-700'}`}>
                            {label}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {selectedMonitorIds.length === 0 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    Select at least one approver
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!name.trim() || (requiresApproval && monitors.length > 1 && selectedMonitorIds.length === 0)}
              className="w-full bg-[#D35400] py-5 rounded-2xl text-white font-bold text-lg disabled:opacity-40 hover:bg-[#B84700] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{ boxShadow: '0 8px 24px rgba(211,84,0,0.3)' }}
            >
              <span>Save Changes</span>
              <span className="material-symbols-outlined text-xl">check</span>
            </button>
          </div>

          <div className="pt-0">
            {!showArchiveConfirm ? (
              <button
                type="button"
                onClick={() => setShowArchiveConfirm(true)}
                className="w-full py-4 text-red-500 font-semibold text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">archive</span>
                Archive this habit
              </button>
            ) : (
              <div className="bg-red-50 rounded-2xl p-5 space-y-3">
                <p className="text-sm text-red-700 font-medium text-center">
                  Archive this habit? It won't appear in your daily list.
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowArchiveConfirm(false)} className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm">Cancel</button>
                  <button type="button" onClick={handleArchive} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm">Archive</button>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="flex justify-center mt-6">
          <div className="h-1.5 w-32 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

interface ToggleProps { id: string; icon: string; label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }

function Toggle({ id, icon, label, checked, onChange, disabled }: ToggleProps) {
  return (
    <div className={`flex items-center justify-between py-2 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="size-10 flex items-center justify-center bg-slate-100 rounded-lg">
          <span className="material-symbols-outlined text-slate-500">{icon}</span>
        </div>
        <label htmlFor={id} className="text-slate-900 font-medium cursor-pointer">{label}</label>
      </div>
      <button id={id} type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => !disabled && onChange(!checked)} className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-[#D35400]' : 'bg-slate-200'} ${disabled ? 'cursor-not-allowed' : ''}`}>
        <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}
