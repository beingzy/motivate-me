import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../lib/auth'
import { AppProvider } from '../lib/store'
import MonitorDashboard from './MonitorDashboard'
import type { User } from '@supabase/supabase-js'

const mockAuth = {
  user: { id: 'test-user-id', email: 'test@example.com' } as User,
  session: null,
  loading: false,
  signUp: async () => ({ error: null }),
  signInWithPassword: async () => ({ error: null }),
  signInWithMagicLink: async () => ({ error: null }),
  changePassword: async () => ({ error: null }),
  signOut: async () => {},
}

function renderMonitorDashboard(userId = 'u1') {
  return render(
    <MemoryRouter initialEntries={[`/monitor/${userId}`]}>
      <AuthContext.Provider value={mockAuth}>
        <AppProvider>
          <Routes>
            <Route path="/monitor/:userId" element={<MonitorDashboard />} />
          </Routes>
        </AppProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('MonitorDashboard', () => {
  it('renders monitored user name', () => {
    renderMonitorDashboard()
    expect(screen.getByText('Casey Lee')).toBeInTheDocument()
  })

  it('renders not found for invalid user', () => {
    renderMonitorDashboard('invalid')
    expect(screen.getByText('User not found')).toBeInTheDocument()
  })

  it('renders pending approvals', () => {
    renderMonitorDashboard()
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument()
    expect(screen.getByText('Weekend Trip')).toBeInTheDocument()
  })

  it('renders approve/reject buttons', () => {
    renderMonitorDashboard()
    expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument()
  })

  it('renders recent activity', () => {
    renderMonitorDashboard()
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it('renders back button', () => {
    renderMonitorDashboard()
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument()
  })
})
