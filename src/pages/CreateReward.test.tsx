import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TestWrapper } from '../test/wrapper'
import CreateReward from './CreateReward'

function renderCreateReward() {
  return render(<TestWrapper><CreateReward /></TestWrapper>)
}

describe('CreateReward', () => {
  it('renders form title', () => {
    renderCreateReward()
    expect(screen.getByRole('heading', { name: 'Create Reward' })).toBeInTheDocument()
  })

  it('submit disabled when empty', () => {
    renderCreateReward()
    expect(screen.getByRole('button', { name: /Create Reward/i })).toBeDisabled()
  })

  it('submit enabled when title filled (offline)', () => {
    renderCreateReward()
    fireEvent.change(screen.getByPlaceholderText('Weekend Trip'), { target: { value: 'Shoes' } })
    expect(screen.getByRole('button', { name: /Create Reward/i })).not.toBeDisabled()
  })

  it('shows URL field for online type', () => {
    renderCreateReward()
    fireEvent.click(screen.getByText('Online'))
    expect(screen.getByPlaceholderText(/https:\/\/example/i)).toBeInTheDocument()
  })

  it('submit disabled for online without URL', () => {
    renderCreateReward()
    fireEvent.change(screen.getByPlaceholderText('Weekend Trip'), { target: { value: 'Link' } })
    fireEvent.click(screen.getByText('Online'))
    expect(screen.getByRole('button', { name: /Create Reward/i })).toBeDisabled()
  })

  it('point cost starts at 500', () => {
    renderCreateReward()
    expect(screen.getByLabelText('500 points')).toBeInTheDocument()
  })

  it('increments cost', () => {
    renderCreateReward()
    fireEvent.click(screen.getByRole('button', { name: /Increase cost/i }))
    expect(screen.getByLabelText('600 points')).toBeInTheDocument()
  })

  it('toggles approval', () => {
    renderCreateReward()
    const toggle = screen.getByRole('switch', { name: /Requires Monitor Approval/i })
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })
})
