import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../lib/auth'
import { AppProvider } from '../lib/store'
import EditHabit from './EditHabit'
import type { User } from '@supabase/supabase-js'

const mockAuth = {
  user: { id: 'test-user-id', email: 'test@example.com' } as User,
  session: null,
  loading: false,
  signUp: async () => ({ error: null }),
  signInWithPassword: async () => ({ error: null }),
  signInWithMagicLink: async () => ({ error: null }),
  changePassword: async () => ({ error: null }),
  signOut: async () => {},
}

function renderEditHabit(id = 'h1') {
  return render(
    <MemoryRouter initialEntries={[`/habits/${id}/edit`]}>
      <AuthContext.Provider value={mockAuth}>
        <AppProvider>
          <Routes>
            <Route path="/habits/:id/edit" element={<EditHabit />} />
          </Routes>
        </AppProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('EditHabit', () => {
  it('renders edit form with pre-filled data', () => {
    renderEditHabit('h1')
    expect(screen.getByRole('heading', { name: 'Edit Habit' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Morning Meditation')).toBeInTheDocument()
  })

  it('renders not found for invalid id', () => {
    renderEditHabit('nonexistent')
    expect(screen.getByText('Habit not found')).toBeInTheDocument()
  })

  it('save button disabled when name cleared', () => {
    renderEditHabit('h1')
    fireEvent.change(screen.getByDisplayValue('Morning Meditation'), { target: { value: '' } })
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeDisabled()
  })

  it('save button enabled with name', () => {
    renderEditHabit('h1')
    expect(screen.getByRole('button', { name: /Save Changes/i })).not.toBeDisabled()
  })

  it('shows archive confirmation', () => {
    renderEditHabit('h1')
    fireEvent.click(screen.getByRole('button', { name: /Archive this habit/i }))
    expect(screen.getByText(/Archive this habit\? It won't appear/i)).toBeInTheDocument()
  })

  it('can cancel archive', () => {
    renderEditHabit('h1')
    fireEvent.click(screen.getByRole('button', { name: /Archive this habit/i }))
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }))
    expect(screen.queryByText(/Archive this habit\? It won't appear/i)).not.toBeInTheDocument()
  })
})
