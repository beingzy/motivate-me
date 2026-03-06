import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../lib/auth'
import AcceptInvite from './AcceptInvite'
import type { User } from '@supabase/supabase-js'

vi.mock('../lib/monitors', () => ({
  acceptMonitorInvite: vi.fn().mockResolvedValue({ success: true }),
}))

const loggedInAuth = {
  user: { id: 'monitor-user-id', email: 'monitor@example.com' } as User | null,
  session: null,
  loading: false,
  signUp: vi.fn().mockResolvedValue({ error: null }),
  signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
  signInWithMagicLink: vi.fn().mockResolvedValue({ error: null }),
  changePassword: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn(),
}

const loggedOutAuth = {
  ...loggedInAuth,
  user: null as User | null,
}

function renderAcceptInvite(auth = loggedInAuth) {
  return render(
    <MemoryRouter initialEntries={['/invite/abc123']}>
      <AuthContext.Provider value={auth}>
        <Routes>
          <Route path="/invite/:token" element={<AcceptInvite />} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('AcceptInvite', () => {
  it('renders invite acceptance page when logged in', () => {
    renderAcceptInvite()
    expect(screen.getByRole('heading', { name: /Monitor Invite/i })).toBeInTheDocument()
  })

  it('shows accept and decline buttons when logged in', () => {
    renderAcceptInvite()
    expect(screen.getByRole('button', { name: /Accept Invite/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Decline/i })).toBeInTheDocument()
  })

  it('calls acceptMonitorInvite on accept click', async () => {
    const { acceptMonitorInvite } = await import('../lib/monitors')
    renderAcceptInvite()

    fireEvent.click(screen.getByRole('button', { name: /Accept Invite/i }))

    await waitFor(() => {
      expect(acceptMonitorInvite).toHaveBeenCalledWith('abc123', 'monitor-user-id')
    })
  })

  it('shows success state after accepting', async () => {
    renderAcceptInvite()

    fireEvent.click(screen.getByRole('button', { name: /Accept Invite/i }))

    await waitFor(() => {
      expect(screen.getByText('Connected!')).toBeInTheDocument()
    })
  })

  it('shows error on failed accept', async () => {
    const { acceptMonitorInvite } = await import('../lib/monitors')
    vi.mocked(acceptMonitorInvite).mockResolvedValueOnce({ success: false, error: 'Invalid or expired invite link' })

    renderAcceptInvite()
    fireEvent.click(screen.getByRole('button', { name: /Accept Invite/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid or expired invite link')).toBeInTheDocument()
    })
  })

  it('shows simplified signup form when not logged in', () => {
    renderAcceptInvite(loggedOutAuth)
    expect(screen.getByText(/You've been invited/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Account & Accept/i })).toBeInTheDocument()
  })

  it('signup calls signUp then signInWithPassword', async () => {
    const auth = { ...loggedOutAuth }
    renderAcceptInvite(auth)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Create Account & Accept/i }))

    await waitFor(() => {
      expect(auth.signUp).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(auth.signInWithPassword).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('can switch to login when not logged in', () => {
    renderAcceptInvite(loggedOutAuth)
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })
})
