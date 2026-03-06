import { describe, it, expect } from 'vitest'
import { getAvatarText, AVATAR_COLORS } from './avatar'

describe('getAvatarText', () => {
  it('returns initials for two-word name', () => {
    expect(getAvatarText('John Doe')).toBe('JD')
  })

  it('returns initials for multi-word name', () => {
    expect(getAvatarText('Mary Jane Watson')).toBe('MW')
  })

  it('returns first two letters for single word', () => {
    expect(getAvatarText('Alice')).toBe('Al')
  })

  it('returns single char for CJK name', () => {
    expect(getAvatarText('\u5F20\u4E09')).toBe('\u5F20')
  })

  it('returns single char for Korean name', () => {
    expect(getAvatarText('\uAE40\uCCA0\uC218')).toBe('\uAE40')
  })

  it('returns single char for Japanese name', () => {
    expect(getAvatarText('\u5C71\u7530')).toBe('\u5C71')
  })

  it('falls back to email prefix when name is null', () => {
    expect(getAvatarText(null, 'alice@example.com')).toBe('Al')
  })

  it('returns ? when both are null', () => {
    expect(getAvatarText(null, null)).toBe('?')
  })

  it('returns single uppercase char for one-char name', () => {
    expect(getAvatarText('A')).toBe('A')
  })
})

describe('AVATAR_COLORS', () => {
  it('has 8 colors', () => {
    expect(AVATAR_COLORS).toHaveLength(8)
  })
})
