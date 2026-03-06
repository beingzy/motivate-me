import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthContext } from '../lib/auth'
import Login from './Login'
import type { User } from '@supabase/supabase-js'

const mockAuth = {
  user: null as User | null,
  session: null,
  loading: false,
  signUp: vi.fn().mockResolvedValue({ error: null }),
  signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
  signInWithMagicLink: vi.fn().mockResolvedValue({ error: null }),
  changePassword: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn(),
}

function renderLogin() {
  const switchFn = vi.fn()
  render(
    <AuthContext.Provider value={mockAuth}>
      <Login onSwitchToSignUp={switchFn} />
    </AuthContext.Provider>
  )
  return { switchFn }
}

describe('Login', () => {
  it('renders sign in form with email and password', () => {
    renderLogin()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('renders magic link button', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /Magic Link/i })).toBeInTheDocument()
  })

  it('renders sign up link', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument()
  })

  it('calls signInWithPassword on form submit', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /Sign In/i }))

    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('shows error on failed sign in', async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({ error: 'Invalid credentials' })
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong')
    await user.click(screen.getByRole('button', { name: /Sign In/i }))

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('switches to sign up when link clicked', async () => {
    const user = userEvent.setup()
    const { switchFn } = renderLogin()

    await user.click(screen.getByRole('button', { name: /Sign Up/i }))
    expect(switchFn).toHaveBeenCalled()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderLogin()

    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByLabelText('Show password'))
    expect(passwordInput).toHaveAttribute('type', 'text')
  })
})
