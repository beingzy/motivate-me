import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestWrapper } from '../test/wrapper'
import Dashboard from './Dashboard'

function renderDashboard() {
  return render(<TestWrapper><Dashboard /></TestWrapper>)
}

describe('Dashboard', () => {
  it('renders point balance', () => {
    renderDashboard()
    // Balance is derived from seed ledger entries
    expect(screen.getByLabelText('Point balance')).toBeInTheDocument()
  })

  it("renders today's habits section", () => {
    renderDashboard()
    expect(screen.getByText("Today's Habits")).toBeInTheDocument()
  })

  it('renders active habit names from seed data', () => {
    renderDashboard()
    expect(screen.getByText('Morning Meditation')).toBeInTheDocument()
    expect(screen.getByText('Read 20 Pages')).toBeInTheDocument()
  })

  it('renders stats section', () => {
    renderDashboard()
    expect(screen.getByText('Best Streak')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('renders View All link', () => {
    renderDashboard()
    expect(screen.getByRole('link', { name: /View All/i })).toBeInTheDocument()
  })

  it('renders notification bell', () => {
    renderDashboard()
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument()
  })

  it('shows weekly progress for daily habits', () => {
    renderDashboard()
    // Seed data has daily habits with logs; should show "X/7 this week"
    const progressTexts = screen.getAllByText(/\/7 this week/i)
    expect(progressTexts.length).toBeGreaterThan(0)
  })
})
