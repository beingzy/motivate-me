import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../lib/auth'
import { AppProvider } from '../lib/store'
import RewardDetail from './RewardDetail'
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

function renderRewardDetail(id = 'r1') {
  return render(
    <MemoryRouter initialEntries={[`/rewards/${id}`]}>
      <AuthContext.Provider value={mockAuth}>
        <AppProvider>
          <Routes>
            <Route path="/rewards/:id" element={<RewardDetail />} />
          </Routes>
        </AppProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('RewardDetail', () => {
  it('renders reward title', () => {
    renderRewardDetail('r1')
    expect(screen.getByRole('heading', { name: 'Movie Night' })).toBeInTheDocument()
  })

  it('renders not found for invalid id', () => {
    renderRewardDetail('nonexistent')
    expect(screen.getByText('Reward not found')).toBeInTheDocument()
  })

  it('enables redeem for affordable reward', () => {
    renderRewardDetail('r1') // Movie Night costs 200, seed balance > 200
    expect(screen.getByRole('button', { name: /Redeem Now/i })).not.toBeDisabled()
  })

  it('disables redeem for expensive reward', () => {
    renderRewardDetail('r4') // Weekend Trip costs 2000
    expect(screen.getByRole('button', { name: /Not enough points/i })).toBeDisabled()
  })

  it('shows redeemed state after click', () => {
    renderRewardDetail('r1')
    fireEvent.click(screen.getByRole('button', { name: /Redeem Now/i }))
    expect(screen.getByText('Reward Redeemed!')).toBeInTheDocument()
  })

  it('renders go back button', () => {
    renderRewardDetail('r1')
    expect(screen.getByRole('button', { name: /Go back/i })).toBeInTheDocument()
  })
})
