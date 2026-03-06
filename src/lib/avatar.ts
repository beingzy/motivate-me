export const AVATAR_COLORS = [
  '#D35400', // orange (brand)
  '#2E86C1', // blue
  '#27AE60', // green
  '#8E44AD', // purple
  '#C0392B', // red
  '#16A085', // teal
  '#F39C12', // amber
  '#2C3E50', // dark blue
]

const CJK_REGEX = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\u3400-\u4dbf]/

export function getAvatarText(displayName: string | null | undefined, email?: string | null): string {
  const name = displayName?.trim()
  if (!name) {
    // Fallback to email prefix
    const prefix = email?.split('@')[0]
    if (prefix && prefix.length >= 2) return prefix[0].toUpperCase() + prefix[1].toLowerCase()
    return prefix?.[0]?.toUpperCase() ?? '?'
  }

  const firstChar = name[0]

  // CJK: single character
  if (CJK_REGEX.test(firstChar)) {
    return firstChar
  }

  // Multi-word name (e.g. "John Doe") → initials
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // Single word → first two letters
  if (name.length >= 2) {
    return name[0].toUpperCase() + name[1].toLowerCase()
  }

  return name[0].toUpperCase()
}
