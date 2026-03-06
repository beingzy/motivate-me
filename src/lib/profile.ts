import { supabase } from './supabase'
import type { Profile, Gender } from '../types'

interface ProfileRow {
  id: string
  display_name: string | null
  avatar_url: string | null
  gender: string | null
  created_at: string
  updated_at: string
}

function toProfile(r: ProfileRow): Profile {
  return {
    id: r.id,
    displayName: r.display_name,
    avatarUrl: r.avatar_url,
    gender: r.gender as Gender | null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return toProfile(data as ProfileRow)
}

export async function fetchProfiles(userIds: string[]): Promise<Map<string, Profile>> {
  const map = new Map<string, Profile>()
  if (userIds.length === 0) return map
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds)
  if (error || !data) return map
  for (const row of data as ProfileRow[]) {
    map.set(row.id, toProfile(row))
  }
  return map
}

export async function upsertProfile(
  userId: string,
  updates: { displayName?: string; gender?: Gender | null }
): Promise<{ error?: string }> {
  const row: Record<string, unknown> = { id: userId, updated_at: new Date().toISOString() }
  if (updates.displayName !== undefined) row.display_name = updates.displayName
  if (updates.gender !== undefined) row.gender = updates.gender

  const { error } = await supabase
    .from('profiles')
    .upsert(row, { onConflict: 'id' })

  if (error) return { error: error.message }
  return {}
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url?: string; error?: string }> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) return { error: uploadError.message }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)

  // Update profile with new avatar URL
  const avatarUrl = `${data.publicUrl}?t=${Date.now()}`
  await supabase
    .from('profiles')
    .upsert({ id: userId, avatar_url: avatarUrl, updated_at: new Date().toISOString() }, { onConflict: 'id' })

  return { url: avatarUrl }
}
