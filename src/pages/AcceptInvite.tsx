import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { acceptMonitorInvite } from '../lib/monitors'

export default function AcceptInvite() {
  const { token } = useParams<{ token: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'accepting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleAccept() {
    if (!user || !token) return
    setStatus('accepting')

    const result = await acceptMonitorInvite(token, user.id)

    if (result.success) {
      setStatus('success')
      setTimeout(() => navigate('/monitors'), 2000)
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-dvh bg-[#FFFAF5] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Connected!</h1>
        <p className="text-slate-500">You are now monitoring this user. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#FFFAF5] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-[#D35400]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[#D35400] text-3xl">supervisor_account</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Monitor Invite</h1>
        <p className="text-slate-500 mb-6">
          Someone wants you to be their accountability monitor. Accept to view their habits and progress.
        </p>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-sm text-red-600">{errorMsg}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            disabled={status === 'accepting'}
            className="w-full py-3 bg-[#D35400] text-white rounded-xl font-semibold text-sm disabled:opacity-50"
          >
            {status === 'accepting' ? 'Accepting...' : 'Accept Invite'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
