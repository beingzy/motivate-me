import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../lib/store'

type RewardType = 'offline' | 'online'

export default function CreateReward() {
  const navigate = useNavigate()
  const { createReward } = useApp()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<RewardType>('offline')
  const [pointCost, setPointCost] = useState(500)
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [requiresApproval, setRequiresApproval] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || pointCost < 1) return
    if (type === 'online' && !url.trim()) return
    createReward({
      title: title.trim(),
      type,
      pointCost,
      description: description.trim() || undefined,
      url: type === 'online' ? url.trim() : undefined,
      requiresApproval,
      status: 'available',
    })
    navigate('/rewards')
  }

  const canSubmit = title.trim() && pointCost >= 1 && (type !== 'online' || url.trim())

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
          <h2 className="text-slate-900 text-3xl font-bold tracking-tight">Create Reward</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-8 mt-8 space-y-7">
          <div className="space-y-2">
            <label htmlFor="reward-title" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Reward Title</label>
            <input id="reward-title" type="text" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekend Trip"
              className="w-full bg-transparent border-none p-0 text-3xl font-bold text-slate-900 placeholder:text-slate-200 focus:ring-0 focus:outline-none" />
            <div className="h-px w-full bg-slate-100" />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Reward Type</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'offline' as RewardType, icon: 'photo_camera', label: 'Offline', desc: 'Physical item or experience' },
                { value: 'online' as RewardType, icon: 'link', label: 'Online', desc: 'URL link to product' },
              ]).map((opt) => (
                <button key={opt.value} type="button" onClick={() => setType(opt.value)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${type === opt.value ? 'border-[#D35400] bg-[#D35400]/5' : 'border-slate-100 bg-white'}`}>
                  <div className={`size-12 rounded-xl flex items-center justify-center ${type === opt.value ? 'bg-[#D35400]/10' : 'bg-slate-100'}`}>
                    <span className={`material-symbols-outlined text-xl ${type === opt.value ? 'text-[#D35400]' : 'text-slate-400'}`}>{opt.icon}</span>
                  </div>
                  <span className={`text-sm font-semibold ${type === opt.value ? 'text-[#D35400]' : 'text-slate-700'}`}>{opt.label}</span>
                  <span className="text-[11px] text-slate-400 text-center">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {type === 'online' && (
            <div className="space-y-2">
              <label htmlFor="reward-url" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">URL</label>
              <input id="reward-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/product"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D35400]/20 focus:border-[#D35400]/30" />
            </div>
          )}

          <div className="flex items-center justify-between p-5 bg-[#FFFAF5] rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="size-12 flex items-center justify-center bg-[#FFB800]/10 rounded-xl">
                <span className="material-symbols-outlined text-[#FFB800] text-2xl">stars</span>
              </div>
              <div>
                <p className="text-slate-900 font-bold">Point Cost</p>
                <p className="text-slate-500 text-sm">Points to redeem</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setPointCost((p) => Math.max(1, p - 100))} aria-label="Decrease cost"
                className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-xl">remove</span>
              </button>
              <span aria-live="polite" aria-label={`${pointCost} points`} className="text-2xl font-bold text-slate-900 min-w-[3ch] text-center">{pointCost}</span>
              <button type="button" onClick={() => setPointCost((p) => p + 100)} aria-label="Increase cost"
                className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-xl">add</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="reward-desc" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description (optional)</label>
            <textarea id="reward-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this reward..." rows={3}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D35400]/20 focus:border-[#D35400]/30 resize-none" />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="size-10 flex items-center justify-center bg-slate-100 rounded-lg">
                <span className="material-symbols-outlined text-slate-500">how_to_reg</span>
              </div>
              <label htmlFor="reward-approval" className="text-slate-900 font-medium cursor-pointer">Requires Monitor Approval</label>
            </div>
            <button id="reward-approval" type="button" role="switch" aria-checked={requiresApproval} onClick={() => setRequiresApproval(!requiresApproval)}
              className={`relative w-12 h-6 rounded-full transition-colors ${requiresApproval ? 'bg-[#D35400]' : 'bg-slate-200'}`}>
              <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${requiresApproval ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={!canSubmit}
              className="w-full bg-[#D35400] py-5 rounded-2xl text-white font-bold text-lg disabled:opacity-40 hover:bg-[#B84700] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{ boxShadow: canSubmit ? '0 8px 24px rgba(211,84,0,0.3)' : 'none' }}>
              <span>Create Reward</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </form>

        <div className="flex justify-center mt-8">
          <div className="h-1.5 w-32 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  )
}
