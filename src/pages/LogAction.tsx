import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../lib/store'

export default function LogAction() {
  const navigate = useNavigate()
  const { habits, logAction, isLoggedToday } = useApp()
  const activeHabits = habits.filter((h) => h.isActive)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const selected = activeHabits.find((h) => h.id === selectedId)
  const needsPhoto = selected?.requiresPhoto ?? false
  const alreadyLogged = selected ? isLoggedToday(selected.id) : false

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const canSubmit = selected && !alreadyLogged && (!needsPhoto || photoPreview)

  const handleSubmit = () => {
    if (!canSubmit || !selected) return
    logAction(selected.id, note.trim() || undefined, photoPreview ?? undefined)
    setSubmitted(true)
  }

  if (submitted && selected) {
    return (
      <div className="relative w-full min-h-dvh bg-slate-200 flex flex-col justify-end">
        <div className="absolute inset-0 p-6 opacity-40 pointer-events-none">
          <div className="space-y-4 mt-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 w-full rounded-xl bg-white/80" />
            ))}
          </div>
        </div>
        <div className="relative w-full bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.12)] flex flex-col items-center pt-2 pb-10">
          <div className="flex justify-center py-3">
            <div className="h-1.5 w-12 rounded-full bg-slate-200" />
          </div>
          <div className="flex flex-col items-center gap-4 px-8 pt-8 pb-4">
            <div className="size-20 rounded-full bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Habit Logged!</h2>
            <div className="flex items-center gap-2 bg-[#FFB800]/10 px-5 py-2.5 rounded-full">
              <span className="material-symbols-outlined text-[#FFB800]">stars</span>
              <span className="text-lg font-bold text-[#FFB800]">+{selected.pointsPerCompletion} pts</span>
            </div>
            {selected.requiresApproval && (
              <p className="text-sm text-amber-600 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Pending monitor approval
              </p>
            )}
            <button
              onClick={() => navigate('/')}
              className="w-full mt-4 bg-[#D35400] py-5 rounded-2xl text-white font-bold text-lg hover:bg-[#B84700] active:scale-[0.98] transition-all"
              style={{ boxShadow: '0 8px 24px rgba(211,84,0,0.3)' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
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
            <span className="text-[#D35400] font-semibold text-sm tracking-wider uppercase">Motivate Me</span>
            <button onClick={() => navigate(-1)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <h2 className="text-slate-900 text-3xl font-bold tracking-tight">Log a Habit</h2>
        </div>

        <div className="px-8 mt-6 space-y-6">
          {/* Habit Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select Habit</label>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-8 px-8 scrollbar-hide">
              {activeHabits.map((habit) => {
                const isSelected = selectedId === habit.id
                const done = isLoggedToday(habit.id)
                return (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => setSelectedId(habit.id)}
                    className={`flex-shrink-0 flex flex-col items-start gap-2 p-4 rounded-2xl border-2 transition-all w-36 ${
                      done
                        ? 'border-green-200 bg-green-50 opacity-60'
                        : isSelected
                          ? 'border-[#D35400] bg-[#D35400]/5'
                          : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className={`size-10 rounded-xl flex items-center justify-center ${done ? 'bg-green-100' : isSelected ? 'bg-[#D35400]/10' : 'bg-slate-100'}`}>
                      <span className={`material-symbols-outlined ${done ? 'text-green-600' : isSelected ? 'text-[#D35400]' : 'text-slate-400'}`}>
                        {done ? 'check_circle' : 'bolt'}
                      </span>
                    </div>
                    <span className={`text-sm font-semibold leading-tight text-left ${done ? 'text-green-700' : isSelected ? 'text-[#D35400]' : 'text-slate-700'}`}>
                      {habit.name}
                    </span>
                    <span className={`text-xs font-bold ${done ? 'text-green-500' : isSelected ? 'text-[#FFB800]' : 'text-slate-400'}`}>
                      {done ? 'Done' : `+${habit.pointsPerCompletion} pts`}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {alreadyLogged && selected && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-green-700 font-medium">Already logged today!</p>
            </div>
          )}

          {/* Photo Upload */}
          {selected && !alreadyLogged && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Photo</label>
                {needsPhoto && (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
                )}
              </div>
              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden">
                  <img src={photoPreview} alt="Upload preview" className="w-full h-48 object-cover" />
                  <button onClick={() => setPhotoPreview(null)} aria-label="Remove photo" className="absolute top-3 right-3 size-8 rounded-full bg-black/50 text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 h-36 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 cursor-pointer hover:border-[#D35400]/30 hover:bg-[#D35400]/5 transition-colors">
                  <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-2xl">photo_camera</span>
                  </div>
                  <span className="text-sm font-medium text-slate-400">Tap to add photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" aria-label="Upload photo" />
                </label>
              )}
            </div>
          )}

          {/* Note */}
          {selected && !alreadyLogged && (
            <div className="space-y-3">
              <label htmlFor="log-note" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Note (optional)</label>
              <textarea
                id="log-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How did it go?"
                rows={3}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D35400]/20 focus:border-[#D35400]/30 resize-none"
              />
            </div>
          )}

          {/* Points Preview */}
          {selected && !alreadyLogged && (
            <div className="flex items-center justify-center gap-2 py-3 bg-[#FFB800]/10 rounded-2xl">
              <span className="material-symbols-outlined text-[#FFB800]">stars</span>
              <span className="text-lg font-bold text-[#FFB800]">Earn +{selected.pointsPerCompletion} pts</span>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-[#D35400] py-5 rounded-2xl text-white font-bold text-lg disabled:opacity-40 hover:bg-[#B84700] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            style={{ boxShadow: canSubmit ? '0 8px 24px rgba(211,84,0,0.3)' : 'none' }}
          >
            <span>Log It</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <div className="h-1.5 w-32 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  )
}
