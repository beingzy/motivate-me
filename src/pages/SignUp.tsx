import { useState } from 'react'
import { useAuth } from '../lib/auth'

export default function SignUp({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword
  const passwordTooShort = password.length > 0 && password.length < 6

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)
    const { error: err } = await signUp(email.trim(), password)
    setSubmitting(false)

    if (err) {
      setError(err)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-600 text-3xl">mark_email_read</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
          <p className="text-gray-500 text-sm">
            We sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="mt-6 py-3 px-6 bg-[#D35400] text-white rounded-xl font-semibold text-sm"
          >
            Back to Sign In
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
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-1">Start building better habits</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D35400] focus:ring-2 focus:ring-[#D35400]/20 outline-none transition text-sm"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition text-sm pr-12 ${
                  passwordTooShort ? 'border-red-300 focus:border-red-400 focus:ring-red-200/50' : 'border-gray-200 focus:border-[#D35400] focus:ring-[#D35400]/20'
                } focus:ring-2`}
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
            {passwordTooShort && (
              <p className="text-red-500 text-xs mt-1">Must be at least 6 characters</p>
            )}
          </div>

          <div>
            <label htmlFor="signup-confirm" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="signup-confirm"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition text-sm ${
                passwordMismatch ? 'border-red-300 focus:border-red-400 focus:ring-red-200/50' : 'border-gray-200 focus:border-[#D35400] focus:ring-[#D35400]/20'
              } focus:ring-2`}
            />
            {passwordMismatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !email.trim() || !password || !confirmPassword || passwordMismatch || passwordTooShort}
            className="w-full py-3 bg-[#D35400] text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-[#D35400] font-semibold">
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
