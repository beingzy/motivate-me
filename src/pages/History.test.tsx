import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestWrapper } from '../test/wrapper'
import History from './History'

function renderHistory() {
  return render(<TestWrapper><History /></TestWrapper>)
}

describe('History', () => {
  it('renders page title', () => {
    renderHistory()
    expect(screen.getByRole('heading', { name: 'Activity' })).toBeInTheDocument()
  })

  it('renders habit names from seed logs', () => {
    renderHistory()
    expect(screen.getAllByText('Morning Meditation').length).toBeGreaterThan(0)
  })

  it('renders status badges', () => {
    renderHistory()
    expect(screen.getAllByText('Self Approved').length).toBeGreaterThan(0)
  })

  it('renders point values', () => {
    renderHistory()
    expect(screen.getAllByText('+20').length).toBeGreaterThan(0)
  })

  it('groups by date', () => {
    renderHistory()
    const headers = screen.getAllByRole('heading', { level: 3 })
    expect(headers.length).toBeGreaterThanOrEqual(1)
  })
})
