import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TestWrapper } from '../test/wrapper'
import Dashboard from './Dashboard'

function renderDashboard() {
  return render(<TestWrapper><Dashboard /></TestWrapper>)
}

describe('Dashboard', () => {
  it('renders point balance', () => {
    renderDashboard()
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
    const progressTexts = screen.getAllByText(/\/7 this week/i)
    expect(progressTexts.length).toBeGreaterThan(0)
  })

  // ── Inline habit logging tests ──

  it('expands inline logging panel when tapping unchecked habit', () => {
    renderDashboard()
    // h3 "Read 20 Pages" is not logged today
    const logButton = screen.getByTestId('habit-check-h3')
    fireEvent.click(logButton)
    expect(screen.getByPlaceholderText('How did it go?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Log It/i })).toBeInTheDocument()
  })

  it('shows photo upload when habit requires photo', () => {
    renderDashboard()
    // h4 "Daily Workout" requires photo
    const logButton = screen.getByTestId('habit-check-h4')
    fireEvent.click(logButton)
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.getByLabelText('Upload photo')).toBeInTheDocument()
  })

  it('submitting calls logAction and shows success state', async () => {
    renderDashboard()
    const logButton = screen.getByTestId('habit-check-h3')
    fireEvent.click(logButton)

    const submitBtn = screen.getByRole('button', { name: /Log It/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/\+15 pts/)).toBeInTheDocument()
    })
  })

  it('only one panel open at a time', () => {
    renderDashboard()
    // Open h3
    fireEvent.click(screen.getByTestId('habit-check-h3'))
    expect(screen.getByPlaceholderText('How did it go?')).toBeInTheDocument()

    // Open h4 — h3 panel should close
    fireEvent.click(screen.getByTestId('habit-check-h4'))
    // Now the note field should belong to h4, and there should only be one
    const noteFields = screen.getAllByPlaceholderText('How did it go?')
    expect(noteFields).toHaveLength(1)
  })

  it('already-logged habits cannot be expanded', () => {
    renderDashboard()
    // h1 "Morning Meditation" is logged today — should not have a clickable check button
    expect(screen.queryByTestId('habit-check-h1')).not.toBeInTheDocument()
  })
})
