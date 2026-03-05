import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestWrapper } from '../test/wrapper'
import AcceptInvite from './AcceptInvite'

function renderAcceptInvite(path = '/invite/abc123') {
  return render(
    <TestWrapper initialPath={path}><AcceptInvite /></TestWrapper>
  )
}

describe('AcceptInvite', () => {
  it('renders invite acceptance page', () => {
    renderAcceptInvite()
    expect(screen.getByRole('heading', { name: /Monitor Invite/i })).toBeInTheDocument()
  })

  it('shows accept button', () => {
    renderAcceptInvite()
    expect(screen.getByRole('button', { name: /Accept Invite/i })).toBeInTheDocument()
  })

  it('shows decline button', () => {
    renderAcceptInvite()
    expect(screen.getByRole('button', { name: /Decline/i })).toBeInTheDocument()
  })
})
