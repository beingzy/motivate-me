import { supabase } from './supabase'

// Approve an action log — update status and credit points
export async function approveActionLog(logId: string): Promise<{ error?: string }> {
  // Get the log
  const { data: log, error: fetchErr } = await supabase
    .from('action_logs')
    .select('*, habits(name, points_per_completion)')
    .eq('id', logId)
    .single()

  if (fetchErr || !log) return { error: 'Action log not found' }
  if (log.status !== 'pending_approval') return { error: 'Already processed' }

  const habit = log.habits as { name: string; points_per_completion: number } | null
  const pts = habit?.points_per_completion ?? 0

  // Update log status
  const { error: updateErr } = await supabase
    .from('action_logs')
    .update({
      status: 'approved',
      points_awarded: pts,
      approved_at: new Date().toISOString(),
    })
    .eq('id', logId)

  if (updateErr) return { error: updateErr.message }

  // Credit points via ledger
  if (pts > 0) {
    await supabase.from('point_ledger').insert({
      user_id: log.user_id,
      delta: pts,
      reason: `Approved: ${habit?.name ?? 'Habit'}`,
      reference_id: logId,
      reference_type: 'action_log',
    })
  }

  // Notify user
  await supabase.from('notifications').insert({
    user_id: log.user_id,
    type: 'approval',
    message: `Your ${habit?.name ?? 'habit'} log was approved! +${pts} pts`,
    read: false,
  })

  return {}
}

// Reject an action log
export async function rejectActionLog(logId: string): Promise<{ error?: string }> {
  const { data: log, error: fetchErr } = await supabase
    .from('action_logs')
    .select('*, habits(name)')
    .eq('id', logId)
    .single()

  if (fetchErr || !log) return { error: 'Action log not found' }
  if (log.status !== 'pending_approval') return { error: 'Already processed' }

  const habit = log.habits as { name: string } | null

  // We don't have a 'rejected' status in the schema, so delete the log
  const { error: deleteErr } = await supabase
    .from('action_logs')
    .delete()
    .eq('id', logId)

  if (deleteErr) return { error: deleteErr.message }

  // Notify user
  await supabase.from('notifications').insert({
    user_id: log.user_id,
    type: 'approval',
    message: `Your ${habit?.name ?? 'habit'} log was rejected.`,
    read: false,
  })

  return {}
}

// Fetch pending action logs for a monitored user
export async function fetchPendingApprovals(userId: string) {
  const { data, error } = await supabase
    .from('action_logs')
    .select('*, habits(name)')
    .eq('user_id', userId)
    .eq('status', 'pending_approval')
    .order('logged_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((row: { id: string; logged_at: string; habits: { name: string } | null; note: string | null }) => ({
    id: row.id,
    habitName: (row.habits as { name: string } | null)?.name ?? 'Unknown',
    loggedAt: row.logged_at,
    note: row.note,
  }))
}
