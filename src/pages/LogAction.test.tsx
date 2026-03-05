import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TestWrapper } from '../test/wrapper'
import LogAction from './LogAction'

function renderLogAction() {
  return render(<TestWrapper><LogAction /></TestWrapper>)
}

describe('LogAction', () => {
  it('renders page title', () => {
    renderLogAction()
    expect(screen.getByRole('heading', { name: 'Log a Habit' })).toBeInTheDocument()
  })

  it('renders habit selector with seed habits', () => {
    renderLogAction()
    expect(screen.getByText('Morning Meditation')).toBeInTheDocument()
    expect(screen.getByText('Read 20 Pages')).toBeInTheDocument()
  })

  it('Log It button disabled when no habit selected', () => {
    renderLogAction()
    expect(screen.getByRole('button', { name: /Log It/i })).toBeDisabled()
  })

  it('renders close button', () => {
    renderLogAction()
    expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument()
  })

  it('renders note field when unlogged habit is selected', () => {
    renderLogAction()
    // Select a habit not yet logged today (Read 20 Pages or Daily Workout)
    fireEvent.click(screen.getByText('Read 20 Pages'))
    expect(screen.getByPlaceholderText('How did it go?')).toBeInTheDocument()
  })
})
