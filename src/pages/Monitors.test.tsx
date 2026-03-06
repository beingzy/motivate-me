import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '../test/wrapper'
import Monitors from './Monitors'

// Mock the monitors module
vi.mock('../lib/monitors', () => ({
  getMyMonitors: vi.fn().mockResolvedValue([]),
  getMonitoringOthers: vi.fn().mockResolvedValue([]),
  getPendingInvites: vi.fn().mockResolvedValue([]),
  createMonitorInvite: vi.fn().mockResolvedValue('test-token-abc123'),
  revokeMonitor: vi.fn().mockResolvedValue(undefined),
  sendInviteEmail: vi.fn().mockResolvedValue({ success: true, method: 'resend' }),
}))

vi.mock('../lib/profile', () => ({
  fetchProfiles: vi.fn().mockResolvedValue(new Map()),
}))

function renderMonitors() {
  return render(<TestWrapper><Monitors /></TestWrapper>)
}

describe('Monitors', () => {
  it('renders page title', () => {
    renderMonitors()
    expect(screen.getByRole('heading', { name: /Monitors/i })).toBeInTheDocument()
  })

  it('renders My Monitors section', () => {
    renderMonitors()
    expect(screen.getByText('People Monitoring Me')).toBeInTheDocument()
  })

  it('renders Monitoring Others section', () => {
    renderMonitors()
    expect(screen.getByText("I'm Monitoring")).toBeInTheDocument()
  })

  it('renders invite button', () => {
    renderMonitors()
    expect(screen.getByRole('button', { name: /Invite a Monitor/i })).toBeInTheDocument()
  })

  it('renders email invite input', () => {
    renderMonitors()
    expect(screen.getByPlaceholderText(/friend's email/i)).toBeInTheDocument()
  })

  it('renders send invite button (disabled when email empty)', () => {
    renderMonitors()
    const sendButtons = screen.getAllByRole('button', { name: /Send Invite/i })
    expect(sendButtons.length).toBeGreaterThan(0)
    expect(sendButtons[0]).toBeDisabled()
  })

  it('creates invite link on button click and shows copy/email options', async () => {
    renderMonitors()
    const inviteBtn = screen.getByRole('button', { name: /Invite a Monitor/i })
    fireEvent.click(inviteBtn)

    await waitFor(() => {
      expect(screen.getByText(/Invite link created/i)).toBeInTheDocument()
    })

    const linkInput = screen.getByDisplayValue(/\/invite\/test-token-abc123/)
    expect(linkInput).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /Copy/i })).toBeInTheDocument()
  })

  it('copies link to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    renderMonitors()
    fireEvent.click(screen.getByRole('button', { name: /Invite a Monitor/i }))

    await waitFor(() => {
      expect(screen.getByText(/Invite link created/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /Copy/i }))
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('/invite/test-token-abc123'))
  })

  it('shows email input after invite link is created', async () => {
    renderMonitors()
    fireEvent.click(screen.getByRole('button', { name: /Invite a Monitor/i }))

    await waitFor(() => {
      expect(screen.getByText(/send via email/i)).toBeInTheDocument()
    })
  })

  it('enables send button when email is entered', async () => {
    const user = userEvent.setup()
    renderMonitors()
    fireEvent.click(screen.getByRole('button', { name: /Invite a Monitor/i }))

    await waitFor(() => {
      expect(screen.getByText(/Invite link created/i)).toBeInTheDocument()
    })

    const emailInputs = screen.getAllByPlaceholderText(/friend's email/i)
    const emailInput = emailInputs[emailInputs.length - 1]
    await user.type(emailInput, 'friend@example.com')

    const sendButtons = screen.getAllByRole('button', { name: /Send Invite/i })
    const enabledSend = sendButtons.find(btn => !btn.hasAttribute('disabled'))
    expect(enabledSend).toBeTruthy()
  })

  it('calls sendInviteEmail when send email is clicked', async () => {
    const { sendInviteEmail } = await import('../lib/monitors')
    const user = userEvent.setup()

    renderMonitors()
    fireEvent.click(screen.getByRole('button', { name: /Invite a Monitor/i }))

    await waitFor(() => {
      expect(screen.getByText(/Invite link created/i)).toBeInTheDocument()
    })

    const emailInputs = screen.getAllByPlaceholderText(/friend's email/i)
    const emailInput = emailInputs[emailInputs.length - 1]
    await user.type(emailInput, 'friend@example.com')

    const sendButtons = screen.getAllByRole('button', { name: /Send Invite/i })
    const enabledSend = sendButtons.find(btn => !btn.hasAttribute('disabled'))
    fireEvent.click(enabledSend!)

    await waitFor(() => {
      expect(sendInviteEmail).toHaveBeenCalledWith(
        'friend@example.com',
        expect.stringContaining('/invite/test-token-abc123'),
        'A friend'
      )
    })
  })

  it('sends email via quick invite when no link exists yet', async () => {
    const { createMonitorInvite, sendInviteEmail } = await import('../lib/monitors')
    const user = userEvent.setup()

    renderMonitors()

    const emailInput = screen.getByPlaceholderText(/friend's email/i)
    await user.type(emailInput, 'quick@example.com')

    const sendBtn = screen.getByRole('button', { name: /Send Invite/i })
    fireEvent.click(sendBtn)

    await waitFor(() => {
      expect(createMonitorInvite).toHaveBeenCalled()
      expect(sendInviteEmail).toHaveBeenCalledWith(
        'quick@example.com',
        expect.stringContaining('/invite/test-token-abc123'),
        'A friend'
      )
    })
  })

  it('shows error when invite creation fails', async () => {
    const { createMonitorInvite } = await import('../lib/monitors')
    vi.mocked(createMonitorInvite).mockRejectedValueOnce(new Error('duplicate key violates unique constraint'))

    renderMonitors()
    fireEvent.click(screen.getByRole('button', { name: /Invite a Monitor/i }))

    await waitFor(() => {
      expect(screen.getByText(/Failed to create invite/i)).toBeInTheDocument()
    })
  })

  it('can create multiple invites (no unique constraint error)', async () => {
    const { createMonitorInvite } = await import('../lib/monitors')
    vi.mocked(createMonitorInvite)
      .mockResolvedValueOnce('token-1')
      .mockResolvedValueOnce('token-2')

    renderMonitors()

    // First invite
    fireEvent.click(screen.getByRole('button', { name: /Invite a Monitor/i }))
    await waitFor(() => {
      expect(screen.getByDisplayValue(/\/invite\/token-1/)).toBeInTheDocument()
    })

    // Second invite
    fireEvent.click(screen.getByRole('button', { name: /Invite a Monitor/i }))
    await waitFor(() => {
      expect(screen.getByDisplayValue(/\/invite\/token-2/)).toBeInTheDocument()
    })
  })

  it('shows pending invites with timestamp', async () => {
    const { getPendingInvites } = await import('../lib/monitors')
    vi.mocked(getPendingInvites).mockResolvedValueOnce([
      {
        id: 'inv-1',
        userId: 'test-user-id',
        monitorUserId: '',
        permissions: { can_edit_habits: false, can_edit_rewards: false },
        inviteToken: 'pending-token',
        createdAt: new Date().toISOString(),
      },
    ])

    renderMonitors()

    await waitFor(() => {
      expect(screen.getByText('Pending Invites')).toBeInTheDocument()
      expect(screen.getByText('Waiting for acceptance')).toBeInTheDocument()
    })

    // Check that timestamp info is shown (contains "Created" and time ago)
    expect(screen.getByText(/Created.*ago/)).toBeInTheDocument()
  })

  it('copies invite link to clipboard when pending card is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, writable: true, configurable: true })

    const { getPendingInvites } = await import('../lib/monitors')
    vi.mocked(getPendingInvites).mockResolvedValueOnce([
      {
        id: 'inv-copy',
        userId: 'test-user-id',
        monitorUserId: '',
        permissions: { can_edit_habits: false, can_edit_rewards: false },
        inviteToken: 'copy-me-token',
        createdAt: new Date().toISOString(),
      },
    ])

    renderMonitors()

    await waitFor(() => {
      expect(screen.getByText('Waiting for acceptance')).toBeInTheDocument()
    })

    const card = screen.getByRole('button', { name: /Copy invite link/i })
    fireEvent.click(card)

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('/invite/copy-me-token'))

    await waitFor(() => {
      expect(screen.getByText('Link copied!')).toBeInTheDocument()
    })
  })

  it('shows invite summary stats with green when monitors accepted', async () => {
    const { getMyMonitors, getPendingInvites } = await import('../lib/monitors')
    vi.mocked(getMyMonitors).mockResolvedValueOnce([
      {
        id: 'mon-1',
        userId: 'test-user-id',
        monitorUserId: 'friend-id',
        monitorEmail: 'friend@test.com',
        permissions: { can_edit_habits: false, can_edit_rewards: false },
        acceptedAt: '2026-01-15T00:00:00Z',
        createdAt: '2026-01-10T00:00:00Z',
      },
    ])
    vi.mocked(getPendingInvites).mockResolvedValueOnce([
      {
        id: 'inv-1',
        userId: 'test-user-id',
        monitorUserId: '',
        permissions: { can_edit_habits: false, can_edit_rewards: false },
        inviteToken: 'pending-token',
        createdAt: new Date().toISOString(),
      },
    ])

    renderMonitors()

    await waitFor(() => {
      expect(screen.getByText(/2 invites? sent/)).toBeInTheDocument()
      expect(screen.getByText(/1 accepted/)).toBeInTheDocument()
    })
  })

  it('shows accepted monitors with avatar and expandable details', async () => {
    const { getMyMonitors } = await import('../lib/monitors')
    vi.mocked(getMyMonitors).mockResolvedValueOnce([
      {
        id: 'mon-1',
        userId: 'test-user-id',
        monitorUserId: 'friend-id',
        monitorEmail: 'friend@test.com',
        permissions: { can_edit_habits: false, can_edit_rewards: false },
        acceptedAt: '2026-01-15T00:00:00Z',
        createdAt: '2026-01-10T00:00:00Z',
      },
    ])

    renderMonitors()

    await waitFor(() => {
      expect(screen.getByText('friend@test.com')).toBeInTheDocument()
    })

    // Click to expand details
    const monitorCard = screen.getByText('friend@test.com').closest('button')!
    fireEvent.click(monitorCard)

    await waitFor(() => {
      // Should show the email in expanded details
      const emailElements = screen.getAllByText('friend@test.com')
      expect(emailElements.length).toBeGreaterThanOrEqual(2) // in card + in expanded
    })

    // Should show Revoke button in expanded section
    expect(screen.getByText('Revoke')).toBeInTheDocument()
  })

  it('shows monitoring others with avatar and expandable details', async () => {
    const { getMonitoringOthers } = await import('../lib/monitors')
    vi.mocked(getMonitoringOthers).mockResolvedValueOnce([
      {
        id: 'mon-2',
        userId: 'other-user-id',
        monitorUserId: 'test-user-id',
        userEmail: 'other@test.com',
        permissions: { can_edit_habits: false, can_edit_rewards: false },
        acceptedAt: '2026-02-01T00:00:00Z',
        createdAt: '2026-01-20T00:00:00Z',
      },
    ])

    renderMonitors()

    await waitFor(() => {
      expect(screen.getByText('other@test.com')).toBeInTheDocument()
      expect(screen.getByText('Tap to view details')).toBeInTheDocument()
    })

    // Click to expand details
    const monitorCard = screen.getByText('other@test.com').closest('button')!
    fireEvent.click(monitorCard)

    await waitFor(() => {
      expect(screen.getByText('View Dashboard')).toBeInTheDocument()
    })
  })

  it('collapses expanded card when clicking again', async () => {
    const { getMyMonitors } = await import('../lib/monitors')
    vi.mocked(getMyMonitors).mockResolvedValueOnce([
      {
        id: 'mon-1',
        userId: 'test-user-id',
        monitorUserId: 'friend-id',
        monitorEmail: 'friend@test.com',
        permissions: { can_edit_habits: false, can_edit_rewards: false },
        acceptedAt: '2026-01-15T00:00:00Z',
        createdAt: '2026-01-10T00:00:00Z',
      },
    ])

    renderMonitors()

    await waitFor(() => {
      expect(screen.getByText('friend@test.com')).toBeInTheDocument()
    })

    const monitorCard = screen.getByText('friend@test.com').closest('button')!

    // Expand
    fireEvent.click(monitorCard)
    await waitFor(() => {
      expect(screen.getByText('Revoke')).toBeInTheDocument()
    })

    // Collapse
    fireEvent.click(monitorCard)
    await waitFor(() => {
      expect(screen.queryByText('Revoke')).not.toBeInTheDocument()
    })
  })
})
