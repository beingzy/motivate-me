import { useState } from 'react'
import { useAuth } from '../lib/auth'

export default function Login({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const { signInWithPassword, signInWithMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: err } = await signInWithPassword(email.trim(), password)
    setSubmitting(false)

    if (err) {
      setError(err)
    }
  }

  async function handleMagicLink() {
    if (!email.trim()) {
      setError('Enter your email first')
      return
    }
    setError(null)
    setSubmitting(true)
    const { error: err } = await signInWithMagicLink(email.trim())
    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      setMagicLinkSent(true)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#D35400] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-white text-3xl">mark_email_read</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
            <p className="text-gray-500 mt-2 text-sm">
              We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
            </p>
          </div>
          <button
            onClick={() => { setMagicLinkSent(false); setEmail('') }}
            className="w-full py-3 text-[#D35400] font-semibold text-sm"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#D35400] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-white text-3xl">local_fire_department</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D35400] focus:ring-2 focus:ring-[#D35400]/20 outline-none transition text-sm"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !email.trim() || !password}
            className="w-full py-3 bg-[#D35400] text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMagicLink}
            disabled={submitting}
            className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            Send Magic Link
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="text-[#D35400] font-semibold">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
