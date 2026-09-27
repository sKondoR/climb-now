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

// Буфер обмена может отказать (нет разрешения, вкладка не в фокусе, старый браузер) — сообщаем об этом, а не роняем промис
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// Подпись поля предлагает взять код из адреса — вставляют всю ссылку c-f-r.ru, код с пробелами или заглавными
export function normalizeEventCode(input: string): string {
  const trimmed = input.trim()
  const fromUrl = trimmed.match(/\/live\/([\w-]+)/i)
  return (fromUrl ? fromUrl[1] : trimmed).toLowerCase()
}