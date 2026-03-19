export function sanitizeEventCode(code: string | null): string | null {
  if (!code) return null
  
  // Allow only alphanumeric characters, hyphens, and underscores
  // Adjust regex based on your actual code format
  const sanitized = code.replace(/[^a-zA-Z0-9-_]/g, '')
  
  // Return null if sanitization removed all characters or changed the value
  return sanitized.length > 0 && sanitized === code ? sanitized : null
}

export function getShareUrl(names: string): string {
  const url = new URL(window.location.href)
  url.searchParams.delete('names')
  url.searchParams.append('names', names)
  return url.href
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
}