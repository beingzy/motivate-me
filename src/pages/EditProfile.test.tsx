import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestWrapper } from '../test/wrapper'
import EditProfile from './EditProfile'

function renderEditProfile() {
  return render(<TestWrapper><EditProfile /></TestWrapper>)
}

describe('EditProfile', () => {
  it('renders page title', () => {
    renderEditProfile()
    expect(screen.getByRole('heading', { name: /Edit Profile/i })).toBeInTheDocument()
  })

  it('renders user ID field (read-only)', () => {
    renderEditProfile()
    expect(screen.getByLabelText(/User ID/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/User ID/i)).toHaveAttribute('readOnly')
  })

  it('renders email field (read-only)', () => {
    renderEditProfile()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toHaveAttribute('readOnly')
  })

  it('renders display name field', () => {
    renderEditProfile()
    expect(screen.getByLabelText(/Display Name/i)).toBeInTheDocument()
  })

  it('renders gender selector', () => {
    renderEditProfile()
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument()
  })

  it('renders avatar section', () => {
    renderEditProfile()
    expect(screen.getByText(/Avatar/i)).toBeInTheDocument()
  })

  it('renders color picker', () => {
    renderEditProfile()
    expect(screen.getByText(/Pick a color/i)).toBeInTheDocument()
  })

  it('renders save button', () => {
    renderEditProfile()
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument()
  })
})
