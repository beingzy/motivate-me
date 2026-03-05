import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TestWrapper } from '../test/wrapper'
import HabitList from './HabitList'

function renderHabitList() {
  return render(<TestWrapper initialPath="/habits"><HabitList /></TestWrapper>)
}

describe('HabitList', () => {
  it('renders active habits from seed data', () => {
    renderHabitList()
    expect(screen.getByText('Morning Meditation')).toBeInTheDocument()
    expect(screen.getByText('Daily Workout')).toBeInTheDocument()
  })

  it('renders My Habits heading', () => {
    renderHabitList()
    expect(screen.getByRole('heading', { name: 'My Habits' })).toBeInTheDocument()
  })

  it('has New Habit link', () => {
    renderHabitList()
    expect(screen.getByRole('link', { name: /New Habit/i })).toBeInTheDocument()
  })

  it('shows segmented control', () => {
    renderHabitList()
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /archived/i })).toBeInTheDocument()
  })

  it('shows empty state on archived tab when no archived habits', () => {
    renderHabitList()
    fireEvent.click(screen.getByRole('button', { name: /archived/i }))
    expect(screen.getByText('No archived habits.')).toBeInTheDocument()
  })

  it('renders point badges', () => {
    renderHabitList()
    expect(screen.getByText('+20 PTS')).toBeInTheDocument()
  })
})
