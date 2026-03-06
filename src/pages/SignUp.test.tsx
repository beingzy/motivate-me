import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthContext } from '../lib/auth'
import SignUp from './SignUp'
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

function renderSignUp() {
  const switchFn = vi.fn()
  render(
    <AuthContext.Provider value={mockAuth}>
      <SignUp onSwitchToLogin={switchFn} />
    </AuthContext.Provider>
  )
  return { switchFn }
}

describe('SignUp', () => {
  it('renders sign up form', () => {
    renderSignUp()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument()
  })

  it('shows password mismatch error', async () => {
    const user = userEvent.setup()
    renderSignUp()

    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'different')

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })

  it('shows too short password error', async () => {
    const user = userEvent.setup()
    renderSignUp()

    await user.type(screen.getByLabelText('Password'), 'abc')

    expect(screen.getByText('Must be at least 6 characters')).toBeInTheDocument()
  })

  it('calls signUp on valid form submit', async () => {
    const user = userEvent.setup()
    renderSignUp()

    await user.type(screen.getByLabelText('Email'), 'new@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /Create Account/i }))

    expect(mockAuth.signUp).toHaveBeenCalledWith('new@example.com', 'password123')
  })

  it('shows verification message after successful sign up', async () => {
    const user = userEvent.setup()
    renderSignUp()

    await user.type(screen.getByLabelText('Email'), 'new@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /Create Account/i }))

    expect(screen.getByText(/Verify your email/i)).toBeInTheDocument()
    expect(screen.getByText(/new@example.com/)).toBeInTheDocument()
  })

  it('disables submit with mismatched passwords', async () => {
    const user = userEvent.setup()
    renderSignUp()

    await user.type(screen.getByLabelText('Email'), 'new@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'different')

    expect(screen.getByRole('button', { name: /Create Account/i })).toBeDisabled()
  })

  it('switches to login when link clicked', async () => {
    const user = userEvent.setup()
    const { switchFn } = renderSignUp()

    await user.click(screen.getByRole('button', { name: /Sign In/i }))
    expect(switchFn).toHaveBeenCalled()
  })
})
