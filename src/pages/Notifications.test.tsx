import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TestWrapper } from '../test/wrapper'
import Notifications from './Notifications'

function renderNotifications() {
  return render(<TestWrapper><Notifications /></TestWrapper>)
}

describe('Notifications', () => {
  it('renders page title', () => {
    renderNotifications()
    expect(screen.getByRole('heading', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('shows unread count', () => {
    renderNotifications()
    // Seed has 1 unread notification
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders notification messages from seed', () => {
    renderNotifications()
    expect(screen.getByText(/7-day streak/i)).toBeInTheDocument()
  })

  it('marks all read', () => {
    renderNotifications()
    fireEvent.click(screen.getByRole('button', { name: /Mark all read/i }))
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })
})
