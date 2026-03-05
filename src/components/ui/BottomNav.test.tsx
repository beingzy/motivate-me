import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestWrapper } from '../../test/wrapper'
import BottomNav from './BottomNav'

function renderNav(initialPath = '/') {
  return render(<TestWrapper initialPath={initialPath}><BottomNav /></TestWrapper>)
}

describe('BottomNav', () => {
  it('renders all navigation labels', () => {
    renderNav()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Habits')).toBeInTheDocument()
    expect(screen.getByText('Rewards')).toBeInTheDocument()
    expect(screen.getByText('Me')).toBeInTheDocument()
  })

  it('renders the FAB log button', () => {
    renderNav()
    expect(screen.getByRole('button', { name: /Log a habit/i })).toBeInTheDocument()
  })

  it('home link is active on /', () => {
    renderNav('/')
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveClass('text-[#D35400]')
  })

  it('habits link is active on /habits', () => {
    renderNav('/habits')
    const habitsLink = screen.getByText('Habits').closest('a')
    expect(habitsLink).toHaveClass('text-[#D35400]')
  })
})
