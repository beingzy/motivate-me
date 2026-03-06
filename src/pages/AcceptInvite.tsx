import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { acceptMonitorInvite } from '../lib/monitors'
import { siteUrl } from '../lib/supabase'
import Login from './Login'

export default function AcceptInvite() {
  const { token } = useParams<{ token: string }>()
  const { user, loading, signUp, signInWithPassword } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'accepting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')

  // Inline signup state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signupError, setSignupError] = useState<string | null>(null)
  const [signingUp, setSigningUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  async function handleInviteSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || password.length < 6) return
    setSignupError(null)
    setSigningUp(true)

    const { error } = await signUp(email.trim(), password)
    if (error) {
      setSignupError(error)
      setSigningUp(false)
      return
    }

    // Try auto-sign-in immediately (works if email confirmation is disabled)
    const { error: signInErr } = await signInWithPassword(email.trim(), password)
    setSigningUp(false)

    if (signInErr) {
      // Email confirmation likely required — show message
      setNeedsConfirmation(true)
    }
    // If sign-in succeeded, user state will update and the accept UI will show
  }

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

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#FFFAF5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#D35400] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in
  if (!user) {
    // Needs email confirmation
    if (needsConfirmation) {
      return (
        <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-600 text-3xl">mark_email_read</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 text-sm">
              We sent a verification link to <strong>{email}</strong>. After confirming, come back to this invite link.
            </p>
            <button
              onClick={() => { setNeedsConfirmation(false); setAuthMode('login') }}
              className="mt-6 py-3 px-6 bg-[#D35400] text-white rounded-xl font-semibold text-sm"
            >
              Sign In Instead
            </button>
          </div>
        </div>
      )
    }

    // Login mode
    if (authMode === 'login') {
      return (
        <div>
          <div className="bg-[#D35400] text-white text-center px-6 py-4">
            <p className="text-sm font-medium">
              You've been invited to be an accountability monitor!
            </p>
            <p className="text-xs text-white/70 mt-1">Sign in to accept the invite.</p>
          </div>
          <Login onSwitchToSignUp={() => setAuthMode('signup')} />
        </div>
      )
    }

    // Simplified signup for invite flow
    const inviteRedirectUrl = `${siteUrl}/invite/${token}`
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Invite banner */}
          <div className="bg-[#D35400] text-white rounded-2xl p-5 mb-6 text-center">
            <span className="material-symbols-outlined text-3xl mb-2">supervisor_account</span>
            <p className="text-sm font-medium">You've been invited to be an accountability monitor!</p>
            <p className="text-xs text-white/70 mt-1">Create a quick account to accept.</p>
          </div>

          <form onSubmit={handleInviteSignUp} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D35400] focus:ring-2 focus:ring-[#D35400]/20 outline-none transition text-sm"
              />
            </div>

            <div>
              <label htmlFor="invite-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="invite-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D35400] focus:ring-2 focus:ring-[#D35400]/20 outline-none transition text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {password.length > 0 && password.length < 6 && (
                <p className="text-red-500 text-xs mt-1">Must be at least 6 characters</p>
              )}
            </div>

            {signupError && <p className="text-red-500 text-sm">{signupError}</p>}

            <input type="hidden" name="redirectTo" value={inviteRedirectUrl} />

            <button
              type="submit"
              disabled={signingUp || !email.trim() || password.length < 6}
              className="w-full py-3 bg-[#D35400] text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition"
            >
              {signingUp ? 'Creating account...' : 'Create Account & Accept'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <button onClick={() => setAuthMode('login')} className="text-[#D35400] font-semibold">
              Sign In
            </button>
          </p>
        </div>
      </div>
    )
  }

  // Logged in — success screen
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

  // Logged in — accept/decline
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
