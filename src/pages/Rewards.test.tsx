import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TestWrapper } from '../test/wrapper'
import Rewards from './Rewards'

function renderRewards() {
  return render(<TestWrapper><Rewards /></TestWrapper>)
}

describe('Rewards', () => {
  it('renders page title', () => {
    renderRewards()
    expect(screen.getByRole('heading', { name: 'Rewards' })).toBeInTheDocument()
  })

  it('renders point balance', () => {
    renderRewards()
    expect(screen.getByText(/pts available/i)).toBeInTheDocument()
  })

  it('shows available rewards by default', () => {
    renderRewards()
    expect(screen.getByText('Movie Night')).toBeInTheDocument()
    expect(screen.getByText('Kindle Book')).toBeInTheDocument()
  })

  it('shows wishlist rewards on wishlist tab', () => {
    renderRewards()
    const tabs = screen.getAllByRole('button')
    const wishlistTab = tabs.find((btn) => btn.textContent === 'wishlist')!
    fireEvent.click(wishlistTab)
    expect(screen.getByText('New Running Shoes')).toBeInTheDocument()
  })

  it('shows progress bar on wishlist tab', () => {
    renderRewards()
    const tabs = screen.getAllByRole('button')
    const wishlistTab = tabs.find((btn) => btn.textContent === 'wishlist')!
    fireEvent.click(wishlistTab)
    expect(screen.getAllByText(/pts to go/i).length).toBeGreaterThan(0)
  })

  it('renders Add Reward link', () => {
    renderRewards()
    expect(screen.getByRole('link', { name: /Add Reward/i })).toBeInTheDocument()
  })

  it('shows segmented control', () => {
    renderRewards()
    expect(screen.getAllByRole('button').some((b) => b.textContent === 'available')).toBe(true)
    expect(screen.getAllByRole('button').some((b) => b.textContent === 'wishlist')).toBe(true)
    expect(screen.getAllByRole('button').some((b) => b.textContent === 'redeemed')).toBe(true)
  })
})
