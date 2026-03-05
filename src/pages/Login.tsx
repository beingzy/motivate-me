import { useState } from 'react'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { signInWithMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: err } = await signInWithMagicLink(email.trim())
    setSubmitting(false)

    if (err) {
      setError(err)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#D35400] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-white text-3xl">local_fire_department</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">Motivate Me</h1>
          <p className="text-gray-500 mt-1">Gamify your habits, earn rewards</p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <span className="material-symbols-outlined text-[#D35400] text-4xl mb-3 block">mark_email_read</span>
            <h2 className="text-lg font-semibold mb-2">Check your email</h2>
            <p className="text-gray-500 text-sm">
              We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="mt-4 text-[#D35400] text-sm font-medium"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D35400] focus:ring-2 focus:ring-[#D35400]/20 outline-none transition text-sm"
            />

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !email.trim()}
              className="w-full mt-4 py-3 bg-[#D35400] text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition"
            >
              {submitting ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
