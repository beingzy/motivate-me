import { supabase } from './supabase'
import type { MonitorConnection } from '../types'

function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16)
}

// Create an invite — returns the token
export async function createMonitorInvite(userId: string): Promise<string> {
  const token = generateToken()
  const { error } = await supabase.from('monitors').insert({
    user_id: userId,
    monitor_user_id: userId, // placeholder — updated when accepted
    invite_token: token,
  })
  if (error) throw error
  return token
}

// Accept an invite — monitor accepts with their user ID
export async function acceptMonitorInvite(
  token: string,
  monitorUserId: string
): Promise<{ success: boolean; error?: string }> {
  // Find the invite
  const { data, error: fetchError } = await supabase
    .from('monitors')
    .select('*')
    .eq('invite_token', token)
    .is('accepted_at', null)
    .single()

  if (fetchError || !data) {
    return { success: false, error: 'Invalid or expired invite link' }
  }

  if (data.user_id === monitorUserId) {
    return { success: false, error: 'You cannot monitor yourself' }
  }

  // Update the connection
  const { error: updateError } = await supabase
    .from('monitors')
    .update({
      monitor_user_id: monitorUserId,
      accepted_at: new Date().toISOString(),
      invite_token: null,
    })
    .eq('id', data.id)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true }
}

// Get monitors for a user (people monitoring me)
export async function getMyMonitors(userId: string): Promise<MonitorConnection[]> {
  const { data, error } = await supabase
    .from('monitors')
    .select('*')
    .eq('user_id', userId)
    .not('accepted_at', 'is', null)

  if (error) throw error
  return (data ?? []).map(toConnection)
}

// Get users I'm monitoring
export async function getMonitoringOthers(monitorUserId: string): Promise<MonitorConnection[]> {
  const { data, error } = await supabase
    .from('monitors')
    .select('*')
    .eq('monitor_user_id', monitorUserId)
    .not('accepted_at', 'is', null)

  if (error) throw error
  return (data ?? []).map(toConnection)
}

// Get pending (unaccepted) invites I've sent
export async function getPendingInvites(userId: string): Promise<MonitorConnection[]> {
  const { data, error } = await supabase
    .from('monitors')
    .select('*')
    .eq('user_id', userId)
    .is('accepted_at', null)
    .not('invite_token', 'is', null)

  if (error) throw error
  return (data ?? []).map(toConnection)
}

// Revoke a monitor connection
export async function revokeMonitor(connectionId: string): Promise<void> {
  const { error } = await supabase.from('monitors').delete().eq('id', connectionId)
  if (error) throw error
}

// Get monitored user's data (for monitor dashboard)
export async function fetchMonitoredUserData(userId: string) {
  const [habits, logs, ledger, rewards] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', userId).eq('is_active', true),
    supabase.from('action_logs').select('*').eq('user_id', userId).order('logged_at', { ascending: false }).limit(20),
    supabase.from('point_ledger').select('*').eq('user_id', userId),
    supabase.from('rewards').select('*').eq('user_id', userId).eq('status', 'wishlist'),
  ])

  return {
    habits: habits.data ?? [],
    recentLogs: logs.data ?? [],
    balance: (ledger.data ?? []).reduce((sum: number, e: { delta: number }) => sum + e.delta, 0),
    wishlistRewards: rewards.data ?? [],
  }
}

// ── Helper ──

interface MonitorRow {
  id: string; user_id: string; monitor_user_id: string
  permissions: { can_edit_habits: boolean; can_edit_rewards: boolean }
  invite_token: string | null; accepted_at: string | null; created_at: string
}

function toConnection(r: MonitorRow): MonitorConnection {
  return {
    id: r.id,
    userId: r.user_id,
    monitorUserId: r.monitor_user_id,
    permissions: r.permissions,
    inviteToken: r.invite_token ?? undefined,
    acceptedAt: r.accepted_at ?? undefined,
    createdAt: r.created_at,
  }
}
