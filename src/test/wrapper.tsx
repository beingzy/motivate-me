import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../lib/auth'
import { AppProvider } from '../lib/store'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'

const mockUser = { id: 'test-user-id', email: 'test@example.com' } as User

const mockAuth = {
  user: mockUser,
  session: null,
  loading: false,
  signUp: async () => ({ error: null }),
  signInWithPassword: async () => ({ error: null }),
  signInWithMagicLink: async () => ({ error: null }),
  changePassword: async () => ({ error: null }),
  signOut: async () => {},
}

export function TestWrapper({ children, initialPath = '/' }: { children: ReactNode; initialPath?: string }) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthContext.Provider value={mockAuth}>
        <AppProvider>{children}</AppProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}
