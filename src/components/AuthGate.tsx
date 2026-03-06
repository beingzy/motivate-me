import { useState } from 'react'
import { useAuth } from '../lib/auth'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#D35400] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    if (mode === 'signup') {
      return <SignUp onSwitchToLogin={() => setMode('login')} />
    }
    return <Login onSwitchToSignUp={() => setMode('signup')} />
  }

  return <>{children}</>
}
