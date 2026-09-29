// Кеш календаря событий (rusclimbing.ru): сайт периодически недоступен,
// поэтому свежий ответ отдаём без запроса, а при ошибке — последний удачный, сколь угодно старый.
// Ошибка пробрасывается, только если удачного ответа ещё не было.
export const BACKEND_CACHE_TTL = 24 * 60 * 60_000

type Entry = { value: unknown, savedAt: number }

const cache = new Map<string, Entry>()

export async function cachedWithFallback<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.savedAt < BACKEND_CACHE_TTL) {
    return hit.value as T
  }

  try {
    const value = await loader()
    cache.set(key, { value, savedAt: Date.now() })
    return value
  } catch (error) {
    if (hit) {
      console.warn(`Backend request failed, serving stale cache for ${key}:`, error)
      return hit.value as T
    }
    throw error
  }
}

export function clearBackendCache() {
  cache.clear()
}
